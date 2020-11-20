import { toggle } from './PaneEventHandlers.js'

class PaneRight {
    constructor() {
        this.elem = document.createElement('div');
        this.elem.className = 'paneRight';
        
        this.makeButton('wall', toggle);
        this.makeButton('solid', toggle);
        this.makeButton('clear', toggle);
        document.body.appendChild(this.elem);
    }
    resize() {
        this.H = document.body.clientHeight;
        this.W = Math.floor(document.body.clientWidth / 7.7);

    }
    makeButton(name, onclick) {
        var button = document.createElement('button');
        button.className = 'paneButton'
        button.id = 'paneButton:' + name;
        button.onclick = onclick;
        button.textContent = name;
        this.elem.appendChild(button);
    }
};

export var paneRight = new PaneRight();