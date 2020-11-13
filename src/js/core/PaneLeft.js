import { end, move } from './PaneEventHandlers.js'

class PaneLeft {
    constructor() {
        this.elem = document.createElement('div');
        this.elem.className = 'pane';
        
        this.H = document.body.clientHeight;
        this.W = Math.floor(document.body.clientWidth / 7.7);
        this.elem.style.width = this.W;
        this.elem.style.height = document.body.clientHeight;
        this.elem.style.top = 0;
        this.elem.style.left = 0;
        
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

        this.pocket = document.createElement('img');
        this.pocket.className = 'paneImage';
        this.pocket.style.width = this.W;
        this.pocket.style.height = this.W;
        this.pocket.style.top = document.body.clientHeight - this.W;
        this.pocket.style.left = 0;
        this.pocket.style.zIndex = 10;
        this.pocket.style.transform = 'rotate(180deg)';
        this.pocket.src = 'res/cardPocket.png';
        this.elem.appendChild(this.pocket);


        document.body.appendChild(this.elem);
    }
    resize() {
        this.H = document.body.clientHeight;
        this.W = Math.floor(document.body.clientWidth / 7.7);
        this.elem.style.width = this.W;
        this.elem.style.height = document.body.clientHeight;
        this.elem.style.top = 0;
        this.elem.style.left = 0;
        var buttons = this.elem.getElementsByClassName('paneButton');
        for(var i=0; i<buttons.length; i++) {
            buttons[i].style.width = this.W-20;
            buttons[i].style.top = this.W + 50 * i + 40;
        }
        this.image.style.width = this.W-20;
        this.image.style.height = this.W-20;
        
        this.pocket.style.width = this.W;
        this.pocket.style.height = this.W;
        this.pocket.style.top = document.body.clientHeight - this.W;

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

};

export var paneLeft = new PaneLeft();