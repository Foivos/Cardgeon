import { hand } from './Hand.js';
import { Card } from './Card.js';
import { mouse } from '../core/Mouse.js';
import { pane } from '../core/Pane.js';
import { renderer } from '../core/Renderer.js';

export function move(e) {
    e = e || window.event;
    e.preventDefault();

    if(hand.selected && e.clientY > document.body.clientHeight-250) {
        hand.moving = hand.selected;
        hand.deselect();
    }
    if(hand.moving) {
        hand.moving.setX(e.clientX);
        hand.moving.setY(e.clientY);
        
        if(hand.moving.getY() < document.body.clientHeight-250) {
            hand.deselect();
            hand.select(hand.moving);
            delete hand.moving;
        }
        else {
            if(hand.selected) {
                hand.deselect();
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
    }
    hand.position();
}

export function mouseup() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    delete hand.moving;
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
    e = e || window.event;
    e.preventDefault();
    delete hand.hovered;
    this.setScale(Card.scaleB);
    this.setX(e.clientX);
    this.setY(e.clientY);
    this.setDeg(0);
    hand.moving = this;
    delete renderer.movingCards[hand.moving.id]
    document.onmouseup = mouseup.bind(hand.selected === this);
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
        var x=e.clientX , y=e.clientY, rad, pos=hand[i-1].pos, dx, dy;
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