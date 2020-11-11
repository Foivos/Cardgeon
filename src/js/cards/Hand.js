import { CardSet } from './CardSet.js';
import { cardPositions } from './CardPositions.js';
import { Card } from './Card.js';
import { mouseover, mouseout, mousedown } from './CardEventHandlers.js';
import { pane } from '../core/Pane.js';
import { withinRange } from '../turn/WithinRange.js';
import { movingCreatures } from '../creatures/MovingCreatures.js';
import { renderer } from '../core/Renderer.js';

class Hand extends CardSet{
    constuctor() {
        this.selected = {};
        this.hovered = {};
        this.moving = {};
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
            card.moveTo(pos, 20);
            card.elem.style.zIndex = (hand.hovered === card) ? 11 : hand.length-1-i;
        }
    }
    /**
     * Adds a card to the hand.
     * @param {Card} card 
     * @param {number} i 
     */
    push(card, i=null) {
        super.push(card, i);
        card.elem.style.display = 'block';
        card.elem.onmouseover = mouseover;
        card.elem.onmouseout = mouseout.bind(card);
        card.elem.onmousedown = mousedown.bind(card);
        this.position();
    }
    /**
     * Removes a card from the hand.
     * @param {Card} card 
     */
    remove(card) {
        super.remove(card);
        card.elem.onmouseover = null;
        card.elem.onmouseout = null;
    }

    pop() {
        var card = super.pop();
        card.hide();
        return card;
    }

    select(card) {
        this.deselect();
        this.selected = card;
        card.moveTo(pane.getCardPos(), 50);
        this.remove(card);
        if(movingCreatures.length === 0 && card.range) withinRange.calculate(card.range);
    }

    deselect(i=0) {
        if(this.selected) this.push(this.selected, i);
        delete this.selected;
        withinRange.delete();
    }
};

export var hand = new Hand();