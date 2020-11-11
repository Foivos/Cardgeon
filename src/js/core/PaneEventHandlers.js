import { selectedCreature } from '../creatures/SelectedCreature.js'
import { turn } from '../turn/Turn.js';
import { turnOrder } from '../turn/TurnOrder.js';
import { availableMoves } from '../turn/AvailableMoves.js';
import { hand } from '../cards/Hand.js';
import { withinRange } from '../turn/WithinRange.js';
import { renderer } from './Renderer.js';
import { movingCreatures } from '../creatures/MovingCreatures.js';



export function move() {
    if(turn.actions <= 0) return;
    turn.actions--;
    turn.remainingMove += turn.hero.speed;
    if(movingCreatures.length > 0) return;
    if(turn.remainingMove >= 1) availableMoves.calculate();
    if(hand.selected && hand.selected.range) withinRange.calculate(hand.selected.range);
}

export function end() {
    turnOrder.advance();
}