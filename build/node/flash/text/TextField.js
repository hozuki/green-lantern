/**
 * Created by MIC on 2015/12/23.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var InteractiveObject_1 = require("../display/InteractiveObject");
var AntiAliasType_1 = require("./AntiAliasType");
var TextFieldAutoSize_1 = require("./TextFieldAutoSize");
var TextFormat_1 = require("./TextFormat");
var GridFitType_1 = require("./GridFitType");
var NotImplementedError_1 = require("../../_util/NotImplementedError");
var TextInteractionMode_1 = require("./TextInteractionMode");
var TextFieldType_1 = require("./TextFieldType");
var ShaderID_1 = require("../../webgl/ShaderID");
var RenderHelper_1 = require("../../webgl/RenderHelper");
var _util_1 = require("../../_util/_util");
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField(root, parent) {
        _super.call(this, root, parent);
        this.alwaysShowSelection = false;
        this.antiAliasType = AntiAliasType_1.AntiAliasType.NORMAL;
        this.autoSize = TextFieldAutoSize_1.TextFieldAutoSize.NONE;
        this.condenseWhite = false;
        this.displayAsPassword = false;
        this.embedFonts = false;
        this.gridFitType = GridFitType_1.GridFitType.PIXEL;
        this.htmlText = null;
        this.maxChars = 0;
        this.mouseWheelEnabled = true;
        this.multiline = true;
        this.restrict = null;
        this.scrollH = 0;
        this.scrollV = 1;
        this.selectable = true;
        this.sharpness = 0;
        this.styleSheet = null;
        /**
         * When set to true, outline color will not change when setting {@link textColor}, enabling drawing a
         * colorful outline. The default value is false.
         * Non-standard extension.
         * @type {Boolean}
         */
        this.customOutlineEnabled = false;
        this.textInteractionMode = TextInteractionMode_1.TextInteractionMode.NORMAL;
        this.type = TextFieldType_1.TextFieldType.DYNAMIC;
        this.useRichTextClipboard = false;
        this.wordWrap = false;
        this._textFormatChangedHandler = null;
        this._defaultTextFormat = null;
        this._isContentChanged = true;
        this._canvasTarget = null;
        this._canvas = null;
        this._context2D = null;
        this._text = null;
        this._background = false;
        this._backgroundColor = 0xffffff;
        this._border = false;
        this._borderColor = 0x000000;
        this._textColor = 0x000000;
        this._textOutlineColor = 0x000000;
        this._thickness = 0;
        if (root !== null) {
            this._canvasTarget = this.__createCanvasTarget(root.worldRenderer);
        }
        this._textFormatChangedHandler = this.__textFormatChanged.bind(this);
        this.defaultTextFormat = new TextFormat_1.TextFormat();
    }
    TextField.prototype.appendText = function (newText) {
        this.text += newText;
    };
    Object.defineProperty(TextField.prototype, "background", {
        get: function () {
            return this._background;
        },
        set: function (v) {
            var b = v !== this._background;
            if (b) {
                this._background = v;
                this._isContentChanged = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "backgroundColor", {
        get: function () {
            return this._backgroundColor;
        },
        set: function (v) {
            var b = v !== this._backgroundColor;
            if (b) {
                this._backgroundColor = v;
                this._isContentChanged = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "border", {
        get: function () {
            return this._border;
        },
        set: function (v) {
            var b = v !== this._border;
            if (b) {
                this._border = v;
                this._isContentChanged = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "borderColor", {
        get: function () {
            return this._borderColor;
        },
        set: function (v) {
            var b = v !== this._borderColor;
            if (b) {
                this._borderColor = v;
                this._isContentChanged = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "bottomScrollV", {
        get: function () {
            throw new NotImplementedError_1.NotImplementedError();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "caretIndex", {
        get: function () {
            throw new NotImplementedError_1.NotImplementedError();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "defaultTextFormat", {
        get: function () {
            return this._defaultTextFormat;
        },
        set: function (v) {
            if (this._defaultTextFormat !== null) {
                this._defaultTextFormat.removeEventListener(TextFormat_1.TextFormat.TEXT_FORMAT_CHANGE, this._textFormatChangedHandler);
            }
            this._defaultTextFormat = !_util_1._util.isUndefinedOrNull(v) ? v : new TextFormat_1.TextFormat();
            this._defaultTextFormat.addEventListener(TextFormat_1.TextFormat.TEXT_FORMAT_CHANGE, this._textFormatChangedHandler);
        },
        enumerable: true,
        configurable: true
    });
    TextField.prototype.getCharBoundaries = function () {
        throw new NotImplementedError_1.NotImplementedError();
    };
    TextField.prototype.getCharIndexAtPoint = function (x, y) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    TextField.prototype.getFirstCharInParagraph = function (charIndex) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    TextField.prototype.getImageReference = function (id) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    TextField.prototype.getLineIndexAtPoint = function (x, y) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    TextField.prototype.getLineIndexOfChar = function (charIndex) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    TextField.prototype.getLineLength = function (lineIndex) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    TextField.prototype.getLineMetrics = function (lineIndex) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    TextField.prototype.getLineOffset = function (lineIndex) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    TextField.prototype.getLineText = function (lineIndex) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    TextField.prototype.getParagraphLength = function (charIndex) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    TextField.prototype.getTextFormat = function (beginIndex, endIndex) {
        if (beginIndex === void 0) { beginIndex = -1; }
        if (endIndex === void 0) { endIndex = -1; }
        throw new NotImplementedError_1.NotImplementedError();
    };
    TextField.prototype.isFontCompatible = function (fontName, fontStyle) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    TextField.prototype.replaceSelectedText = function (value) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    TextField.prototype.replaceText = function (beginIndex, endIndex, newText) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    TextField.prototype.setSelection = function (beginIndex, endIndex) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    TextField.prototype.setTextFormat = function (format, beginIndex, endIndex) {
        if (beginIndex === void 0) { beginIndex = -1; }
        if (endIndex === void 0) { endIndex = -1; }
        throw new NotImplementedError_1.NotImplementedError();
    };
    Object.defineProperty(TextField.prototype, "length", {
        get: function () {
            return !_util_1._util.isUndefinedOrNull(this.text) ? this.text.length : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "maxScrollH", {
        get: function () {
            throw new NotImplementedError_1.NotImplementedError();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "maxScrollV", {
        get: function () {
            throw new NotImplementedError_1.NotImplementedError();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "numLines", {
        get: function () {
            throw new NotImplementedError_1.NotImplementedError();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "selectionBeginIndex", {
        get: function () {
            throw new NotImplementedError_1.NotImplementedError();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "selectionEndIndex", {
        get: function () {
            throw new NotImplementedError_1.NotImplementedError();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (v) {
            var b = this._text !== v;
            if (b) {
                this._text = v;
                this._isContentChanged = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "textColor", {
        get: function () {
            return this.defaultTextFormat.color;
        },
        set: function (v) {
            var b = this.defaultTextFormat.color !== v;
            this.defaultTextFormat.color = v;
            if (b && !this.customOutlineEnabled) {
                this.textOutlineColor = v;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "textOutlineColor", {
        /**
         * Non-standard extension.
         * @returns {Number}
         */
        get: function () {
            return this._textOutlineColor;
        },
        /**
         * Non-standard extension.
         * @param v {Number}
         */
        set: function (v) {
            var b = this._textOutlineColor !== v;
            if (b) {
                this._textOutlineColor = v;
                this._isContentChanged = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "textHeight", {
        get: function () {
            // TODO: This only works under single line circumstances.
            var height = this.defaultTextFormat.size * 1.5;
            if (this.thickness > 0) {
                height += this.thickness * 2;
            }
            return height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "textWidth", {
        get: function () {
            // TODO: This only works under single line circumstances.
            var metrics = this._context2D.measureText(this.text);
            var width = metrics.width;
            if (this.thickness > 0) {
                width += this.thickness * 2;
            }
            return width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "thickness", {
        get: function () {
            return this._thickness;
        },
        set: function (v) {
            var b = this._thickness !== v;
            if (b) {
                this._thickness = v;
                this._isContentChanged = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    TextField.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        // TODO: WARNING: HACK!
        var renderer = this.root.worldRenderer;
        renderer.releaseRenderTarget(this._canvasTarget);
        this._canvasTarget = null;
        this._canvas = null;
        this._context2D = null;
    };
    TextField.prototype.__update = function () {
        if (!this._isContentChanged) {
            return;
        }
        //var canvas = this._canvas;
        //var context = this._context2D;
        //context.font = this.__getStyleString();
        //var metrics:TextMetrics = context.measureText(this.text);
        //canvas.height = this.defaultTextFormat.size * 1.15;
        //canvas.width = metrics.width;
        this._canvasTarget.updateImageSize();
        this.__updateCanvasTextStyle(this._context2D);
        this.__drawTextElements(this._context2D);
        this._isContentChanged = false;
    };
    TextField.prototype.__render = function (renderer) {
        if (this.visible && this.alpha > 0 && this.text !== null && this.text.length > 0) {
            this._canvasTarget.updateImageContent();
            RenderHelper_1.RenderHelper.copyImageContent(renderer, this._canvasTarget, this._rawRenderTarget, false, false, this.transform.matrix3D, this.alpha, true);
        }
        else {
            this._rawRenderTarget.clear();
        }
    };
    TextField.prototype.__selectShader = function (shaderManager) {
        shaderManager.selectShader(ShaderID_1.ShaderID.COPY_IMAGE);
    };
    TextField.prototype.__createCanvasTarget = function (renderer) {
        if (this._canvas === null) {
            var canvas = window.document.createElement("canvas");
            canvas.width = renderer.view.width;
            canvas.height = renderer.view.height;
            this._canvas = canvas;
            this._context2D = canvas.getContext("2d");
        }
        return renderer.createRenderTarget(this._canvas);
    };
    TextField.prototype.__updateCanvasTextStyle = function (context2D) {
        var fontStyles = [];
        if (this.defaultTextFormat.bold) {
            fontStyles.push("bold");
        }
        if (this.defaultTextFormat.italic) {
            fontStyles.push("italic");
        }
        fontStyles.push(this.defaultTextFormat.size.toString() + "pt");
        fontStyles.push("\"" + this.defaultTextFormat.font + "\"");
        context2D.font = fontStyles.join(" ");
    };
    TextField.prototype.__drawTextElements = function (context2D) {
        var baseX = this.thickness;
        var baseY = this.thickness;
        var borderThickness = 1;
        context2D.clearRect(0, 0, this._canvas.width, this._canvas.height);
        if (this.background) {
            context2D.fillStyle = _util_1._util.colorToCssSharp(this.backgroundColor);
            context2D.fillRect(0, 0, this.textWidth + borderThickness * 2, this.textHeight + borderThickness * 2);
        }
        context2D.fillStyle = _util_1._util.colorToCssSharp(this.textColor);
        context2D.fillText(this.text, baseX + borderThickness, this.textHeight * 0.75 + borderThickness);
        if (this.thickness > 0) {
            context2D.lineWidth = this.thickness;
            context2D.strokeStyle = _util_1._util.colorToCssSharp(this.textOutlineColor);
            context2D.strokeText(this.text, baseX + borderThickness, this.textHeight * 0.75 + borderThickness);
        }
        if (this.border) {
            context2D.lineWidth = 1;
            context2D.strokeStyle = _util_1._util.colorToCssSharp(this.borderColor);
            context2D.strokeRect(borderThickness, borderThickness, this.textWidth + borderThickness * 2, this.textHeight + borderThickness * 2);
        }
    };
    TextField.prototype.__textFormatChanged = function () {
        this._isContentChanged = true;
    };
    return TextField;
})(InteractiveObject_1.InteractiveObject);
exports.TextField = TextField;

//# sourceMappingURL=TextField.js.map
