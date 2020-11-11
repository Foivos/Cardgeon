import { renderer } from '../core/Renderer.js';
import { getInfo } from '../core/Utils.js';
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

        this.pos = {};
        this.setPos({x:0, y:document.body.clientHeight, deg:0, scale:0});
        this.target = {};
        this.speed = 0;
        
        
        document.body.appendChild(this.elem);
        getInfo('cards/' + name, this.init.bind(this));
    }

    init(data) {
        this.range = data.targets[0].range;
        var frame = new Image();
        frame.onload = function(){
            var ctx = this.elem.getContext('2d');
            ctx.drawImage(frame, 0, 0);
            ctx.font = '20px serif';
            ctx.fontFamily = '"Lucida Console", Courier, monospace';
            ctx.fillText(data.name, 40, 20);
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
        this.target = {};
    }
    
    moveTo(pos, speed=10) {
        if(pos.x===this.pos.x && pos.y===this.pos.y && pos.deg===this.pos.deg && pos.scale===this.pos.scale) {
            return;
        }
        this.target = pos;
        this.speed = speed;
        renderer.movingCards[this.id] = this;
    }

    getX() {
        return this.pos.x;
    }

    getY() {
        return this.pos.y;
    }
    getDeg() {
        return this.pos.deg;
    }
    getScale() {
        return this.pos.scale;
    }

    setX(x) {
        this.pos.x = x;
        this.elem.style.left = x-Card.W*this.getScale()/2  + 'px'
    }

    setY(y) {
        this.pos.y = y;
        this.elem.style.top = y-Card.H*this.getScale()/2 + 'px'
    }

    setDeg(deg) {
        this.pos.deg = deg;
        this.elem.style.transform = 'rotate(' + deg + 'deg)';
    }

    setScale(scale) {
        if(!scale && scale !== 0) {
            console.trace();
        }
        this.pos.scale = scale;
        this.elem.style.width = Card.W*scale;
    }

    advanceMove() {
        var dx = this.target.x - this.pos.x;
        var dy = this.target.y - this.pos.y;
        var dDeg = this.target.deg - this.pos.deg;
        var dScale = this.target.scale - this.pos.scale;
        if(dx===0 && dy===0) {
            this.setDeg(this.target.deg);
            this.setScale(this.target.scale);
            renderer.movingCards[this.id] = null;
            return;
        }
        var ratio = Math.sqrt( this.speed**2 / (dx**2 + dy**2) );
        if(ratio >= 1) {
            this.setPos(this.target);
            delete renderer.movingCards[this.id];
        }
        else {
            this.displace(dx*ratio, dy*ratio, dDeg*ratio, dScale*ratio);
        }
    }

    displace (dx, dy, dDeg=0, dScale=0) {
        this.setX(this.getX() + dx);
        this.setY(this.getY() + dy);
        this.setDeg(this.getDeg() + dDeg);
        this.setScale(this.getScale() + dScale)
    }

    activate(target) {
        target.hp -= 10;
    }

    hide() {
        this.elem.style.display = 'none';
        this.setPos({x:0, y:document.body.clientHeight, deg:0, scale:0});
        delete renderer.movingCards[this.id];
    }

    static setScales() {
        var w = document.body.clientWidth;
        this.scaleB = w/this.W/7.7;
        this.scaleS = this.scaleB*0.7;
    }
};

Card.setScales();