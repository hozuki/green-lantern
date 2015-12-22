/**
 * Created by MIC on 2015/11/30.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Blur2Filter_1 = require("../../webgl/filters/Blur2Filter");
var BitmapFilterQuality_1 = require("./BitmapFilterQuality");
/**
 * Derive from {@link BlurFilter} for better performance, or {@link Blur2Filter} for better quality.
 */
var BlurFilter = (function (_super) {
    __extends(BlurFilter, _super);
    function BlurFilter(filterManager, blurX, blurY, quality) {
        if (blurX === void 0) { blurX = 4.0; }
        if (blurY === void 0) { blurY = 4.0; }
        if (quality === void 0) { quality = BitmapFilterQuality_1.BitmapFilterQuality.LOW; }
        _super.call(this, filterManager);
        this.blurX = blurX;
        this.blurY = blurY;
        this.quality = quality;
    }
    Object.defineProperty(BlurFilter.prototype, "blurX", {
        get: function () {
            return this.strengthX;
        },
        set: function (v) {
            this.strengthX = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlurFilter.prototype, "blurY", {
        get: function () {
            return this.strengthY;
        },
        set: function (v) {
            this.strengthY = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlurFilter.prototype, "quality", {
        get: function () {
            return this.pass;
        },
        set: function (v) {
            this.pass = v;
        },
        enumerable: true,
        configurable: true
    });
    BlurFilter.prototype.clone = function () {
        return new BlurFilter(this._filterManager, this.blurX, this.blurY, this.quality);
    };
    return BlurFilter;
})(Blur2Filter_1.Blur2Filter);
exports.BlurFilter = BlurFilter;

//# sourceMappingURL=BlurFilter.js.map
