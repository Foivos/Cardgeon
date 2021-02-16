import { selectedCreature } from '../creatures/SelectedCreature.js';
import { getTime } from '../core/Utils.js';
import { turn } from '../turn/Turn.js';
import { mouse } from '../core/Mouse.js';
import { grid } from './Grid.js';
import { level } from '../map/Level.js';


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

    if(grid.x < -3 && grid.x + grid.canvas.width / grid.d < level.W + 3) grid.x = Math.min(-3, level.W + 3 - grid.canvas.width / grid.d);
    if(grid.y < -3 && grid.y + grid.canvas.height / grid.d < level.H + 3) grid.y = Math.min(-3, level.H + 3 - grid.canvas.height / grid.d);
    if(grid.x + grid.canvas.width / grid.d > level.W + 3 && grid.x > -3) grid.x = Math.max(-3, level.W + 3 - grid.canvas.width / grid.d);
    if(grid.y + grid.canvas.height / grid.d > level.H + 3 && grid.y > -3) grid.y = Math.max(-3, level.H + 3 - grid.canvas.height / grid.d);

    grid.mouse = {x:e.clientX, y:e.clientY};
}

export function onmouseup(e) {
    document.onmousemove = null;
    document.onmouseup = null;
    var d = Math.sqrt((mouse.lastX - e.clientX) ** 2 + (mouse.lastY - e.clientY) ** 2);
    if (d > 5) return; 
    var x = Math.floor(e.layerX / grid.d + grid.x);
    var y = Math.floor(e.layerY / grid.d + grid.y);

    var creature = level.creatures.occupying(x, y);
    if(creature) {
        selectedCreature.set(creature);
    }
    if(turn.targeting.get(x, y)) {
        turn.targeting.onSelect(x, y);
    }
    
    if(turn.targeting.length > 0 || turn.availableMoves.length === 0 ||  (x === turn.hero.x &&  y === turn.hero.y)) return;
    if(turn.availableMoves.get(x, y)) {
        var path = turn.availableMoves.getPathTo(x, y);
        turn.move(path);
    }
}

export function oncontextmenu(e) {
    e.preventDefault();
    return false;
}