import { CardSet } from './CardSet.js';
import { cardPositions } from './CardPositions.js';
import { Card } from './Card.js';
import { mouseover, mouseout, mousedown, mouseup, mousemove, contextmenu } from './CardEventHandlers.js';
import { paneRight } from '../ui/PaneRight.js';
import { withinRange } from '../turn/WithinRange.js';
import { renderer } from '../ui/Renderer.js';

/**
 * A represents the active hand of the player.
 */
class Hand extends CardSet{
    constructor() {
        super();

        this.highlight = document.createElement('img');
        this.highlight.id = 'handHighlight'
        this.highlight.src = 'res/highlight.png';
        this.highlight.style.position = 'absolute';
        this.highlight.style.top = 0;
        this.highlight.style.left = 0;
        this.highlight.style.zIndex = 30;
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
        card.elem.addEventListener('mouseover', mouseover.bind(card));
        card.elem.addEventListener('mouseout', mouseout.bind(card));
        card.elem.addEventListener('mousedown', mousedown.bind(card));
        card.elem.addEventListener('mousemove', mousemove.bind(card));
        card.elem.addEventListener('mouseup', mouseup.bind(card));
        card.elem.addEventListener('contextmenu', contextmenu);
        delete renderer.movingCards[card.id];
        this.position();
    }
    /**
     * Removes a card from the hand.
     * @param {Card} card 
     */
    remove(card) {
        super.remove(card);
        card.canvas.removeEventListener('mouseover', mouseover);
        card.canvas.removeEventListener('mouseout', mouseout);
    }
    /**
     * Removes the last card from the hand.
     */
    pop() {
        var card = super.pop();
        //card.hide();
        return card;
    }
    /**
     * Selects a card when it is played.
     * @param {Card} card The card to select.
     */
    select(card) {
        this.deselect();
        this.selected = card;
        var pos = paneRight.getCardPos();
        card.moveTo(pos, 2);
        this.remove(card);
        card.activate();
    }
    /**
     * Deselects a card.
     * @param {number} i The position to return the card to.
     */
    deselect(i=0) {
        withinRange.length = 0;
        if(this.selected) this.push(this.selected, i);
        delete this.selected;
    }
    /**
     * Check to see if x and y are close enought to the hand that the card should not be played.
     * @param {number} x The x coordinate.
     * @param {number} y The y coordinate.
     */
    reorderingFrom(x, y) {
        return y > document.body.clientHeight-Card.H*Card.scaleB && x < document.body.clientWidth - paneRight.W;
    }
    /**
     * Discard the entire hand.
     * @param {function} onDiscard What to do once the hand is done discarding.
     */
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