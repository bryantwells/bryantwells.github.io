import { Slideshow } from "./modules/slideshow";

window.addEventListener('load', () => {
    const slideshow = new Slideshow(document.querySelector('.Slideshow'))
    slideshow.init();
});