class StaticImage {
    constructor(src, container, next, delay) {
        this.src = src;
        this.container = container;
        this.next = next;
        if (delay === undefined) {
            this.delay = 0;
        } else {
            this.delay = delay;
        }
    }

    show(ready) {
        var i = document.createElement('img');
        var c = this.container;
        i.src = this.src;
        c.appendChild(i);
        ready();
        var endCb = _ => this.next.show(function () {
            i.classList.add('fadeout');
            i.addEventListener("animationend", _ => c.removeChild(i));
        });
        if (this.delay) {
            var cb = _ => window.setTimeout(endCb, this.delay);
        } else {
            var cb = endCb;
        }
        window.addEventListener("keypress", cb, {once: true});
    }
}

class Video {
    constructor(src, container, next, loop, fade) {
        this.src = src;
        this.container = container;
        this.next = next;
        if (loop === undefined) {
            this.loop = false;
        } else {
            this.loop = loop;
        }
        if (fade === undefined) {
            this.fade = true;
        } else {
            this.fade = fade;
        }
    }

    show(ready) {
        var v = document.createElement('video');
        var c = this.container;
        v.src = this.src;
        v.autoplay = true;
        v.loop = this.loop;
        v.width = 1920;
        v.height = 1080;
        v.classList.add('fadein');
        v.addEventListener("animationend", _ => v.classList.remove('fadein'), {once: true});
        c.appendChild(v);
        ready();
        var fade = this.fade;
        var cb = _ => this.next.show(function () {
            v.removeEventListener("ended", cb, {once: true});
            window.removeEventListener("keypress", cb);
            if (fade) {
                v.classList.add('fadeout');
                v.addEventListener("animationend", _ => c.removeChild(v));
            } else {
                c.removeChild(v);
            }
        });
        v.addEventListener("ended", cb, {once: true});
        window.addEventListener("keypress", cb, {once: true});
    }
}

class SvgAnim {
    constructor(src, container, next) {
        this.src = src;
        this.container = container;
        this.next = next;
    }

    show(ready) {
        var i = document.createElement('object');
        var c = this.container;
        i.data = this.src;
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
    var mexico = new Video('NewMexico.mp4', content, finalLogo);
    var preMexLogo = new StaticImage('forayslogo.svg', backdrop, mexico);
    // P&P
    var coil = new StaticImage('Coil/AnimAtomThingy.svg', content, preMexLogo);
    var preCoilLogo = new StaticImage('epcover.png', backdrop, coil);
    var clarity = new SvgAnim('Clarity/HillsAnim.svg', content, preCoilLogo);
    var preClarity = new StaticImage('blackout.svg', backdrop, clarity);
    var answer = new Video('Answer.ogg', content, preClarity);
    var preAnswer = new StaticImage('epcover.png', backdrop, answer, 2466);
    var churn = new Video('Churn.mp4', content, preAnswer);
    var preChurn = new StaticImage('forayslogo.svg', backdrop, churn);
    // Burn
    // Olive
    // NWO
    var evDaydream = new SvgAnim('EV/DDRTickerAnim.svg', backdrop, preChurn);
    var preEv = new Video('EV/rainscenes.ogg', content, evDaydream, true, false);
    preEv.show(noop);
}

document.onload = wholeSet;
