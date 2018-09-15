class StaticImage {
    constructor(src, container, next) {
        this.src = src;
        this.container = container;
        this.next = next;
    }

    show(ready) {
        var i = document.createElement('img');
        var c = this.container;
        i.src = this.src;
        c.appendChild(i);
        ready();
        var cb = _ => this.next.show(function () {
            i.classList.add('fadeout');
            i.addEventListener("animationend", _ => c.removeChild(i));
        });
        window.addEventListener("keypress", cb, {once: true});
    }
}

class EndStop {
    show(ready) {
    }
}

function noop() {
}

function wholeSet() {
    var backdrop = document.getElementById('backdrop');
    var content = document.getElementById('content');
    var endstop = new EndStop();
    var finalLogo = new StaticImage('forayslogo.svg', backdrop, endstop);
    var coil = new StaticImage('Coil/AnimAtomThingy.svg', content, finalLogo);
    coil.show(noop);
}

document.onload = wholeSet;
