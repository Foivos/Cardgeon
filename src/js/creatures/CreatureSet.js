
export class CreatureSet extends Array{
    constructor() {
        super();
    }

    push(creature) {
        super.push(creature);
        creature.id = this.length-1;
    }

    remove(creature) {
        for(var i=0; i<this.length; i++) {
            if(creature.id === this[i].id) {
                this.splice(i, 1);
                break;
            }
        }
    }

    occupying(x, y) {
        for(var i=0; i<this.length; i++) {
            if(this[i].x === x && this[i].y === y) return this[i];
        }
        return null;
    }
}
