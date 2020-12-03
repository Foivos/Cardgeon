import { turn } from '../turn/Turn.js';
import { turnOrder } from '../turn/TurnOrder.js';
import { hand } from '../cards/Hand.js';
import { movingCreatures } from '../creatures/MovingCreatures.js';



export function move() {
    if(turn.actions <= 0) return;
    hand.deselect();
    turn.actions--;
    turn.remainingMove += turn.hero.stats.get('speed');
    if(movingCreatures.length > 0) return;
    if(turn.remainingMove >= 1) turn.availableMoves.calculate(turn.hero.x, turn.hero.y, turn.remainingMove);
    if(hand.selected && hand.selected.range) turn.targeting.calculate(turn.hero.x, turn.hero.y, hand.selected.range);
}

export function end() {
    turnOrder.advance();
}