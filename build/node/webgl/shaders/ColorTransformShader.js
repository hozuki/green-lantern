/**
 * Created by MIC on 2015/11/18.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var UniformCache_1 = require("../UniformCache");
var VertexShaders_1 = require("../VertexShaders");
var FragmentShaders_1 = require("../FragmentShaders");
var BufferedShader_1 = require("./BufferedShader");
var WebGLDataType_1 = require("../WebGLDataType");
var ColorTransformShader = (function (_super) {
    __extends(ColorTransformShader, _super);
    function ColorTransformShader(manager) {
        _super.call(this, manager, ColorTransformShader.VERTEX_SOURCE, ColorTransformShader.FRAGMENT_SOURCE);
    }
    ColorTransformShader.prototype.setColorMatrix = function (r4c5) {
        if (r4c5.length < 20) {
            console.warn("ColorTransformShader.setColorMatrix needs a 4x5 matrix.");
            return;
        }
        this._uniforms.get("uColorMatrix").value = r4c5.slice();
    };
    ColorTransformShader.prototype.__localInit = function (manager, uniforms, attributes) {
        _super.prototype.__localInit.call(this, manager, uniforms, attributes);
        var u;
        var defaultColorMatrix = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0
        ];
        u = new UniformCache_1.UniformCache();
        u.name = "uColorMatrix";
        u.type = WebGLDataType_1.WebGLDataType.U1FV;
        u.value = defaultColorMatrix;
        uniforms.set(u.name, u);
    };
    ColorTransformShader.SHADER_CLASS_NAME = "ColorTransformShader";
    ColorTransformShader.FRAGMENT_SOURCE = FragmentShaders_1.FragmentShaders.colorTransform;
    ColorTransformShader.VERTEX_SOURCE = VertexShaders_1.VertexShaders.buffered;
    return ColorTransformShader;
})(BufferedShader_1.BufferedShader);
exports.ColorTransformShader = ColorTransformShader;

//# sourceMappingURL=ColorTransformShader.js.map
