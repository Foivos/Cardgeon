
/**
 * A priority queue implementation.
 */
export class PriorityQueue extends Array{
    /**
     * @param {function} compare If provided it should accept two elements that will be passed to the queue and return true only if the first element should be returned first.
     */
    constructor(compare = null) {
        super();
        this.compare = compare ? compare : function(e1, e2) {return e1<e2};;
    }
    /**
     * Push an element to the specified position. If n is not provided the element will be appended insted.
     * @param {*} elem The element to be added to the queue.
     * @param {number} n the position to add the element to.
     */
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
    /**
     * Return the (by default smallest) top element and reorders the rest of the queue.
     */
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

/**
 * A container that has saves all the distances from a point and can potentially be used for pathfinding.
 */
export class DistanceMap extends Array{
    constructor() {
        super();
    }
    /**
     * Creates a DistanceMap around a set of squares an arbitrary number of variables.
     * @param {number} d The additional distance to traverse to.
     * @param {number} dmax The maximum distance to traverse to.
     * @param {number} x0 The center x's of the distance map.
     * @param {number} y0 The center y's of the distance map.
     * @param {function} findAdjecent A function thatw take an x and a y and returns objects holding x, y and d, the additional distance.
     */
    initGeneral(d, dmax, x0, y0, findAdjecent, nvars=1, sortI = -1) {
        this.dmax = Math.floor(dmax);
        this.d = d;
        this.nvars = nvars;
        this.x0 = x0;
        this.y0 = y0;
        this.sortI = sortI === -1 ? this.nvars - 1 : sortI; 
        this.findAdjecent = findAdjecent;
        this.N = 2 * dmax + 1;
        this.length = this.N ** 2;
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
     * Calculates the distnaces.
     */
    proccess() {
        var comp = function(x, y) {
            return x.d < y.d;
        }
        var q = new PriorityQueue(comp);
        for(var i=0; i<this.I0.length; i++) {
            q.push({x:this.getX(this.I0[i]), y:this.getY(this.I0[i]), d:this[this.I0[i]][this.sortI]});
        }
        while(q.length > 0) {
            var cur = q.pop();
            var vars = this.get(cur.x, cur.y);
            if(vars[this.sortI] < cur.d) continue;
            var Next = this.findAdjecent(cur.x, cur.y);
            for(var j=0; j<Next.length; j++) {
                var next = Next[j];
                if(Math.floor(cur.d + next.d) > this.d) continue;
                var i = this.getI(next.x, next.y);
                if(!this[i]) {
                    this[i] = [];
                    for(var k=0; k<this.nvars; k++) {
                        this[i].push(vars[k] + next.d);
                    }
                    q.push({x : next.x, y : next.y, d : vars[this.sortI] + next.d});
                }
                else {
                    for(var k=0; k<this.nvars; k++) {
                        if(this[i][k] > vars[k] + next.d) {
                            this[i][k] = vars[k] + next.d;
                            if(k === this.sortI) q.push({x : next.x, y : next.y, d : vars[k] + next.d});
                        }
                    }
                }
            }
        }
    }
    /**
     * Returns the index for the distance map from coorditanes.
     * @param {number} x 
     * @param {number} y 
     */
    getI(x, y) {if(Math.abs(x - this.x0) > this.dmax || Math.abs(y - this.y0) > this.dmax) return null;
        return x - this.x0 + this.dmax + (y - this.y0 + this.dmax) * this.N;
    }
    /**
     * returns the x value that corresponds to the index i.
     * @param {number} i 
     */
    getX(i) {
        return i % this.N + this.x0 - this.dmax;
    }
    /**
     * returns the y value that corresponds to the index i.
     * @param {number} i 
     */
    getY(i) {
        return Math.floor(i / this.N) + this.y0 - this.dmax;
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
        for(var i=0; i<this.length; i++) {
            delete this[i];
        }
        this.length = 0;
    }
    /**
     * Returns an array of coordinates and their relative distances of the shortest path to the target coordinates.
     * @param {number} x 
     * @param {number} y 
     */
    getPathTo(x, y, sortI = 0, within = 0) {
        var pos = {x:x, y:y, d:this.get(x, y)[sortI]};
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
                if(this[i][sortI] < min && pos.d - this[i][sortI] === next.d) {
                    min = this[i][sortI];
                    nextI = i;
                }
            }
            pos={x:this.getX(nextI), y:this.getY(nextI), d:this[nextI][sortI]};
            path.push(pos);
            
        }
        path.push({x : this.x0, y : this.y0, d : this[this.getI(this.x0, this.y0)][this.sortI]});
        var rev = [];
        for(var i=path.length-1; i>=0; i--) {
            if(i < path.length - 1 && d0 - path[i].d <= within && d0 - path[i+1].d > within) {
                rev.push(path[i]);
                break;
            }
            rev.push(path[i]);
        }
        return rev;
    }
}