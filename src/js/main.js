import { Layout } from './modules/layout';

const layout = new Layout();
layout.init();

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}