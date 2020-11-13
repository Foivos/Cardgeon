
export function getTime() {
    return (new Date()).getTime();
}

export function getInfo(name, execute) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            if(execute) execute(data);
        }
    };
    xhttp.open('GET', 'res/' + name + '.json', true);
    xhttp.send();
}


export function getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}


export function asArray(a, n = 1) {
    if(n <= 1) {
        if(a === null || typeof a === 'undefined') return [];
        return Array.isArray(a) ? a : [a];
    }
    if(!Array.isArray(a)) {
        return [asArray(a, n-1)];
    }
    var r = [];
    for(var i=0; i<a.length; i++) {
        r.push(asArray(a[i], n-1));
    }
    return r;
}; 