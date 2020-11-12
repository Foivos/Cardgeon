import { hand } from '../cards/Hand.js';
import { creatureSet } from '../creatures/CreatureSet.js';
import { grid } from './Grid.js'
import { keys } from './Keys.js'
import { pane } from './Pane.js';
import { selectedCreature } from '../creatures/SelectedCreature.js'
import { availableMoves } from '../turn/AvailableMoves.js';
import { movingCreatures } from '../creatures/MovingCreatures.js';
import { turn } from '../turn/Turn.js';
import { withinRange } from '../turn/WithinRange.js';
import { CardSet } from '../cards/CardSet.js';
import { Card } from '../cards/Card.js';

class Renderer {
    constructor() {
        setInterval(this.tick.bind(this), 1000.0/60.0)
        this.movingCards = {};
        window.onresize = this.resize;
    }

    resize() {
        Card.setScales();
        pane.resize();
        grid.resize();
        hand.position();
    }

    tick() {
        this.advanceCards();
        this.advanceGrid();
        this.advanceCreatures();

        this.clearGrid();
        this.drawHighlighs();
        this.drawCreatures();
        this.drawGrid();
    }

    advanceGrid() {
        if(keys.pressed.up && !keys.pressed.down) grid.y-=10/grid.d;
        if(keys.pressed.down && !keys.pressed.up) grid.y+=10/grid.d;
        if(keys.pressed.left && !keys.pressed.right) grid.x-=10/grid.d;
        if(keys.pressed.right && !keys.pressed.left) grid.x+=10/grid.d;
    }

    clearGrid() {
        grid.ctx.clearRect(0, 0, grid.canvas.width, grid.canvas.height);
    }

    drawGrid() {
        grid.ctx.font = "30px Arial";
        grid.ctx.beginPath();
        grid.ctx.lineWidth = 0.3;
        grid.ctx.strokeStyle = 'black';
        for(var f = Math.ceil(grid.x)*grid.d-grid.x*grid.d; f<grid.canvas.width; f+=grid.d) {
            grid.ctx.moveTo(f,0);
            grid.ctx.lineTo(f,grid.canvas.height);
        }
        for(var f = Math.ceil(grid.y)*grid.d-grid.y*grid.d; f<grid.canvas.height; f+=grid.d) {
            grid.ctx.moveTo(0, f);
            grid.ctx.lineTo(grid.canvas.width, f);
        }
        grid.ctx.stroke();
        grid.ctx.closePath();
    }

    drawCreatures() {
        for(var i in creatureSet) {
            var creature = creatureSet[i]
            var x = (creature.x - grid.x) * grid.d;
            var y = (creature.y - grid.y) * grid.d;
            if(x>grid.W || x+grid.d<0 || y>grid.H || y+grid.d<0) continue;
            grid.ctx.drawImage(creature.sprite, x, y, grid.d, grid.d);
            if(selectedCreature.creature == creature) {
                grid.ctx.beginPath();
                grid.ctx.lineWidth = grid.d/30;
                grid.ctx.strokeStyle = 'rgb(0, 100, 0)';
                grid.ctx.rect((creature.x-grid.x) * grid.d, (creature.y-grid.y) * grid.d, grid.d, grid.d);
                grid.ctx.stroke();
            }
        }
    }

    advanceCards() {
        for (var i in this.movingCards) {
            if (this.movingCards[i] == null) continue;
            this.movingCards[i].advanceMove();
        }
    }

    drawHighlighs(numbers = false) {
        grid.ctx.globalAlpha = 0.2;
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