import { creatureSet } from '../creatures/CreatureSet.js'
import { selectedCreature } from '../creatures/SelectedCreature.js';
import { availableMoves } from '../turn/AvailableMoves.js';
import { getTime } from './Utils.js';
import { turn } from '../turn/Turn.js';
import { mouse } from './Mouse.js';
import { hand } from '../cards/Hand.js';
import { withinRange } from '../turn/WithinRange.js';
import { grid } from './Grid.js';


export function scroll(e) {
    if (!e) e = window.event;
    var sod = 125*10;
    var d = grid.d*(1-e.deltaY/sod);
    d = d>200 ? 200 : (d<20 ? 20 : d);
    if(d === grid.d) return;
    grid.x += e.clientX * (1/grid.d - 1/d);
    grid.y += e.clientY * (1/grid.d - 1/d);
    
    grid.d = d;
}

export function onmousedown(e) {
    if (!e) e = window.event;
    grid.mouse = {x:e.clientX, y:e.clientY};
    document.onmousemove = onmousemove;
    document.onmouseup = onmouseup;
}

export function onmousemove(e) {
    if(getTime() - mouse.lastClicked < 50) {
        return;
    }
    if (!e) e = window.event;
    grid.x -= (e.clientX - grid.mouse.x) / grid.d;
    grid.y -= (e.clientY - grid.mouse.y) / grid.d;
    grid.mouse = {x:e.clientX, y:e.clientY};
}

export function onmouseup(e) {
    document.onmousemove = null;
    document.onmouseup = null;
    var d = Math.sqrt((mouse.lastX - e.clientX) ** 2 + (mouse.lastY - e.clientY) ** 2);
    if (d > 5) return; 
    var x = Math.floor(e.clientX / grid.d + grid.x);
    var y = Math.floor(e.clientY / grid.d + grid.y);

    var creature = creatureSet.occupying(x, y);
    if(creature) {
        selectedCreature.set(creature);
    }
    if(withinRange.get(x, y)) {
        withinRange.onSelect(x, y);
    }
    
    if(availableMoves.length === 0 ||  (x === turn.hero.x &&  y === turn.hero.y)) return;
    if(availableMoves.get(x, y)) {
        var path = availableMoves.getPathTo(x, y);
        turn.move(path);
    }
}
