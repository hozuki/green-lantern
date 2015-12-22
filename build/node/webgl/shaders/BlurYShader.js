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
var BlurYShader = (function (_super) {
    __extends(BlurYShader, _super);
    function BlurYShader(manager) {
        _super.call(this, manager, BlurYShader.VERTEX_SOURCE, BlurYShader.FRAGMENT_SOURCE);
    }
    BlurYShader.prototype.setStrength = function (strength) {
        if (strength < 0) {
            strength = 1;
        }
        this._uniforms.get("uStrength").value = strength;
    };
    BlurYShader.prototype.getStrength = function () {
        return this._uniforms.get("uStrength").value;
    };
    BlurYShader.prototype.__localInit = function (manager, uniforms, attributes) {
        _super.prototype.__localInit.call(this, manager, uniforms, attributes);
        var u;
        u = new UniformCache_1.UniformCache();
        u.name = "uStrength";
        u.type = WebGLDataType_1.WebGLDataType.U1F;
        u.value = 5;
        uniforms.set(u.name, u);
    };
    BlurYShader.SHADER_CLASS_NAME = "BlurYShader";
    BlurYShader.FRAGMENT_SOURCE = FragmentShaders_1.FragmentShaders.blur;
    BlurYShader.VERTEX_SOURCE = VertexShaders_1.VertexShaders.blurY;
    return BlurYShader;
})(BufferedShader_1.BufferedShader);
exports.BlurYShader = BlurYShader;

//# sourceMappingURL=BlurYShader.js.map
