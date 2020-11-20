import { grid } from '../ui/Grid.js';
import { Stats } from '../effects/Stats.js';
import { Tags } from '../effects/Tags.js';

export class Creature {
    
    static nextId = 0;
    constructor(image) {
        this.id = Creature.nextId++;
        this.x = 1;
        this.y = 1;
        this.stats = new Stats();
        this.tags = new Tags();
        if(!image) return;
        this.sprite = new Image();
        this.sprite.src = 'res/' + image + '.png';
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