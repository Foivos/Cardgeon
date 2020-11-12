import { selectorMaps } from './Selectors.js';
import { resultMaps } from './Results.js'
import { asArray } from '../core/Utils.js';

class Resolver {
    constructor() {
        this.init();
    }

    init(results, whenDone) {
        this.results = asArray(results);
        this.selected = [];
        this.selectors = [];
        this.selectorIDs = {};
        this.whenDone = whenDone;
        this.vars = [[]];
        this.i = 0;
        this.j = 0;
    }

    resolve() {
        this.j = 0;
        var result = this.results[this.i];
        var map = resultMaps[result.result];
        this.applyDynamicFunction(map.result, result, map.vars);
        this.i++;
        if(this.i < this.results.length) {
            this.nextResult();
        }
        else {
            this.whenDone();
        }
    }

    proccess(results, whenDone) {
        this.init(results, whenDone);
        this.nextResult();
    }

    nextResult() {
        this.vars = asArray(resultMaps[this.results[this.i].result].vars);
        var result = this.results[this.i];
        for(var i=0; i<this.vars.length; i++) {
            var value = asArray(result[this.vars[i]]);
            for(var j=0; j<value.length; j++) {
                if(value[j].selector) {
                    this.addSelectorsRecursive(value[j]);
                }
            }
        }
        this.j = 0;
        this.nextSelector();
    }

    addSelectorsRecursive(selector) {
        var vars = asArray(selectorMaps[selector.selector].vars);
        for(var i=0; i<vars.length; i++) {
            var values = asArray(selector[vars[i]])
            for(var j=0; j<values.length; j++) {
                if(values[j].selector) {
                    this.addSelectorsRecursive(values[j]);
                }
            }
        }
        if(!selector.id) selector.id = '#' + this.i + ':' + this.selectors.length;
        this.selectors.push(selector);
    }

    nextSelector() {
        var selector = this.selectors[this.j];
        var map = selectorMaps[selector.selector];
        this.applyDynamicFunction(map.selector, selector, map.vars);
    }
    

    send(selected) {
        if(this.selectors[this.j].id) {
            this.selectorIDs[this.selectors[this.j].id] = selected; 
        }
        this.j++;
        if(this.j < this.selectors.length) {
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
        keys = asArray(keys);
        var r = [];
        for(var i=0; i<keys.length; i++) {
            var value = data[keys[i]];
            if(value.id) {
                value = this.selectorIDs[value.id];
            } else if(Array.isArray(value)) {
                for(var j=0; j<value.length; j++) {
                    if(value[j].id) {
                        value[j] = this.selectorIDs[value[j].id]
                    }
                }
            }
            r.push(value);
        }
        f(...args, ...r);
    }
}

export var resolver = new Resolver();