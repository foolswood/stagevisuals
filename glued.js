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
        var extraCls = this.getOpt('extraClasses', []);
        for (var i = 0; i < extraCls.length; i++) {
            e.classList.add(extraCls[i]);
        }
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
                // Clunky fudge to avoid dropping onto unrendered stuff
                window.setTimeout(_ => c.removeChild(e), 50);
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
        v.playbackRate = super.getOpt('speed', 1.0);
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

class Flipper extends Layer {
    constructor(sources, container, next, opts) {
        super(container, next, opts);
        this.sources = sources;
    }

    createNode() {
        var i = document.createElement('img');
        var counter = 0;
        var sources = this.sources;
        var nextSource = function() {
            i.src = sources[counter++ % sources.length];
        }
        i.intervalTimer = window.setInterval(nextSource, this.getOpt('interval', 350));
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

function noop() {
}

var olive_imgs = [
    'Olive/00.jpg',
    'Olive/37.jpg',
    'Olive/03.jpg',
    'Olive/04.jpg',
    'Olive/01.jpg',
    'Olive/07.jpg',
    'Olive/02.jpg',
    'Olive/08.jpg',
    'Olive/36.jpg',
    'Olive/38.jpg',
    'Olive/10.jpg',
    'Olive/17.jpg',
    'Olive/29.jpg',
    'Olive/15.jpg',
    'Olive/11.jpg',
    'Olive/05.jpg',
    'Olive/22.jpg',
    'Olive/13.jpg',
    'Olive/16.jpg',
    'Olive/09.jpg',
    'Olive/32.jpg',
    'Olive/06.jpg',
    'Olive/18.jpg',
    'Olive/21.jpg',
    'Olive/12.jpg',
    'Olive/14.jpg',
    'Olive/34.jpg',
    'Olive/23.jpg',
    'Olive/27.jpg',
    'Olive/19.jpg',
    'Olive/20.jpg',
    'Olive/35.jpg',
    'Olive/25.jpg',
    'Olive/30.jpg',
    'Olive/26.jpg',
    'Olive/24.jpg',
    'Olive/28.jpg',
    'Olive/31.jpg',
    'Olive/33.jpg',
    'Olive/39.jpg',
];

ivan_frames = [
    'EV/ivan_frames/01.jpg',
    'EV/ivan_frames/02.jpg',
    'EV/ivan_frames/03.jpg',
    'EV/ivan_frames/04.jpg',
    'EV/ivan_frames/05.jpg',
    'EV/ivan_frames/06.jpg',
    'EV/ivan_frames/07.jpg',
    'EV/ivan_frames/08.jpg',
    'EV/ivan_frames/09.jpg',
    'EV/ivan_frames/10.jpg',
    'EV/ivan_frames/11.jpg',
    'EV/ivan_frames/12.jpg',
    'EV/ivan_frames/13.jpg',
    'EV/ivan_frames/14.jpg',
    'EV/ivan_frames/15.jpg',
    'EV/ivan_frames/16.jpg',
    'EV/ivan_frames/17.jpg',
    'EV/ivan_frames/18.jpg',
    'EV/ivan_frames/19.jpg',
    'EV/ivan_frames/20.jpg',
    'EV/ivan_frames/21.jpg',
    'EV/ivan_frames/22.jpg',
    'EV/ivan_frames/23.jpg',
    'EV/ivan_frames/24.jpg',
    'EV/ivan_frames/25.jpg',
];

function wholeSet() {
    var backdrop = document.getElementById('backdrop');
    var content = document.getElementById('content');
    var overlay = document.getElementById('overlay');
    var endstop = new EndStop();

    var finalLogo = new StaticImage('charitycard.svg', backdrop, endstop);

    var mexico = new Video('NewMexico.mp4', content, finalLogo);
    var preMexLogo = new StaticImage('EpArt/newmex.jpg', backdrop, mexico);

    var pnp = new Video('PnP.mp4', content, preMexLogo, {fadein: false});
    var prePnp = new StaticImage('blackout.svg', backdrop, pnp, {delay: 3947, fadeout: false});

    var coil = new StaticImage('Coil/AnimAtomThingy.svg', content, prePnp);
    var preCoilLogo = new StaticImage('EpArt/coil.jpg', backdrop, coil);

    var warning = new Video('Warning.ogg', content, preCoilLogo, {extraClasses: ['pokedown']});
    var preWarning = new StaticImage('EpArt/warning.jpg', backdrop, warning);

    var sonica = new Video('sonicasea.ogg', content, preWarning, {loop: true, extraClasses: ['pokedown']});

    var instinctsMove2 = new Video('Instincts/moving.mp4', overlay, sonica, {fadein: false, speed: 1.25});
    var instinctsStill2 = new Video('Instincts/stationary.mp4', content, instinctsMove2, {fadein: false});
    var instinctsMove = new Video('Instincts/moving.mp4', overlay, instinctsStill2, {fadein: false});
    var instinctsStill = new Video('Instincts/stationary.mp4', content, instinctsMove, {fadeout: false});
    var preInstincts = new StaticImage('EpArt/instincts.jpg', backdrop, instinctsStill, {fadeout: false});

    var clarity = new SvgAnim('Clarity/HillsAnim.svg', content, preInstincts);
    var preClarity = new StaticImage('blackout.svg', backdrop, clarity);

    var answer = new Video('Answer.ogg', content, preClarity);
    var preAnswer = new StaticImage('EpArt/answer.jpg', backdrop, answer, {delay: 2466});

    var churn = new Video('Churn.mp4', content, preAnswer);
    var preChurn = new StaticImage('epcover.png', backdrop, churn);

    var burn = new SvgAnim('Burn/OrbitAnim.svg', content, preChurn);
    var preBurn = new StaticImage('epcover.png', backdrop, burn);

    var olive = new Flipper(olive_imgs, content, preBurn);
    var preOlive = new StaticImage('EpArt/olive.jpg', backdrop, olive, {fadein: false, fadeout: false, delay: 500});

    var nwo = new Video('NWO.mp4', content, preOlive);
    var preNwo = new StaticImage('blackout.svg', backdrop, nwo, {fadein: false});

    var evOutro2 = new Video('EV/sundown_late.mp4', content, preNwo, {fadein: false, fadeout: false, speed: 0.5});
    var evOutro1 = new Video('EV/sundown_early.mp4', backdrop, evOutro2, {fadein: false, fadeout: false, speed: 0.5});
    var evChorus3 = new Video('EV/sunrise.ogg', content, evOutro1, {fadeout: false, speed: 0.5});
    var evDaydream = new SvgAnim('EV/DDRTickerAnim.svg', backdrop, evChorus3, {fadein: false, fadeout: false});
    var evChorus2 = new Video('EV/flickery_sundown.mp4', content, evDaydream, {speed: 0.5});
    var evVerse2 = new StaticImage('EV/corpdesign.png', backdrop, evChorus2);
    var evChorus1 = new Video('EV/flickery_sundown.mp4', content, evVerse2, {speed: 0.5, fadein: false});
    var evVerse1 = new Flipper(ivan_frames, overlay, evChorus1, {fadein: false, interval: 100});
    var preEv = new Video('EV/rainscenes.ogg', backdrop, evVerse1, {loop: true, fadeout: false, extraClasses: ['pokedown']});

    var charityCard1 = new StaticImage('charitycard.svg', content, preEv);
    
    var doopsEndCard = new StaticImage('support/doops/doopsthing.jpg', backdrop, charityCard1);
    var doopsVid6 = new Video('support/doops/mush.mp4', content, doopsEndCard, {speed: 0.2});
    var doopsVid5 = new Video('support/doops/shuttle.mp4', backdrop, doopsVid6);
    var doopsVid4 = new Video('support/doops/mush.mp4', content, doopsVid5, {speed: 0.3});
    var doopsVid3 = new Video('support/doops/shuttle.mp4', backdrop, doopsVid4);
    var doopsVid2 = new Video('support/doops/mush.mp4', content, doopsVid3, {speed: 0.5});
    var doopsVid1 = new Video('support/doops/shuttle.mp4', backdrop, doopsVid2, {fadein: true});
    var doopsVid0 = new Video('support/doops/mush.mp4', content, doopsVid1, {speed: 0.7});
    var preDoops = new StaticImage('support/doops/doopslogo.jpg', backdrop, doopsVid0);

    var charityCard = new StaticImage('charitycard.svg', content, preDoops);

    var cultRadio = new StaticImage('support/cultradio.jpg', backdrop, charityCard);

    var startCard = new StaticImage('charitycard.svg', content, cultRadio);
    startCard.show(noop);
}

document.onload = wholeSet;
