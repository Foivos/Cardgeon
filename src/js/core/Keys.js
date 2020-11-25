
class Keys {
    constructor() {
        this.commands = {
            up : 'up',
            down : 'down',
            left : 'left',
            right : 'right',
            shift : 'shift',
        };
        this.keybinds = {
            KeyW : this.commands.up,
            KeyS : this.commands.down,
            KeyA : this.commands.left,
            KeyD : this.commands.right,
            ShiftLeft : this.commands.shift,
            ShiftRight : this.commands.shift,
        };
        document.addEventListener('keydown', this.keydown.bind(this));
        document.addEventListener('keyup', this.keyup.bind(this));
        this.pressed = {};
    }
    /**
     * Handles the keydown event.
     * @param {Event} e 
     */
    keydown(e) {
        if (!e) e = window.event;
        if(this.keybinds[e.code]) {
            this.pressed[this.keybinds[e.code]] = true;
        }
    
    }
    /**
     * Handles the keyup event.
     * @param {Event} e 
     */
    keyup(e) {
        if (!e) e = window.event;
        if(this.keybinds[e.code]) {
            this.pressed[this.keybinds[e.code]] = null;
        }
    }
}

export var keys = new Keys();