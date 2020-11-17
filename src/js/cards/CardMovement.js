import { renderer } from '../core/Renderer.js';
import { getTime, matrixInvert, matrixMultiply } from '../core/Utils.js';
import { Card } from './Card.js';
import { CardCoord } from './CardCoord.js';




export class CardMovement {
    constructor(card, coords, derivs, onArrive=null) {
        this.t0 = getTime();
        this.onArrive = onArrive;
        this.t1 = coords[coords.length - 1].t;
        this.coords = coords;
        this.derivs = derivs;
        this.card = card;
        this.initiate();
    }

    getPos(i) {
        var r = {};
        var t = getTime() - this.t0;
        if(t >= this.t1) {
            t = this.t1;
            if(renderer.movingCards[i].movements.length == 1) {
                renderer.movingCards[i].movements.pop();
                delete renderer.movingCards[i];
            }
            else {
                renderer.movingCards[i].movements.splice(0,1);
                this.card = renderer.movingCards[i];
                renderer.movingCards[i].movements[0].initiate();
            }
            if(this.onArrive) {
                this.onArrive();
            }
        }
        for(var key in CardCoord.default) { 
            var Ts = [];
            for(var i=0; i<this[key].length; i++) {
                Ts.push(t ** i);
            }
            r[key] = matrixMultiply([Ts], this[key])[0][0];
        }
        return r;
    }

    initiate() {
        this.t0 = getTime();
        var coords = [this.card];
        coords.push(...this.coords);
        var derivs = this.derivs;
        for(var key in CardCoord.default) {
            var Ys = [];
            var Ts = [];
            var N = coords.length;
            
            for(var i=0; i<N; i++) {
                var n = coords[i][key];
                if(!n && n !== 0) {
                    n = CardCoord.default[key];
                }
                Ys.push([n]);
                var t = coords[i].t;
                if(!t && t !== 0) {
                    t = 0;
                }
                Ts.push(t);
            }
            for(var i=0; derivs && i<derivs.length; i++) {
                var n = derivs[i][key];
                if(!n && n !== 0) {
                    continue;
                }
                N++;
                Ys.push([n]);
                var t = derivs[i].t;
                if(!t && t !== 0) {
                    t = 0;
                }
                Ts.push(t);
            }
            var M = [];
            var i=0
            for(; i<coords.length; i++) {
                M.push([]);
                for(var j=0; j<N; j++) {
                    M[i].push(Ts[i] ** j);
                }
            }
            for(; i<N; i++) {
                M.push([0]);
                for(var j=1; j<N; j++) {
                    M[i].push(j * Ts[i] ** (j - 1));
                }
            }
            M = matrixInvert(M);
            this[key] = matrixMultiply(M, Ys);
            
        }
    }
}