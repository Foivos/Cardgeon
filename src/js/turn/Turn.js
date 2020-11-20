import { hand } from '../cards/Hand.js';
import { paneLeft } from '../ui/PaneLeft.js';
import { renderer } from '../ui/Renderer.js';
import { movingCreatures } from '../creatures/MovingCreatures.js';
import { availableMoves } from './AvailableMoves.js';
import { withinRange } from './WithinRange.js';

export class Turn {
    constructor() {
        this.hero = null;
        this.remainingMove = 0;
        this.actions = 0;
        this.toDraw = 0;
    }

    move(path, onFinish) {
        movingCreatures.push(this.hero, path, onFinish);
        this.remainingMove -= path[path.length-1].d;
        availableMoves.delete();
        withinRange.delete();
    }

    start(hero, onStart) {
        this.hero = hero;
        this.actions = hero.actions;
        paneLeft.setActions(this.actions);
        this.remainingMove = 0;
        for(var i=0; i<7; i++) {
            this.drawCard();
        }
    }

    end(onEnd) {
        hand.discardAll(onEnd);
    }

    drawCard() {
        if(this.toDraw > 0) {
            this.toDraw++;
            return;
        }
        if(this.hero.drawPile.length === 0 && this.hero.discardPile.length === 0) return;
        if(hand.length + (hand.selected ? 1 : 0) >= 10) return;
        if(this.hero.drawPile.length === 0) {
            renderer.doneWithMoves.push(function() {
                turn.hero.drawPile.shuffle();
                var n = turn.toDraw;
                turn.toDraw = 0;
                turn.draw(n);
            });
            var int = setInterval(function() {
                if(turn.hero.discardPile.length <=1) clearInterval(int);
                if(turn.hero.discardPile.length <=0) return;
                var card = turn.hero.discardPile.pop();
                turn.hero.drawPile.push(card);
                card.reshuffle();
            }, 10);
            this.toDraw = 1;
            return;
        }
        var card = this.hero.drawPile.draw();
        hand.push(card);
    }

    draw(n) {
        var obj = {n:n};
        var int = setInterval(function(obj) {
            var n = obj.n--;
            if(n <= 1) {
                clearInterval(int);
                if(n <= 0) return;
            }
            turn.drawCard();
        }.bind(null, obj), 10);
    }
}

export var turn = new Turn();