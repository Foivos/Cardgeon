import { turn } from './Turn.js';
import { availableMoves } from './AvailableMoves.js';
import { hand } from '../cards/Hand.js';
import { DistanceMap } from '../core/Containers.js';
import { creatureSet } from '../creatures/CreatureSet.js';

class TargetedSquares extends DistanceMap{
    constructor() {
        super()
    }

    calculate(d) {
        this.delete();
        var f = function(x,y) {
            var adj = [
                {x:0, y:1, d:1},
                {x:0, y:-1, d:1},
                {x:1, y:0, d:1},
                {x:-1, y:0, d:1},
                {x:1, y:1, d:1.5},
                {x:1, y:-1, d:1.5},
                {x:-1, y:1, d:1.5},
                {x:-1, y:-1, d:1.5},
            ];
            return adj.map(elem => ({x:x+elem.x, y:y+elem.y, d:elem.d}));
        }

        if(availableMoves.length === 0) {
            super.initSingle(d, turn.hero.x, turn.hero.y, f);
        }
        else {
            super.initNested(availableMoves, d, f);
        }
    }

    getPathTo(x, y) {
        return super.getPathTo(x, y, 0, this.d);
    }

    withinRange(x, y) {
        return this.get(x,y)[0] <= this.d;
    }
}

export var targetedSquares = new TargetedSquares();