import { end, move } from './PaneEventHandlers.js'

class PaneLeft {
    constructor() {
        this.elem = document.createElement('div');
        this.elem.className = 'pane';
        this.elem.classList.add('paneLeft');
        
        this.H = document.body.clientHeight;
        this.W = Math.floor(document.body.clientWidth / 7.7);


        this.actionDisplay = document.createElement('img');
        this.actionDisplay.src = 'res/actionDisplay.png';
        this.actionDisplay.className = 'paneActionDisplay';
        this.elem.appendChild(this.actionDisplay);

        this.actionCount = document.createElement('div');
        this.actionCount.className = 'paneActionCount';
        this.actionCount.innerHTML = '3';
        this.elem.appendChild(this.actionCount);

        this.text = document.createElement('p');
        this.elem.appendChild(this.text);

        this.pocket = document.createElement('img');
        this.pocket.className = 'leftPocket';
        this.pocket.src = 'res/cardPocket.png';
        this.elem.appendChild(this.pocket);


        document.body.appendChild(this.elem);
    }
    resize() {
        this.H = document.body.clientHeight;
        this.W = Math.floor(document.body.clientWidth / 7.7);
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

    setActions(n) {
        this.actionCount.innerHTML = n;
    }

};

export var paneLeft = new PaneLeft();