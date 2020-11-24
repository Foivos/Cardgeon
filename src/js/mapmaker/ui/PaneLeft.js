import { getInfo } from '../../core/Utils.js';
import { Creature } from '../../creatures/Creature.js';
import { grid } from './Grid.js';


class PaneLeft {
    constructor() {
        this.elem = document.createElement('div');
        this.elem.className = 'paneLeft';
        
        this.H = document.body.clientHeight;
        this.W = Math.floor(document.body.clientWidth / 7.7);
        
        this.h0 = this.W + 40;

        

        var creature = document.createElement('div');
        creature.className = 'creatureDiv';
        creature.classList.add('selectedCreatureDiv');
        creature.id = 'creatureDiv1'
        this.populateCreature(creature, 1);
        this.elem.appendChild(creature);


        creature = document.createElement('div');
        creature.className = 'creatureDiv';
        creature.id = 'creatureDiv2'
        this.populateCreature(creature, 2);
        this.elem.appendChild(creature);


        getInfo('enemies/list', this.init.bind(this));

        
        document.body.appendChild(this.elem);
    }

    populateCreature(creatureSelector, n) {
        creatureSelector.onclick = function(e) {
            var selected = document.getElementsByClassName('selectedCreatureDiv')[0];
            selected.classList.remove('selectedCreatureDiv');
            var elem = document.getElementById('creatureDiv' + n);
            elem.classList.add('selectedCreatureDiv');
        }.bind(n);
        var load = document.createElement('button');
        load.className = 'dropbtn';
        load.id = 'paneLeftLoad' + n;
        load.textContent = 'Load';
        var div = document.createElement('div');
        div.className = 'dropdown-content';
        div.id = 'paneLeftList' + n;
        creatureSelector.appendChild(load);
        creatureSelector.appendChild(div);

        var image = document.createElement('img');
        image.className = 'paneImage';
        image.classList.add('toHide');
        image.id = 'creatureImage' + n;
        creatureSelector.appendChild(image);

        var save = document.createElement('button');
        save.className = 'paneLeftButton';
        save.classList.add('toHide');
        save.id = 'paneLeftSave' + n;
        save.textContent = 'Save';
        creatureSelector.appendChild(save);
        save.onclick = this.saveCreature;

        var name = document.createElement('div');
        var text = document.createElement('a');
        text.textContent = "Name:";
        text.className = 'paneLeftLabel';
        var box = document.createElement('input');
        
        box.className = 'paneLeftBox';
        box.id = 'creatureName' + n;
        name.appendChild(text);
        name.appendChild(box);
        creatureSelector.appendChild(name);

        text = document.createElement('a');
        text.textContent = "Stats:";
        text.className = 'paneLeftLabel';
        text.classList.add('toHide');
        creatureSelector.appendChild(text);

        var stats = document.createElement('div');
        stats.classList.add('toHide');
        stats.id = 'paneLeftStats' + n;
        creatureSelector.appendChild(stats);
        var button = document.createElement('button');
        button.className = 'paneLeftAddLine';
        button.classList.add('toHide');
        button.id = 'paneLeftAddStat' + n;
        button.textContent = '+';
        button.onclick = e => this.addStatLine();
        creatureSelector.appendChild(button);

        text = document.createElement('a');
        text.textContent = "Moves:";
        text.className = 'paneLeftLabel';
        text.classList.add('toHide');
        creatureSelector.appendChild(text);

        var moves = document.createElement('div');
        moves.classList.add('toHide');
        moves.id = 'paneLeftMoves' + n;
        creatureSelector.appendChild(moves);
        button = document.createElement('button');
        button.className = 'paneLeftAddLine';
        button.classList.add('toHide');
        button.id = 'paneLeftAddMove' + n;
        button.textContent = '+';
        button.onclick = e => this.addMoveLine();
        creatureSelector.appendChild(button);
        
        name = document.createElement('div');
        name.classList.add('toHide');
        text = document.createElement('a');
        text.textContent = "Art:";
        text.className = 'paneLeftLabel';
        var box = document.createElement('input');
        
        box.className = 'paneLeftBox';
        box.id = 'creatureArt' + n;
        name.appendChild(text);
        name.appendChild(box);
        creatureSelector.appendChild(name);
        
        button = document.createElement('button');
        button.className = 'paneLeftButton';
        button.id = 'paneLeftAdd' + n;
        button.textContent = 'Add';
        button.onclick = this.addCreature.bind(this);
        creatureSelector.appendChild(button);
    }

    init(data) {
        this.availableEnemies = data;
        
        var divs = document.getElementsByClassName('dropdown-content');
        for(var divi=0; divi<divs.length; divi++) {
            var div = divs[divi];
            var n = div.id[div.id.length-1];
            for(var i=0; i<data.length; i++) {
                var a = document.createElement('a');
                a.textContent = data[i].name;
                a.onclick = function(e) {
                    getInfo('enemies/' + this, paneLeft.load.bind(paneLeft));
                }.bind(data[i].id);
                div.appendChild(a);
            }
            var load = document.getElementById('paneLeftLoad' + n);
            load.onclick = function(e) {
                var elem = document.getElementById('paneLeftList' + this);
                elem.classList.toggle('show');
            }.bind(n)
        }        

        window.addEventListener('click', function(event) {
            if (!event.target.matches('.dropbtn')) {
                var dropdowns = document.getElementsByClassName("dropdown-content");
                var i;
                for (i = 0; i < dropdowns.length; i++) {
                    var openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('show')) {
                        openDropdown.classList.remove('show');
                    }
                }
            }
        }, false);
    }

    resize() {
        this.H = document.body.clientHeight;
        this.W = Math.floor(document.body.clientWidth / 7.7);

        var buttons = this.elem.getElementsByClassName('paneButton');
        for(var i=0; i<buttons.length; i++) {
            buttons[i].style.width = this.W-20;
            buttons[i].style.top = this.W + 50 * i + 40;
        }

    }

    load(data) {
        var selected = document.getElementsByClassName('selectedCreatureDiv')[0];
        var n = selected.id[selected.id.length-1];
        var name = document.getElementById('creatureName' + n);
        name.value = data.name;
        var stats = document.getElementById('paneLeftStats' + n);
        while(stats.children.length>0) {
            stats.children[0].remove();
        }
        var moves = document.getElementById('paneLeftMoves' + n);
        while(moves.children.length>0) {
            moves.children[0].remove();
        }
        for(var stat in data.stats) {
            this.addStatLine(stat, data.stats[stat]);
        }
        for(var move in data.moves) {
            this.addMoveLine(move, data.moves[move]);
        }
        var art = document.getElementById('creatureArt' + n);
        art.value = data.art;
        var image = document.getElementById('creatureImage' + n);
        image.src = 'res/' + art.value + '.png';
    }
    
    addStatLine(stat, n) {
        var div = document.createElement('div');
        var box = document.createElement('input');
        box.className = 'statName';
        if(stat || stat === 0) box.value = stat;
        div.appendChild(box);
        box = document.createElement('input');
        box.className = 'statValue';
        if(n || n === 0) box.value = n;
        div.appendChild(box);
        box = document.createElement('button');
        box.className = 'removeStat';
        box.textContent = '-';
        box.onclick = function(e) {
            var div = e.target.parentElement;
            div.remove();
        }
        div.appendChild(box);

        var selected = document.getElementsByClassName('selectedCreatureDiv')[0];
        var n = selected.id[selected.id.length-1];
        var stats = document.getElementById('paneLeftStats' + n);
        stats.appendChild(div);
    }

    addMoveLine(name, move) {
        var div = document.createElement('div');
        var box = document.createElement('input');
        box.className = 'moveName';
        if(name || name === 0) box.value = name;
        div.appendChild(box);
        box = document.createElement('button');
        box.className = 'removeMove';
        box.textContent = '-';
        box.onclick = function(e) {
            var div = e.target.parentElement;
            div.remove();
        }
        div.appendChild(box);
        box = document.createElement('input');
        box.className = 'moveValue';
        if(move || move === 0) box.value = move;
        div.appendChild(box);
        

        var selected = document.getElementsByClassName('selectedCreatureDiv')[0];
        var n = selected.id[selected.id.length-1];
        var moves = document.getElementById('paneLeftMoves' + n);
        moves.appendChild(div);
    }

    getCreature(e) {
        var selected = e.target;
        var n = selected.id[selected.id.length-1];
        var creature = {}
        creature.art = document.getElementById('creatureArt' + n).value;
        creature.name = document.getElementById('creatureName' + n).value;
        var stats = document.getElementById('paneLeftStats' + n);
        creature.stats = {};
        for(var i=0; i<stats.children.length; i++) {
            var name = stats.children[i].getElementsByClassName('statName')[0].value;
            var value = stats.children[i].getElementsByClassName('statValue')[0].value;
            creature.stats[name] = value;
        }
        creature.moves = {};
        var moves = document.getElementById('paneLeftMoves' + n);
        for(var i=0; i<moves.children.length; i++) {
            var name = moves.children[i].getElementsByClassName('moveName')[0].value;
            var value = moves.children[i].getElementsByClassName('moveValue')[0].value;
            creature.moves[name] = value;
        }
        return creature;
    }

    addCreature(e) {
        var creature = this.getCreature(e);
        grid.selectedCreature = null;
        grid.placingCreature = new Creature(creature);
    }

    saveCreature(e) {
        var creature = this.getCreature(e);
        var a = document.createElement('a');
        a.download = creature.name.toLowerCase().replace(' ', '_') + '.json';
        a.href = "data:text/json;base64," + btoa(JSON.stringify(creature));
        a.click();
    }
};



export var paneLeft = new PaneLeft();