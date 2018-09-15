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

class Video {
    constructor(src, container, next) {
        this.src = src;
        this.container = container;
        this.next = next;
    }

    show(ready) {
        var v = document.createElement('video');
        var c = this.container;
        v.src = this.src;
        v.autoplay = true;
        v.classList.add('fadein');
        v.addEventListener("animationend", _ => v.classList.remove('fadein'), {once: true});
        c.appendChild(v);
        ready();
        var cb = _ => this.next.show(function () {
            v.classList.add('fadeout');
            v.addEventListener("animationend", _ => c.removeChild(v));
        });
        v.addEventListener("ended", cb, {once: true});
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
    var mexico = new Video('NewMexico.mp4', content, finalLogo);
    var preMexLogo = new StaticImage('forayslogo.svg', backdrop, mexico);
    var coil = new StaticImage('Coil/AnimAtomThingy.svg', content, preMexLogo);
    coil.show(noop);
}

document.onload = wholeSet;
