import { hand } from './Hand.js';
import { Card } from './Card.js';
import { mouse } from '../core/Mouse.js';
import { paneRight } from '../core/PaneRight.js';
import { renderer } from '../core/Renderer.js';

export function move(e) {
    e = e || window.event;
    e.preventDefault();

    if(hand.moving) {
        hand.moving.setX(e.clientX);
        hand.moving.setY(e.clientY);
        
        if(hand.reorderingFrom(e.clientX, e.clientY)) {
            hand.highlight.style.display = 'none';
            if(!hand.includes(hand.moving)) {
                hand.push(hand.moving);
            }
            var i = hand.findIndex(elem => elem === hand.moving);
            while(i<hand.length-1 && hand.moving.getX()<hand[i+1].getX()) {
                hand[i] = hand[i+1];
                hand[i+1] = hand.moving;
                i++;
            }
            while (i>0) {
                if (i === 1){
                    if (hand.moving.getX()<hand[i-1].getX()) break;
                }
                else if (hand.moving.getX() + Card.W*hand.moving.getScale()/2 < hand[i-2].getX() - Card.W*hand[i-2].getScale()/2) break;
                hand[i] = hand[i-1];
                hand[i-1] = hand.moving;
                i--;
            }
        }
        else {
            hand.remove(hand.moving);
            hand.highlight.style.display = 'block';
            hand.highlight.style.width = Card.scaleB * Card.W * 1.01;
            hand.highlight.style.top = hand.moving.getY() - Card.scaleB * Card.H / 2 * 1.01;
            hand.highlight.style.left = hand.moving.getX() - Card.scaleB * Card.W / 2 * 1.01;
        }
    }
    hand.position();
}

export function mouseup(e) {
    if(!hand.reorderingFrom(e.clientX, e.clientY) && hand.moving) {
        hand.deselect();
        hand.select(hand.moving);
    }
    document.onmouseup = null;
    document.onmousemove = null;
    delete hand.moving;
    hand.highlight.style.display = 'none';
    hand.position();
}
/**
 * Handle the onmouseout event.
 * @param {Event} e 
 */
export function mouseout(e) {
    if(!e.target.id) return;
    delete hand.hovered;
    hand.position();
}
/**
 * handles the onmousedown event.
 * @param {Event} e 
 */
export function mousedown(e){
    var card = hand.hovered || hand.selected;
    e = e || window.event;
    e.preventDefault();
    delete hand.hovered;
    card.setScale(Card.scaleB);
    card.setX(e.clientX);
    card.setY(e.clientY);
    card.setDeg(0);
    hand.moving = card;
    delete renderer.movingCards[hand.moving.id]
    document.onmouseup = mouseup;
    hand.deselect();
    hand.position();
    document.onmousemove = move;
}
/**
 * handles the onmouseover event.
 * @param {Event} e 
 */
export function mouseover(e) {
    if(hand.moving) return;
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
    card.elem.style.zIndex = 11;
    hand.position();
}