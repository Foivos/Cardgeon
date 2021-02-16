import { Card } from './Card.js';
import { hand } from './Hand.js';

/**
 * Returns an array of the card positions.
 * @param {number} N 
 */
export function cardPositions(N) { if(N === 0) return [];
    var dx = document.body.clientWidth/N/1.7;
    if(dx>Card.W*Card.scaleS*0.8) {
        dx=Card.W*Card.scaleS*0.8;
    }
    var Pos = new Array(N);
    var middle = document.body.clientWidth/2
    var y0 = document.body.clientHeight-Card.H*Card.scaleB/10;
    var degx =30;
    for(var i=0; i<N; i++) {
        Pos[i] = {x : ((N-1)/2-i)*dx + middle, deg : ((N-1)/2-i)*dx/degx, scale:Card.scaleS};
    }
    if(N%2) {
        Pos[(N-1)/2].y = y0;
    }
    else {
        y0-=5
        Pos[N/2-1].y = y0;
        Pos[N/2].y = y0;
    }
    for(var i=Math.floor(N/2-1.25); i>=0; i--) {
        Pos[i].y = getRightCardPosition(Pos[i+1], dx, degx, Card.scaleS);
        Pos[N-i-1].y = getLeftCardPosition(Pos[N-i-2], dx, degx, Card.scaleS);
    }
    if(!hand.moving && !hand.hovered) {
        return Pos;
    }
    
    var card = hand.moving ? hand.moving : hand.hovered;
    var i0 = hand.findIndex(elem => elem === card);
    
    if(i0 == -1) return Pos;
    Pos[i0].x = Pos[i0].x - Card.W * Card.scaleS / 2 + dx / 2;
    Pos[i0].y = document.body.clientHeight - Card.H * Card.scaleB/2 + 1;
    Pos[i0].deg = 0;
    Pos[i0].scale = Card.scaleB;
    if(i0<N-1) {
        var dx1, dx2, rad;
        rad = Pos[i0+1].deg / 180 * Math.PI;
        dx1 = Card.W * Card.scaleS / 2 * Math.cos(rad) + Card.H * Card.scaleS / 2 * Math.sin(rad);
        dx2 = Card.W * Card.scaleS / 2 * Math.cos(rad);
        Pos[i0+1].x = Math.min( Pos[i0].x - Math.min(dx1, dx2) + 10, Pos[i0+1].x );
        dx = (Pos[i0+1].x - Pos[N-1].x)/(N-i0-2);
        if(dx<40) dx = 40;
        for(i=i0+2; i<N; i++) {
            Pos[i].x = Pos[i-1].x - dx;
        }
    }
    if( i0>0 ) {
        var dx1, dx2, rad;
        rad = Pos[i0-1].deg / 180 * Math.PI;
        dx1 = -Card.W * Card.scaleS / 2 * Math.cos(rad) + Card.H*Card.scaleS / 2 * Math.sin(rad);
        dx2 = -Card.W * Card.scaleS / 2 * Math.cos(rad);
        Pos[i0-1].x = Math.max( Pos[i0].x + Card.W * Card.scaleS/2 - Math.max(dx1, dx2) - 10, Pos[i0-1].x );
        dx = (Pos[0].x - Pos[i0-1].x)/(i0-1);
        if(dx<40) dx = 40;
        for(i=i0-2; i>=0; i--) {
            Pos[i].x = Pos[i+1].x + dx;
        }
    }
    return Pos;
};

/**
 * Calculates the next card position from the previus one. Should be used when the cards are on the left side of the hand.
 * @param {object} pos
 * @param {number} dx 
 * @param {number} degx
 */
function getLeftCardPosition(pos, dx, degx, scale) {
    var x,y,deg,dx1,dx2,dy1,dy2,rad;
    x = pos.x-dx;
    deg = pos.deg - dx/degx;
    rad = pos.deg / 180 * Math.PI;
    dx1 = Card.W * scale / 2 * Math.cos(rad) + Card.H * scale / 2 * Math.sin(rad);
    dy1 = Card.W * scale / 2 * Math.sin(rad) - Card.H * scale / 2 * Math.cos(rad);
    rad = deg / 180 * Math.PI;
    dx2 = Card.W * scale / 2 * Math.cos(rad) + Card.H * scale / 2 * Math.sin(rad);
    dy2 = Card.W * scale / 2 * Math.sin(rad) - Card.H * scale / 2 * Math.cos(rad);
    y = Math.tan(pos.deg/180*Math.PI)*(x+dx2-(pos.x+dx1))-dy2+(pos.y+dy1);
    return y;
}

/**
 * Calculates the next card position from the previus one. Should be used whne the cards are on the right side of the hand.
 * @param {object} pos
 * @param {number} dx 
 * @param {number} degx
 */
function getRightCardPosition(pos, dx, degx, scale) {
    var x,y,deg,dx1,dx2,dy1,dy2,rad;
    x = pos.x+dx;
    deg = pos.deg + dx/degx;
    rad = pos.deg / 180 * Math.PI;
    dx1 = -Card.W * scale / 2 * Math.cos(rad) + Card.H * scale / 2 * Math.sin(rad);
    dy1 = -Card.W * scale / 2 * Math.sin(rad) - Card.H * scale / 2 * Math.cos(rad);
    rad = deg / 180 * Math.PI;
    dx2 = -Card.W * scale / 2 * Math.cos(rad) + Card.H * scale / 2 * Math.sin(rad);
    dy2 = -Card.W * scale / 2 * Math.sin(rad) - Card.H * scale / 2 * Math.cos(rad);
    y = Math.tan(pos.deg/180*Math.PI)*(x+dx2-(pos.x+dx1))-dy2+(pos.y+dy1);
    return y;
}