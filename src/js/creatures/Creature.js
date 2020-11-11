import { grid } from '../core/Grid.js';

export class Creature {
    constructor(image) {
        this.x = 1;
        this.y = 1;
        this.sprite = new Image();
        this.sprite.src = image + '.png';
        this.speed = 4;
        this.hp = 100;
        this.armor = 0;
    }
};