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
var BlurXFilter = (function (_super) {
    __extends(BlurXFilter, _super);
    function BlurXFilter(manager) {
        _super.call(this, manager);
        this._strength = 5;
        this._pass = 1;
        this._tempTarget = null;
    }
    Object.defineProperty(BlurXFilter.prototype, "strength", {
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
    Object.defineProperty(BlurXFilter.prototype, "pass", {
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
    BlurXFilter.prototype.process = function (renderer, input, output, clearOutput) {
        var _this = this;
        var t1 = input, t2 = this._tempTarget;
        var t;
        for (var i = 0; i < this.pass * 9; ++i) {
            RenderHelper_1.RenderHelper.renderBuffered(renderer, t1, t2, ShaderID_1.ShaderID.BLUR_X, true, function (renderer) {
                var shader = renderer.shaderManager.currentShader;
                shader.setStrength(_this.strength);
            });
            t = t1;
            t1 = t2;
            t2 = t;
        }
        renderer.copyRenderTargetContent(t1, output, clearOutput);
    };
    BlurXFilter.prototype.__initialize = function () {
        this._tempTarget = this._filterManager.renderer.createRenderTarget();
    };
    BlurXFilter.prototype.__dispose = function () {
        this._filterManager.renderer.releaseRenderTarget(this._tempTarget);
        this._tempTarget = null;
    };
    return BlurXFilter;
})(FilterBase_1.FilterBase);
exports.BlurXFilter = BlurXFilter;

//# sourceMappingURL=BlurXFilter.js.map
