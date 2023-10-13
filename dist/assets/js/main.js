(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _slideshow = require("./modules/slideshow");

window.addEventListener('load', function () {
  var slideshow = new _slideshow.Slideshow(document.querySelector('.Slideshow'));
  slideshow.init();
});

},{"./modules/slideshow":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Ascii = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Ascii = /*#__PURE__*/function () {
  function Ascii(el, ref) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, Ascii);

    this.el = el;
    this.ref = ref;
    this.options = Object.assign({
      steps: ["\xA0", '·', ':', '*'].reverse(),
      contrast: 100,
      invert: false,
      width: null,
      height: null,
      fit: null,
      frameHeight: 1,
      paddingHeight: 0,
      paddingWidth: 0
    }, options);
  }

  _createClass(Ascii, [{
    key: "init",
    value: function init() {
      if (this.options.invert && this.options.invert == 'true' || this.options.invert == true) this.options.steps = this.options.steps.reverse();
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d'); // document.body.append(this.canvas)

      this.build();
    }
  }, {
    key: "build",
    value: function build() {
      this.buildImage();
      this.buildPixelData();
      this.buildAscii();
    }
  }, {
    key: "buildImage",
    value: function buildImage() {
      this.imageRatio = this.ref.naturalWidth / this.ref.naturalHeight;
      this.containerRatio = (this.el.offsetWidth - this.options.paddingWidth * 2) / (this.el.offsetHeight - this.options.paddingHeight * 2);
      this.options.width = this.options.width ? this.options.width : Math.floor(this.options.height * this.containerRatio);
      this.options.height = this.options.height ? this.options.height : Math.ceil(this.options.width / this.containerRatio);
      this.ctx.canvas.width = this.options.width;
      this.ctx.canvas.height = this.options.height;

      if (this.options.fit == 'contain') {
        // wide image
        if (this.containerRatio >= this.imageRatio) {
          this.imageHeight = this.canvas.height - this.options.paddingHeight * 2;
          this.imageWidth = this.imageHeight * this.imageRatio;
          this.x = (this.canvas.width - this.imageWidth) / 2;
          this.y = 0 + this.options.paddingHeight; // tall image
        } else {
          this.imageWidth = this.canvas.width - this.options.paddingWidth * 2;
          this.imageHeight = this.imageWidth / this.imageRatio;
          this.x = 0 + this.options.paddingWidth;
          this.y = (this.canvas.height - this.imageHeight) / 2;
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

      this.ctx.drawImage(this.ref, 0, 0, this.ref.naturalWidth, this.ref.naturalHeight, this.x, this.y, this.imageWidth, this.imageHeight);
      this.imgData = this.ctx.getImageData(0, 0, this.options.width, this.options.height).data;

      if (this.options.gamma) {
        this.adjustGamma();
      }

      if (this.options.contrast) {
        this.adjustContrast();
      }
    }
  }, {
    key: "adjustContrast",
    value: function adjustContrast() {
      var contrast = this.options.contrast / 100 + 1;
      var intercept = 128 * (1 - contrast);

      for (var i = 0; i < this.imgData.length; i += 4) {
        this.imgData[i] = this.imgData[i] * contrast + intercept;
        this.imgData[i + 1] = this.imgData[i + 1] * contrast + intercept;
        this.imgData[i + 2] = this.imgData[i + 2] * contrast + intercept;
      }
    }
  }, {
    key: "adjustGamma",
    value: function adjustGamma() {
      var gammaCorrection = 1 / this.options.gamma;

      for (var i = 0; i < this.imgData.length; i += 4) {
        this.imgData[i] = Math.pow(255 * (this.imgData[i] / 255), gammaCorrection);
        this.imgData[i + 1] = Math.pow(255 * (this.imgData[i + 1] / 255), gammaCorrection);
        this.imgData[i + 2] = Math.pow(255 * (this.imgData[i + 2] / 255), gammaCorrection);
      }
    }
  }, {
    key: "buildPixelData",
    value: function buildPixelData() {
      this.pixelData = [];

      for (var i = 0; i < this.options.width * this.options.height; i++) {
        var colorData = [];

        for (var j = i * 4; j < (i + 1) * 4 - 1; j++) {
          colorData.push(this.imgData[j]);
        }

        var avg = colorData.reduce(function (a, b) {
          return a + b;
        }, 0) / colorData.length;
        var pctg = Math.ceil(avg / 255 * 100) / 100;
        this.pixelData.push(pctg);
      }
    }
  }, {
    key: "buildAscii",
    value: function buildAscii() {
      var containerHTML = '';

      for (var i = 0; i < this.pixelData.length; i++) {
        if (i > 0 && i % this.options.width == 0) {
          containerHTML += '\n';
        }

        if (i % this.options.width > 0 && i % this.options.width < this.options.width) {
          containerHTML += " ";
        }

        if (this.pixelData[i] == 1) {
          containerHTML += this.options.steps[this.options.steps.length - 1];
        } else {
          containerHTML += this.options.steps[Math.floor(this.pixelData[i] * this.options.steps.length / 1)];
        }
      }

      this.el.innerHTML = "".concat(containerHTML);
    }
  }, {
    key: "update",
    value: function update(options) {
      this.options.width = options.width ? options.width : this.options.width;
      this.options.height = options.height ? options.height : this.options.height;
      this.options.paddingWidth = options.paddingWidth ? options.paddingWidth : this.options.paddingWidth;
      this.options.paddingHeight = options.paddingHeight ? options.paddingHeight : this.options.paddingHeight;
      this.build();
    }
  }]);

  return Ascii;
}();

exports.Ascii = Ascii;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Slide = void 0;

var _ascii = require("./ascii");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Slide = /*#__PURE__*/function () {
  function Slide(el, i) {
    _classCallCheck(this, Slide);

    this.el = el;
    this.i = i;
    this.ruler = document.querySelector('.Ruler');
    this.media = this.el.querySelector('.Slide-media');
    this.caption = this.media ? this.media.alt : null;
    this.ascii = null;
    this.thumbnail = null;
    this.options = {
      steps: [" ", '●'].reverse(),
      contrast: Number(this.el.dataset.contrast) || 0,
      gamma: Number(this.el.dataset.gamma) || 0,
      bg: Number(this.el.dataset.bg) || 'black',
      invert: this.el.dataset.invert || false
    };
  }

  _createClass(Slide, [{
    key: "createThumbnail",
    value: function createThumbnail() {
      var url = new URL(this.media.dataset.src);
      this.thumbnail = document.createElement('img');
      this.thumbnail.crossOrigin = 'Anonymous';
      this.thumbnail.src = "".concat(url.origin).concat(url.pathname, "?w=200&auto=format");
      this.loadThumbnail();
    }
  }, {
    key: "createAscii",
    value: function createAscii() {
      this.ascii = new _ascii.Ascii(this.el.querySelector('.Ascii'), this.thumbnail, _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, this.options), this.dimensions), this.padding), {}, {
        fit: this.el.dataset.fit,
        bg: this.el.style.backgroundColor
      }));
      this.ascii.init();
    }
  }, {
    key: "update",
    value: function update() {
      this.updateAscii();
    }
  }, {
    key: "updateAscii",
    value: function updateAscii() {
      this.ascii.update(_objectSpread(_objectSpread({}, this.dimensions), this.padding));
    }
  }, {
    key: "activate",
    value: function activate() {
      var _this = this;

      this.el.classList.add('is-active');

      if (this.ascii) {
        this.updateAscii();
      } else {
        this.createAscii();
        this.thumbnail.addEventListener('load', function () {
          _this.updateAscii();
        });
        this.media.addEventListener('load', function () {
          _this.updateAscii();
        });
        this.loadImage();
      }
    }
  }, {
    key: "deactivate",
    value: function deactivate() {
      this.el.classList.remove('is-active');
    }
  }, {
    key: "loadThumbnail",
    value: function loadThumbnail() {
      this.media.src = this.thumbnail.src;
    }
  }, {
    key: "loadImage",
    value: function loadImage() {
      var _this2 = this;

      var url = new URL(this.media.dataset.src);
      this.media.sizes = '100vw';
      this.media.srcset = "".concat(url.origin).concat(url.pathname, "?w=750&auto=format&q=90 750w, ").concat(url.origin).concat(url.pathname, "?w=1500&auto=formatq=90 1500w, ").concat(url.origin).concat(url.pathname, "?w=3000&auto=formatq=90 3000w");
      this.media.src = "".concat(url.origin).concat(url.pathname, "?auto=format");
      this.media.addEventListener('load', function () {
        _this2.media.classList.add('is-loaded');
      });
    }
  }, {
    key: "dimensions",
    get: function get() {
      var rulerRect = this.ruler.getBoundingClientRect();
      return {
        width: this.ascii ? Math.round(this.ascii.el.offsetWidth / rulerRect.width) : Math.round(this.el.querySelector('.Ascii').offsetWidth / rulerRect.width),
        height: this.ascii ? Math.round(this.ascii.el.offsetHeight / rulerRect.height) : Math.round(this.el.querySelector('.Ascii').offsetHeight / rulerRect.height)
      };
    }
  }, {
    key: "padding",
    get: function get() {
      return {
        paddingHeight: this.mediaPadding.paddingHeight - this.asciiPadding.paddingHeight,
        paddingWidth: this.mediaPadding.paddingWidth - this.asciiPadding.paddingWidth
      };
    }
  }, {
    key: "mediaPadding",
    get: function get() {
      return {
        paddingHeight: Math.round(this.media.offsetTop / this.ruler.offsetHeight),
        paddingWidth: Math.round(this.media.offsetLeft / this.ruler.offsetWidth)
      };
    }
  }, {
    key: "asciiPadding",
    get: function get() {
      return {
        paddingHeight: this.ascii ? Math.round(this.ascii.el.offsetTop / this.ruler.offsetHeight) : Math.round(this.el.querySelector('.Ascii').offsetTop / this.ruler.offsetHeight),
        paddingWidth: this.ascii ? Math.round(this.ascii.el.offsetLeft / this.ruler.offsetWidth) : Math.round(this.el.querySelector('.Ascii').offsetLeft / this.ruler.offsetWidth)
      };
    }
  }]);

  return Slide;
}();

exports.Slide = Slide;

},{"./ascii":2}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Slideshow = void 0;

var _slide = require("./slide");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Slideshow = /*#__PURE__*/function () {
  function Slideshow(el) {
    _classCallCheck(this, Slideshow);

    this.el = el;
    this.header = document.querySelector('.Header');
    this.toggle = this.header.querySelector('.Header-toggle');
    this.nav = this.header.querySelector('.Header-nav');
    this.navList = this.header.querySelector('.Header-navList');
    this.caption = this.header.querySelector('.Header-caption');
    this.prevButton = document.querySelector('.Slideshow-progressButton--prev');
    this.nextButton = document.querySelector('.Slideshow-progressButton--next');
    this.navItems = null;
    this.progress = 0;
    this.slides = null;
  }

  _createClass(Slideshow, [{
    key: "init",
    value: function init() {
      this.createSlides();
      this.slides.forEach(function (slide) {
        slide.createThumbnail();
      });
      this.populateNav();
      this.activeIndex = Math.floor(Math.random() * this.slides.length);
      this.addEventListeners();
    }
  }, {
    key: "populateNav",
    value: function populateNav() {
      var _this = this;

      this.navItems = this.slides.map(function (slide) {
        var navItem = document.createElement('li');
        navItem.classList.add('Header-navItem');

        _this.navList.append(navItem);

        return navItem;
      });
    }
  }, {
    key: "addEventListeners",
    value: function addEventListeners() {
      var _this2 = this;

      this.prevButton.addEventListener('click', function () {
        if (_this2.el.classList.contains('is-meta') || _this2.el.classList.contains('is-about')) {
          _this2.hideMeta();
        } else {
          _this2.activeIndex--;
        }
      });
      this.nextButton.addEventListener('click', function () {
        if (_this2.el.classList.contains('is-meta') || _this2.el.classList.contains('is-about')) {
          _this2.hideMeta();
        } else {
          _this2.activeIndex++;
        }
      });
      this.toggle.addEventListener('click', function () {
        _this2.toggleAbout();

        _this2.hideMeta();
      });
      this.navItems.forEach(function (navItem, i) {
        navItem.addEventListener('click', function () {
          _this2.toggleMeta();

          _this2.hideAbout();

          _this2.activeIndex = i;
        });
      });
      this.navItems.forEach(function (navItem, i) {
        navItem.addEventListener('mouseenter', function () {
          if (_this2.el.classList.contains('is-meta') || _this2.el.classList.contains('is-about')) {
            _this2.hintSlide(i);
          }
        });
      });
      this.navList.addEventListener('mouseleave', function () {
        console.log('leave');

        if (_this2.el.classList.contains('is-about')) {
          _this2.hideMeta();

          _this2.activeIndex = _this2.activeIndex;
          console.log('hide meta');
        } else {
          _this2.activeIndex = _this2.activeIndex;
          console.log(_this2.activeIndex);
        }
      });
      window.addEventListener('resize', function () {
        _this2.activeSlide.update();
      });
    }
  }, {
    key: "createSlides",
    value: function createSlides() {
      this.slides = _toConsumableArray(this.el.querySelectorAll('.Slide')).map(function (slide, i) {
        return new _slide.Slide(slide, i);
      });
    }
  }, {
    key: "hintSlide",
    value: function hintSlide(i) {
      this.el.classList.add('is-meta');
      this.slides.forEach(function (slide) {
        slide.deactivate();
      });
      this.navItems.forEach(function (navItem) {
        navItem.classList.remove('is-active');
      });
      this.slides[i].activate();
      this.navItems[i].classList.add('is-active');
      this.updateCaption(i);
    }
  }, {
    key: "updateCaption",
    value: function updateCaption(i) {
      if (this.slides[i].isAbout) {
        this.header.classList.add('is-about');
        this.showMeta();
        this.caption.innerHTML = this.slides[i].el.innerHTML;
      } else {
        this.header.classList.remove('is-about');
        this.caption.innerHTML = this.slides[i].caption;
      }
    }
  }, {
    key: "toggleAbout",
    value: function toggleAbout() {
      if (this.el.classList.contains('is-about')) {
        this.hideAbout();
      } else {
        this.showAbout();
      }
    }
  }, {
    key: "toggleMeta",
    value: function toggleMeta() {
      if (this.el.classList.contains('is-meta')) {
        this.hideMeta();
      } else {
        this.showMeta();
      }
    }
  }, {
    key: "showMeta",
    value: function showMeta() {
      this.el.classList.add('is-meta');
    }
  }, {
    key: "hideMeta",
    value: function hideMeta() {
      this.el.classList.remove('is-meta');
    }
  }, {
    key: "showAbout",
    value: function showAbout() {
      this.el.classList.add('is-about');
    }
  }, {
    key: "hideAbout",
    value: function hideAbout() {
      this.el.classList.remove('is-about');
    }
  }, {
    key: "activeSlide",
    get: function get() {
      return this.slides[this.activeIndex];
    }
  }, {
    key: "activeIndex",
    get: function get() {
      if (this.progress >= 0) {
        return Math.abs(this.progress % this.slides.length);
      } else {
        return this.slides.length + this.progress;
      }
    },
    set: function set(val) {
      this.slides.forEach(function (slide) {
        slide.deactivate();
      });
      this.navItems.forEach(function (navItem) {
        navItem.classList.remove('is-active');
      });
      this.header.style.color = null;
      this.progress = val;
      this.activeSlide.activate();
      this.activeNavItem.classList.add('is-active');
      this.header.style.color = this.activeSlide.el.dataset.textColor;
      this.updateCaption(this.activeIndex);
    }
  }, {
    key: "activeNavItem",
    get: function get() {
      return this.navItems[this.activeIndex];
    }
  }]);

  return Slideshow;
}();

exports.Slideshow = Slideshow;

},{"./slide":3}]},{},[1]);
