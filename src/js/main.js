import { Card } from './cards/Card.js';
import { hand } from './cards/Hand.js';
import { creatureSet } from './creatures/CreatureSet.js';
import { Hero } from './creatures/Hero.js';
import { turnOrder } from './turn/TurnOrder.js';
import { DistanceMap } from './core/Containers.js';
import { getInfo } from './core/Utils.js';
import { Creature } from './creatures/Creature.js';
import { resolver } from './effects/Resolver.js';
import { evaluate } from './effects/Evaluator.js';
import { turn } from './turn/Turn.js';
import { paneRight } from './core/PaneRight.js';




var mew = new Hero('mew')
creatureSet.push(mew);
creatureSet.push(new Creature('salamance'));
creatureSet.push(new Creature('tyranitar'));
creatureSet[1].x = 5;
creatureSet[1].y = 1;
creatureSet[2].x = 1;
creatureSet[2].y = 5;


/*for(var i=0; i<10; i++) {
    mew.drawPile.push(new Card('strike'));
    mew.drawPile.push(new Card('defend'));
    mew.drawPile.push(new Card('test'));
}*/
mew.drawPile.push(new Card('test'));
mew.drawPile.shuffle();

turnOrder.push(mew);
turnOrder.start();


/*var card = new Card('test');
card.back.style.display = 'block';
card.back.style.zIndex = 10;
card.setPos({x: 500, y:500, scale:0.7, deg:0});


/*var card = new Card('test');
card.setPos({x: 500, y:500, scale:0.7, deg:0});

var t = {t:0};

setInterval(function(t) {
    t.t+=0.01;
    //if(t.t>3) t.t=0;
    var t = t.t;// > 2 ? 0 : t.t;
    var a, b, c, d, e=0, f =0;
    var phi = Math.PI/4;
    var cosphi = Math.cos(phi), sinphi = Math.sin(phi);
    var costh = Math.cos(Math.PI*t/2);
    a = cosphi ** 2 + sinphi ** 2 * costh;
    b = -cosphi * sinphi * (1 - costh);
    c = b;
    d = sinphi ** 2 + cosphi **2 * costh;
    var s = 'matrix(' + a + ', ' + b + ', ' + c + ', ' + d + ', ' + e + ', ' + f + ')';
    this.elem.style.transform = s;
}.bind(card,t), 10);*/