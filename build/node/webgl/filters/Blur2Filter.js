/**
 * Created by MIC on 2015/12/22.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _util_1 = require("../../_util/_util");
var FilterBase_1 = require("../FilterBase");
var RenderHelper_1 = require("../RenderHelper");
var ShaderID_1 = require("../ShaderID");
var Blur2Filter = (function (_super) {
    __extends(Blur2Filter, _super);
    function Blur2Filter(manager) {
        _super.call(this, manager);
        this._tempTarget = null;
        this._strengthX = 1;
        this._strengthY = 1;
        this._pass = 1;
        this._tempTarget = manager.renderer.createRenderTarget();
    }
    Object.defineProperty(Blur2Filter.prototype, "strengthX", {
        get: function () {
            return this._strengthX;
        },
        set: function (v) {
            if (v < 0) {
                v = 1;
            }
            this._strengthX = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Blur2Filter.prototype, "strengthY", {
        get: function () {
            return this._strengthY;
        },
        set: function (v) {
            if (v < 0) {
                v = 1;
            }
            this._strengthY = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Blur2Filter.prototype, "pass", {
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
    Blur2Filter.prototype.process = function (renderer, input, output, clearOutput) {
        var _this = this;
        var passCoeff = 9;
        // See http://rastergrid.com/blog/2010/09/efficient-gaussian-blur-with-linear-sampling/
        var t1 = input, t2 = this._tempTarget;
        var t;
        for (var i = 0; i < this.pass * passCoeff; ++i) {
            RenderHelper_1.RenderHelper.renderBuffered(renderer, t1, t2, ShaderID_1.ShaderID.BLUR2, true, function (renderer) {
                var shader = renderer.shaderManager.currentShader;
                shader.setStrength(_this.strengthX);
                shader.setResolution(input.fitWidth);
                shader.setBlurDirection([1.0, 0.0]);
            });
            t = t1;
            t1 = t2;
            t2 = t;
        }
        for (var i = 0; i < this.pass * passCoeff; ++i) {
            RenderHelper_1.RenderHelper.renderBuffered(renderer, t1, t2, ShaderID_1.ShaderID.BLUR2, true, function (renderer) {
                var shader = renderer.shaderManager.currentShader;
                shader.setStrength(_this.strengthY);
                shader.setResolution(input.fitHeight);
                shader.setBlurDirection([0.0, 1.0]);
            });
            t = t1;
            t1 = t2;
            t2 = t;
        }
        renderer.copyRenderTargetContent(t1, output, clearOutput);
    };
    Blur2Filter.prototype.__initialize = function () {
        this._tempTarget = this._filterManager.renderer.createRenderTarget();
    };
    Blur2Filter.prototype.__dispose = function () {
        this._filterManager.renderer.releaseRenderTarget(this._tempTarget);
        this._tempTarget = null;
    };
    return Blur2Filter;
})(FilterBase_1.FilterBase);
exports.Blur2Filter = Blur2Filter;

//# sourceMappingURL=Blur2Filter.js.map
