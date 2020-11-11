
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
