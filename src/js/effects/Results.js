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
    test : {
        result : test,
        vars : ['arg1', 'arg2'],
    }
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

function test(arg1, arg2) {
    console.log(arg1,arg2);
}