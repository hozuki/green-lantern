/**
 * Created by MIC on 2015/11/18.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ColorTransformFilter_1 = require("./ColorTransformFilter");
var _util_1 = require("../../_util/_util");
var FilterBase_1 = require("../FilterBase");
var Blur2Filter_1 = require("./Blur2Filter");
var RenderHelper_1 = require("../RenderHelper");
var GlowFilter = (function (_super) {
    __extends(GlowFilter, _super);
    function GlowFilter(manager) {
        _super.call(this, manager);
        this._strengthX = 5;
        this._strengthY = 5;
        this._pass = 1;
        this._colorMatrix = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0
        ];
        /**
         * Use {@link BlurFilter} for better performance, or {@link Blur2Filter} for better quality.
         * @type {RenderTarget2D}
         * @private
         */
        this._blurFilter = null;
        this._colorTransformFilter = null;
        this._tempOriginalTarget = null;
        this._tempColorTransformedTarget = null;
    }
    Object.defineProperty(GlowFilter.prototype, "strengthX", {
        get: function () {
            return this._strengthX;
        },
        set: function (v) {
            if (v < 0) {
                v = 1;
            }
            this._strengthX = v;
            if (this._blurFilter !== null) {
                this._blurFilter.strengthX = v;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlowFilter.prototype, "strengthY", {
        get: function () {
            return this._strengthY;
        },
        set: function (v) {
            if (v < 0) {
                v = 1;
            }
            this._strengthY = v;
            if (this._blurFilter !== null) {
                this._blurFilter.strengthY = v;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlowFilter.prototype, "pass", {
        get: function () {
            return this._pass;
        },
        set: function (v) {
            v = _util_1._util.limitInto(v, 1, 3) | 0;
            this._pass = v;
            if (this._blurFilter !== null) {
                this._blurFilter.pass = v;
            }
        },
        enumerable: true,
        configurable: true
    });
    GlowFilter.prototype.setColorMatrix = function (r4c5) {
        if (this._colorTransformFilter !== null) {
            this._colorTransformFilter.setColorMatrix(r4c5);
        }
        this._colorMatrix = r4c5.slice();
    };
    GlowFilter.prototype.process = function (renderer, input, output, clearOutput) {
        //renderer.copyRenderTargetContent(input, this._tempOriginalTarget, true);
        RenderHelper_1.RenderHelper.copyTargetContent(renderer, input, this._tempOriginalTarget, false, false, true);
        this._colorTransformFilter.process(renderer, input, this._tempColorTransformedTarget, clearOutput);
        this._blurFilter.process(renderer, this._tempColorTransformedTarget, output, false);
        //renderer.copyRenderTargetContent(this._tempOriginalTarget, output, false);
        RenderHelper_1.RenderHelper.copyTargetContent(renderer, this._tempOriginalTarget, output, this.flipX, this.shouldFlipY(output), false);
    };
    GlowFilter.prototype.__initialize = function () {
        this._blurFilter = new Blur2Filter_1.Blur2Filter(this.filterManager);
        this._colorTransformFilter = new ColorTransformFilter_1.ColorTransformFilter(this.filterManager);
        this._blurFilter.initialize();
        this._colorTransformFilter.initialize();
        this._blurFilter.strengthX = this.strengthX;
        this._blurFilter.strengthY = this.strengthY;
        this._blurFilter.pass = this.pass;
        this._colorTransformFilter.setColorMatrix(this._colorMatrix);
        this._tempOriginalTarget = this.filterManager.renderer.createRenderTarget();
        this._tempColorTransformedTarget = this.filterManager.renderer.createRenderTarget();
    };
    GlowFilter.prototype.__dispose = function () {
        this._blurFilter.dispose();
        this._colorTransformFilter.dispose();
        this._blurFilter = this._colorTransformFilter = null;
        this.filterManager.renderer.releaseRenderTarget(this._tempOriginalTarget);
        this.filterManager.renderer.releaseRenderTarget(this._tempColorTransformedTarget);
        this._tempOriginalTarget = this._tempColorTransformedTarget = null;
    };
    return GlowFilter;
})(FilterBase_1.FilterBase);
exports.GlowFilter = GlowFilter;

//# sourceMappingURL=GlowFilter.js.map
