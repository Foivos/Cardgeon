import { Creature } from './Creature.js';
import { CardSet } from '../cards/CardSet.js';

export class Hero extends Creature {
    constructor(image) {
        super(image);
        this.actions = 3;
        this.drawPile = new CardSet();
        this.discardPile = new CardSet();
    }
    
    initiateMove() {
        
    }
}