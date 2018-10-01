class Layer {
    constructor(container, next, opts) {
        this.container = container;
        this.next = next;
        if (opts === undefined) {
            this.opts = {};
        } else {
            this.opts = opts;
        }
    }

    getOpt(opt_name, fallback) {
        if (this.opts[opt_name] === undefined) {
            return fallback;
        } else {
            return this.opts[opt_name];
        }
    }

    show(ready) {
        var e = this.createNode();
        var c = this.container;
        if (this.getOpt('fadein', true)) {
            e.classList.add('fadein');
            c.appendChild(e);
            e.addEventListener(
                "animationend",
                function () {
                    e.classList.remove('fadein');
                    ready();
                },
                {once: true});
        } else {
            c.appendChild(e);
            ready();
        }
        var fadeout = this.getOpt('fadeout', true);
        var ret = this.removeEndTriggers;
        var endCb = _ => this.next.show(function () {
            ret(e, cb);
            if (fadeout) {
                e.classList.add('fadeout');
                e.addEventListener("animationend", _ => c.removeChild(e));
            } else {
                c.removeChild(e);
            }
        });
        var delay = this.getOpt('delay', 0);
        var cb = _ => window.setTimeout(endCb, delay);
        this.addEndTriggers(e, cb);
    }

    addEndTriggers(e, cb) {
        window.addEventListener('keypress', cb, {once: true});
    }

    removeEndTriggers(e, cb) {
        window.removeEventListener("keypress", cb, {once: true});
    }
}

class StaticImage extends Layer {
    constructor(src, container, next, opts) {
        super(container, next, opts);
        this.src = src;
    }

    createNode() {
        var i = document.createElement('img');
        i.src = this.src;
        return i;
    }
}

class Video extends Layer {
    constructor(src, container, next, opts) {
        super(container, next, opts)
        this.src = src;
    }

    createNode() {
        var v = document.createElement('video');
        v.src = this.src;
        v.autoplay = true;
        v.loop = super.getOpt('loop', false);
        v.width = 1920;
        v.height = 1080;
        return v;
    }

    addEndTriggers(v, cb) {
        super.addEndTriggers(v, cb);
        v.addEventListener("ended", cb, {once: true});
    }

    removeEndTriggers(v, cb) {
        super.removeEndTriggers(v, cb);
        v.removeEventListener("ended", cb, {once: true});
    }
}

class SvgAnim extends Layer {
    constructor(src, container, next, opts) {
        super(container, next, opts);
        this.src = src;
    }

    createNode() {
        var i = document.createElement('object');
        i.data = this.src;
        return i;
    }
}

class Olive extends Layer {
    createNode() {
        var i = document.createElement('img');
        var sources = [
            'Olive/00.jpg',
            'Olive/01.jpg'
        ];
        var counter = 0;
        var nextSource = function() {
            i.src = sources[counter++ % sources.length];
        }
        i.intervalTimer = window.setInterval(nextSource, 250);
        return i;
    }

    removeEndTriggers(i, cb) {
        super.removeEndTriggers(i, cb);
        clearInterval(i.intervalTimer);
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

    var pnp = new Video('PnP.mp4', content, preMexLogo, {fadein: false});
    var prePnp = new StaticImage('forayslogo.svg', backdrop, pnp, {delay: 3947, fadeout: false});

    var coil = new StaticImage('Coil/AnimAtomThingy.svg', content, prePnp);
    var preCoilLogo = new StaticImage('epcover.png', backdrop, coil);

    var warning = new Video('Warning.ogg', content, preCoilLogo);
    var preWarning = new StaticImage('epcover.png', backdrop, warning);

    // Vessels
    // Sonica
    // Instincts

    var clarity = new SvgAnim('Clarity/HillsAnim.svg', content, preWarning);
    var preClarity = new StaticImage('blackout.svg', backdrop, clarity);

    var answer = new Video('Answer.ogg', content, preClarity);
    var preAnswer = new StaticImage('epcover.png', backdrop, answer, {delay: 2466});

    var churn = new Video('Churn.mp4', content, preAnswer);
    var preChurn = new StaticImage('forayslogo.svg', backdrop, churn);

    var burn = new SvgAnim('Burn/OrbitAnim.svg', content, preChurn);
    var preBurn = new StaticImage('forayslogo.svg', backdrop, burn);

    var olive = new Olive(content, preBurn);

    var nwo = new Placeholder('NWO', content, olive);
    var preNwo = new StaticImage('blackout.svg', backdrop, olive, {fadein: false});

    var evOutro2 = new Video('EV/sundown_late.mp4', content, preNwo, {fadein: false, fadeout: false});
    var evOutro1 = new Video('EV/sundown_early.mp4', backdrop, evOutro2, {fadein: false, fadeout: false});
    var evChorus3 = new Video('EV/sunrise.ogg', content, evOutro1, {fadeout: false});
    var evDaydream = new SvgAnim('EV/DDRTickerAnim.svg', backdrop, evChorus3, {fadein: false, fadeout: false});
    var evChorus2 = new Video('EV/flickery_sundown.mp4', content, evDaydream);
    var evVerse2 = new Placeholder('Ivan futurescape', backdrop, evChorus2);
    var evChorus1 = new Video('EV/flickery_sundown.mp4', content, evVerse2);
    var evVerse1 = new Placeholder('Ivan logo', backdrop, evChorus1);
    var preEv = new Video('EV/rainscenes.ogg', content, evVerse1, {loop: true, fadeout: false});
    
    var cultRadio = new StaticImage('support/cultradio.jpg', backdrop, preEv, {fadein: false});
    cultRadio.show(noop);
}

document.onload = wholeSet;
