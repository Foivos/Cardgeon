import { paneRight } from '../ui/PaneRight.js';
import { creatureSet } from './CreatureSet.js';

class SelectedCreature {
    constructor() {
        this.creature = null;
        this.id = null;
    }

    set(creature , id) {
        this.creature = creature;
        this.id = creatureSet.find(elem => elem === creature);
        paneRight.setSelected(creature);
    }
}

export var selectedCreature = new SelectedCreature();