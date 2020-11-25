import { level } from '../../map/Level.js';
import { toggle } from './PaneEventHandlers.js'

class PaneRight {
    constructor() {
        this.elem = document.createElement('div');
        this.elem.className = 'paneRight';
        
        var text = document.createElement('a');
        text.textContent = 'W:';
        text.className = 'paneDimension';
        this.elem.appendChild(text);

        var input = document.createElement('input');
        input.className = 'paneDimensionInput';
        input.id = "gridWidth";
        this.elem.appendChild(input);

        
        this.makeButton('set', function() {
            var W = parseInt(document.getElementById('gridWidth').value, 10);
            if(!W) return;
            level.setDimentions(W, level.H);
        });

        var text = document.createElement('a');
        text.textContent = 'H:';
        text.className = 'paneDimension';
        this.elem.appendChild(text);

        var input = document.createElement('input');
        input.className = 'paneDimensionInput';
        input.id = "gridHeight";
        this.elem.appendChild(input);
        this.makeButton('set', function() {
            var H = parseInt(document.getElementById('gridHeight').value, 10);
            if(!H) return;
            level.setDimentions(level.W, H);
        });

        this.makeButton('wall', toggle);

        var load = document.createElement('button');
        load.className = 'dropbtn';
        load.classList.add('paneRightButton');
        load.id = 'paneRightTerrain';
        load.textContent = 'solid';
        var div = document.createElement('div');
        div.className = 'dropdown-content-right';
        div.id = 'paneRightList';

        for(var code in level.codes) {
            if(code === 'empty' || code === 'clear') continue;
            var a = document.createElement('a');
            a.textContent = code;
            a.onclick = function(e) {
                var load = document.getElementById('paneRightTerrain');
                load.textContent = e.target.textContent;
                load.classList.add('paneButtonSelected');
            }
            div.appendChild(a);
        }
        load.onclick = function(e) {
            div.classList.toggle('show');
            toggle(e);
        }      

        this.elem.appendChild(load);
        this.elem.appendChild(div);

        window.addEventListener('click', function(event) {
            if (!event.target.matches('.dropbtn')) {
                var dropdowns = document.getElementsByClassName("dropdown-content-right");
                var i;
                for (i = 0; i < dropdowns.length; i++) {
                    var openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('show')) {
                        openDropdown.classList.remove('show');
                    }
                }
            }
        }, false);

        var levelName = document.createElement('input');
        levelName.id = 'levelName';
        levelName.className = 'paneRightInput';
        this.elem.appendChild(levelName);
        this.makeButton('load', function() {
            var name = document.getElementById('levelName').value;
            if(name === '') name = 'level';
            level.load(name);
        });
        this.makeButton('save', function() {
            var name = document.getElementById('levelName').value;
            if(name === '') name = 'level';
            level.save(name);
        });
        document.body.appendChild(this.elem);
    }
    resize() {
        this.H = document.body.clientHeight;
        this.W = Math.floor(document.body.clientWidth / 7.7);
    }
    makeButton(name, onclick) {
        var button = document.createElement('button');
        button.className = 'paneRightButton'
        button.id = 'paneButton:' + name;
        button.onclick = onclick;
        button.textContent = name;
        this.elem.appendChild(button);
    }
};

export var paneRight = new PaneRight();