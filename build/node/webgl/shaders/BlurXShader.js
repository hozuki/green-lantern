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
var BlurXShader = (function (_super) {
    __extends(BlurXShader, _super);
    function BlurXShader(manager) {
        _super.call(this, manager, BlurXShader.VERTEX_SOURCE, BlurXShader.FRAGMENT_SOURCE);
    }
    BlurXShader.prototype.setStrength = function (strength) {
        if (strength < 0) {
            strength = 1;
        }
        this._uniforms.get("uStrength").value = strength;
    };
    BlurXShader.prototype.getStrength = function () {
        return this._uniforms.get("uStrength").value;
    };
    BlurXShader.prototype.__localInit = function (manager, uniforms, attributes) {
        _super.prototype.__localInit.call(this, manager, uniforms, attributes);
        var u;
        u = new UniformCache_1.UniformCache();
        u.name = "uStrength";
        u.type = WebGLDataType_1.WebGLDataType.U1F;
        u.value = 5;
        uniforms.set(u.name, u);
    };
    BlurXShader.SHADER_CLASS_NAME = "BlurXShader";
    BlurXShader.FRAGMENT_SOURCE = FragmentShaders_1.FragmentShaders.blur;
    BlurXShader.VERTEX_SOURCE = VertexShaders_1.VertexShaders.blurX;
    return BlurXShader;
})(BufferedShader_1.BufferedShader);
exports.BlurXShader = BlurXShader;

//# sourceMappingURL=BlurXShader.js.map
