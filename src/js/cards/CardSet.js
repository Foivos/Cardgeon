import {Card} from './Card.js'

/**
 * A card array with some additional functionalily.
 */
export class CardSet extends Array{
    constructor() {
        super();
    }
    
    /**
     * Randomizes the Card order.
     */
    shuffle() {
        for(var i=this.length-1; i>0; i--) {
            var ri = Math.floor(Math.random()*(i+1));
            var temp = this[ri];
            this[ri] = this[i];
            this[i] = temp;
        }
    }
    /**
     * Adds a card to the set.
     * @param {Card} card 
     * @param {number} index 
     */
    push(card, index=null) {
        super.push(card);
        if(index !== null) {
            for(var i = this.length-1; i>index; i--) {
                this[i] = this[i-1];
            }
            this[index]=card;
        }
    }
    remove(card) {
        var i = this.findIndex(elem => elem === card);
        if(i != -1) this.splice(i,1);
    }
    /**
     * Removes and returns the top card.
     */
    draw() {
        return this.pop();
    }
};