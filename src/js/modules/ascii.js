export class Ascii {

    constructor(el, ref, options = {}) {
        this.el = el;
        this.ref = ref;

        this.options = Object.assign({
            steps: ['\u00A0', '·', ':', '*'].reverse(),
            contrast: 100,
            invert: false,
            width: null,
            height: null,
            fit: null,
            frameHeight: 1,
            paddingHeight: 0,
            paddingWidth: 0,
        }, options);
    }

    init() {
        if (this.options.invert && this.options.invert == 'true' || this.options.invert == true) this.options.steps = this.options.steps.reverse();
        this.ref.crossOrigin = 'Anonymous';
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        // document.body.append(this.canvas)
        this.build();        
    }

    build() {
        this.buildImage();
        this.buildPixelData();
        this.buildAscii();
    }

    buildImage() {
        this.imageRatio = this.ref.naturalWidth / this.ref.naturalHeight;
        this.containerRatio = (this.el.offsetWidth - (this.options.paddingWidth * 2)) / (this.el.offsetHeight - (this.options.paddingHeight * 2));

        this.options.width = (this.options.width)
            ? this.options.width
            : Math.floor(this.options.height * this.containerRatio);
        this.options.height = (this.options.height)
            ? this.options.height
            : Math.ceil(this.options.width / this.containerRatio);

        this.ctx.canvas.width = this.options.width;
        this.ctx.canvas.height = this.options.height;

        if (this.options.fit == 'contain') {

            // wide image
            if (this.containerRatio >= this.imageRatio) {
                this.imageHeight = this.canvas.height - (this.options.paddingHeight * 2);
                this.imageWidth = (this.imageHeight * this.imageRatio);
                this.x = ((this.canvas.width - this.imageWidth) / 2);
                this.y = 0 + this.options.paddingHeight;

            // tall image
            } else {
                this.imageWidth = this.canvas.width - (this.options.paddingWidth * 2);
                this.imageHeight = (this.imageWidth / this.imageRatio);
                this.x = 0 + this.options.paddingWidth;
                this.y = ((this.canvas.height - this.imageHeight) / 2);
            }
        }

        if (this.options.fit == 'cover') {
            if (this.containerRatio >= this.imageRatio) {
                this.imageWidth = this.canvas.width;
                this.imageHeight = this.imageWidth / this.imageRatio;
                this.x = 0;
                this.y = (this.canvas.height - this.imageHeight) / 2;                
            } else {
                this.imageHeight = this.canvas.height;
                this.imageWidth = this.imageHeight * this.imageRatio;
                this.x = (this.canvas.width - this.imageWidth) / 2;
                this.y = 0;
            }
        }

        if (this.options.bg) {
            this.ctx.fillStyle = this.options.bg;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        this.ctx.drawImage(this.ref, 
            0, 0, this.ref.naturalWidth, this.ref.naturalHeight, 
            this.x, this.y, this.imageWidth, this.imageHeight);
        
        this.imgData = this.ctx.getImageData(0, 0, this.options.width, this.options.height).data;
        if (this.options.gamma) { this.adjustGamma(); }
        if (this.options.contrast) { this.adjustContrast(); } 
    }

    adjustContrast() {
        const contrast = (this.options.contrast / 100) + 1;
        const intercept = 128 * (1 - contrast);
        for (var i = 0; i < this.imgData.length; i += 4) {
            this.imgData[i] = this.imgData[i] * contrast + intercept;
            this.imgData[i + 1] = this.imgData[i + 1] * contrast + intercept;
            this.imgData[i + 2] = this.imgData[i + 2] * contrast + intercept;
        }
    }

    adjustGamma() {
        const gammaCorrection = 1 / this.options.gamma;
        for (var i = 0; i < this.imgData.length; i += 4) {
            this.imgData[i] = Math.pow(255 * (this.imgData[i] / 255), gammaCorrection);
            this.imgData[i + 1] = Math.pow(255 * (this.imgData[i + 1] / 255), gammaCorrection);
            this.imgData[i + 2] = Math.pow(255 * (this.imgData[i + 2] / 255), gammaCorrection);
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
            if (i % this.options.width > 0 && i % this.options.width < this.options.width) {
                containerHTML += '\u0020';
            }
            if (this.pixelData[i] == 1) {
                containerHTML += this.options.steps[this.options.steps.length - 1];
            } else {
                containerHTML += this.options.steps[Math.floor(this.pixelData[i] * this.options.steps.length / 1)];
            }
        }

        this.el.innerHTML = `${ containerHTML }`;
    }

    update(options) {
        this.options.width = (options.width) ? options.width : this.options.width;
        this.options.height = (options.height) ? options.height : this.options.height;
        this.options.paddingWidth = (options.paddingWidth) ? options.paddingWidth : this.options.paddingWidth;
        this.options.paddingHeight = (options.paddingHeight) ? options.paddingHeight : this.options.paddingHeight;
        this.build();
    }
}