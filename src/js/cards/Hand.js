import { CardSet } from './CardSet.js';
import { cardPositions } from './CardPositions.js';
import { Card } from './Card.js';
import { mouseover, mouseout, mousedown } from './CardEventHandlers.js';
import { paneRight } from '../ui/PaneRight.js';
import { paneLeft } from '../ui/PaneLeft.js';
import { withinRange } from '../turn/WithinRange.js';
import { movingCreatures } from '../creatures/MovingCreatures.js';
import { renderer } from '../ui/Renderer.js';

class Hand extends CardSet{
    constructor() {
        super();

        this.highlight = document.createElement('img');
        this.highlight.src = 'res/highlight.png';
        this.highlight.style.position = 'absolute';
        this.highlight.style.top = 0;
        this.highlight.style.left = 0;
        this.highlight.style.zIndex = 30;
        this.highlight.style.display = 'none';
        document.body.appendChild(this.highlight);
    }
    
    /**
     * Positions the hand properly on screen;
     */
    position() {
        var Pos = cardPositions(this.length);
        for(var i=0; i<this.length; i++) {
            var card = this[i];
            if (this.moving && card === this.moving) continue;
            var pos = Pos[i];
            card.movements = [];
            card.moveTo(pos, 3);
            card.elem.style.zIndex = (hand.hovered === card) ? 20 : hand.length+9-i;
        }
    }
    /**
     * Adds a card to the hand.
     * @param {Card} card 
     * @param {number} i 
     */
    push(card, i=null) {
        super.push(card, i);
        if(card.getTurnover() <= 1) {
            card.elem.addEventListener('mouseover', mouseover);
            card.elem.addEventListener('mouseout', mouseout);
            card.elem.addEventListener('mousedown', mousedown);
        }
        else {
            card.back.addEventListener('mouseover', mouseover);
            card.back.addEventListener('mouseout', mouseout);
            card.back.addEventListener('mousedown', mousedown);
        }
        delete renderer.movingCards[card.id];
        this.position();
    }
    /**
     * Removes a card from the hand.
     * @param {Card} card 
     */
    remove(card) {
        super.remove(card);
        card.elem.removeEventListener('mouseover', mouseover);
        card.elem.removeEventListener('mouseout', mouseout);
    }

    pop() {
        var card = super.pop();
        //card.hide();
        return card;
    }

    select(card) {
        this.deselect();
        this.selected = card;
        var pos = paneRight.getCardPos();
        card.moveTo(pos, 2);
        this.remove(card);
        card.activate();
    }

    deselect(i=0) {
        withinRange.length = 0;
        if(this.selected) this.push(this.selected, i);
        delete this.selected;
    }

    reorderingFrom(x, y) {
        return y > document.body.clientHeight-Card.H*Card.scaleB && x < document.body.clientWidth - paneRight.W;
    }

    discardAll(onDiscard) {
        hand.deselect();

        if(hand.length <= 0) {
            onDiscard();
            return;
        }
        var int = setInterval(function() {
            if(hand.length <= 1) {
                clearInterval(int);
            }
            if(hand.length <= 0) return;
            var card = hand.pop();
            card.discard();
        }, 10);
        setTimeout(() => {renderer.doneWithMoves.push(onDiscard);}, 20);
    }
};

export var hand = new Hand();