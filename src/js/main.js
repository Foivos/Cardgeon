import { Card } from './cards/Card.js';
import { Hero } from './creatures/Hero.js';
import { turnOrder } from './turn/TurnOrder.js';
import { Creature } from './creatures/Creature.js';
import { level } from './map/Level.js';



var mew = new Hero('mew');
mew.x = 6;
mew.y = 14;
level.load('level', function() {
    level.creatures.push(this);
}.bind(mew));




for(var i=0; i<10; i++) {
    mew.drawPile.push(new Card('strike'));
    mew.drawPile.push(new Card('defend'));
    mew.drawPile.push(new Card('test'));
}
mew.drawPile.shuffle();
setTimeout(function () {
    var pos = {
        x : -Card.H * Card.scaleB / 2 + Card.W * Card.scaleB,
        y : document.body.clientHeight - Card.W * Card.scaleB / 2 ,
        deg : 0,
        scale : Card.scaleB,
        turnover : 2,
    }
    for(var i=0; i<mew.drawPile.length; i++) {
        mew.drawPile[i].setPos(pos);
    }

}, 100);

turnOrder.push(mew);
turnOrder.start();




/*var card = new Card('test');
card.setPos({x: 500, y:500, scale:0.7, deg:0});

var t = {t:0};

setInterval(function(t) {
    t.t = 1 - t.t;
    if(t.t === 1) {
        card.discard();
    }
    else {
        card.reshuffle();
    }
}.bind(card,t), 4000);*/