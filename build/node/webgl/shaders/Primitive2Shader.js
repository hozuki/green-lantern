/**
 * Created by MIC on 2015/11/18.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Matrix3D_1 = require("../../flash/geom/Matrix3D");
var UniformCache_1 = require("../UniformCache");
var VertexShaders_1 = require("../VertexShaders");
var FragmentShaders_1 = require("../FragmentShaders");
var ShaderBase_1 = require("../ShaderBase");
var WebGLDataType_1 = require("../WebGLDataType");
var Primitive2Shader = (function (_super) {
    __extends(Primitive2Shader, _super);
    function Primitive2Shader(manager) {
        _super.call(this, manager, Primitive2Shader.VERTEX_SOURCE, Primitive2Shader.FRAGMENT_SOURCE, null, null);
    }
    Primitive2Shader.prototype.setProjection = function (matrix) {
        this._uniforms.get("uProjectionMatrix").value = matrix.toArray();
    };
    Primitive2Shader.prototype.setTransform = function (matrix) {
        this._uniforms.get("uTransformMatrix").value = matrix.toArray();
    };
    Primitive2Shader.prototype.setAlpha = function (alpha) {
        this._uniforms.get("uAlpha").value = alpha;
    };
    Primitive2Shader.prototype.setFlipX = function (flip) {
        this._uniforms.get("uFlipX").value = flip;
    };
    Primitive2Shader.prototype.setFlipY = function (flip) {
        this._uniforms.get("uFlipY").value = flip;
    };
    Primitive2Shader.prototype.setOriginalSize = function (xy) {
        this._uniforms.get("uOriginalSize").value = xy.slice();
    };
    Primitive2Shader.prototype.__localInit = function (manager, uniforms, attributes) {
        _super.prototype.__localInit.call(this, manager, uniforms, attributes);
        var u;
        var transformMatrix = new Matrix3D_1.Matrix3D();
        var projectionMatrix = new Matrix3D_1.Matrix3D();
        var w = manager.renderer.view.width;
        var h = manager.renderer.view.height;
        projectionMatrix.setOrthographicProjection(0, w, h, 0, -1000, 1000);
        u = new UniformCache_1.UniformCache();
        u.name = "uProjectionMatrix";
        u.type = WebGLDataType_1.WebGLDataType.UMat4;
        u.value = projectionMatrix.toArray();
        u.transpose = false;
        uniforms.set(u.name, u);
        u = new UniformCache_1.UniformCache();
        u.name = "uTransformMatrix";
        u.type = WebGLDataType_1.WebGLDataType.UMat4;
        u.value = transformMatrix.toArray();
        u.transpose = false;
        uniforms.set(u.name, u);
        u = new UniformCache_1.UniformCache();
        u.name = "uAlpha";
        u.type = WebGLDataType_1.WebGLDataType.U1F;
        u.value = 1;
        uniforms.set(u.name, u);
        u = new UniformCache_1.UniformCache();
        u.name = "uFlipX";
        u.type = WebGLDataType_1.WebGLDataType.UBool;
        u.value = false;
        uniforms.set(u.name, u);
        u = new UniformCache_1.UniformCache();
        u.name = "uFlipY";
        u.type = WebGLDataType_1.WebGLDataType.UBool;
        u.value = false;
        uniforms.set(u.name, u);
        u = new UniformCache_1.UniformCache();
        u.name = "uOriginalSize";
        u.type = WebGLDataType_1.WebGLDataType.U2F;
        u.value = [0, 0];
        uniforms.set(u.name, u);
    };
    Primitive2Shader.SHADER_CLASS_NAME = "Primitive2Shader";
    Primitive2Shader.FRAGMENT_SOURCE = FragmentShaders_1.FragmentShaders.primitive;
    Primitive2Shader.VERTEX_SOURCE = VertexShaders_1.VertexShaders.primitive2;
    return Primitive2Shader;
})(ShaderBase_1.ShaderBase);
exports.Primitive2Shader = Primitive2Shader;

//# sourceMappingURL=Primitive2Shader.js.map
