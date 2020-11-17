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
        turn.end(function() {
            turn.start(turnOrder[turnOrder.i]);
        });
        availableMoves.delete()
        withinRange.delete();
    }

    start() {
        this.i = -1;
        this.advance();
    }
}

export var turnOrder = new TurnOrder();