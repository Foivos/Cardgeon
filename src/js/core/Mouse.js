import { getTime } from './Utils.js';

class Mouse {
    constructor() {
        this.lastClicked = null;
        this.lastX = null;
        this.lastY = null;
        document.onmousedown = onmousedown;
    }

    wasClick() {
        return getTime() - mouse.lastClicked < 300;
    }

}

export var mouse = new Mouse();

function onmousedown(e) {
    mouse.lastClicked = getTime();
    mouse.lastX = e.clientX;
    mouse.lastY = e.clientY;
}

