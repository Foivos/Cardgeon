import { hand } from './Hand.js';
import { Card } from './Card.js';
import { renderer } from '../ui/Renderer.js';

/**
 * Handles the mousemove event for cards.
 * @param {Event} e 
 */
export function mousemove(e) {
    e = e || window.event;
    e.preventDefault();
    if(hand.moving !== this) return;

    this.setX(e.clientX);
    this.setY(e.clientY);
    
    if(hand.reorderingFrom(e.clientX, e.clientY)) {
        if(document.getElementById('handHighlight')) this.elem.removeChild(hand.highlight);
        if(!hand.includes(this)) {
            hand.push(this);
        }
        var i = hand.findIndex(elem => elem === this);
        while(i<hand.length-1 && this.getX()<hand[i+1].getX()) {
            hand[i] = hand[i+1];
            hand[i+1] = this;
            i++;
        }
        while (i>0) {
            if (i === 1){
                if (this.getX() < hand[i-1].getX()) break;
            }
            else if (this.getX() + Card.W * this.getScale() / 2 < hand[i-2].getX() - Card.W * hand[i-2].getScale() / 2) break;
            hand[i] = hand[i-1];
            hand[i-1] = this;
            i--;
        }
    }
    else {
        hand.remove(hand.moving);
        hand.moving.elem.appendChild(hand.highlight);
        hand.highlight.style.width = Card.scaleB * Card.W * 1.01;
    }
    hand.position();
}
/**
 * Handles the mouseup event for cards.
 * @param {Event} e 
 */
export function mouseup(e) {
    if(hand.moving !== this) return;
    if(!hand.reorderingFrom(e.clientX, e.clientY) && hand.moving) {
        hand.deselect();
        hand.select(hand.moving);
    }
    hand.moving = null;
    if(document.getElementById('handHighlight')) this.elem.removeChild(hand.highlight);
    hand.position();
}
/**
 * Handle the onmouseout event for cards.
 * @param {Event} e 
 */
export function mouseout(e) {
    if(!e.target.id) return;
    hand.hovered = null;
    hand.position();
}
/**
 * handles the onmousedown event for cards.
 * @param {Event} e 
 */
export function mousedown(e){
    e = e || window.event;
    e.preventDefault();
    if(e.button === 0) {
        var card = hand.hovered || hand.selected;
        if(!card) return;
        delete hand.hovered;
        card.setScale(Card.scaleB);
        card.setX(e.clientX);
        card.setY(e.clientY);
        card.setDeg(0);
        hand.moving = card;
        delete renderer.movingCards[hand.moving.id]
        hand.deselect();
        hand.position();
    }
    else if(e.button === 2 && (hand.moving || hand.selected)) {
        if(this === hand.selected) hand.deselect();
        if(!hand.includes(this)) {
            hand.push(this);
        }
        hand.moving = null;
        if(document.getElementById('handHighlight')) this.elem.removeChild(hand.highlight);
        hand.position();
    }
}
/**
 * handles the onmouseover event for cards.
 * @param {Event} e 
 */
export function mouseover(e) {
    if(hand.moving) return;
    if(hand.selected && e.target === hand.selected.canvas) return;
    e = e || window.event;
    e.preventDefault();
    var i;
    for(i=hand.length-1;i>0;i--) {
        var x=e.clientX , y=e.clientY, rad, pos=hand[i-1], dx, dy;
        rad = pos.deg / 180 * Math.PI;
        dx=-Card.W*Card.scaleS/2*Math.cos(rad)+Card.H*Card.scaleS/2*Math.sin(rad);
        dy=-Card.W*Card.scaleS/2*Math.sin(rad)-Card.H*Card.scaleS/2*Math.cos(rad);
        if(-Math.tan(rad)*(y-pos.y-dy)+pos.x+dx > x) break;
    }
    var card = hand[i];
    hand.hovered = card;
    card.canvas.style.zIndex = 11;
    hand.position();
}
/**
 * Handles the contextmenuevent to prevent rightclicking cards from showing the menu.
 * @param {Event} e 
 */
export function contextmenu(e) {
    e.preventDefault();
    return false;
}