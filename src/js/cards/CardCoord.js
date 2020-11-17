import { Card } from './Card.js';


export class CardCoord {
    constructor(x, y, deg, scale, turnover, t) {
        this.x = x;
        this.y = y;
        this.deg =deg;
        this.scale = scale;
        this.turnover = turnover;
        this.t = t;
    }

    static default = {
        x : 0,
        y : 0,
        deg : 0,
        scale : 1,
        turnover : 0,
    }
}