
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

export function matrixInvert(M){
    // I use Guassian Elimination to calculate the inverse:
    // (1) 'augment' the matrix (left) by the identity (on the right)
    // (2) Turn the matrix on the left into the identity by elemetry row ops
    // (3) The matrix on the right is the inverse (was the identity matrix)
    // There are 3 elemtary row ops: (I combine b and c in my code)
    // (a) Swap 2 rows
    // (b) Multiply a row by a scalar
    // (c) Add 2 rows
    
    //if the matrix isn't square: exit (error)
    if(M.length !== M[0].length){return;}
    
    //create the identity matrix (I), and a copy (C) of the original
    var i=0, ii=0, j=0, N=M.length, e=0, t=0;
    var I = [], C = [];
    for(i=0; i<N; i++){
        // Create the row
        I.push([]);
        C.push([]);
        for(j=0; j<N; j++){
            //if we're on the diagonal, put a 1 (for identity)
            I[i][j] = i === j ? 1 : 0;
            
            // Also, make the copy of the original
            C[i][j] = M[i][j];
        }
    }
    
    // Perform elementary row operations
    for(i=0; i<N; i++){
        // get the element e on the diagonal
        e = C[i][i];
        
        // if we have a 0 on the diagonal (we'll need to swap with a lower row)
        if(e === 0){
            //look through every row below the i'th row
            for(ii=i+1; ii<N; ii++){
                //if the ii'th row has a non-0 in the i'th col
                if(C[ii][i] !== 0){
                    //it would make the diagonal have a non-0 so swap it
                    for(j=0; j<N; j++){
                        e = C[i][j];       //temp store i'th row
                        C[i][j] = C[ii][j];//replace i'th row by ii'th
                        C[ii][j] = e;      //repace ii'th by temp
                        e = I[i][j];       //temp store i'th row
                        I[i][j] = I[ii][j];//replace i'th row by ii'th
                        I[ii][j] = e;      //repace ii'th by temp
                    }
                    //don't bother checking other rows since we've swapped
                    break;
                }
            }
            //get the new diagonal
            e = C[i][i];
            //if it's still 0, not invertable (error)
            if(e === 0){return}
        }
        
        // Scale this row down by e (so we have a 1 on the diagonal)
        for(j=0; j<N; j++){
            C[i][j] = C[i][j]/e; //apply to original matrix
            I[i][j] = I[i][j]/e; //apply to identity
        }
        
        // Subtract this row (scaled appropriately for each row) from ALL of
        // the other rows so that there will be 0's in this column in the
        // rows above and below this one
        for(ii=0; ii<N; ii++){
            // Only apply to other rows (we want a 1 on the diagonal)
            if(ii==i){continue;}
            
            // We want to change this element to 0
            e = C[ii][i];
            
            // Subtract (the row above(or below) scaled by e) from (the
            // current row) but start at the i'th column and assume all the
            // stuff left of diagonal is 0 (which it should be if we made this
            // algorithm correctly)
            for(j=0; j<N; j++){
                C[ii][j] -= e*C[i][j]; //apply to original matrix
                I[ii][j] -= e*I[i][j]; //apply to identity
            }
        }
    }
    
    //we've done all operations, C should be the identity
    //matrix I should be the inverse:
    return I;
}

export function matrixMultiply(M1, M2) {
    
    if(M1[0].length !== M2.length){return;}

    var R = [];
    for(var i=0; i<M1.length; i++) {
        R.push([]);
        for(var j=0; j<M2[0].length; j++) {
            var s = 0;
            for(var k=0; k<M2.length; k++) {
                s += M1[i][k]*M2[k][j];
            }
            R[i].push(s)
        }
    }
    return R;
}

export function intersects(l1, l2) {
    if(Math.abs((l1.x1 - l1.x0) * (l2.y1 - l2.y0) - (l2.x1 - l2.x0) * (l1.y1 - l1.y0)) < 1e-12) {
        if(Math.abs((l1.x0 * l1.y1 - l1.x1 * l1.y0 - l2.x0 * l2.y1 + l2.x1 * l2.y0)) < 1e-12) {
            return true;
        }
        return false;
    }
    if((distance(l1, l2.x0, l2.y0) * distance(l1, l2.x1, l2.y1) < 0) && (distance(l2, l1.x0, l1.y0) * distance(l2, l1.x1, l1.y1) < 0)) return true;
    return false;
}

export function distance(l, x, y) {
    return ((l.y1 - l.y0) * x - (l.x1 - l.x0) * y + l.x1 * l.y0 - l.x0 * l.y1) / length(l);
}

export function length(l) {
    return Math.sqrt((l.x1 - l.x0) ** 2 + (l.y1 - l.y0) ** 2);
}
