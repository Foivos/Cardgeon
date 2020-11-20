

class PaneLeft {
    constructor() {
        this.elem = document.createElement('div');
        this.elem.className = 'paneLeft';
        
        this.H = document.body.clientHeight;
        this.W = Math.floor(document.body.clientWidth / 7.7);
        
        this.h0 = this.W + 40;

        this.image = document.createElement('img');
        this.image.className = 'paneImage';
        this.image.style.width = this.W-20;
        this.image.style.height = this.W-20;
        this.image.style.top = 10;
        this.image.style.left = 10;
        this.elem.appendChild(this.image);

        this.actionDisplay = document.createElement('img');
        this.actionDisplay.src = 'res/actionDisplay.png';
        this.actionDisplay.className = 'paneActionDisplay';
        this.actionDisplay.style.width = this.W/2;
        this.actionDisplay.style.height = this.W/2;
        this.actionDisplay.style.top = this.H - 3*this.W/4;
        this.actionDisplay.style.left = this.W/4;
        this.elem.appendChild(this.actionDisplay);

        this.actionCount = document.createElement('div');
        this.actionCount.className = 'paneActionCount';
        this.actionCount.innerHTML = '3';
        this.actionCount.style.fontSize = (this.W / 2.5) + 'px';
        this.actionCount.style.width = this.W/2;
        this.actionCount.style.height = this.W/2;
        this.actionCount.style.top = this.H - 3*this.W/4;
        this.actionCount.style.left = this.W/4;
        this.elem.appendChild(this.actionCount);

        this.text = document.createElement('p');
        this.text.style.position = 'absolute'
        this.text.style.width = this.W-20;
        this.text.style.height = 30;
        this.text.style.top = this.W;
        this.text.style.left = 10;
        this.text.style.color = 'white';
        this.elem.appendChild(this.text);

        this.pocket = document.createElement('img');
        this.pocket.className = 'leftPocket';
        this.pocket.style.width = this.W;
        this.pocket.style.height = this.W;
        this.pocket.style.top = document.body.clientHeight - this.W;
        this.pocket.style.left = 0;
        this.pocket.src = 'res/cardPocket.png';
        this.elem.appendChild(this.pocket);


        document.body.appendChild(this.elem);
    }
    resize() {
        this.H = document.body.clientHeight;
        this.W = Math.floor(document.body.clientWidth / 7.7);

        this.actionDisplay.style.width = this.W/2;
        this.actionDisplay.style.height = this.W/2;
        this.actionDisplay.style.top = this.H - 3*this.W/4;
        this.actionDisplay.style.left = this.W/4;

        this.pocket.style.width = this.W;
        this.pocket.style.height = this.W;
        this.pocket.style.top = document.body.clientHeight - this.W;
        this.pocket.style.left = 0;

        this.actionCount.style.fontSize = (this.W / 2.5) + 'px';
        this.actionCount.style.width = this.W/2;
        this.actionCount.style.height = this.W/2;
        this.actionCount.style.top = this.H - 3*this.W/4;
        this.actionCount.style.left = this.W/4;

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

    setActions(n) {
        this.actionCount.innerHTML = n;
    }

};

export var paneLeft = new PaneLeft();