import { asArray } from '../core/Utils.js';

export function damage (target, damage) {
    target = asArray(target);
    for(var i=0; i<target.length; i++) {
        target[i].damage(damage);
    }
}

export function getStat(target, stat) {
    return target.stats.get(stat);
}

export function modifyStat(target, stat, n) {
    return target.stats.modify(stat, n);
}