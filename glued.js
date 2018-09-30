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
    constructor(src, container, next, opts) {
        this.src = src;
        this.container = container;
        this.next = next;
        if (opts === undefined) {
            opts = {};
        }
        if (opts.loop === undefined) {
            this.loop = false;
        } else {
            this.loop = opts.loop;
        }
        if (opts.fadein === undefined) {
            this.fadein = true;
        } else {
            this.fadein = opts.fadein;
        }
        if (opts.fadeout === undefined) {
            this.fadeout = true;
        } else {
            this.fadeout = opts.fadeout;
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
        if (this.fadein) {
            v.classList.add('fadein');
            c.appendChild(v);
            v.addEventListener(
                "animationend",
                function () {
                    v.classList.remove('fadein');
                    ready();
                },
                {once: true});
        } else {
            c.appendChild(v);
            ready();
        }
        var fadeout = this.fadeout;
        var cb = _ => this.next.show(function () {
            v.removeEventListener("ended", cb, {once: true});
            window.removeEventListener("keypress", cb, {once: true});
            if (fadeout) {
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
    constructor(src, container, next, opts) {
        this.src = src;
        this.container = container;
        this.next = next;
        if (opts === undefined) {
            opts = {};
        }
        if (opts.fade === undefined) {
            this.fade = opts.fade;
        }
    }

    show(ready) {
        var i = document.createElement('object');
        var c = this.container;
        i.data = this.src;
        if (this.fade) {
            i.classList.add('fadein');
            c.appendChild(i);
            i.addEventListener("animationend", function() {
                i.classList.remove('fadein');
                ready();
                }, {once: true});
        } else {
            c.appendChild(i);
            ready();
        }
        var fadeout = this.fade;
        var cb = _ => this.next.show(function () {
            if (fadeout) {
                i.classList.add('fadeout');
                i.addEventListener("animationend", _ => c.removeChild(i));
            } else {
                c.removeChild(i);
            }
        });
        window.addEventListener("keypress", cb, {once: true});
    }
}

class EndStop {
    show(ready) {
    }
}

class Placeholder {
    constructor(src, container, next) {
        this.next = next;
    }

    show(ready) {
        ready();
        var cb = _ => this.next.show(function () {
        });
        window.addEventListener("keypress", cb, {once: true});
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
    var warning = new Video('Warning.ogg', content, preCoilLogo);
    var preWarning = new StaticImage('epcover.png', backdrop, warning);
    var clarity = new SvgAnim('Clarity/HillsAnim.svg', content, preWarning);
    var preClarity = new StaticImage('blackout.svg', backdrop, clarity);
    var answer = new Video('Answer.ogg', content, preClarity);
    var preAnswer = new StaticImage('epcover.png', backdrop, answer, 2466);
    var churn = new Video('Churn.mp4', content, preAnswer);
    var preChurn = new StaticImage('forayslogo.svg', backdrop, churn);
    // Burn
    // Olive
    // NWO
    var preNwo = new StaticImage('blackout.svg', backdrop, preChurn);

    var evOutro2 = new Video('EV/sundown_late.mp4', content, preNwo, {fadein: false, fadeout: false});
    var evOutro1 = new Video('EV/sundown_early.mp4', backdrop, evOutro2, {fadein: false, fadeout: false});
    var evChorus3 = new Video('EV/sunrise.ogg', content, evOutro1, {fadeout: false});
    var evDaydream = new SvgAnim('EV/DDRTickerAnim.svg', backdrop, evChorus3, {fade: false});
    var evChorus2 = new Video('EV/flickery_sundown.mp4', content, evDaydream);
    var evVerse2 = new Placeholder('Ivan futurescape', backdrop, evChorus2);
    var evChorus1 = new Video('EV/flickery_sundown.mp4', content, evVerse2);
    var evVerse1 = new Placeholder('Ivan logo', backdrop, evChorus1);
    var preEv = new Video('EV/rainscenes.ogg', content, evVerse1, {loop: true, fadeout: false});
    
    var cultRadio = new StaticImage('support/cultradio.jpg', backdrop, preEv);
    cultRadio.show(noop);
}

document.onload = wholeSet;
