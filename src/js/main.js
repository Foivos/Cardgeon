import { Card } from './cards/Card.js';
import { hand } from './cards/Hand.js';
import { creatureSet } from './creatures/CreatureSet.js';
import { Hero } from './creatures/Hero.js';
import { turnOrder } from './turn/TurnOrder.js';
import { DistanceMap } from './core/Containers.js';
import { getInfo } from './core/Utils.js';
import { Creature } from './creatures/Creature.js';
import { resolver } from './effects/Resolver.js';




var mew = new Hero('mew')
creatureSet.push(mew);
creatureSet.push(new Creature('salamance'));
creatureSet.push(new Creature('tyranitar'));
creatureSet[1].x = 5;
creatureSet[1].y = 1;
creatureSet[2].x = 1;
creatureSet[2].y = 5;


for(var i=0; i<10; i++) {
    mew.drawPile.push(new Card('strike'));
    mew.drawPile.push(new Card('defend'));
}
mew.drawPile.shuffle();

turnOrder.push(mew);
turnOrder.start();
