/**
 * Created by MIC on 2015/12/23.
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
var Matrix3D_1 = require("../../flash/geom/Matrix3D");
var CopyImageShader = (function (_super) {
    __extends(CopyImageShader, _super);
    function CopyImageShader(manager) {
        _super.call(this, manager, CopyImageShader.VERTEX_SOURCE, CopyImageShader.FRAGMENT_SOURCE);
    }
    CopyImageShader.prototype.setFlipX = function (flip) {
        this._uniforms.get("uFlipX").value = flip;
    };
    CopyImageShader.prototype.setFlipY = function (flip) {
        this._uniforms.get("uFlipY").value = flip;
    };
    CopyImageShader.prototype.setOriginalSize = function (xy) {
        this._uniforms.get("uOriginalSize").value = xy.slice();
    };
    CopyImageShader.prototype.setFitSize = function (xy) {
        this._uniforms.get("uFitSize").value = xy.slice();
    };
    CopyImageShader.prototype.setAlpha = function (alpha) {
        this._uniforms.get("uAlpha").value = alpha;
    };
    CopyImageShader.prototype.setTransform = function (matrix) {
        this._uniforms.get("uTransformMatrix").value = matrix.toArray();
    };
    CopyImageShader.prototype.__localInit = function (manager, uniforms, attributes) {
        _super.prototype.__localInit.call(this, manager, uniforms, attributes);
        var u;
        var transformMatrix = new Matrix3D_1.Matrix3D();
        transformMatrix.identity();
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
        u = new UniformCache_1.UniformCache();
        u.name = "uFitSize";
        u.type = WebGLDataType_1.WebGLDataType.U2F;
        u.value = [0, 0];
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
    };
    CopyImageShader.SHADER_CLASS_NAME = "CopyImageShader";
    CopyImageShader.FRAGMENT_SOURCE = FragmentShaders_1.FragmentShaders.copyImage;
    CopyImageShader.VERTEX_SOURCE = VertexShaders_1.VertexShaders.copyImage;
    return CopyImageShader;
})(BufferedShader_1.BufferedShader);
exports.CopyImageShader = CopyImageShader;

//# sourceMappingURL=CopyImageShader.js.map
