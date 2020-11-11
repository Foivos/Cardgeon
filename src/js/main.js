import { Card } from './cards/Card.js';
import { hand } from './cards/Hand.js';
import { creatureSet } from './creatures/CreatureSet.js';
import { Hero } from './creatures/Hero.js';
import { turnOrder } from './turn/TurnOrder.js';
import { DistanceMap } from './core/Containers.js';



var j = 0;
var interval = setInterval(function () {
    hand.push(new Card());
    hand.position();
    j++;
    if(j===10) clearInterval(interval);
}, 100.0);

creatureSet.push(new Hero('mew'));
creatureSet.push(new Hero('salamance'));
creatureSet.push(new Hero('tyranitar'));
creatureSet[1].x = 5;
creatureSet[1].y = 1;
creatureSet[2].x = 1;
creatureSet[2].y = 5;
for(var i=0; i<creatureSet.length; i++) {
    turnOrder.push(creatureSet[i]);
}
turnOrder.start();




