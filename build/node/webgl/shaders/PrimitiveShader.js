/**
 * Created by MIC on 2015/11/18.
 */
"use strict";
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
var PrimitiveShader = (function (_super) {
    __extends(PrimitiveShader, _super);
    function PrimitiveShader(manager) {
        _super.call(this, manager, PrimitiveShader.VERTEX_SOURCE, PrimitiveShader.FRAGMENT_SOURCE, null, null);
    }
    PrimitiveShader.prototype.setProjection = function (matrix) {
        this._uniforms.get("uProjectionMatrix").value = matrix.toArray();
    };
    PrimitiveShader.prototype.setTransform = function (matrix) {
        this._uniforms.get("uTransformMatrix").value = matrix.toArray();
    };
    PrimitiveShader.prototype.setAlpha = function (alpha) {
        this._uniforms.get("uAlpha").value = alpha;
    };
    PrimitiveShader.prototype.__localInit = function (manager, uniforms, attributes) {
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
    };
    PrimitiveShader.SHADER_CLASS_NAME = "PrimitiveShader";
    PrimitiveShader.FRAGMENT_SOURCE = FragmentShaders_1.FragmentShaders.primitive;
    PrimitiveShader.VERTEX_SOURCE = VertexShaders_1.VertexShaders.primitive;
    return PrimitiveShader;
}(ShaderBase_1.ShaderBase));
exports.PrimitiveShader = PrimitiveShader;

//# sourceMappingURL=PrimitiveShader.js.map
