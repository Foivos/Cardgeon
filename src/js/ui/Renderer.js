import { hand } from '../cards/Hand.js';
import { grid } from './Grid.js'
import { keys } from '../core/Keys.js'
import { paneRight } from './PaneRight.js';
import { selectedCreature } from '../creatures/SelectedCreature.js'
import { movingCreatures } from '../creatures/MovingCreatures.js';
import { turn } from '../turn/Turn.js';
import { Card } from '../cards/Card.js';
import { paneLeft } from './PaneLeft.js';
import { level } from '../map/Level.js';

class Renderer {
    constructor() {
        setInterval(this.tick.bind(this), 1000.0/60.0)
        this.movingCards = {};
        window.onresize = this.resize;
        this.doneWithMoves = [];
    }

    resize() {
        Card.setScales();
        paneRight.resize();
        paneLeft.resize();
        grid.resize();
        hand.position();
    }

    tick() {
        this.advanceCards();
        this.advanceGrid();
        this.advanceCreatures();

        this.clearGrid();
        this.drawHighlighs();
        this.drawWalls()
        this.drawTerrain();
        this.drawCreatures();
        this.drawGrid();
        paneLeft.setActions(turn.actions);
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

    advanceGrid() {
        if(keys.pressed.up && !keys.pressed.down) grid.y-=10/grid.d;
        if(keys.pressed.down && !keys.pressed.up) grid.y+=10/grid.d;
        if(keys.pressed.left && !keys.pressed.right) grid.x-=10/grid.d;
        if(keys.pressed.right && !keys.pressed.left) grid.x+=10/grid.d;

        if(grid.x < -3 && grid.x + grid.canvas.width / grid.d < level.W + 3) grid.x = Math.min(-3, level.W + 3 - grid.canvas.width / grid.d);
        if(grid.y < -3 && grid.y + grid.canvas.height / grid.d < level.H + 3) grid.y = Math.min(-3, level.H + 3 - grid.canvas.height / grid.d);
        if(grid.x + grid.canvas.width / grid.d > level.W + 3 && grid.x > -3) grid.x = Math.max(-3, level.W + 3 - grid.canvas.width / grid.d);
        if(grid.y + grid.canvas.height / grid.d > level.H + 3 && grid.y > -3) grid.y = Math.max(-3, level.H + 3 - grid.canvas.height / grid.d);
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

    drawCreatures() {
        for(var i in level.creatures) {
            var creature = level.creatures[i]
            var x = (creature.x - grid.x) * grid.d;
            var y = (creature.y - grid.y) * grid.d;
            if(x>grid.W || x+grid.d<0 || y>grid.H || y+grid.d<0) continue;
            grid.ctx.drawImage(creature.sprite, x, y, grid.d, grid.d);
            if(selectedCreature.creature == creature) {
                grid.ctx.beginPath();
                grid.ctx.lineWidth = grid.d/30;
                grid.ctx.strokeStyle = 'rgb(0, 100, 0)';
                grid.ctx.rect(x, y, grid.d, grid.d);
                grid.ctx.stroke();
            }
            if(keys.pressed.shift) {
                grid.ctx.fillStyle = 'rgba(120, 30, 30, 0.8)';
                grid.ctx.fillRect(x, y, grid.d * creature.stats.get('hp') / creature.stats.get('max_hp'), grid.d/5);
                grid.ctx.beginPath();
                grid.ctx.lineWidth = grid.d/200;
                grid.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
                grid.ctx.rect(x, y, grid.d, grid.d/5);
                grid.ctx.stroke();
            }
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
        for (var i=0; i<turn.targeting.length; i++) {
            if(!turn.targeting[i]) continue;
            var x = turn.targeting.getX(i);
            var y = turn.targeting.getY(i);
            grid.ctx.fillStyle = 'rgb(255, 100, 100)';
            grid.ctx.fillRect((x-grid.x) * grid.d, (y-grid.y) * grid.d, grid.d, grid.d);
            if(numbers) {
                grid.ctx.globalAlpha = 1;
                grid.ctx.font = "20px Arial";
                grid.ctx.fillText(turn.targeting[i][0], (x-grid.x+0.5) * grid.d, (y-grid.y+1) * grid.d);
                if(turn.targeting.nvars > 1) grid.ctx.fillText(turn.targeting[i][1], (x-grid.x) * grid.d, (y-grid.y+1) * grid.d);
                grid.ctx.globalAlpha = 0.2;
            }
        }

        if(turn.targeting.length) {
            grid.ctx.globalAlpha = 1.0;
            return;
        }
        for (var i=0; i<turn.availableMoves.length; i++) {
            if(!turn.availableMoves[i]) continue;
            var x = turn.availableMoves.getX(i);
            var y = turn.availableMoves.getY(i);
            grid.ctx.fillStyle = 'rgb(100, 100, 255)';
            grid.ctx.fillRect((x-grid.x) * grid.d, (y-grid.y) * grid.d, grid.d, grid.d);
            if(numbers) {
                grid.ctx.globalAlpha = 1;
                grid.ctx.font = "20px Arial";
                grid.ctx.strokeStyle = 'black';
                grid.ctx.fillText(turn.availableMoves[i][0], (x-grid.x) * grid.d, (y-grid.y+1) * grid.d);
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
                    turn.availableMoves.calculate(turn.hero.x, turn.hero.y, turn.remainingMove);
                }
                if(hand.selected && hand.selected.range) {
                    turn.targeting.calculate(turn.hero.x, turn.hero.y, hand.selected.range);
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