import { grid } from '../core/Grid.js';
import { Stats } from '../effects/Stats.js';
import { Tags } from '../effects/Tags.js';

export class Creature {
    constructor(image) {
        this.x = 1;
        this.y = 1;
        this.sprite = new Image();
        this.sprite.src = 'res/' + image + '.png';
        this.stats = new Stats();
        this.tags = new Tags();
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