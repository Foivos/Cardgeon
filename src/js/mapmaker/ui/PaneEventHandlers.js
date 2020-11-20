export function toggle(e) {
    var selected = document.getElementsByClassName('paneButtonSelected')[0];
    if(!selected) {
        e.target.classList.add('paneButtonSelected');
    }
    else if(selected === e.target) {
        e.target.classList.remove('paneButtonSelected');
    }
    else {
        e.target.classList.add('paneButtonSelected');
        selected.classList.remove('paneButtonSelected');
    }
}
