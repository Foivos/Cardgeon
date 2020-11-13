import { renderer } from '../core/Renderer.js';
import { getInfo, getLines } from '../core/Utils.js';
import { resolver } from '../effects/Resolver.js';
import { turn } from '../turn/Turn.js';
import { hand } from './Hand.js';



export class Card {
    static W=300;
    static H=450;
    static scaleB=1;
    static scaleS=0.75;
    static nextId = 0;
    constructor(name) {
        this.id = Card.nextId++;

        this.elem = document.createElement("canvas");
        this.elem.style.position = 'absolute';
        this.elem.id = 'card' + this.id;
        this.elem.width = Card.W;
        this.elem.height = Card.H;
        this.setPos({x:0, y:document.body.clientHeight, deg:0, scale:0});
        this.target = {};
        this.speed = 0;
        
        this.back = document.createElement("img");
        this.back.style.position = 'absolute';
        this.back.id = 'cardback' + this.id;
        this.back.style.display = 'none';
        this.back.src = 'res/cardback.png';

        document.body.appendChild(this.elem);
        
        document.body.appendChild(this.back);
        getInfo('cards/' + name, this.init.bind(this));
    }

    init(data) {
        this.results = data.results;
        var frame = new Image();
        frame.onload = function(){
            var ctx = this.elem.getContext('2d');
            ctx.drawImage(frame, 0, 0);
            ctx.font = '32px monospace';
            ctx.fillText(data.name, 52, 37);
            ctx.font = '50px monospace';
            ctx.fillText(data.actions, 12, 41);
            ctx.font = '20px monospace';
            var lines = getLines(ctx, data.text, 262);
            for(var i=0; i<lines.length; i++) {
                ctx.fillText(lines[i], 20, 270+20*i, 262);
            }
            var art = new Image();
            art.onload = function(){
                ctx.drawImage(art, 16, 50);
            }.bind(this);
            art.src = 'res/art/' + data.art + '.png';
        }.bind(this);
        frame.src = 'res/frame.png';
    }


    /**
     * 
     * @param {object} pos 
     */
    setPos(pos) {
        this.setScale(pos.scale);
        this.setX(pos.x);
        this.setY(pos.y);
        this.setDeg(pos.deg);
        this.setTurnover(pos.turnover);    
    }
    
    moveTo(pos, speed=10, onArrive = null) {
        this.onArrive = onArrive;
        this.target = pos;
        this.speed = speed;
        renderer.movingCards[this.id] = this;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }
    getDeg() {
        return this.deg;
    }
    getScale() {
        return this.scale;
    }
    getTurnover() {
        return this.turnover;
    }

    getPos() {
        return {
            x : this.getX(),
            y : this.getY(),
            deg : this.getDeg(),
            scale : this.getScale(),
            turnover : this.getTurnover(),
        }
    }

    setX(x) {
        this.x = x;
        this.elem.style.left = x-Card.W*this.getScale()/2  + 'px'
    }

    setY(y) {
        this.y = y;
        this.elem.style.top = y-Card.H*this.getScale()/2 + 'px'
    }

    setDeg(deg) {
        this.deg = deg;
        this.setTransform();
    }

    setScale(scale) {
        if(!scale && scale !== 0) {
            console.trace();
        }
        this.scale = scale;
        this.elem.style.width = Card.W*scale;
    }

    setTurnover(turnover) {
        if(!turnover) turnover = 0;
        if(turnover > 1 && this.turnover <= 1) {
            var temp = this.elem;
            this.elem = this.back;
            this.back = temp;
            this.elem.style.display = 'block';
            this.back.style.display = 'none';
            this.setPos(this.getPos());
        }
        else if(turnover <= 1 && this.turnover > 1) {
            var temp = this.elem;
            this.elem = this.back;
            this.back = temp;
            this.elem.style.display = 'block';
            this.back.style.display = 'none';
            this.setPos(this.getPos());
        }
        this.turnover = turnover;
        this.setTransform();
    }

    setTransform() {
        var plus = (1 + Math.cos(this.turnover * Math.PI / 2)) / 2;
        var minus = (-1 + Math.cos(this.turnover * Math.PI / 2)) / 2;
        var cos = Math.cos(this.deg / 180 * Math.PI);
        var sin = Math.sin(this.deg / 180 * Math.PI);
        var a = plus * cos - minus * sin;
        var b = plus * sin + minus * cos;
        var c = minus * cos - plus * sin;
        var d = minus * sin + plus * cos;
        var s = 'matrix(' + a + ', ' + b + ', ' + c + ', ' + d + ', 0, 0)';
        this.elem.style.transform = s;
    }

    advanceMove() {
        var dx = this.target.x - this.x;
        var dy = this.target.y - this.y;
        var dDeg = this.target.deg - this.deg;
        var dScale = this.target.scale - this.scale;
        var dTurnover = this.target.turnover - this.turnover;
        if(dx===0 && dy===0) {
            this.setDeg(this.target.deg);
            this.setScale(this.target.scale);
            this.setTurnover(this.target.turnover);
            delete renderer.movingCards[this.id];
            if(this.onArrive) this.onArrive();
            this.onArrive = null;
            return;
        }
        var ratio = Math.sqrt( this.speed**2 / (dx**2 + dy**2) );
        if(ratio >= 1) {
            this.setPos(this.target);
            delete renderer.movingCards[this.id];
            if(this.onArrive) this.onArrive();
            this.onArrive = null;
        }
        else {
            this.displace(dx*ratio, dy*ratio, dDeg*ratio, dScale*ratio, dTurnover*ratio);
        }
    }

    displace (dx, dy, dDeg=0, dScale=0, dTurnover = 0) {
        this.setX(this.getX() + dx);
        this.setY(this.getY() + dy);
        this.setDeg(this.getDeg() + dDeg);
        this.setScale(this.getScale() + dScale)
        this.setTurnover(this.getTurnover() + dTurnover);
    }

    activate() {
        resolver.proccess(this.results, this.discard.bind(this));
    }

    hide() {
        this.elem.style.display = 'none';
        this.setPos({x:0, y:document.body.clientHeight, deg:0, scale:0});
        delete renderer.movingCards[this.id];
    }

    discard() {
        hand.remove(this);
        if(hand.moving === this) delete hand.moving;
        if(hand.hovered === this) delete hand.hovered;
        if(hand.selected === this) delete hand.selected;
        turn.hero.discardPile.push(this);
        var pos = {
            x : document.body.clientWidth - Card.H * Card.scaleB / 2 - Card.W * Card.scaleB,
            y : document.body.clientHeight - Card.W * Card.scaleB / 2 ,
            deg : 0,
            scale : Card.scaleB,
            turnover : 2,
        }
        var onArrive = function() {
            var pos = {
                x : document.body.clientWidth + Card.H * Card.scaleB / 2 - Card.W * Card.scaleB,
                y : document.body.clientHeight - Card.W * Card.scaleB / 2 ,
                deg : 0,
                scale : Card.scaleB,
                turnover : 2,
            }
            this.moveTo(pos, 25);
        }
        this.elem.style.zIndex = 0;
        this.moveTo(pos, 30, onArrive);
    }

    static setScales() {
        var w = document.body.clientWidth;
        this.scaleB = w/this.W/7.7;
        this.scaleS = this.scaleB*0.7;
    }

    setHighlight(h) {
        if(h) {

        }
        else {

        }
    }
};

Card.setScales();