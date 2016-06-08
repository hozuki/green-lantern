/**
 * Created by MIC on 2015/11/30.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GlowFilter_1 = require("../../webgl/filters/GlowFilter");
var BitmapFilterQuality_1 = require("./BitmapFilterQuality");
var GLUtil_1 = require("../../GLUtil");
var GlowFilter = (function (_super) {
    __extends(GlowFilter, _super);
    function GlowFilter(filterManager, color, alpha, blurX, blurY, strength, quality, inner, knockout) {
        if (color === void 0) { color = 0xff0000; }
        if (alpha === void 0) { alpha = 1.0; }
        if (blurX === void 0) { blurX = 6.0; }
        if (blurY === void 0) { blurY = 6.0; }
        if (strength === void 0) { strength = 2; }
        if (quality === void 0) { quality = BitmapFilterQuality_1.BitmapFilterQuality.LOW; }
        if (inner === void 0) { inner = false; }
        if (knockout === void 0) { knockout = false; }
        _super.call(this, filterManager);
        this.inner = false;
        this.knockout = false;
        this.strength = 2;
        this._color = 0x000000;
        this._alpha = 1;
        this.color = color;
        this.alpha = GLUtil_1.GLUtil.limitInto(alpha, 0, 1);
        this.blurX = blurX;
        this.blurY = blurY;
        this.strength = strength;
        this.quality = quality;
        this.inner = inner;
        this.knockout = knockout;
    }
    Object.defineProperty(GlowFilter.prototype, "alpha", {
        get: function () {
            return this._alpha;
        },
        set: function (v) {
            var b = v !== this.alpha;
            this._alpha = v;
            if (b) {
                this.__updateColorMatrix();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlowFilter.prototype, "blurX", {
        get: function () {
            return this.strengthX;
        },
        set: function (v) {
            this.strengthX = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlowFilter.prototype, "blurY", {
        get: function () {
            return this.strengthY;
        },
        set: function (v) {
            this.strengthY = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlowFilter.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (v) {
            v |= 0;
            var b = v !== this._color;
            this._color = v;
            if (b) {
                this.__updateColorMatrix();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlowFilter.prototype, "quality", {
        get: function () {
            return this.pass;
        },
        set: function (v) {
            this.pass = v;
        },
        enumerable: true,
        configurable: true
    });
    GlowFilter.prototype.clone = function () {
        return new GlowFilter(this.filterManager, this.color, this.alpha, this.blurX, this.blurY, this.strength, this.quality, this.inner, this.knockout);
    };
    GlowFilter.prototype.__updateColorMatrix = function () {
        var r = ((this._color >>> 16) & 0xff) / 0xff;
        var g = ((this._color >>> 8) & 0xff) / 0xff;
        var b = (this._color & 0xff) / 0xff;
        var a = this._alpha;
        var cm = [
            0, 0, 0, r, 0,
            0, 0, 0, g, 0,
            0, 0, 0, b, 0,
            0, 0, 0, a, 0
        ];
        this.setColorMatrix(cm);
    };
    return GlowFilter;
}(GlowFilter_1.GlowFilter));
exports.GlowFilter = GlowFilter;

//# sourceMappingURL=GlowFilter.js.map
