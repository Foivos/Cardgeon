import { getTime } from './Utils.js';

/**
 * Used to keep track of mouse actions.
 */
class Mouse {
    constructor() {
        this.lastClicked = null;
        this.lastX = null;
        this.lastY = null;
        document.onmousedown = onmousedown;
        document.onmouseup = onmouseup;
        document.onmousemove = onmousemove;
    }

    wasClick() {
        return getTime() - mouse.lastClicked < 300;
    }

}

export var mouse = new Mouse();

/**
 * Handles the mousedown event.
 * @param {Event} e 
 */
function onmousedown(e) {
    mouse.lastClicked = getTime();
    mouse.lastX = e.clientX;
    mouse.lastY = e.clientY;
    mouse.button = e.button;
    mouse.shift = e.shiftKey;
}
/**
 * Handles the mouseup event.
 * @param {Event} e 
 */
function onmouseup(e) {
}
/**
 * Handles the mousemove event.
 * @param {Event} e 
 */
function onmousemove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

