import { selectorMaps } from './Selectors.js';
import { evaluate } from './Evaluator.js';
import { turn } from '../turn/Turn.js';


class Resolver {
    constructor() {
    }

    init(results, actions, whenDone) {
        if(Array.isArray(results)) {
            results = results.join('\n');
        }
        this.results = results.split('$resolve()');
        this.selectors = [];
        this.cache = {};
        this.parsed = '';
        this.whenDone = whenDone;
        this.actions = actions;
        this.i = 0;
        this.j = 0;
    }

    

    proccess(results, actions, whenDone) {
        this.init(results, actions, whenDone);
        this.nextResult();
    }

    parseSelectors(s) {
        if(typeof s !== 'string') return s;
        for(var i=0; i<s.length; i++) {
            if(s[i] === '$') {
                var j = i + 1;
                while(s[j++] != '(') {}
                var d = 1;
                while(d > 0) {
                    if(s[j] === '(') d++;
                    if(s[j++] === ')') d--;
                }
                var selector = this.parseSelectors(s.substring(i+1,j));
                var id = this.getId(selector);
                if(id === null) {
                    id = '#' + this.i + ':' + this.selectors.length;
                    s = s.replace('$' + selector, id);
                    selector = selector.replace('(', id + '(');
                } 
                else {
                    s = s.replace('$' + selector, id);
                }
                this.selectors.push(selector);
            }
        }
        return s;
    }

    nextResult() {
        var result = this.results[this.i];
        this.parsed = this.parseSelectors(result);    
        this.j = 0;
        this.nextSelector();
    }

    nextSelector() {
        if(this.j >= this.selectors.length) {
            this.resolve();
            return;
        }
        var selector = this.selectors[this.j];
        var f = selectorMaps[this.getName(selector)].selector;

        var i = selector.indexOf('(');
        var fname = selector.substring(0,i).trim();
        selector = selector.replace(fname, 'this.f');
        evaluate.bind({s : selector, cache : this.cache, f : f})(turn.hero);
    }
    
    getName(selector) {
        var i = selector.indexOf('#');
        return selector.substring(0,i).trim();
    }


    send(selected) {
        var id = this.getId(this.selectors[this.j]);
        this.cache[id] = selected;
        this.j++;
        this.nextSelector();
    }

    resolve() {
        if(this.i === 0) turn.actions -= this.actions;
        for(var id in this.cache) { 
            this.parsed = this.parsed.replaceAll(id, 'this.cache["' + id + '"]');
        }
        evaluate.bind({s : this.parsed, cache : this.cache})(turn.hero);
        this.i++;
        if(this.i < this.results.length) {
            this.nextResult();
        }
        else {
            if(this.whenDone) this.whenDone();
        }
    }

    getId(selector) {
        var start = selector.indexOf('(');
        var hash = selector.indexOf('#');
        if(hash === -1 || hash > start) return null;
        return (selector.substring(selector.indexOf('#'), selector.indexOf('(')));
    }
}

export var resolver = new Resolver();
