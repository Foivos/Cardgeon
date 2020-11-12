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
    }
}

function damage (target, damage) {
    target = Array.isArray(target) ? target : [target];
    for(var i=0; i<target.length; i++) {
        target[i].damage(damage);
    }
}

function armour(target, armour) {
    target = Array.isArray(target) ? target : [target];
    for(var i=0; i<target.length; i++) {
        target[i].applyArmour(armour);
    }
}
