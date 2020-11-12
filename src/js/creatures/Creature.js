import { grid } from '../core/Grid.js';

export class Creature {
    constructor(image) {
        this.x = 1;
        this.y = 1;
        this.sprite = new Image();
        this.sprite.src = 'res/' + image + '.png';
        this.speed = 4;
        this.hp = 100;
        this.armour = 0;
    }

    damage(n, source) {
        this.armour -= n;
        if(this.armour < 0) {
            this.hp += this.armour;
            this.armour = 0;
        }
        if(this.hp <= 0) {
            this.die();
        }
    }

    applyArmour(n) {
        this.armour += n;
    }

    die() {
        console.log(this);
    }
};