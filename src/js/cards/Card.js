import { renderer } from '../ui/Renderer.js';
import { getInfo, getLines } from '../core/Utils.js';
import { resolver } from '../effects/Resolver.js';
import { turn } from '../turn/Turn.js';
import { CardMovement } from './CardMovement.js';
import { hand } from './Hand.js';


/**
 * Implements each card. Keeps track of the assosiated element as well.
 */
export class Card {
    static W=300;
    static H=450;
    static scaleB=1;
    static scaleS=0.75;
    static nextId = 0;
    static default = {
        x : 0,
        y : 0,
        deg : 0,
        scale : 1,
        turnover : 0,
    }
    /**
     * Cards do not load synchronusly so avoid doing things with them immediatly after the constructor.
     * @param {string} name The name of the card to load from memory.
     */
    constructor(name) {
        this.id = Card.nextId++;

        this.elem = document.createElement("div");
        this.elem.className = 'cardDiv';
        document.body.appendChild(this.elem);

        this.canvas = document.createElement("canvas");
        this.canvas.id = 'card' + this.id;
        this.canvas.width = Card.W;
        this.canvas.height = Card.H;
        
        this.back = document.createElement("img");
        this.back.id = 'cardback' + this.id;
        this.back.src = 'res/cardback.png';
        this.movements = [];
        this.setPos({x:0, y:document.body.clientHeight, deg:0, scale:0});

        this.elem.appendChild(this.canvas);
        this.elem.appendChild(this.back);
        this.canvas.onload = getInfo('cards/' + name, this.init.bind(this));
    }
    /**
     * Draws the card and initializes the data.
     * @param {JSON} data {results : Object, actions : number, name : string, text : string, art : string}.
     * 
     */
    init(data) {
        this.results = data.results;
        this.actions = data.actions;
        var frame = new Image();
        frame.onload = function(){
            var ctx = this.canvas.getContext("2d");
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
     * Sets the position of the card immediatly.
     * @param {Object} pos {x : number, y : number, deg : number, scale : number, turnover : number}.
     */
    setPos(pos) {
        this.setScale(pos.scale);
        this.setX(pos.x);
        this.setY(pos.y);
        this.setDeg(pos.deg);
        this.setTurnover(pos.turnover);    
    }
    /**
     * Appends a new destination for the card.
     * @param {Object} pos {x : number, y : number, deg : number, scale : number, turnover : number}.
     * @param {number} speed In pixels per tick.
     * @param {function} onArrive What to do once there.
     */
    moveTo(pos, speed, onArrive = null) {
        var d2 = (this.x - pos.x) ** 2 + (this.y - pos.y) ** 2;
        if(d2 === 0) {
            if (onArrive) onArrive();
            return;
        };
        pos.t = Math.sqrt(d2) / speed;
        this.movements.push(new CardMovement(this, [pos], null, onArrive));
        renderer.movingCards[this.id] = this;
    }
    /**
     * Gets x.
     */
    getX() {
        return this.x;
    }
    /**
     * Gets y.
     */
    getY() {
        return this.y;
    }
    /**
     * Gets the angling of the card.
     */
    getDeg() {
        return this.deg;
    }
    /**
     * Gets the scaling of the card.
     */
    getScale() {
        return this.scale;
    }
    /**
     * Gets the turnover of the card. 0 is facing up, 2 is facing down.
     */
    getTurnover() {
        return this.turnover;
    }
    /**
     * Returns the position object of the card.
     */
    getPos() {
        return {
            x : this.getX(),
            y : this.getY(),
            deg : this.getDeg(),
            scale : this.getScale(),
            turnover : this.getTurnover(),
        }
    }
    /**
     * Set x.
     * @param {number} x 
     */
    setX(x) {
        this.x = x;
        this.elem.style.left = x-Card.W*this.getScale()/2  + 'px'
    }
    /**
     * Set y.
     * @param {number} y 
     */
    setY(y) {
        this.y = y;
        this.elem.style.top = y-Card.H*this.getScale()/2 + 'px'
    }
    /**
     * Set the angling of the card.
     * @param {number} deg 
     */
    setDeg(deg) {
        this.deg = deg;
        this.setTransform();
    }
    /**
     * Set the scaling of the card.
     * @param {number} scale 
     */
    setScale(scale) {
        if(!scale && scale !== 0) {
            console.trace();
        }
        this.scale = scale;
        this.canvas.style.width = Card.W*scale;
        this.back.style.width = Card.W*scale;
    }
    /**
     * Set the turnover of the card. 0 is facing up, 2 is facing down.
     * @param {number} turnover 
     */
    setTurnover(turnover) {
        if(!turnover) turnover = 0;
        if(turnover > 1) {
            this.canvas.style.display = 'none';
            this.back.style.display = 'block';
        }
        else {
            this.canvas.style.display = 'block';
            this.back.style.display = 'none';
        }
        this.turnover = turnover;
        this.setTransform();
    }
    /**
     * Calculates the transorm that of the card by combining the angling (deg) and the turnover of the card.
     */
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
        this.canvas.style.transform = s;
        this.back.style.transform = s;
    }
    /**
     * Trigger the card (as) if it is played.
     */
    activate() {
        if(turn.actions < this.actions) {
            hand.deselect();
            return;
        }
        resolver.proccess(this.results, this.actions, this.discard.bind(this));
    }
    /**
     * (Deprecated) Hide the card.
     */
    hide() {
        this.canvas.style.display = 'none';
        this.back.style.display = 'none';
        this.setPos({x:0, y:document.body.clientHeight, deg:0, scale:0});
        delete renderer.movingCards[this.id];
    }
    /**
     * Move the card to the discard pile.
     * @param {function} onDiscard What to do once the card is finished discarding.
     */
    discard(onDiscard) {
        hand.remove(this);
        if(hand.moving === this) delete hand.moving;
        if(hand.hovered === this) delete hand.hovered;
        if(hand.selected === this) delete hand.selected;
        this.movements = [];
        turn.hero.discardPile.push(this);
        
        var pos = {
            x : document.body.clientWidth - Card.H * Card.scaleB / 2 - Card.W * Card.scaleB,
            y : document.body.clientHeight - Card.W * Card.scaleB / 2 ,
            deg : 0,
            scale : Card.scaleB,
            turnover : 2,
        }
        
        var t = Math.sqrt((this.x - pos.x) ** 2 + (this.y - pos.y) ** 2) / 2;
        pos.t = t;
        var deriv = {
            x : 2,
            y : 0,
            turnover : 0,
            t : t,
        }
        this.movements.push(new CardMovement(this, [pos], [deriv]));

        pos = {
            x : document.body.clientWidth + Card.H * Card.scaleB / 2 - Card.W * Card.scaleB,
            y : document.body.clientHeight - Card.W * Card.scaleB / 2,
            deg : 0,
            scale : Card.scaleB,
            turnover : 2,
        }

        this.moveTo(pos, 2, onDiscard);
        this.elem.style.zIndex = 0;
        
        renderer.movingCards[this.id] = this;
    }
    /**
     * Move the card from the discard pile to the draw pile.
     * @param {function} onShuffle What to do once the card is shuffled back.
     */
    reshuffle(onShuffle) {
        var pos = {
            x : document.body.clientWidth - Card.H * Card.scaleB / 2 - Card.W * Card.scaleB,
            y : document.body.clientHeight - Card.W * Card.scaleB / 2 ,
            deg : 0,
            scale : Card.scaleB,
            turnover : 2,
        }
        this.moveTo(pos, 2);
        pos = {
            x : document.body.clientWidth/2,
            y : document.body.clientHeight/3*2,
            deg : 0,
            scale : Card.scaleB,
            turnover : 2,
        }
        var t = Math.sqrt((this.x - pos.x) ** 2 + (this.y - pos.y) ** 2) / 2;
        pos.t = t;
        var coords = [pos];
        var pos1 = {
            x : Card.H * Card.scaleB / 2 + Card.W * Card.scaleB,
            y : document.body.clientHeight - Card.W * Card.scaleB / 2 ,
            deg : 0,
            scale : Card.scaleB,
            turnover : 2,
        }
        t += Math.sqrt((pos1.x - pos.x) ** 2 + (pos1.y - pos.y) ** 2) / 2;
        pos1.t = t;
        coords.push(pos1);
        pos = {
            x : -2,
            y : 0,
            turnover : 0,
            t : t,
        }
        this.movements.push(new CardMovement(this, coords, [pos]));
        pos = {
            x : -Card.H * Card.scaleB / 2 + Card.W * Card.scaleB,
            y : document.body.clientHeight - Card.W * Card.scaleB / 2 ,
            deg : 0,
            scale : Card.scaleB,
            turnover : 2,
        }

        this.moveTo(pos, 2, onShuffle);
    }
    /**
     * Sets the card scales from the window size.
     */
    static setScales() {
        var w = document.body.clientWidth;
        this.scaleB = w/this.W/7.7;
        this.scaleS = this.scaleB*0.7;
    }
};

Card.setScales();