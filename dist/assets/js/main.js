(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _layout = require("./modules/layout");

var layout = new _layout.Layout();
layout.init();

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

},{"./modules/layout":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Ascii = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Ascii = /*#__PURE__*/function () {
  function Ascii(el) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Ascii);

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

  _createClass(Ascii, [{
    key: "init",
    value: function init() {
      if (this.options.invert && this.options.invert == 'true' || this.options.invert == true) this.options.steps = this.options.steps.reverse();
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.build(); // this.ref.remove();
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
      this.options.width = this.options.width ? this.options.width : Math.floor(this.ref.width / (this.ref.height / this.options.height));
      this.options.height = this.options.height ? this.options.height : Math.floor(this.ref.height / (this.ref.width / this.options.width));
      this.ratio = this.options.width / this.options.height;
      this.canvas.width = this.options.width;
      this.canvas.height = this.options.height;
      this.ctx.drawImage(this.ref, 0, 0, this.ref.width, Math.floor(this.ref.width / this.ratio), 0, 0, this.options.width, this.options.height);
      this.imgData = this.ctx.getImageData(0, 0, this.options.width, this.options.height).data;
      if (this.options.contrast) this.contrastImage();
    }
  }, {
    key: "contrastImage",
    value: function contrastImage() {
      var contrast = this.options.contrast / 100 + 1;
      var intercept = 128 * (1 - contrast);

      for (var i = 0; i < this.imgData.length; i += 4) {
        this.imgData[i] = this.imgData[i] * contrast + intercept;
        this.imgData[i + 1] = this.imgData[i + 1] * contrast + intercept;
        this.imgData[i + 2] = this.imgData[i + 2] * contrast + intercept;
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

        if (this.pixelData[i] == 1) {
          containerHTML += this.options.steps[this.options.steps.length - 1];
        } else {
          containerHTML += this.options.steps[Math.floor(this.pixelData[i] * this.options.steps.length / 1)];
        }
      }

      this.container.innerText = "".concat(containerHTML);
    }
  }, {
    key: "updateWidth",
    value: function updateWidth(width, frameHeight) {
      this.options.width = width;
      this.options.frameHeight = frameHeight;
      this.options.height = null;
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
exports.Caption = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Caption = /*#__PURE__*/function () {
  function Caption(el) {
    _classCallCheck(this, Caption);

    this.el = el;
    this.rect = this.el.getBoundingClientRect();
    this.entries = _toConsumableArray(document.querySelectorAll('.Entry'));
    this.activeEntryEl = null;
  }

  _createClass(Caption, [{
    key: "init",
    value: function init() {
      var _this = this;

      window.addEventListener('scroll', function () {
        _this.updateContent();
      });
      window.addEventListener('resize', function () {
        _this.updateRect();

        _this.updateContent();
      });
    }
  }, {
    key: "updateContent",
    value: function updateContent() {
      var _this2 = this;

      if (!this.el.classList.contains('is-hidden')) {
        this.entries.forEach(function (entry) {
          var entryRect = entry.getBoundingClientRect();

          if (entryRect.top < _this2.rect.top && entryRect.bottom > _this2.rect.bottom && _this2.activeEntry !== entry) {
            _this2.activeEntry = entry;
          }
        });
      }
    }
  }, {
    key: "updateRect",
    value: function updateRect() {
      this.rect = this.el.getBoundingClientRect();
    }
  }, {
    key: "activeEntry",
    set: function set(entry) {
      this.activeEntryEl = entry;
      this.el.textContent = entry.querySelector('.Entry-caption') ? entry.querySelector('.Entry-caption').textContent : '';
    },
    get: function get() {
      return this.activeEntryEl;
    }
  }]);

  return Caption;
}();

exports.Caption = Caption;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Layout = void 0;

var _margin = require("./margin");

var _lazyLoader = require("./lazy-loader");

var _caption = require("./caption");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Layout = /*#__PURE__*/function () {
  function Layout() {
    _classCallCheck(this, Layout);

    this.headerInfo = document.querySelector('.Header-info');
    this.footer = document.querySelector('.Footer');
    this.entries = document.querySelectorAll('.Entry');
    this.firstEntry = this.entries[0];
    this.lastEntry = this.entries[this.entries.length - 1];
    this.margin = new _margin.Margin(document.querySelector('.Margin'), {
      contrast: 100
    });
    this.caption = new _caption.Caption(document.querySelector('.Caption'));
    this.lazyLoader = new _lazyLoader.LazyLoader();
    this.scrollDelta = 0;
  }

  _createClass(Layout, [{
    key: "init",
    value: function init() {
      var _this = this;

      window.addEventListener('load', function () {
        _this.margin.init();

        _this.lazyLoader.init();

        _this.caption.init();

        _this.updateWidth();

        window.addEventListener('resize', function (e) {
          _this.update(e);
        });
        window.addEventListener('scroll', function (e) {
          _this.update(e);
        });
      });
    }
  }, {
    key: "update",
    value: function update(e) {
      if (e.type == 'resize') {
        this.updateWidth();
      } else if (e.type == 'scroll') {
        this.firstEntryPos = this.firstEntry.getBoundingClientRect().top;
        this.lastEntryPos = this.lastEntry.getBoundingClientRect().bottom;
        this.toggleHeader();
        this.toggleCaption();
      }
    }
  }, {
    key: "updateWidth",
    value: function updateWidth() {
      var width = Math.floor(this.margin.el.clientWidth / this.margin.unitWidth);
      this.headerInfo.style.width = "".concat(width * this.margin.unitWidth, "px");
      this.caption.el.style.width = "".concat(width * this.margin.unitWidth, "px");
      this.margin.update(this.scrollDelta);
    }
  }, {
    key: "toggleHeader",
    value: function toggleHeader() {
      if (this.firstEntryPos < 0 && !this.headerInfo.classList.contains('is-hidden')) {
        this.headerInfo.classList.add('is-hidden');
        this.margin.update(this.scrollDelta);
      } else if (this.firstEntryPos > 0 && this.headerInfo.classList.contains('is-hidden')) {
        this.headerInfo.classList.remove('is-hidden');
        this.margin.update(this.scrollDelta);
      }
    }
  }, {
    key: "toggleCaption",
    value: function toggleCaption() {
      if (this.firstEntryPos < window.innerHeight / 4 && this.lastEntryPos > window.innerHeight * (3 / 4) && this.caption.el.classList.contains('is-hidden')) {
        this.caption.el.classList.remove('is-hidden');
        this.scrollDelta = -1;
        this.margin.update(this.scrollDelta);
      } else if (this.lastEntryPos < window.innerHeight * (2 / 3) && !this.caption.el.classList.contains('is-hidden')) {
        this.caption.el.classList.add('is-hidden');
        this.footer.classList.remove('is-hidden');
      } else if (this.firstEntryPos > window.innerHeight / 4 && !this.caption.el.classList.contains('is-hidden')) {
        this.caption.el.classList.add('is-hidden');
        this.scrollDelta = 0;
        this.margin.update(this.scrollDelta);
      } else if (this.lastEntryPos > window.innerHeight * (2 / 3) && this.caption.el.classList.contains('is-hidden')) {
        this.caption.el.classList.remove('is-hidden');
        this.footer.classList.add('is-hidden');
      }
    }
  }]);

  return Layout;
}();

exports.Layout = Layout;

},{"./caption":3,"./lazy-loader":5,"./margin":6}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LazyLoader = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LazyLoader = /*#__PURE__*/function () {
  function LazyLoader() {
    _classCallCheck(this, LazyLoader);

    this.images = _toConsumableArray(document.querySelectorAll('.Entry-media--image'));
    this.options = {
      rootMargin: '200%',
      threshold: 0
    };
    this.preloadImageCount = 0;
  }

  _createClass(LazyLoader, [{
    key: "init",
    value: function init() {
      this.loadThumbnails();
    }
  }, {
    key: "loadThumbnails",
    value: function loadThumbnails() {
      var _this = this;

      this.images.forEach(function (image) {
        var url = new URL(image.dataset.src);
        image.src = "".concat(url.origin).concat(url.pathname, "?w=50&auto=format");
        image.addEventListener('load', function () {
          _this.preloadImageCount++;

          if (_this.preloadImageCount == _this.images.length) {
            _this.createObserver();
          }
        });
      });
    }
  }, {
    key: "createObserver",
    value: function createObserver() {
      var _this2 = this;

      this.observer = new IntersectionObserver(this.handleObservation.bind(this), this.options);
      this.images.forEach(function (image) {
        _this2.observer.observe(image);
      });
    }
  }, {
    key: "handleObservation",
    value: function handleObservation(entries, observer) {
      var _this3 = this;

      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);

          _this3.loadImage(entry.target);
        }
      });
    }
  }, {
    key: "loadImage",
    value: function loadImage(image) {
      var url = new URL(image.dataset.src);
      image.sizes = '100vw';
      image.srcset = "".concat(url.origin).concat(url.pathname, "?w=750&auto=format&q=90 750w, ").concat(url.origin).concat(url.pathname, "?w=1500&auto=formatq=90 1500w, ").concat(url.origin).concat(url.pathname, "?w=3000&auto=formatq=90 3000w");
      image.src = "".concat(url.origin).concat(url.pathname, "?auto=format");
      image.addEventListener('load', function () {
        image.classList.add('is-loaded');
      });
    }
  }]);

  return LazyLoader;
}();

exports.LazyLoader = LazyLoader;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Margin = void 0;

var _ascii = require("./ascii");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Margin = /*#__PURE__*/function () {
  function Margin(el) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Margin);

    this.el = el;
    this.asciiEl = this.el.querySelector('.Ascii');
    this.asciiRrefEl = this.el.querySelector('.Ascii-ref');
    this.ruler = document.querySelector('.Ruler');
    this.options = Object.assign({
      steps: ['·', ' ', ' ', '·'].reverse(),
      contrast: 0,
      invert: false
    }, options);
    this.unitWidth = null;
    this.unitHeight = null;
    this.ascii = null;
  }

  _createClass(Margin, [{
    key: "init",
    value: function init() {
      this.getUnitDimensions();
      this.buildAscii();
    }
  }, {
    key: "update",
    value: function update() {
      var delta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      this.updateAscii(delta);
    }
  }, {
    key: "buildAscii",
    value: function buildAscii() {
      console.log(this.el.clientHeight, this.unitHeight, this.height);
      var options = {
        steps: this.options.steps,
        contrast: this.options.contrast,
        invert: this.options.invert,
        width: this.width,
        height: this.height
      };
      this.ascii = new _ascii.Ascii(this.el.querySelector('.Ascii'), options);
      this.ascii.init();
    }
  }, {
    key: "updateAscii",
    value: function updateAscii() {
      var delta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      this.ascii.options.width = this.width;
      this.ascii.options.height = this.height + delta > 0 ? this.height + delta : 1;
      this.ascii.build();
    }
  }, {
    key: "getUnitDimensions",
    value: function getUnitDimensions() {
      var rect = this.ruler.getBoundingClientRect();
      this.unitWidth = rect.width;
      this.unitHeight = rect.height;
    }
  }, {
    key: "width",
    get: function get() {
      return Math.floor(this.asciiEl.clientWidth / this.unitWidth);
    }
  }, {
    key: "height",
    get: function get() {
      return Math.floor(this.el.clientHeight / this.unitHeight);
    }
  }]);

  return Margin;
}();

exports.Margin = Margin;

},{"./ascii":2}]},{},[1]);
