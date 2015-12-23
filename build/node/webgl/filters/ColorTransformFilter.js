/**
 * Created by MIC on 2015/11/18.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FilterBase_1 = require("../FilterBase");
var RenderHelper_1 = require("../RenderHelper");
var ShaderID_1 = require("../ShaderID");
var ColorTransformFilter = (function (_super) {
    __extends(ColorTransformFilter, _super);
    function ColorTransformFilter(manager) {
        _super.call(this, manager);
        this._colorMatrix = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0
        ];
    }
    ColorTransformFilter.prototype.setColorMatrix = function (r4c5) {
        this._colorMatrix = r4c5.slice();
    };
    ColorTransformFilter.prototype.process = function (renderer, input, output, clearOutput) {
        var _this = this;
        RenderHelper_1.RenderHelper.renderBuffered(renderer, input, output, ShaderID_1.ShaderID.COLOR_TRANSFORM, clearOutput, function (renderer) {
            var shader = renderer.shaderManager.currentShader;
            shader.setColorMatrix(_this._colorMatrix);
        });
    };
    return ColorTransformFilter;
})(FilterBase_1.FilterBase);
exports.ColorTransformFilter = ColorTransformFilter;

//# sourceMappingURL=ColorTransformFilter.js.map