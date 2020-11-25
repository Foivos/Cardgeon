import { getInfo, intersects } from '../core/Utils.js';
import { Creature } from '../creatures/Creature.js';
import { CreatureSet } from '../creatures/CreatureSet.js';


class Level {
    constructor(W, H) {
        this.W = W;
        this.H = H;
        this.walls = [];
        this.squares = [];
        this.squares.length = this.W * this.H;
        this.creatures = new CreatureSet();
        
        this.codes = {
            clear : -1,
            empty : 0,
            solid : 1,
            spawn : 2,
        }

        for(var i=0; i<this.W * this.H; i++) {
            this.squares[i] = this.codes.empty;
        }

        this.fillstyle = {}
        this.fillstyle[this.codes['solid']] = "rgba(0, 0, 0, 0.5)";
        this.fillstyle[this.codes['clear']] = "rgba(255, 255, 255, 0.5)";
        this.fillstyle[this.codes['spawn']] = "rgba(100, 100, 255, 0.5)";
        this.fillstyle[this.codes['solid'] | this.codes['spawn']] = "rgba(0, 0, 150, 0.5)";
    }

    load(name, onload) {
        getInfo('levels/' + name, function(data) {
            Object.assign(this, data);
            var creatures = this.creatures;
            this.creatures = new CreatureSet();
            for(var i=0; i<creatures.length; i++) {
                this.creatures.push(new Creature(creatures[i]));
            }
            if(onload) onload();
        }.bind(this));
    }
    save(name) {
        var a = document.createElement('a');
        a.download = name + '.json';
        a.href = "data:text/json;base64," + btoa(JSON.stringify(this, function(key, value) {
            if(key === 'sprite') return undefined;
            return value;
        }));
        a.click();
    }


    addWall(x0, y0, x1, y1) {
        if(x0 == x1 && y0 == y1) {
            return;
        }
        if(x0 > x1) {
            var temp = x0;
            x0 = x1;
            x1 = temp;
            temp = y0;
            y0 = y1;
            y1 = temp;
        }
        this.walls.push({
            x0 : x0,
            x1 : x1,
            y0 : y0,
            y1 : y1,
        })
    }

    removeWalls(x0, y0, x1, y1) {
        if(x0 == x1 && y0 == y1) {
            return;
        }
        if(x0 > x1) {
            var temp = x0;
            x0 = x1;
            x1 = temp;
        }
        if(y0 > y1) {
            var temp = y0;
            y0 = y1;
            y1 = temp;
        }
        for(var i=0; i<this.walls.length; i++) {
            var wall = this.walls[i];
            if(wall.x0 >= x0 && wall.x0 <= x1 && wall.y0 >= y0 && wall.y0 <= y1) {
                this.walls.splice(i--, 1);
                continue;
            }
            if(wall.x1 >= x0 && wall.x1 <= x1 && wall.y1 >= y0 && wall.y1 <= y1) {
                this.walls.splice(i--, 1);
                continue;
            }
            var sides = [{x:x0, y:y0}, {x:x0, y:y1}, {x:x1, y:y1}, {x:x1, y:y0}];
            for(var j in sides) {
                var l = {x0:sides[j].x, y0:sides[j].y};
                l.x1 = sides[(j+1)%4].x;
                l.y1 = sides[(j+1)%4].y;
                if(intersects(l, wall)) {
                    this.walls.splice(i--, 1);
                    break;
                }
            }
        }
    }

    addTerrain(name, x0, y0, x1, y1) {
        if(x0 == x1 && y0 == y1) {
            return;
        }
        if(x0 > x1) {
            var temp = x0;
            x0 = x1;
            x1 = temp;
        }
        if(y0 > y1) {
            var temp = y0;
            y0 = y1;
            y1 = temp;
        }
        for(var i=x0; i<x1; i++) {
            for(var j=y0; j<y1; j++) {
                this.squares[i + j * level.W] |= this.codes[name];
            }
        }
    }

    removeTerrain(name, x0, y0, x1, y1) {
        if(x0 == x1 && y0 == y1) {
            return;
        }
        if(x0 > x1) {
            var temp = x0;
            x0 = x1;
            x1 = temp;
        }
        if(y0 > y1) {
            var temp = y0;
            y0 = y1;
            y1 = temp;
        }
        for(var i=Math.ceil(x0); i<=x1-1; i++) {
            for(var j=Math.ceil(y0); j<=y1-1; j++) {
                this.squares[i + j * level.W] &= ~this.codes[name];
            }
        }
    }
    
    setDimentions(W, H) {
        var squares = [];
        squares.length = H * W;
        for(var i=0; i<W && i<this.W; i++) {
            for(var j=0; j<H && i<this.H; j++) {
                squares[i + j * W] = this.squares[i + j * this.W];
            }
        }
        this.squares = squares;
        for(var i=0; i<this.walls.length; i++) {
            if(this.walls[i].x1 > W + 1 || this.walls[i].y1 > H + 1) {
                this.walls.splice(i--, 1);
            }
        }
        this.W = W;
        this.H = H;
    }
}

export var level = new Level(30, 30);