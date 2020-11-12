import { asArray } from '../core/Utils.js';
import { creatureSet } from '../creatures/CreatureSet.js';
import { turn } from '../turn/Turn.js'
import { withinRange } from '../turn/WithinRange.js';
import { resolver } from './Resolver.js';

export const selectorMaps = {
    single : {
        selector : single,
        vars : 'range',
    },
    self : {
        selector : self,
    },
    evaluate : {
        selector : evaluate,
        vars : 'parts',
    },
    getStat : {
        selector : getStat,
        vars : [
            'target',
            'stat'
        ],
    },
}

function single(range) {
    withinRange.calculate(range);
    withinRange.onSelect = function(x ,y) {
        var creature = creatureSet.occupying(x, y);
        if(!creature) return;
        withinRange.delete();
        resolver.send(creature);
    }
}

function self() {
    resolver.send(turn.hero);
}

function evaluate(parts) {console.log(''.concat(...parts));
    resolver.send(eval(''.concat(...parts)));
}

function getStat(target, stat) {console.log(target, stat);
    resolver.send(target.stats.get(stat));
}