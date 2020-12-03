

class ThreatMap extends Array{
    constructor() {
        super();
    }
    init(enemy) {
        this.enemy = enemy;
        this.length = level.W * level.H;
        
    }
}