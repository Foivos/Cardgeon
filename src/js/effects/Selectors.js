import { asArray } from '../core/Utils.js';
import { creatureSet } from '../creatures/CreatureSet.js';
import { turn } from '../turn/Turn.js'
import { withinRange } from '../turn/WithinRange.js';
import { resolver } from './Resolver.js';

export const selectorMaps = {
    single : {
        selector : single,
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