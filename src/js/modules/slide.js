import { Ascii } from "./ascii";

export class Slide {

    constructor(el, i) {
        this.el = el;
        this.i = i;

        this.ruler = document.querySelector('.Ruler');
        this.media = this.el.querySelector('.Slide-media');
        this.caption = (this.media) ? this.media.alt : null;
        this.ascii = null;
        this.thumbnail = null;
        
        this.options = {
            steps: ['\u0020', '●'].reverse(),
            contrast: Number(this.el.dataset.contrast) || 0,
            gamma: Number(this.el.dataset.gamma) || 0,
            bg: Number(this.el.dataset.bg) || 'black',
            invert: this.el.dataset.invert || false,
        };
    }

    createThumbnail() {
        const url = new URL(this.media.dataset.src);
        this.thumbnail = document.createElement('img');
        this.thumbnail.src = `${url.origin}${url.pathname}?w=200&auto=format`;
        this.loadThumbnail();
    }

    createAscii() {
        this.ascii = new Ascii(this.el.querySelector('.Ascii'), this.thumbnail, { 
                ...this.options,
                ...this.dimensions, 
                ...this.padding, 
                fit: this.el.dataset.fit, 
                bg: this.el.style.backgroundColor 
            });
        this.ascii.init();
    }

    update() {
        this.updateAscii();
    }

    updateAscii() {
        this.ascii.update({ ...this.dimensions, ...this.padding });
    }
    
    activate() {
        this.el.classList.add('is-active');
        if (this.ascii) { 
            this.updateAscii();
        } else { 
            this.createAscii();
            this.thumbnail.addEventListener('load', () => {
                this.updateAscii();
            });
            this.media.addEventListener('load', () => {
                this.updateAscii();
            });
            this.loadImage();
        }
    }

    deactivate() {
        this.el.classList.remove('is-active');
    }

    loadThumbnail() {
        this.media.src = this.thumbnail.src;
    }

    loadImage() {
        const url = new URL(this.media.dataset.src);
        this.media.sizes = '100vw'
        this.media.srcset = `${url.origin}${url.pathname}?w=750&auto=format&q=90 750w, ${url.origin}${url.pathname}?w=1500&auto=formatq=90 1500w, ${url.origin}${url.pathname}?w=3000&auto=formatq=90 3000w`;
        this.media.src = `${url.origin}${url.pathname}?auto=format`;
        this.media.addEventListener('load', () => {
            this.media.classList.add('is-loaded');
        });
    }

    get dimensions() {
        const rulerRect = this.ruler.getBoundingClientRect();
        return {
            width: (this.ascii) 
                ? Math.round(this.ascii.el.offsetWidth / rulerRect.width)
                : Math.round(this.el.querySelector('.Ascii').offsetWidth / rulerRect.width),
            height: (this.ascii)
                ? Math.round(this.ascii.el.offsetHeight / rulerRect.height)
                : Math.round(this.el.querySelector('.Ascii').offsetHeight / rulerRect.height)
        }
    }

    get padding() {
        return {
            paddingHeight: this.mediaPadding.paddingHeight - this.asciiPadding.paddingHeight,
            paddingWidth: this.mediaPadding.paddingWidth - this.asciiPadding.paddingWidth,
        }
    }

    get mediaPadding() {
        return {
            paddingHeight: Math.round(this.media.offsetTop / this.ruler.offsetHeight),
            paddingWidth: Math.round(this.media.offsetLeft / this.ruler.offsetWidth),
        }
    }

    get asciiPadding() {
        return {
            paddingHeight: (this.ascii) 
                ? Math.round(this.ascii.el.offsetTop / this.ruler.offsetHeight)
                : Math.round(this.el.querySelector('.Ascii').offsetTop / this.ruler.offsetHeight),
            paddingWidth: (this.ascii) 
                ? Math.round(this.ascii.el.offsetLeft / this.ruler.offsetWidth)
                : Math.round(this.el.querySelector('.Ascii').offsetLeft / this.ruler.offsetWidth),
        }
    }
}