export class Caption {

    constructor(el) {
        this.el = el;
        this.rect = this.el.getBoundingClientRect();
        this.entries = [...document.querySelectorAll('.Entry')];
        this.activeEntryEl = null;
    }

    init() {
        window.addEventListener('scroll', () => {
            this.updateContent();
        });

        window.addEventListener('resize', () => {
            this.updateRect();
            this.updateContent();
        });
    }

    updateContent() {
        if (!this.el.classList.contains('is-hidden')) {
            this.entries.forEach((entry) => {
                const entryRect = entry.getBoundingClientRect();
                if (entryRect.top < this.rect.top && entryRect.bottom > this.rect.bottom && this.activeEntry !== entry) {
                    this.activeEntry = entry;
                }
            });
        }
    }

    updateRect() {
        this.rect = this.el.getBoundingClientRect();
    }

    set activeEntry(entry) {
        this.activeEntryEl = entry;
        this.el.innerHTML = (entry.querySelector('.Entry-caption')) 
            ? entry.querySelector('.Entry-caption').innerHTML
            : '';
    }

    get activeEntry() {
        return this.activeEntryEl;
    }
}