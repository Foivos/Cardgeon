
import { level } from '../map/Level.js';
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
        var creature = level.creatures.occupying(x, y);
        if(!creature) return;
        withinRange.delete();
        resolver.send(creature);
    }
}