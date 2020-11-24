import { Creature } from './Creature.js';

export class Enemy extends Creature {
    constructor(name) {
        super();
        getInfo('enemies/' + name, this.init.bind(this));
    }

    init(data) {
        this.name = data.name;
        for(var stat in data.stats) {
            this.stats.set(stat, data.stats[stat]);
        }
        this.actions = 2;
        this.moves = stats.moves;
        this.results = data.results;
        this.sprite.src = data.art;
    }
        
    takeTurn() {

    }
}