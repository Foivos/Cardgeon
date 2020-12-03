
import { level } from '../map/Level.js';
import { turn } from '../turn/Turn.js';
import { resolver } from './Resolver.js';

export const selectorMaps = {
    single : {
        selector : single,
    },
}

function single(range) {
    turn.targeting.calculate(turn.hero.x, turn.hero.y, range);
    turn.targeting.onSelect = function(x ,y) {
        var creature = level.creatures.occupying(x, y);
        if(!creature) return;
        turn.targeting.delete();
        resolver.send(creature);
    }
}