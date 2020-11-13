import { Card } from '../cards/Card.js';
import { hand } from '../cards/Hand.js';
import { end, move } from './PaneEventHandlers.js'

class Pane {
    constructor() {
        this.elem = document.createElement('div');
        this.elem.className = 'pane';
        
        this.H = document.body.clientHeight;
        this.W = Math.floor(document.body.clientWidth / 7.7);
        this.elem.style.width = this.W;
        this.elem.style.height = document.body.clientHeight;
        this.elem.style.top = 0;
        this.elem.style.left = document.body.clientWidth - this.W;
        
        this.h0 = this.W + 40;
        this.makeButton('move', move);
        this.makeButton('end turn', end);

        this.image = document.createElement('img');
        this.image.className = 'paneImage';
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
        this.text.style.color = 'white';
        this.elem.appendChild(this.text);

        document.body.appendChild(this.elem);
    }
    resize() {
        this.H = document.body.clientHeight;
        this.W = Math.floor(document.body.clientWidth / 7.7);
        this.elem.style.width = this.W;
        this.elem.style.height = document.body.clientHeight;
        this.elem.style.top = 0;
        this.elem.style.left = document.body.clientWidth - this.W;
        var buttons = this.elem.getElementsByClassName('paneButton');
        for(var i=0; i<buttons.length; i++) {
            buttons[i].style.width = this.W-20;
            buttons[i].style.top = this.W + 50 * i + 40;
        }
        this.image.style.width = this.W-20;
        this.image.style.height = this.W-20;
        if(hand.selected) hand.selected.setPos(this.getCardPos());
    }
    makeButton(name, onclick) {
        var button = document.createElement('button');
        button.className = 'paneButton'
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
        this.text.innerHTML = creature.stats.get('hp') + ' + ' + creature.stats.get('armour');
    }

    getCardPos() {
        return {x:document.body.clientWidth-this.W/2, y:document.body.clientHeight - Card.H*Card.scaleB/2, deg:0, scale:Card.scaleB};
    }
};

export var pane = new Pane();