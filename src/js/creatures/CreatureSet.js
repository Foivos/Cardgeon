
class CreatureSet extends Array{
    constructor() {
        super();
    }

    push(creature) {
        super.push(creature);
        creature.id = this.length-1;
    }

    occupying(x, y) {
        for(var i=0; i<this.length; i++) {
            if(this[i].x === x && this[i].y === y) return this[i];
        }
        return null;
    }
}

export var creatureSet = new CreatureSet;