import { Ascii } from './ascii'

export class Margin {

    constructor(el, options = {}) {
        this.el = el;
        this.asciiEl = this.el.querySelector('.Ascii');
        this.asciiRrefEl = this.el.querySelector('.Ascii-ref');
        this.ruler = document.querySelector('.Ruler');

        this.options = Object.assign({
            steps: ['·', ' ', ' ', '·'].reverse(),
            contrast: 0,
            invert: false,
        }, options);

        this.unitWidth = null;
        this.unitHeight = null;
        this.ascii = null;
    }

    init() {
        this.getUnitDimensions();
        this.buildAscii();
    }

    update(delta = 0) {
        this.updateAscii(delta);
    }

    buildAscii() {
        console.log(this.el.clientHeight, this.unitHeight, this.height);
        const options = {
            steps: this.options.steps,
            contrast: this.options.contrast,
            invert: this.options.invert,
            width: this.width,
            height: this.height,
        };
        this.ascii = new Ascii(this.el.querySelector('.Ascii'), options);
        this.ascii.init();
    }

    updateAscii(delta = 0) {
        this.ascii.options.width = this.width;
        this.ascii.options.height = (this.height + delta > 0) ? this.height + delta : 1;
        this.ascii.build();
    }

    getUnitDimensions() {
        const rect = this.ruler.getBoundingClientRect();
        this.unitWidth = rect.width;
        this.unitHeight = rect.height;
    }

    get width() {
        return Math.floor(this.asciiEl.clientWidth / this.unitWidth);
    }

    get height() {
        return Math.floor(this.el.clientHeight / this.unitHeight);
    }
}