/**
 * Created by MIC on 2015/11/18.
 */
var GLUtil_1 = require("../../../lib/glantern-utils/src/GLUtil");
var NotImplementedError_1 = require("../../../lib/glantern-utils/src/NotImplementedError");
var ColorTransform = (function () {
    function ColorTransform(redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset) {
        if (redMultiplier === void 0) { redMultiplier = 1; }
        if (greenMultiplier === void 0) { greenMultiplier = 1; }
        if (blueMultiplier === void 0) { blueMultiplier = 1; }
        if (alphaMultiplier === void 0) { alphaMultiplier = 1; }
        if (redOffset === void 0) { redOffset = 0; }
        if (greenOffset === void 0) { greenOffset = 0; }
        if (blueOffset === void 0) { blueOffset = 0; }
        if (alphaOffset === void 0) { alphaOffset = 0; }
        this.color = 0;
        this._alphaMultiplier = 1;
        this._alphaOffset = 0;
        this._redMultiplier = 1;
        this._redOffset = 0;
        this._greenMultiplier = 1;
        this._greenOffset = 0;
        this._blueMultiplier = 1;
        this._blueOffset = 0;
        this.redMultiplier = redMultiplier;
        this.greenMultiplier = greenMultiplier;
        this.blueMultiplier = blueMultiplier;
        this.alphaMultiplier = alphaMultiplier;
        this.redOffset = redOffset;
        this.greenOffset = greenOffset;
        this.blueOffset = blueOffset;
        this.alphaOffset = alphaOffset;
    }
    Object.defineProperty(ColorTransform.prototype, "alphaMultiplier", {
        get: function () {
            return this._alphaMultiplier;
        },
        set: function (v) {
            this._alphaMultiplier = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorTransform.prototype, "alphaOffset", {
        get: function () {
            return this._alphaOffset;
        },
        set: function (v) {
            this._alphaOffset = GLUtil_1.GLUtil.limitInto(v, -1, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorTransform.prototype, "redMultiplier", {
        get: function () {
            return this._redMultiplier;
        },
        set: function (v) {
            this._redMultiplier = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorTransform.prototype, "redOffset", {
        get: function () {
            return this._redOffset;
        },
        set: function (v) {
            this._redOffset = GLUtil_1.GLUtil.limitInto(v, -1, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorTransform.prototype, "greenMultiplier", {
        get: function () {
            return this._greenMultiplier;
        },
        set: function (v) {
            this._greenMultiplier = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorTransform.prototype, "greenOffset", {
        get: function () {
            return this._greenOffset;
        },
        set: function (v) {
            this._greenOffset = GLUtil_1.GLUtil.limitInto(v, -1, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorTransform.prototype, "blueMultiplier", {
        get: function () {
            return this._blueMultiplier;
        },
        set: function (v) {
            this._blueMultiplier = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorTransform.prototype, "blueOffset", {
        get: function () {
            return this._blueOffset;
        },
        set: function (v) {
            this._blueOffset = GLUtil_1.GLUtil.limitInto(v, -1, 1);
        },
        enumerable: true,
        configurable: true
    });
    ColorTransform.prototype.concat = function (second) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    return ColorTransform;
})();
exports.ColorTransform = ColorTransform;

//# sourceMappingURL=ColorTransform.js.map
