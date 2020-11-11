import { availableMoves } from '../turn/AvailableMoves.js';
import { pane } from '../core/Pane.js';
import { creatureSet } from './CreatureSet.js';

class SelectedCreature {
    constructor() {
        this.creature = null;
        this.id = null;
    }

    set(creature , id) {
        this.creature = creature;
        this.id = creatureSet.find(elem => elem === creature);
        pane.setSelected(creature);
    }
}

export var selectedCreature = new SelectedCreature();