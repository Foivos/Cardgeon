import { level } from '../map/Level.js';
import { intersects } from './Utils.js';

export class PriorityQueue extends Array{
    constructor(compare = null) {
        super();
        this.compare = compare ? compare : function(e1, e2) {return e1<e2};;
    }

    push(elem, n=null) {
        n = n != null ? n : this.length; 
        var i = 0;
        var dig = n;
        while(i < n) {
            
            if(this.compare(elem, this[i])) {
                var temp = elem;
                elem = this[i];
                this[i] = temp;
            }
            i = (i + 1) << 1 + dig % 2 - 1
            dig = dig >> 1;
        }
        if(this.length == n) {
            super.push(elem);
        }
        else {
            this[n] = elem;
        }
    }

    pop() {
        var r = this[0];
        for(var i=0; i<this.length; ) {
            var i1 = ((i + 1) << 1) - 1;
            if(i1 >= this.length) break;
            var i2 = (i + 1) << 1;
            if(i2 >= this.length) {
                this[i] = this[i1];
                i = i1;
                break;
            }
            if(this.compare(this[i1], this[i2])) {
                this[i] = this[i1];
                i = i1;
            }
            else {
                this[i] = this[i2];
                i = i2;
            }
        }
        if(i == this.length - 1) {   
            super.pop();
        }
        else {
            this.push(super.pop(), i);
        }

        return r;
    }
}


export class DistanceMap extends Array{
    constructor() {
        super();
    }


    init(x0, y0, d) {
        this.x0 = x0;
        this.y0 = y0;
        this.d = d;
        this.xmin = Math.max(x0 - Math.floor(d), 0);
        this.xmax = Math.min(x0 + Math.floor(d), level.W - 1);
        this.ymin = Math.max(y0 - Math.floor(d), 0);
        this.ymax = Math.min(y0 + Math.floor(d), level.H - 1);
        this.N = this.xmax - this.xmin + 1;
        this.length = this.N * (this.ymax - this.ymin + 1);
    }
    /**
     * Creates a DistanceMap around a set of squares an arbitrary number of variables.
     * @param {number} d The additional distance to traverse to.
     * @param {number} dmax The maximum distance to traverse to.
     * @param {Array.number} x0 The center x's of the distance map.
     * @param {Array.number} y0 The center y's of the distance map.
     * @param {function} findAdjecent A function thatw take an x and a y and returns objects holding x, y and d, the additional distance.
     */
    initGeneral(d, dmax, x0, y0, findAdjecent, nvars=1, sortI = -1) {
        this.xmin = Math.max(x0 - Math.floor(dmax), 0);
        this.xmax = Math.min(x0 + Math.floor(dmax), level.W - 1);
        this.ymin = Math.max(y0 - Math.floor(dmax), 0);
        this.ymax = Math.min(y0 + Math.floor(dmax), level.H - 1);
        this.d = d;
        this.nvars = nvars;
        this.x0 = x0;
        this.y0 = y0;
        this.sortI = sortI === -1 ? this.nvars - 1 : sortI; 
        this.findAdjecent = findAdjecent;
        this.N = this.xmax - this.xmin + 1;
        this.length = this.N * (this.ymax - this.ymin + 1);
        this.I0 = [];
    }/**
     * Creates a DistanceMap around a single square with a single variable.
     * @param {number} d The maximum distance to traverse to.
     * @param {number} x0 The center x of the distance map.
     * @param {number} y0 The center y of the distance map.
     * @param {function} findAdjecent An array of functions that take an x and a y and return objects holding x, y and d, the additional distance.
     */
    initSingle(d, x0, y0, findAdjecent) {
        this.initGeneral(d, Math.floor(d), x0, y0, findAdjecent);
        this.I0.push(this.getI(x0, y0));
        this[this.I0[0]] = [0];
        this.proccess();
    }
    /**
     * Creates a DistanceMap around another DistanceMap. The first var should be the same as that of the previous DistanceMap.
     * @param {DistanceMap} distances The original distanceMap.
     * @param {number} d The additional distance.
     * @param {function} findAdjacent The new adjacent square finder.
     */
    initNested(distances, d, findAdjacent) {
        this.initGeneral(d, distances.dmax+Math.floor(d), distances.x0, distances.y0, findAdjacent, distances.nvars+1);
        for(var i=0; i<distances.length; i++) {
            if(!distances[i]) continue;
            var j = this.getI(distances.getX(i), distances.getY(i));
            this[j] = distances[i].concat([0]);
            this.I0.push(j);
        }
        this.proccess();
    }
    
    /**
     * Returns the index for the distance map from coorditanes.
     * @param {number} x 
     * @param {number} y 
     */
    getI(x, y) {
        if(x < this.xmin || x > this.xmax || y < this.ymin || y > this.ymax) return null;
        return x - this.xmin + (y - this.ymin) * this.N;
    }
    /**
     * returns the x value that corresponds to the index i.
     * @param {number} i 
     */
    getX(i) {
        return i % this.N + this.xmin;
    }
    /**
     * returns the y value that corresponds to the index i.
     * @param {number} i 
     */
    getY(i) {
        return Math.floor(i / this.N) + this.ymin;
    }
    /**
     * Returns the distnaces from coordinates.
     * @param {number} x 
     * @param {number} y 
     */
    get(x,y) {
        return this[this.getI(x, y)];
    }
    /**
     * Sets the distances using coordinates.
     * @param {number} x 
     * @param {number} y 
     * @param {Array.number} vars 
     */
    set(x, y, vars) {
        this[this.getI(x, y)] = vars;
    }
    /**
     * Deletes the distance map. This should be invoke before recalculating as arrays are wonky otherise.
     */
    delete() {
        this.length = 0;
    }
    
}

export class WalkingDistanceMap extends DistanceMap {
    constructor() {
        super();
    }

    calculate(x0, y0, d) {
        this.init(x0, y0, d);
        this.I0 = [this.getI(x0, y0)];
        this[this.I0[0]] = 0;
        this.proccess();
    }
    
    findAdjecent = function(x,y) {
        var adj = [
            {x:0, y:1, d:1},
            {x:0, y:-1, d:1},
            {x:1, y:0, d:1},
            {x:-1, y:0, d:1},
            {x:1, y:1, d:1.5},
            {x:1, y:-1, d:1.5},
            {x:-1, y:1, d:1.5},
            {x:-1, y:-1, d:1.5},
        ];
        var r = [];
        for(var i=0; i<adj.length; i++) {
            var pos = {x : x + adj[i].x, y : y + adj[i].y, d : adj[i].d};
            if(level.creatures.occupying(pos.x, pos.y)) {
                continue;
            }
            if(pos.d === 1.5 && (level.creatures.occupying(pos.x, y) || level.creatures.occupying(x, pos.y))) {
                continue;
            }
            var l = {x0 : x, y0 : y, x1 : pos.x, y1: pos.y};
            for(var j=0; j<level.walls.length; j++) {
                if(intersects(level.walls[j], l)) continue;
            }
            r.push(pos);
        }
        return r;
    }
    /**
     * Calculates the distnaces.
     */
    proccess() {
        var comp = function(x, y) {
            return x.d < y.d;
        }
        var q = new PriorityQueue(comp);
        for(var i=0; i<this.I0.length; i++) {
            q.push({x:this.getX(this.I0[i]), y:this.getY(this.I0[i]), d:this[this.I0[i]]});
        }
        while(q.length > 0) {
            var cur = q.pop();
            if(this.get(cur.x, cur.y) < cur.d) continue;
            var Next = this.findAdjecent(cur.x, cur.y)
            for(var j=0; j<Next.length; j++) {
                var next = Next[j];
                if(Math.floor(cur.d + next.d) > this.d) continue;
                var i = this.getI(next.x, next.y);
                if(!this[i]) {
                    this[i] = cur.d + next.d;
                    q.push({x : next.x, y : next.y, d : cur.d + next.d});
                }
                else {
                    if(this[i] > cur.d + next.d) {
                        this[i] = cur.d + next.d;
                        q.push({x : next.x, y : next.y, d : cur.d + next.d});
                    }
                }
            }
        }
    }
    /**
     * Returns an array of coordinates and their relative distances of the shortest path to the target coordinates.
     * @param {number} x 
     * @param {number} y 
     */
    getPathTo(x, y) {
        var pos = {x:x, y:y, d:this.get(x, y)};
        var d0 = pos.d;
        var path = [];
        path.push(pos);
        while(pos.d > 1.5) {
            var min = pos.d;
            var Next = this.findAdjecent(pos.x, pos.y);
            var nextI;
            for(var j=0; j<Next.length; j++) {
                var next = Next[j];
                var i = this.getI(next.x, next.y);
                if(!this[i]) continue;
                if(this[i] < min && pos.d - this[i] === next.d) {
                    min = this[i];
                    nextI = i;
                }
            }
            pos={x:this.getX(nextI), y:this.getY(nextI), d:this[nextI]};
            path.push(pos);
            
        }
        path.push({x : this.x0, y : this.y0, d : this[this.getI(this.x0, this.y0)]});
        var rev = [];
        for(var i=path.length-1; i>=0; i--) {
            rev.push(path[i]);
        }
        return rev;
    }
}

export class TargetDistanceMap extends DistanceMap {
    constructor(x0, y0, d) {
        super();
    }

    calculate(x0, y0, d) {
        this.init(x0, y0, d);
        this.proccess();
    }

    proccess() {
        for(var i=0; i<this.length; i++) {
            var x = this.getX(i);
            var y = this.getY(i);
            if((x - this.x0) ** 2 + (y - this.y0) ** 2 > this.d) continue;
            if(!level.haveLOS(x, y, this.x0, this.y0)) continue;
            this[i] = Math.sqrt((x - this.x0) ** 2 + (y - this.y0) ** 2);
        }
    }
}