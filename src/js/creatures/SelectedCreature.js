import { level } from '../map/Level.js';
import { paneRight } from '../ui/PaneRight.js';

class SelectedCreature {
    constructor() {
        this.creature = null;
        this.id = null;
    }

    set(creature , id) {
        this.creature = creature;
        this.id = level.creatures.find(elem => elem === creature);
        paneRight.setSelected(creature);
    }
}

export var selectedCreature = new SelectedCreature();