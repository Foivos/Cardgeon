import { end, move } from './PaneEventHandlers.js'

class Pane {
    constructor() {
        this.W = 200;
        this.elem = document.createElement('div');
        this.elem.style.position = 'absolute';
        this.elem.id = 'pane';
        
        this.resize();
        
        this.h0 = this.W + 40;
        this.makeButton('move', move);
        this.makeButton('end turn', end);

        this.image = document.createElement('img');
        this.image.style.position = 'absolute'
        this.image.style.width = this.W-20;
        this.image.style.height = this.W-20;
        this.image.style.top = 10;
        this.image.style.left = 10;
        this.elem.appendChild(this.image);

        this.text = document.createElement('p');
        this.text.style.position = 'absolute'
        this.text.style.width = this.W-20;
        this.text.style.height = 30;
        this.text.style.top = this.W;
        this.text.style.left = 10;
        this.elem.appendChild(this.text);

        document.body.appendChild(this.elem);
    }
    resize() {
        this.H = document.body.clientHeight;
        this.elem.width = this.W;
        this.elem.height = this.H;
        this.elem.style.top = 0;
        this.elem.style.left = document.body.clientWidth - this.W;
    }
    makeButton(name, onclick) {
        var button = document.createElement('button');
        button.style.position = 'absolute'
        button.style.width = this.W-20;
        button.style.height = 40;
        button.style.top = this.h0;
        button.onclick = onclick;
        this.h0+=50;
        button.style.left = 10;
        button.textContent = name;
        this.elem.appendChild(button);
    }

    setSelected(creature) {
        this.image.src = creature.sprite.src;
        this.text.innerHTML = creature.hp;
    }

    getCardPos() {
        return {x:document.body.clientWidth-this.W/2, y:700, deg:0, scale:1};
    }
};

export var pane = new Pane();