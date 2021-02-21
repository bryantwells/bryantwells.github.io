import { Slide } from './slide';

export class Slideshow {

    constructor(el) {
        this.el = el;

        this.header = document.querySelector('.Header');
        this.toggle = this.header.querySelector('.Header-toggle');
        this.nav = this.header.querySelector('.Header-nav');
        this.navList = this.header.querySelector('.Header-nav');
        this.caption = this.header.querySelector('.Header-caption');

        this.prevButton = document.querySelector('.Slideshow-progressButton--prev');
        this.nextButton = document.querySelector('.Slideshow-progressButton--next');

        this.navItems = null;
        this.progress = 0;
        this.slides = null;
    }

    init() {
        this.createSlides();
        this.slides.forEach((slide) => { slide.createThumbnail() })
        this.populateNav();
        this.activeIndex = Math.floor(Math.random() * this.slides.length);
        this.addEventListeners();        
    }

    populateNav() {
        this.navItems = this.slides.map((slide) => {
            const navItem = document.createElement('li');
            navItem.classList.add('Header-navItem');
            this.navList.append(navItem);
            return navItem;
        })
    }
    
    addEventListeners() {

        this.prevButton.addEventListener('click', () => {
            if (this.el.classList.contains('is-meta') || this.el.classList.contains('is-about')) {
                this.hideMeta();
            } else {
                this.activeIndex--;
            }            
        });

        this.nextButton.addEventListener('click', () => {
            if (this.el.classList.contains('is-meta') || this.el.classList.contains('is-about')) {
                this.hideMeta();
            } else {
                this.activeIndex++;
            }  
        });

        this.toggle.addEventListener('click', () => {
            this.toggleAbout();
            this.hideMeta();
        });

        this.navItems.forEach((navItem, i) => {
            navItem.addEventListener('click', () => {
                this.toggleMeta();
                this.activeIndex = i;
            });
        });

        this.navItems.forEach((navItem, i) => {
            navItem.addEventListener('mouseenter', () => {
                if (this.el.classList.contains('is-meta') || this.el.classList.contains('is-about')) {
                    this.hintSlide(i);
                }
            });
        });

        this.nav.addEventListener('mouseleave', () => {
            if (this.el.classList.contains('is-about')) {
                this.hideMeta();
            } else {
                this.activeIndex = this.activeIndex;
            }
            
        });

        window.addEventListener('resize', () => {
            this.activeSlide.update();
        });
    }

    createSlides() {
        this.slides = [...this.el.querySelectorAll('.Slide')].map((slide, i) => {
            return new Slide(slide, i)
        });
    }

    hintSlide(i) {
        this.el.classList.add('is-meta');
        this.slides.forEach((slide) => { slide.deactivate() });
        this.navItems.forEach((navItem) => { navItem.classList.remove('is-active') });
        this.slides[i].activate();
        this.navItems[i].classList.add('is-active');
        this.updateCaption(i);
    }

    updateCaption(i) {
        if (this.slides[i].isAbout) {
            this.header.classList.add('is-about');
            this.showMeta();
            this.caption.innerHTML = this.slides[i].el.innerHTML;
        } else {
            this.header.classList.remove('is-about');
            this.caption.innerHTML = this.slides[i].caption;
        }
    }

    toggleAbout() {
        if (this.el.classList.contains('is-about')) {
            this.hideAbout();
        } else {
            this.showAbout();
        }
    }

    toggleMeta() {
        if (this.el.classList.contains('is-meta')) {
            this.hideMeta();
        } else {
            this.showMeta();
        }
    }

    showMeta() {
        this.el.classList.add('is-meta');
    }

    hideMeta() {
        this.el.classList.remove('is-meta');
    }    

    showAbout() {
        this.el.classList.add('is-about');
    }

    hideAbout() {
        this.el.classList.remove('is-about');
    }

    get activeSlide() {
        return this.slides[this.activeIndex];
    }

    get activeIndex() {
        return Math.abs(this.progress % this.slides.length);
    }

    get activeNavItem() {
        return this.navItems[this.activeIndex];
    }

    set activeIndex(val) {
        this.slides.forEach((slide) => { slide.deactivate() });
        this.navItems.forEach((navItem) => { navItem.classList.remove('is-active') });
        this.header.style.color = null;
        this.progress = val;
        this.activeSlide.activate();
        this.activeNavItem.classList.add('is-active');
        this.header.style.color = this.activeSlide.el.dataset.textColor;
        this.updateCaption(this.activeIndex);
    }
}