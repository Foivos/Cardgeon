import { hand } from '../cards/Hand.js';
import { movingCreatures } from '../creatures/MovingCreatures.js';
import { availableMoves } from './AvailableMoves.js';
import { withinRange } from './WithinRange.js';

export class Turn {
    constructor() {
        this.hero = null;
        this.remainingMove = 0;
        this.actions = 0;
    }

    move(path, onFinish) {
        movingCreatures.push(this.hero, path, onFinish);
        this.remainingMove -= path[path.length-1].d;
        availableMoves.delete();
        withinRange.delete();
    }

    start(hero) {
        this.hero = hero;
        this.actions = hero.actions;
        this.remainingMove = 0;
        for(var i=0; i<7; i++) {
            this.drawCard();
        }
    }

    end() {
        hand.deselect();
        while(hand.length > 0) {
            hand[0].discard();
        }
    }

    drawCard() {
        if(this.hero.drawPile.length === 0 && this.hero.discardPile.length === 0) return;
        if(hand.length + hand.selected ? 1 : 0 >= 10) return;
        if(this.hero.drawPile.length === 0) {
            while(this.hero.discardPile.length > 0) {
                this.hero.drawPile.push(this.hero.discardPile.pop());
            }
            this.hero.drawPile.shuffle();
        }
        var card = this.hero.drawPile.draw();
        hand.push(card);
    }
}

export var turn = new Turn();