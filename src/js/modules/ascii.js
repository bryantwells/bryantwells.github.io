export class Ascii {

    constructor(el, options = {}) {
        this.el = el;
        this.ref = this.el.querySelector('.Ascii-ref');
        this.container = this.el.querySelector('.Ascii-image');

        this.options = Object.assign({
            steps: ['·', '·', ':', '*'].reverse(),
            contrast: 0,
            invert: false,
            width: null,
            height: null,
            frameHeight: 1
        }, options);
    }

    init() {
        if (this.options.invert && this.options.invert == 'true' || this.options.invert == true) this.options.steps = this.options.steps.reverse();
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.build();
        // this.ref.remove();
    }

    build() {
        this.buildImage();
        this.buildPixelData();
        this.buildAscii();
    }

    buildImage() {
        this.options.width = (this.options.width)
            ? this.options.width
            : Math.floor(this.ref.width / (this.ref.height / this.options.height));
        this.options.height = (this.options.height)
            ? this.options.height
            : Math.floor(this.ref.height / (this.ref.width / this.options.width));
        this.ratio = this.options.width / this.options.height;
        this.canvas.width = this.options.width;
        this.canvas.height = this.options.height;
        this.ctx.drawImage(this.ref, 
            0, 0, this.ref.width, Math.floor(this.ref.width / this.ratio), 
            0, 0, this.options.width, this.options.height);
        this.imgData = this.ctx.getImageData(0, 0, this.options.width, this.options.height).data;
        if (this.options.contrast) this.contrastImage();
    }

    contrastImage() {
        const contrast = (this.options.contrast / 100) + 1;
        const intercept = 128 * (1 - contrast);
        for (var i = 0; i < this.imgData.length; i += 4) {
            this.imgData[i] = this.imgData[i] * contrast + intercept;
            this.imgData[i + 1] = this.imgData[i + 1] * contrast + intercept;
            this.imgData[i + 2] = this.imgData[i + 2] * contrast + intercept;
        }
    }

    buildPixelData() {
        this.pixelData = [];
        for (let i = 0; i < this.options.width * this.options.height; i++) {
            const colorData = [];
            for (let j = i * 4; j < ((i + 1) * 4) - 1; j++) {
                colorData.push(this.imgData[j]);
            }
            const avg = colorData.reduce((a, b) => a + b, 0) / colorData.length;
            const pctg = Math.ceil((avg / 255) * 100) / 100;
            this.pixelData.push(pctg);
        }
    }

    buildAscii() {
        let containerHTML = '';

        for (let i = 0; i < this.pixelData.length; i++) {
            if (i > 0 && i % this.options.width == 0) {
                containerHTML += '\n';
            }
            if (this.pixelData[i] == 1) {
                containerHTML += this.options.steps[this.options.steps.length - 1];
            } else {
                containerHTML += this.options.steps[Math.floor(this.pixelData[i] * this.options.steps.length / 1)];
            }
        }

        this.container.innerText = `${ containerHTML }`;
    }

    updateWidth(width, frameHeight) {
        this.options.width = width;
        this.options.frameHeight = frameHeight;
        this.options.height = null;
        this.build();
    }
}