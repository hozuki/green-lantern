/**
 * Created by MIC on 2015/11/18.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _util_1 = require("../../_util/_util");
var FilterBase_1 = require("../FilterBase");
var ShaderID_1 = require("../ShaderID");
var RenderHelper_1 = require("../RenderHelper");
var BlurYFilter = (function (_super) {
    __extends(BlurYFilter, _super);
    function BlurYFilter(manager) {
        _super.call(this, manager);
        this._strength = 5;
        this._pass = 1;
        this._tempTarget = null;
    }
    Object.defineProperty(BlurYFilter.prototype, "strength", {
        get: function () {
            return this._strength;
        },
        set: function (v) {
            if (v < 0) {
                v = 1;
            }
            this._strength = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BlurYFilter.prototype, "pass", {
        get: function () {
            return this._pass;
        },
        set: function (v) {
            v = _util_1._util.limitInto(v, 1, 3) | 0;
            this._pass = v;
        },
        enumerable: true,
        configurable: true
    });
    BlurYFilter.prototype.process = function (renderer, input, output, clearOutput) {
        var _this = this;
        // Larger value makes image smoother, darker (or less contrastive), but greatly improves efficiency.
        var passCoeff = 3;
        var t1 = input, t2 = this._tempTarget;
        t2.clear();
        var t;
        for (var i = 0; i < passCoeff * this.pass; ++i) {
            RenderHelper_1.RenderHelper.renderBuffered(renderer, t1, t2, ShaderID_1.ShaderID.BLUR_Y, true, function (renderer) {
                var shader = renderer.shaderManager.currentShader;
                shader.setStrength(_this.strength / 4 / _this.pass / (t1.fitWidth / t1.originalWidth));
            });
            t = t1;
            t1 = t2;
            t2 = t;
        }
        //renderer.copyRenderTargetContent(t1, output, clearOutput);
        RenderHelper_1.RenderHelper.copyTargetContent(renderer, t1, output, this.flipX, this.shouldFlipY(output), clearOutput);
    };
    BlurYFilter.prototype.__initialize = function () {
        this._tempTarget = this.filterManager.renderer.createRenderTarget();
    };
    BlurYFilter.prototype.__dispose = function () {
        this.filterManager.renderer.releaseRenderTarget(this._tempTarget);
        this._tempTarget = null;
    };
    return BlurYFilter;
})(FilterBase_1.FilterBase);
exports.BlurYFilter = BlurYFilter;

//# sourceMappingURL=BlurYFilter.js.map
