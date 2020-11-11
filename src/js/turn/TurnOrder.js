import { availableMoves } from './AvailableMoves.js';
import { pane } from '../core/Pane.js';
import { turn } from './Turn.js';
import { targetedSquares } from './TargetedSquares.js';

class TurnOrder extends Array{
    constructor() {
        super();
        this.i = -1;
    }

    advance() {
        this.i = (this.i+1) % this.length;
        turn.set(this[this.i]);
        availableMoves.delete()
        targetedSquares.delete();
        pane.image.src = turn.hero.sprite.src;
    }

    start() {
        this.i = -1;
        this.advance();
    }
}

export var turnOrder = new TurnOrder();