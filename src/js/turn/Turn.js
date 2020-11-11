import { movingCreatures } from '../creatures/MovingCreatures.js';
import { availableMoves } from './AvailableMoves.js';
import { withinRange } from './WithinRange.js';

export class Turn {
    constructor() {
        this.hero = null;
        this.remainingMove = 0;
        this.actions = 0;
    }

    set(hero) {
        this.hero = hero;
        this.actions = hero.actions;
        this.remainingMove = 0;
    }

    move(path, onFinish) {
        movingCreatures.push(this.hero, path, onFinish);
        this.remainingMove -= path[path.length-1].d;
        availableMoves.delete();
        withinRange.delete();
    }
}

export var turn = new Turn();