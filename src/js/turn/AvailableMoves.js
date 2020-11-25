import { turn } from './Turn.js';
import { DistanceMap} from '../core/Containers.js';
import { level } from '../map/Level.js';

class AvailableMoves extends DistanceMap {
    constructor() {
        super()
    }

    calculate(creature, moves) {
        if(!creature) creature = turn.hero;
        if(!moves && moves !== 0) moves = turn.remainingMove;
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
            var r = [];
            for(var i=0; i<adj.length; i++) {
                var pos = {x : x + adj[i].x, y : y + adj[i].y, d : adj[i].d};
                if(level.creatures.occupying(pos.x, pos.y)) {
                    continue;
                }
                if(pos.d === 1.5 && (level.creatures.occupying(pos.x, y) || level.creatures.occupying(x, pos.y))) {
                    continue;
                }
                r.push(pos);
            }
            return r;
        }
       
        super.initSingle(moves, creature.x, creature.y, f);
    }
}

export var availableMoves = new AvailableMoves();