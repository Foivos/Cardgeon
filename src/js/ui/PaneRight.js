import { Card } from '../cards/Card.js';
import { cardPositions } from '../cards/CardPositions.js';
import { hand } from '../cards/Hand.js';
import { end, move } from './PaneEventHandlers.js'

class PaneRight {
    constructor() {
        this.elem = document.createElement('div');
        this.elem.className = 'pane';
        this.elem.classList.add('paneRight')
        
        this.H = document.body.clientHeight;
        this.W = Math.floor(document.body.clientWidth / 7.7);
        
        this.image = document.createElement('img');
        this.image.className = 'paneImage';
        this.elem.appendChild(this.image);

        this.makeButton('move', move);
        this.makeButton('end turn', end);

     

        this.text = document.createElement('p');
        this.text.className = 'paneText'
        this.elem.appendChild(this.text);

        this.pocket = document.createElement('img');
        this.pocket.classList.add('rightPocket');
        
        this.pocket.src = 'res/cardPocket.png';
        this.elem.appendChild(this.pocket);


        document.body.appendChild(this.elem);
    }
    resize() {
        this.H = document.body.clientHeight;
        this.W = Math.floor(document.body.clientWidth / 7.7);

        if(hand.selected) hand.selected.setPos(this.getCardPos());
    }
    makeButton(name, onclick) {
        var button = document.createElement('button');
        button.className = 'paneButton'
        button.onclick = onclick;
        button.textContent = name;
        this.elem.appendChild(button);
    }

    setSelected(creature) {
        this.image.src = creature.sprite.src;
        this.text.innerHTML = creature.stats.get('hp') + ' + ' + creature.stats.get('armour');
    }

    getCardPos() {
        return {
            x : document.body.clientWidth - this.W / 2, 
            y : document.body.clientHeight - Card.H * Card.scaleB / 2 - Card.W * Card.scaleB, 
            deg : 0, 
            scale : Card.scaleB
        };
    }
};

export var paneRight = new PaneRight();