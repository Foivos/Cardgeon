export class Tags extends Array {
    constructor() {
        super();
    }

    add(tags) {
        tags = asArray(tags);
        for(var i=0; i<tags.length; i++) {
            if(!super.includes(tags[i])) this.push(tag[i]);
        }
    }

    remove(tags) {
        tags = asArray(tags);
        for(var i=0; i<this.length; i++) {
            if(tags.includes(this[i])) {
                this.splice(i, 1);
                i--;
            }
        }
    }

    includes(tags) {
        tags = asArray(tags);
        for(var i=0; i<tags.length; i++) {
            if(!super.includes(tags[i])) return false;
        }
        return true;
    }

    excludes(tags) {
        tags = asArray(tags);
        for(var i=0; i<tags.length; i++) {
            if(super.includes(tags[i])) return false;
        }
        return true;
    }
}