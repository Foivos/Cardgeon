import { asArray } from '../core/Utils.js';
import { Creature } from '../creatures/Creature.js';

export const resultMaps = {
    damage : {
        result : damage,
        vars : [
            'target',
            'damage',
        ]
    },
    armour : {
        result : armour,
        vars : [
            'target',
            'armour',
        ]
    },
    target : {
        result : target,
        vars : 'selectors',
    },
}

function damage (target, damage) {
    target = asArray(target);
    for(var i=0; i<target.length; i++) {
        target[i].damage(damage);
    }
}

function armour(target, armour) {
    target = asArray(target);
    for(var i=0; i<target.length; i++) {
        target[i].applyArmour(armour);
    }
}

function target() {};