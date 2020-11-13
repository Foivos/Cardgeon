
class CardMovement {
    constructor(from, to, ticks = 15, through=null, onArrive=null) {
        this.from = from;
        this.to = to;
        this.through = through;
        this.ticks = ticks;
        this.onArrive = onArrive;
    }

    getPos(tick) {
        var t = tick / this.ticks;
        var f;
        if(!this.through) {
            f = function(t, key) {
                return this.to[key] * t - this.from[key] * (1 - t);
            }
        }
        else {
            f = function(t, key) {
                var a = 4 * this.through[key] - 3 * this.from[key] - this.to[key];
                var b = 2 * this.to[key] + 2 * this.from[key] - 4 * this.through[key];
                return a * t ** 2 + b * t + this.from[key];
            }
        }
        var pos = {};
        for(var key in ['x', 'y', 'deg', 'scale', 'turnover']) {
            pos[key] = f(t, key);
        }
        return pos;
    }
}