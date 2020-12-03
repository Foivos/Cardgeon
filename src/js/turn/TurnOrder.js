import { turn } from './Turn.js';

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
        turn.availableMoves.delete()
        turn.targeting.delete();
    }

    start() {
        this.i = -1;
        this.advance();
    }
}

export var turnOrder = new TurnOrder();