import { Margin } from './margin'
import { LazyLoader } from './lazy-loader'
import { Caption } from './caption'

export class Layout {

    constructor() {
        this.headerInfo = document.querySelector('.Header-info');
        this.entries = document.querySelectorAll('.Entry');
        this.firstEntry = this.entries[0];
        this.lastEntry = this.entries[this.entries.length - 1];

        this.margin = new Margin(document.querySelector('.Margin'), { contrast: 100 });
        this.caption = new Caption(document.querySelector('.Caption'));
        this.lazyLoader = new LazyLoader();

        this.scrollDelta = 0;
    }

    init() {
        window.addEventListener('load', () => { 
            this.margin.init();
            this.lazyLoader.init();
            this.caption.init();
            this.updateWidth();

            window.addEventListener('resize', (e) => { this.update(e) });
            window.addEventListener('scroll', (e) => { this.update(e) });
        });
        
    }

    update(e) {
        if (e.type == 'resize') {
            this.updateWidth();
        } else if (e.type == 'scroll') {
            this.firstEntryPos = this.firstEntry.getBoundingClientRect().top;
            this.lastEntryPos = this.lastEntry.getBoundingClientRect().bottom;
            this.toggleHeader();
            this.toggleCaption();
        }
    }

    updateWidth() {
        const width = Math.floor(this.margin.el.clientWidth / this.margin.unitWidth);
        this.headerInfo.style.width = `${width * this.margin.unitWidth}px`;
        this.caption.el.style.width = `${width * this.margin.unitWidth}px`;
        this.margin.update(this.scrollDelta);
    }

    toggleHeader() {
        if (this.firstEntryPos < 0 && !this.headerInfo.classList.contains('is-hidden')) {
            this.headerInfo.classList.add('is-hidden');
            this.margin.update(this.scrollDelta);
        } else if (this.firstEntryPos > 0 && this.headerInfo.classList.contains('is-hidden')) {
            this.headerInfo.classList.remove('is-hidden');
            this.margin.update(this.scrollDelta);
        }
    }

    toggleCaption() {
        if (this.firstEntryPos < window.innerHeight / 4 && this.lastEntryPos > window.innerHeight  * (3/4) && this.caption.el.classList.contains('is-hidden')) {
            this.caption.el.classList.remove('is-hidden');
            this.scrollDelta = -2;
            this.margin.update(this.scrollDelta);
        } else if (this.lastEntryPos < window.innerHeight  * (3/4) && !this.caption.el.classList.contains('is-hidden')) {
            this.caption.el.classList.add('is-hidden');
        } else if (this.firstEntryPos > window.innerHeight / 4 && !this.caption.el.classList.contains('is-hidden')) {
            this.caption.el.classList.add('is-hidden');
            this.scrollDelta = 0;
            this.margin.update(this.scrollDelta);
        }
    }
}