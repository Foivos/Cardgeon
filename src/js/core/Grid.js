import { keys } from './Keys.js';
import { pane } from './Pane.js';
import { creatureSet } from '../creatures/CreatureSet.js'
import { selectedCreature } from '../creatures/SelectedCreature.js';
import { availableMoves } from '../turn/AvailableMoves.js';
import { getTime } from './Utils.js';
import { movingCreatures } from '../creatures/MovingCreatures.js';
import { turn } from '../turn/Turn.js';
import { mouse } from './Mouse.js';
import { targetedSquares } from '../turn/TargetedSquares.js';
import { hand } from '../cards/Hand.js';

class Grid {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'canvas';
        this.canvas.style.margin = 0;
        this.canvas.style.backgroundColor = 'rgb(158, 154, 161)';
        this.resize();
        this.ctx = this.canvas.getContext('2d');
        this.x = 0;
        this.y = 0;
        this.d = 60; 
        
        this.canvas.onwheel = scroll;
        this.canvas.onmousedown = onmousedown;
        document.body.appendChild(this.canvas);
    }
    resize() {
        this.canvas.width = document.body.clientWidth - pane.W;
        this.canvas.height = document.body.clientHeight;
        this.W = this.canvas.width;
        this.H = this.canvas.height;
    }

};

function scroll(e) {
    if (!e) e = window.event;
    var sod = 125*10;
    var d = grid.d*(1-e.deltaY/sod);
    d = d>200 ? 200 : (d<20 ? 20 : d);
    if(d === grid.d) return;
    grid.x += e.clientX * (1/grid.d - 1/d);
    grid.y += e.clientY * (1/grid.d - 1/d);
    
    grid.d = d;
}

function onmousedown(e) {
    if (!e) e = window.event;
    grid.mouse = {x:e.clientX, y:e.clientY};
    document.onmousemove = onmousemove;
    document.onmouseup = onmouseup;
}

function onmousemove(e) {
    if(getTime() - mouse.lastClicked < 50) {
        return;
    }
    if (!e) e = window.event;
    grid.x -= (e.clientX - grid.mouse.x) / grid.d;
    grid.y -= (e.clientY - grid.mouse.y) / grid.d;
    grid.mouse = {x:e.clientX, y:e.clientY};
}

function onmouseup(e) {
    document.onmousemove = null;
    document.onmouseup = null;
    var d = Math.sqrt((mouse.lastX - e.clientX) ** 2 + (mouse.lastY - e.clientY) ** 2);
    if (d > 5) return; 
    var x = Math.floor(e.clientX / grid.d + grid.x);
    var y = Math.floor(e.clientY / grid.d + grid.y);

    var creature = creatureSet.occupying(x, y);
    if(creature) {
        selectedCreature.set(creature);
        if(hand.selected && hand.selected.range && targetedSquares.get(x, y)) {
            if(targetedSquares.withinRange(x,y)) {
                hand.selected.activate(creature);
            }
            else {
                var path = targetedSquares.getPathTo(x, y);
                turn.move(path, hand.selected.activate.bind(null, creature));
            }
        }
    }
    
    if(availableMoves.length === 0 ||  (x === turn.hero.x &&  y === turn.hero.y)) return;
    if(availableMoves.get(x, y)) {
        var path = availableMoves.getPathTo(x, y);
        turn.move(path);
    }
}

export var grid = new Grid();