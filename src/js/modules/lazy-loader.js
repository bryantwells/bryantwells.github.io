export class LazyLoader {

    constructor() {
        this.images = [...document.querySelectorAll('.Entry-media--image')];
        this.options = {
            rootMargin: '200%',
            threshold: 0
        };
        this.preloadImageCount = 0;
    }

    init() {
        this.loadThumbnails();
    }

    loadThumbnails() {
        this.images.forEach((image) => {
            const url = new URL(image.dataset.src);
            image.src = `${url.origin}${url.pathname}?w=50&auto=format`;
            image.addEventListener('load', () => { 
                this.preloadImageCount++;
                if (this.preloadImageCount == this.images.length) {
                    this.createObserver();
                }
            });

        })
    }

    createObserver() {
        this.observer = new IntersectionObserver(this.handleObservation.bind(this), this.options);
        this.images.forEach((image) => { this.observer.observe(image) });
    }

    handleObservation(entries, observer) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                observer.unobserve(entry.target);
                this.loadImage(entry.target);
            }
        });
    }

    loadImage(image) {
        const url = new URL(image.dataset.src);
        image.sizes = '100vw'
        image.srcset = `${url.origin}${url.pathname}?w=750&auto=format&q=90 750w, ${url.origin}${url.pathname}?w=1500&auto=formatq=90 1500w, ${url.origin}${url.pathname}?w=3000&auto=formatq=90 3000w`;
        image.src = `${url.origin}${url.pathname}?auto=format`;
        image.addEventListener('load', () => {
            image.classList.add('is-loaded');
        });
    }
}