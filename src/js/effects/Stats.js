
const defaultStats = {
    quickstepRage : 1,
    speed : 6,
    hp : 100,
}

export class Stats {
    constuctor() {
    }

    get(stat) {
        if(typeof this[stat] !== 'undefined') {
            return this[stat];
        }
        else if(typeof defaultStats[stat] !== 'undefined') {
            this[stat] = defaultStats[stat];
            return this[stat];
        }
        this[stat] = 0;
        return 0;
    }

    set(stat, n) {
        this[stat] = n;
    }

    modify(stat, n) {
        if(typeof this[stat] !== 'undefined') {
            this[stat] += n;
        }
        else if(typeof defaultStats[stat] !== 'undefined') {
            this[stat] = defaultStats[stat];
            this[stat] += n;
        }
        else {
            this[stat] = n;
        }
    }
}