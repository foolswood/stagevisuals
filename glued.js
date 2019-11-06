class Layer {
    constructor(layer, next, opts) {
        this.layer = layer;
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

    into_dom(layer, v) {
        if (layer === "bg") {
            document.body.insertBefore(v, document.body.childNodes[0]);
        } else {
            document.body.appendChild(v);
        }
    }

    show(ready) {
        var e = this.createNode();
        e.classList.add('stacked');
        var extraCls = this.getOpt('extraClasses', []);
        for (var i = 0; i < extraCls.length; i++) {
            e.classList.add(extraCls[i]);
        }
        var layer = this.layer;
        var dom_add = this.into_dom;
        if (this.getOpt('fadein', true)) {
            e.classList.add('fadein');
            dom_add(layer, e);
            e.addEventListener(
                "animationend",
                function () {
                    e.classList.remove('fadein');
                    ready();
                },
                {once: true});
        } else {
            dom_add(layer, e);
            ready();
        }
        var fadeout = this.getOpt('fadeout', true);
        var ret = this.removeEndTriggers;
        var endCb = _ => this.next.show(function () {
            ret(e, cb);
            if (fadeout) {
                e.classList.add('fadeout');
                e.addEventListener("animationend", _ => document.body.removeChild(e));
            } else {
                // Clunky fudge to avoid dropping onto unrendered stuff
                window.setTimeout(_ => document.body.removeChild(e), 50);
            }
        });
        var delay = this.getOpt('delay', 0);
        var eta = evt => this.addEndTriggers(e, cb);
        var cb = evt => {
            if (evt.keyCode != 122) {
                window.setTimeout(endCb, delay);
            } else {
                eta(e, cb);
            }
        };
        window.setTimeout(eta, 1000);
    }

    addEndTriggers(e, cb) {
        window.addEventListener('keydown', cb, {once: true});
    }

    removeEndTriggers(e, cb) {
        window.removeEventListener('keydown', cb, {once: true});
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
        nextSource();
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

old_not_up_imgs = [
    'OldNotUp/books_00.jpg',
    'OldNotUp/books_01.jpg',
    'OldNotUp/books_02.jpg',
    'OldNotUp/books_03.jpg',
    'OldNotUp/books_04.jpg',
    'OldNotUp/books_05.jpg',
    'OldNotUp/books_06.jpg',
    'OldNotUp/books_07.jpg',
    'OldNotUp/books_08.jpg',
    'OldNotUp/books_09.jpg',
    'OldNotUp/bwh_00.jpg',
    'OldNotUp/bwh_01.jpg',
    'OldNotUp/bwh_02.jpg',
    'OldNotUp/amp_0.jpg',
    'OldNotUp/amp_1.jpg',
    'OldNotUp/amp_2.jpg',
    'OldNotUp/car_0.jpg',
    'OldNotUp/car_1.jpg',
    'OldNotUp/car_2.jpg',
    'OldNotUp/car_3.jpg',
    'OldNotUp/drums_0.jpg',
    'OldNotUp/drums_1.jpg',
    'OldNotUp/phone_0.jpg',
    'OldNotUp/phone_1.jpg',
    'OldNotUp/phone_2.jpg',
    'OldNotUp/strat_0.jpg',
    'OldNotUp/strat_1.jpg',
    'OldNotUp/twh_00.jpg',
    'OldNotUp/twh_01.jpg',
    'OldNotUp/twh_02.jpg',
    'OldNotUp/twh_03.jpg',
    'OldNotUp/tele_0.jpg',
    'OldNotUp/tele_1.jpg',
    'OldNotUp/triple_0.jpg',
    'OldNotUp/triple_1.jpg',
    'OldNotUp/wh_00.jpg',
    'OldNotUp/wh_01.jpg',
    'OldNotUp/wh_02.jpg',
    'OldNotUp/wh_03.jpg',
    'OldNotUp/wh_04.jpg'
];

corpos = [
    'EV/corpdesign.png',
    //'EV/insp/0.jpg',
    'EV/insp/1.jpg',
    'EV/woody.png',
    //'EV/insp/2.jpg',
    'EV/insp/3.jpg',
];

/*
    var omniSun = new Video('Omniscient/sunslice.webm', "fg", preEv, {fadein: false});
    var omnisMeiosis = new Video('Omniscient/meiosis.mp4', "fg", omniSun, {fadein: false, fadeout: false});
    var omnisEarth = new Video('Omniscient/earthslice.mp4', "fg", omnisMeiosis, {fadeout: false});
    var preOmnis = new StaticImage('cjeff.png', "bg", omnisEarth);

    var instinctsMove2 = new Video('Instincts/moving.mp4', "fg", preOmnis, {fadein: false, speed: 1.25});
    var instinctsStill2 = new Video('Instincts/stationary.mp4', "fg", instinctsMove2, {fadein: false});
    var instinctsMove = new Video('Instincts/moving.mp4', "fg", instinctsStill2, {fadein: false});
    var instinctsStill = new Video('Instincts/stationary.mp4', "fg", instinctsMove, {fadeout: false});
    var preInstincts = new StaticImage('EpArt/instincts.jpg', "bg", instinctsStill, {fadeout: false});

    var encoreBlackout = new StaticImage('blackout.svg', "bg", preMexLogo, {});

    var opinionation = new SvgAnim('Opinionation/opinionation_moving.svg', "bg", preOldNotUp);

    var churn = new Video('Churn.mp4', "fg", preInstrumental);
    var preChurn = new StaticImage('epcover.png', "bg", churn);

    var sonica = new Video('sonicasea.ogg', "fg", preChurn, {loop: true, extraClasses: ['pokedown']});
    var preSonica = new StaticImage('epcover.png', "bg", sonica);

    var coil = new StaticImage('Coil/AnimAtomThingy.svg', "fg", preClarity);
    var preCoilLogo = new StaticImage('EpArt/coil.jpg', "bg", coil);

    var evOutro2 = new Video('EV/sundown_late.mp4', "fg", finalLogo, {fadein: false, fadeout: false, speed: 0.5});
    var evOutro1 = new Video('EV/sundown_early.mp4', "bg", evOutro2, {fadein: false, fadeout: false, speed: 0.5});
    var evChorus3 = new Video('EV/sunrise.ogg', "fg", evOutro1, {fadeout: false, speed: 0.5});
    var evDaydream = new SvgAnim('EV/DDRTickerAnim.svg', "bg", evChorus3, {fadein: false, fadeout: false});
    var evChorus2 = new Video('EV/flickery_sundown.mp4', "fg", evDaydream, {speed: 0.5});
    var evVerse2 = new Flipper(corpos, "bg", evChorus2, {interval: 5000});
    var evChorus1 = new Video('EV/flickery_sundown.mp4', "fg", evVerse2, {speed: 0.5, fadein: false});
    var evVerse1 = new Flipper(ivan_frames, "fg", evChorus1, {fadein: false, interval: 100});
    var preEv = new Video('EV/rainscenes.ogg', "bg", evVerse1, {loop: true, fadeout: false, extraClasses: ['pokedown']});
 */
function wholeSet() {
    var endstop = new EndStop();

    var finalLogo = new StaticImage('epcover.png', "bg", endstop);

    var mexico = new Video('NewMexico.mp4', "fg", finalLogo);
    var preMexLogo = new StaticImage('EpArt/newmex.jpg', "fg", mexico);

    // Executioner goes here

    var pnp = new Video('PnP.mp4', "fg", preMexLogo, {fadein: false});
    var prePnp = new StaticImage('blackout.svg', "bg", pnp, {delay: 3947, fadeout: false});

    var clarity = new SvgAnim('Clarity/HillsAnim.svg', "fg", prePnp);
    var preClarity = new StaticImage('epcover.png', "bg", clarity);

    var warning = new Video('Warning.ogg', "fg", preClarity, {extraClasses: ['pokedown']});
    var preWarning = new StaticImage('EpArt/warning.jpg', "bg", warning);

    var oldNotUp = new Flipper(old_not_up_imgs, "fg", preWarning, {interval: 3000});
    var preOldNotUp = new StaticImage('epcover.png', "bg", oldNotUp);

    var instrumental = new Flipper(olive_imgs, "fg", preOldNotUp, {interval: 150});

    var startCard = new StaticImage('forayslogo_white.svg', "bg", instrumental);
    startCard.show(noop);
    window.addEventListener('keydown', e => {
        if (e.keyCode != 122) {
            e.preventDefault()
        }
    });
}

document.onload = wholeSet;
