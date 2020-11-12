import { selectorMaps } from './Selectors.js';
import { resultMaps } from './Results.js'
import { turn } from '../turn/Turn.js';

class Resolver {
    constructor() {
        this.init();
    }

    init(results) {
        this.results = Array.isArray(results) ? results : [results]
        this.selected = [];
        this.selectors = [];
        this.selectorIDs = {};
        this.i = 0;
    }

    resolve() {
        this.i=0;
        for(var i=0; i<this.results.length; i++) {
            var result = this.results[i];
            var map = resultMaps[result.result];
            if(!map.vars) {
                map.result();
                continue;
            }
            if(!Array.isArray(map.vars)) {
                if(result[map.vars].selector) {
                    map.result(this.selected[this.i++]);
                }
                else if(result[map.vars].id) {
                    map.result( this.selectorIDs[ result[map.vars].id ] );
                }
                else {
                    map.result[result[map.vars]];
                }
            }
            else {
                var vars = [];
                for(var j=0; j<map.vars.length; j++) {
                    if(result[map.vars[j]].selector) {
                        vars.push(this.selected[this.i++]);
                    }
                    else if(result[map.vars[j]].id) {
                        vars.push( this.selectorIDs[ result[map.vars[j]].id ] );
                    }
                    else {
                        vars.push(result[map.vars[j]]);
                    }
                }
                map.result(...vars);
            }
            
        }
        console.log(turn.hero.armour)
    }

    proccess(results) {
        this.init(results);
        for(var i=0; i<this.results.length; i++) {
            var result = this.results[i];
            var map = resultMaps[result.result];
            if(!map.vars) continue;
            if(!Array.isArray(map.vars)) {
                if(result[map.vars].selector) {
                    this.selectors.push(result[map.vars]);
                }
            }
            else {
                for(var j=0; j<map.vars.length; j++) {
                    if(result[map.vars[j]].selector) {
                        this.selectors.push(result[map.vars[j]]);
                    } 
                }
            }
        }
        if(this.selectors.length === 0) {
            this.resolve();
        }
        else {
            this.nextSelector();
        }
    }

    nextSelector() {
        var selector = this.selectors[this.i];
        var map = selectorMaps[selector.selector];
        this.applyDynamicFunction(map.selector, selector, map.vars);
    }
    

    send(selected) {
        this.selected.push(selected);
        if(this.selectors[this.i].id) {
            this.selectorIDs[this.selectors[this.i].id] = this.i; 
        }
        this.i++
        if(this.i < this.results.length) {
            this.nextSelector();
        }
        else {
            this.resolve();
        }
    }

    cancel() {

    }


    /**
     * Applys function f with arguments being the args followed by each value of data specified by keys.
     * @param {function} f The function to apply.
     * @param {Object} data An object that includes keys specified by vars. 
     * @param {* | Array} vars The keys of the data to pass to the functions.
     * @param  {...any} args Additional arguments.
     */
    applyDynamicFunction(f, data, keys, ...args) {
        if(!keys) {
            f(...args);
            return;
        }
        if(!Array.isArray(keys)) {
            f(...args, data[keys]);
        }
        else {
            var temp = [];
            for(var i=0; i<vars.length; i++) temp.push(data[keys[i]]);
            f(...args, ...vars);
        }

    }
}

export var resolver = new Resolver();