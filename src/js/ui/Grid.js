import { oncontextmenu, onmousedown, scroll } from './GridEventHandlers.js';
import { paneRight } from './PaneRight.js';

class Grid {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'grid';
        this.resize();
        this.ctx = this.canvas.getContext('2d');
        this.x = 0;
        this.y = 0;
        this.d = 60; 
        
        this.canvas.addEventListener('wheel', scroll);
        this.canvas.addEventListener('mousedown', onmousedown);
        this.canvas.addEventListener('contextmenu', oncontextmenu)
        this.canvas.onmousedown = onmousedown;
        this.canvas.onmousedown = onmousedown;
        document.body.appendChild(this.canvas);
    }
    resize() {
        this.canvas.width = document.body.clientWidth - paneRight.W;
        this.canvas.height = document.body.clientHeight;
        this.W = this.canvas.width;
        this.H = this.canvas.height;
    }

};


export var grid = new Grid();