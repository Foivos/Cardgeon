import { getTime } from '../../core/Utils.js';
import { mouse } from '../../core/Mouse.js';
import { grid } from './Grid.js';
import { level } from '../../map/Level.js';


export function scroll(e) {
    if (!e) e = window.event;
    var sod = 125*10;
    var d = grid.d*(1-e.deltaY/sod);
    d = d>200 ? 200 : (d<20 ? 20 : d);
    if(d === grid.d) return;
    grid.x += e.layerX * (1/grid.d - 1/d);
    grid.y += e.layerY * (1/grid.d - 1/d);
    
    grid.d = d;
}

export function onmousedown(e) {
    if (!e) e = window.event;
    grid.mouse = {x:e.layerX, y:e.layerY};
    grid.canvas.onmousemove = onmousemove;
    grid.canvas.onmouseup = onmouseup;
    var selected = document.getElementsByClassName('paneButtonSelected')[0];
    if(selected) {
        var f = e.shiftKey ? ((x) => x) : ((x) => Math.floor(x+0.5));
        grid.selecting = {
            x0 : Math.max(0, Math.min(level.W, f(grid.mouse.x / grid.d + grid.x))),        
            y0 : Math.max(0, Math.min(level.H, f(grid.mouse.y / grid.d + grid.y))),
        }
    }
}

export function onmousemove(e) {
    if(e.buttons === 0) {
        onmouseup(e);
        return;
    }
    if(getTime() - mouse.lastClicked < 50) {
        return;
    }
    if (!e) e = window.event;
    var selected = document.getElementsByClassName('paneButtonSelected')[0];
    if(!selected) {
        grid.x -= (e.layerX - grid.mouse.x) / grid.d;
        grid.y -= (e.layerY - grid.mouse.y) / grid.d;
        if(grid.x < -3) grid.x = -3;
        if(grid.y < -3) grid.y = -3;
        if(grid.x + grid.canvas.width / grid.d > level.W +3) grid.x = level.W +3 - grid.canvas.width / grid.d;
        if(grid.y + grid.canvas.height / grid.d > level.H +3) grid.y = level.H +3 - grid.canvas.height / grid.d;
        grid.mouse = {x:e.layerX, y:e.layerY};
        return;
    }
    var f = e.shiftKey ? ((x) => x) : ((x) => Math.floor(x+0.5));
    grid.selecting.x1 = Math.max(0, Math.min(level.W, f(e.layerX / grid.d + grid.x)));
    grid.selecting.y1 = Math.max(0, Math.min(level.H, f(e.layerY / grid.d + grid.y)));
    name = selected.id.split(':')[1];
}

export function onmouseup(e) {
    grid.canvas.onmousemove = null;
    grid.canvas.onmouseup = null;
    
    var selected = document.getElementsByClassName('paneButtonSelected')[0];
    if(!selected) return;
    name = selected.id.split(':')[1];
    switch(mouse.button) {
    case 0:
        switch(name) {
            case 'wall':
                level.addWall(grid.selecting.x0, grid.selecting.y0, grid.selecting.x1, grid.selecting.y1);
                break;
            case 'solid':
                level.addSolid(grid.selecting.x0, grid.selecting.y0, grid.selecting.x1, grid.selecting.y1);
                break;
            case 'clear':
                break;
        }
        break;
    case 2:
        switch(name) {
            case 'wall':
                level.removeWalls(grid.selecting.x0, grid.selecting.y0, grid.selecting.x1, grid.selecting.y1);
                break;
            case 'solid':
                level.removeSolid(grid.selecting.x0, grid.selecting.y0, grid.selecting.x1, grid.selecting.y1);
                break;
            case 'clear':
                break;
        }
        break;
    }
    grid.selecting = null;
}

export function oncontextmenu(e) {
    e.preventDefault();
    return false;
}