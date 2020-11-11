const { CardSet } = require('./CardSet.js');

class DrawPile extends CardSet {
    constructor() {
        super();
    }

    draw() {
        return this.pop();
    }
}