import { onmousedown, scroll } from './GridEventHandlers.js';
import { paneRight } from './PaneRight.js';

class Grid {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'grid';
        this.ctx = this.canvas.getContext('2d');
        this.x = 0;
        this.y = 0;
        this.d = 60; 

        
        this.canvas.width = Math.ceil(document.body.clientWidth * 0.74);
        this.canvas.height = document.body.clientHeight;
        
        this.canvas.onwheel = scroll;
        this.canvas.onmousedown = onmousedown;
        document.body.appendChild(this.canvas);
    }
    resize() {
        this.canvas.width = document.body.clientWidth * 0.74;
        this.canvas.height = document.body.clientHeight;
    }

};


export var grid = new Grid();