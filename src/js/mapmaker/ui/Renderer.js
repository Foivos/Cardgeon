import { grid } from '../ui/Grid.js'
import { keys } from '../../core/Keys.js'
import { level } from '../../map/Level.js';
import { mouse } from '../../core/Mouse.js';

class Renderer {
    constructor() {
        setInterval(this.tick.bind(this), 1000.0/60.0);
        window.onresize = this.resize;
    }

    resize() {
        grid.resize();
    }

    tick() {
        this.advanceGrid();

        this.clearGrid();
        this.drawGrid();
        this.drawGridSelection();
        this.drawWalls()
        this.drawTerrain();
        this.drawCreatures();
    }

    advanceGrid() {
        if (document.activeElement.nodeName === 'INPUT') return;
        if(keys.pressed.up && !keys.pressed.down) grid.y-=10/grid.d;
        if(keys.pressed.down && !keys.pressed.up) grid.y+=10/grid.d;
        if(keys.pressed.left && !keys.pressed.right) grid.x-=10/grid.d;
        if(keys.pressed.right && !keys.pressed.left) grid.x+=10/grid.d;
        
        if(grid.x < -3 && grid.x + grid.canvas.width / grid.d < level.W + 3) grid.x = Math.min(-3, level.W + 3 - grid.canvas.width / grid.d);
        if(grid.y < -3 && grid.y + grid.canvas.height / grid.d < level.H + 3) grid.y = Math.min(-3, level.H + 3 - grid.canvas.height / grid.d)
        if(grid.x + grid.canvas.width / grid.d > level.W + 3 && grid.x > -3) grid.x = Math.max(-3, level.W + 3 - grid.canvas.width / grid.d)
        if(grid.y + grid.canvas.height / grid.d > level.H + 3 && grid.y > -3) grid.y = Math.max(-3, level.H + 3 - grid.canvas.height / grid.d)
    }

    clearGrid() {
        grid.ctx.clearRect(0, 0, grid.canvas.width, grid.canvas.height);
    }

    drawGrid() {
        grid.ctx.font = "30px Arial";
        grid.ctx.beginPath();
        grid.ctx.lineWidth = 0.3;
        grid.ctx.strokeStyle = 'black';
        for(var f = Math.ceil(Math.max(0, grid.x))*grid.d-grid.x*grid.d; f<=0.1+Math.min(grid.canvas.width, (level.W - grid.x) * grid.d); f+=grid.d) {
            grid.ctx.moveTo(f, Math.max(0, -grid.y * grid.d));
            grid.ctx.lineTo(f, Math.min(grid.canvas.height, (level.H - grid.y) * grid.d));
        }
        for(var f = Math.ceil(Math.max(0, grid.y))*grid.d-grid.y*grid.d; f<=0.1+Math.min(grid.canvas.height, (level.H - grid.y) * grid.d); f+=grid.d) {
            grid.ctx.moveTo(Math.max(0, -grid.x * grid.d), f);
            grid.ctx.lineTo(Math.min(grid.canvas.width, (level.W - grid.x) * grid.d), f);
        }
        grid.ctx.stroke();
        grid.ctx.closePath();
    }

    drawGridSelection() {
        if(!grid.selecting) return;
        var selected = document.getElementsByClassName('paneButtonSelected')[0];
        if(!selected) return;
        name = selected.id.split(':')[1];
        if(mouse.button === 0 && name === 'wall') {
            grid.ctx.beginPath();
            grid.ctx.lineWidth = grid.d/30;
            grid.ctx.strokeStyle = 'black';
            grid.ctx.moveTo(grid.selecting.x0 * grid.d - grid.x * grid.d, grid.selecting.y0 * grid.d - grid.y * grid.d);
            grid.ctx.lineTo(grid.selecting.x1 * grid.d - grid.x * grid.d, grid.selecting.y1 * grid.d - grid.y * grid.d);
        
            grid.ctx.stroke();
            grid.ctx.closePath();
            return;
        }
        switch(mouse.button) {
        case 0:
            grid.ctx.fillStyle = level.fillstyle[level.codes['solid']];
            break;
        case 2:
            grid.ctx.fillStyle = level.fillstyle[level.codes['clear']];
            break;
        default:
            return;
        }
        var x0 = Math.min(grid.selecting.x0, grid.selecting.x1);
        var y0 = Math.min(grid.selecting.y0, grid.selecting.y1);
        var w = Math.abs(grid.selecting.x0 - grid.selecting.x1) * grid.d;
        var h = Math.abs(grid.selecting.y0 - grid.selecting.y1) * grid.d;
        grid.ctx.fillRect((x0 - grid.x) * grid.d, (y0 - grid.y) * grid.d, w, h);        
    }

    drawWalls() {
        grid.ctx.beginPath();
        grid.ctx.lineWidth = grid.d/30;
        grid.ctx.strokeStyle = 'black';
        for(var i=0; i<level.walls.length; i++) {
            var wall = level.walls[i];
            grid.ctx.moveTo(wall.x0 * grid.d - grid.x * grid.d, wall.y0 * grid.d - grid.y * grid.d);
            grid.ctx.lineTo(wall.x1 * grid.d - grid.x * grid.d, wall.y1 * grid.d - grid.y * grid.d);
        }
        grid.ctx.stroke();
        grid.ctx.closePath();
    }

    drawTerrain() {
        for(var i=0; i< level.squares.length; i++) {
            if(!level.fillstyle[level.squares[i]]) continue;
            var x0 = i % level.W;
            var y0 = Math.floor(i / level.W); 
            var x = (x0 - grid.x) * grid.d;
            var y = (y0 - grid.y) * grid.d;
            if(x > grid.canvas.width || x + grid.d < 0 || y > grid.canvas.height || y + grid.d < 0) continue;
            grid.ctx.fillStyle = level.fillstyle[level.squares[i]]
            grid.ctx.fillRect(x, y, grid.d, grid.d);
        }
        
    }

    drawCreatures() {
        for(var i in level.creatures) {
            var creature = level.creatures[i];
            var x = (creature.x - grid.x) * grid.d;
            var y = (creature.y - grid.y) * grid.d;
            if(x>grid.W || x+grid.d<0 || y>grid.H || y+grid.d<0) continue;
            grid.ctx.drawImage(creature.sprite, x, y, grid.d, grid.d);
            if(grid.selectedCreature == creature) {
                grid.ctx.beginPath();
                grid.ctx.lineWidth = grid.d/30;
                grid.ctx.strokeStyle = 'rgb(0, 100, 0)';
                grid.ctx.rect((creature.x-grid.x) * grid.d, (creature.y-grid.y) * grid.d, grid.d, grid.d);
                grid.ctx.stroke();
            }
        }
        if(grid.placingCreature) {
            var creature = grid.placingCreature;
            var x = (creature.x - grid.x) * grid.d;
            var y = (creature.y - grid.y) * grid.d;
            grid.ctx.drawImage(creature.sprite, x, y, grid.d, grid.d);
        }
    }

    advanceCards() {
        var flag = true;
        for (var i in this.movingCards) {
            if(this.movingCards[i] == null) continue;
            if(this.movingCards[i].movements.length === 0) {
                this.movingCards[i] = null;
                continue;
            }
            flag = false
            var card = this.movingCards[i];
            card.setPos(card.movements[0].getPos(i));
        }
        if(flag) {
            var f = this.doneWithMoves.splice(0,1);
            if(f[0]) f[0]();
        }
    }

    drawHighlighs(numbers = false) {
        grid.ctx.globalAlpha = 0.2;
        for (var i=0; i<withinRange.length; i++) {
            if(!withinRange[i]) continue;
            var x = withinRange.getX(i);
            var y = withinRange.getY(i);
            grid.ctx.fillStyle = 'rgb(255, 100, 100)';
            grid.ctx.fillRect((x-grid.x) * grid.d, (y-grid.y) * grid.d, grid.d, grid.d);
            if(numbers) {
                grid.ctx.globalAlpha = 1;
                grid.ctx.font = "20px Arial";
                grid.ctx.fillText(withinRange[i][0], (x-grid.x+0.5) * grid.d, (y-grid.y+1) * grid.d);
                if(withinRange.nvars > 1) grid.ctx.fillText(withinRange[i][1], (x-grid.x) * grid.d, (y-grid.y+1) * grid.d);
                grid.ctx.globalAlpha = 0.2;
            }
        }

        if(withinRange.length) {
            grid.ctx.globalAlpha = 1.0;
            return;
        }
        for (var i=0; i<availableMoves.length; i++) {
            if(!availableMoves[i]) continue;
            var x = availableMoves.getX(i);
            var y = availableMoves.getY(i);
            grid.ctx.fillStyle = 'rgb(100, 100, 255)';
            grid.ctx.fillRect((x-grid.x) * grid.d, (y-grid.y) * grid.d, grid.d, grid.d);
            if(numbers) {
                grid.ctx.globalAlpha = 1;
                grid.ctx.font = "20px Arial";
                grid.ctx.strokeStyle = 'black';
                grid.ctx.fillText(availableMoves[i][0], (x-grid.x) * grid.d, (y-grid.y+1) * grid.d);
                grid.ctx.globalAlpha = 0.2;
            }
        }
        grid.ctx.globalAlpha = 1.0;
    }

    advanceCreatures() {
        for(var i=0; i<movingCreatures.length; i++) {
            if(movingCreatures[i] == null) continue;    
            var mc = movingCreatures[i];
            var j = Math.floor(mc.progress);
            var d = mc.path[j+1].d - mc.path[j].d;
            mc.progress += mc.speed / d / 60;
            var j = Math.floor(mc.progress);
            if(mc.progress >= mc.path.length - 1) {
                mc.creature.x = mc.path[mc.path.length -1].x;
                mc.creature.y = mc.path[mc.path.length -1].y;
                if(mc.onFinish) mc.onFinish();
                movingCreatures.remove(mc);
                i--;
                if(turn.remainingMove >= 1) {
                    availableMoves.calculate();
                }
                if(hand.selected && hand.selected.range) {
                    withinRange.calculate(hand.selected.range);
                }
                turn.moving = false;
                continue;
            }
            var dx = (mc.path[j+1].x - mc.path[j].x) * (mc.progress - j);
            var dy = (mc.path[j+1].y - mc.path[j].y) * (mc.progress - j);
            mc.creature.x = mc.path[j].x + dx;
            mc.creature.y = mc.path[j].y + dy;
        }
    }
}

export var renderer = new Renderer();