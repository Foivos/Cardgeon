
class MovingCreature {
    constructor(creature, path, onFinish, speed = 5) {
        this.creature = creature;
        if(!creature.remainingMove) {
            creature.remainingMove = creature.speed;
        }
        this.path = path;
        this.speed = speed;
        this.progress = 0;
        this.onFinish = onFinish;
    }

}

class MovingCreatures extends Array {
    constructor() {
        super();
    }

    push(creature, path, onFinish, speed = 5) {
        if(path.length < 2) {
            return;
        };
        super.push(new MovingCreature(creature, path, onFinish, speed));
    }

    remove(mc) {
        var i = this.findIndex(function(elem) {return this === elem;}, mc);
        if(i != -1) this.splice(i, 1);
    }
}

export var movingCreatures = new MovingCreatures();