import { Creature } from './Creature.js';

export class Hero extends Creature {
    constructor(image) {
        super(image);
        this.actions = 3;
    }
    
    initiateMove() {
        
    }
}