import { Creature } from './Creature.js';

export class Enemy extends Creature {
    constructor(name) {
        super();
        getInfo('enemies/' + name, this.init.bind(this));
    }

    init(data) {
        this.results = data.results;
        this.actions = data.actions;
        var frame = new Image();
        frame.onload = function(){
            var ctx = this.elem.getContext('2d');
            ctx.drawImage(frame, 0, 0);
            ctx.font = '32px monospace';
            ctx.fillText(data.name, 52, 37);
            ctx.font = '50px monospace';
            ctx.fillText(data.actions, 12, 41);
            ctx.font = '20px monospace';
            var lines = getLines(ctx, data.text, 262);
            for(var i=0; i<lines.length; i++) {
                ctx.fillText(lines[i], 20, 270+20*i, 262);
            }
            var art = new Image();
            art.onload = function(){
                ctx.drawImage(art, 16, 50);
            }.bind(this);
            art.src = 'res/art/' + data.art + '.png';
        }.bind(this);
        frame.src = 'res/frame.png';
    }
        
    takeTurn() {

    }
}