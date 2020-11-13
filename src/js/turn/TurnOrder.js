import { availableMoves } from './AvailableMoves.js';
import { paneRight } from '../core/PaneRight.js';
import { turn } from './Turn.js';
import { withinRange } from './WithinRange.js';

class TurnOrder extends Array{
    constructor() {
        super();
        this.i = -1;
    }

    advance() {
        this.i = (this.i+1) % this.length;
        turn.end();
        turn.start(this[this.i]);
        availableMoves.delete()
        withinRange.delete();
        paneRight.image.src = turn.hero.sprite.src;
    }

    start() {
        this.i = -1;
        this.advance();
    }
}

export var turnOrder = new TurnOrder();