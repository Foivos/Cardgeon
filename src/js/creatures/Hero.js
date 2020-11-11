import { Creature } from './Creature.js';
import { DrawPile } from '../cards/DrawPile.js'

export class Hero extends Creature {
    constructor(image) {
        super(image);
        this.actions = 3;
        this.drawPile = new DrawPile();
    }
    
    initiateMove() {
        
    }
}