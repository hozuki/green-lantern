/**
 * Created by MIC on 2015/12/23.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var os = require("os");
var TextFormatAlign_1 = require("./TextFormatAlign");
var EventDispatcher_1 = require("../events/EventDispatcher");
var FlashEvent_1 = require("../events/FlashEvent");
var GLUtil_1 = require("../../../../lib/glantern-utils/src/GLUtil");
var TextFormat = (function (_super) {
    __extends(TextFormat, _super);
    function TextFormat(font, size, color, bold, italic, underline, url, target, align, leftMargin, rightMargin, indent, leading) {
        if (font === void 0) { font = null; }
        if (size === void 0) { size = 12; }
        if (color === void 0) { color = 0x000000; }
        if (bold === void 0) { bold = false; }
        if (italic === void 0) { italic = false; }
        if (underline === void 0) { underline = false; }
        if (url === void 0) { url = null; }
        if (target === void 0) { target = null; }
        if (align === void 0) { align = TextFormatAlign_1.TextFormatAlign.LEFT; }
        if (leftMargin === void 0) { leftMargin = 0; }
        if (rightMargin === void 0) { rightMargin = 0; }
        if (indent === void 0) { indent = 0; }
        if (leading === void 0) { leading = 0; }
        _super.call(this);
        this._align = TextFormatAlign_1.TextFormatAlign.LEFT;
        this._blockIndent = 0;
        this._bold = false;
        this._bullet = false;
        this._color = 0x000000;
        this._font = null;
        this._indent = 0;
        this._italic = false;
        this._kerning = false;
        this._leading = 0;
        this._leftMargin = 0;
        this._letterSpacing = 0;
        this._rightMargin = 0;
        this._size = 12;
        this._tabStops = [];
        this._target = null;
        this._underline = false;
        this._url = null;
        if (font === null) {
            this.font = os.type().toLowerCase().indexOf("osx") >= 0 ? "Times" : "Times New Roman";
        }
        else {
            this.font = font;
        }
        this.size = size;
        this.color = color;
        this.bold = bold;
        this.italic = italic;
        this.underline = underline;
        this.url = url;
        this.target = target;
        this.align = align;
        this.leftMargin = leftMargin;
        this.rightMargin = rightMargin;
        this.indent = indent;
        this.leading = leading;
    }
    Object.defineProperty(TextFormat, "TEXT_FORMAT_CHANGE", {
        get: function () {
            return "textFormatChange";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextFormat.prototype, "align", {
        get: function () {
            return this._align;
        },
        set: function (v) {
            var b = this._align !== v;
            if (b) {
                this._align = v;
                this.__raiseChange();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextFormat.prototype, "blockIndent", {
        get: function () {
            return this._blockIndent;
        },
        set: function (v) {
            var b = this._blockIndent !== v;
            if (b) {
                this._blockIndent = v;
                this.__raiseChange();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextFormat.prototype, "bold", {
        get: function () {
            return this._bold;
        },
        set: function (v) {
            var b = this._bold !== v;
            if (b) {
                this._bold = v;
                this.__raiseChange();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextFormat.prototype, "bullet", {
        get: function () {
            return this._bullet;
        },
        set: function (v) {
            var b = this._bullet !== v;
            if (b) {
                this._bullet = v;
                this.__raiseChange();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextFormat.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (v) {
            var b = this._color !== v;
            if (b) {
                this._color = v;
                this.__raiseChange();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextFormat.prototype, "font", {
        get: function () {
            return this._font;
        },
        set: function (v) {
            var b = this._font !== v;
            if (b) {
                this._font = v;
                this.__raiseChange();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextFormat.prototype, "indent", {
        get: function () {
            return this._indent;
        },
        set: function (v) {
            var b = this._indent !== v;
            if (b) {
                this._indent = v;
                this.__raiseChange();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextFormat.prototype, "italic", {
        get: function () {
            return this._italic;
        },
        set: function (v) {
            var b = this._italic !== v;
            if (b) {
                this._italic = v;
                this.__raiseChange();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextFormat.prototype, "kerning", {
        get: function () {
            return this._kerning;
        },
        set: function (v) {
            var b = this._kerning !== v;
            if (b) {
                this._kerning = v;
                this.__raiseChange();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextFormat.prototype, "leading", {
        get: function () {
            return this._indent;
        },
        set: function (v) {
            var b = this._leading !== v;
            if (b) {
                this._leading = v;
                this.__raiseChange();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextFormat.prototype, "leftMargin", {
        get: function () {
            return this._leftMargin;
        },
        set: function (v) {
            var b = this._leftMargin !== v;
            if (b) {
                this._leftMargin = v;
                this.__raiseChange();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextFormat.prototype, "letterSpacing", {
        get: function () {
            return this._letterSpacing;
        },
        set: function (v) {
            var b = this._letterSpacing !== v;
            if (b) {
                this._letterSpacing = v;
                this.__raiseChange();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextFormat.prototype, "rightMargin", {
        get: function () {
            return this._rightMargin;
        },
        set: function (v) {
            var b = this._rightMargin !== v;
            if (b) {
                this._rightMargin = v;
                this.__raiseChange();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextFormat.prototype, "size", {
        get: function () {
            return this._size;
        },
        set: function (v) {
            var b = this._size !== v;
            if (b) {
                this._size = v;
                this.__raiseChange();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextFormat.prototype, "tabStops", {
        get: function () {
            return this._tabStops;
        },
        set: function (v) {
            if (GLUtil_1.GLUtil.isUndefinedOrNull(v)) {
                v = [];
            }
            var b = false;
            if (!b) {
                b = this._tabStops.length !== v.length;
            }
            if (!b) {
                for (var i = 0; i < v.length; ++i) {
                    if (this._tabStops[i] !== v[i]) {
                        b = true;
                        break;
                    }
                }
            }
            if (b) {
                this._tabStops = v.slice();
                this.__raiseChange();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextFormat.prototype, "target", {
        get: function () {
            return this._target;
        },
        set: function (v) {
            var b = this._target !== v;
            if (b) {
                this._target = v;
                this.__raiseChange();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextFormat.prototype, "underline", {
        get: function () {
            return this._underline;
        },
        set: function (v) {
            var b = this._underline !== v;
            if (b) {
                this._underline = v;
                this.__raiseChange();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextFormat.prototype, "url", {
        get: function () {
            return this._url;
        },
        set: function (v) {
            var b = this._url !== v;
            if (b) {
                this._url = v;
                this.__raiseChange();
            }
        },
        enumerable: true,
        configurable: true
    });
    TextFormat.prototype.__raiseChange = function () {
        var ev = FlashEvent_1.FlashEvent.create(TextFormat.TEXT_FORMAT_CHANGE);
        this.dispatchEvent(ev);
    };
    return TextFormat;
})(EventDispatcher_1.EventDispatcher);
exports.TextFormat = TextFormat;

//# sourceMappingURL=TextFormat.js.map
