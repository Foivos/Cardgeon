import { Stats } from '../effects/Stats.js';
import { Tags } from '../effects/Tags.js';

export class Creature {
    
    static nextId = 0;
    constructor(data) {
        this.art = data.art;
        this.id = Creature.nextId++;
        this.name = data.name;
        this.stats = new Stats();
        this.tags = new Tags();
        this.sprite = new Image();
        this.x = data.x;
        this.y = data.y;
        for(var stat in data.stats) {
            this.stats.set(stat, parseFloat(data.stats[stat]));
        }
        this.moves = {};
        for(var move in data.moves) {
            this.moves[move] = data.moves[move];
        }
        if(!this.art) return;
        this.sprite.src = 'res/' + this.art + '.png';
    }

    damage(n, source) {
        var armour = this.stats.get('armour');
        var hp = this.stats.get('hp');
        armour -= n;
        if(armour < 0) {
            hp += armour;
            armour = 0;
        }
        if(this.hp <= 0) {
            this.die();
        }
        this.stats.set('hp', hp);
        this.stats.set('armour', armour);
        if(hp<=0) this.die();
    }

    applyArmour(n) {
        this.stats.modify('armour', n);
    }

    die() {
        console.log(this, 'has died');
    }
};