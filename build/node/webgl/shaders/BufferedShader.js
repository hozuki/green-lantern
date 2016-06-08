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
var BufferedShader = (function (_super) {
    __extends(BufferedShader, _super);
    function BufferedShader(manager, vertexSource, fragmentSource) {
        _super.call(this, manager, vertexSource, fragmentSource, null, null);
    }
    BufferedShader.prototype.setTexture = function (texture) {
        // Must contains a "uSampler" uniform.
        this._uniforms.get("uSampler").texture = texture;
    };
    BufferedShader.prototype.__localInit = function (manager, uniforms, attributes) {
        _super.prototype.__localInit.call(this, manager, uniforms, attributes);
        var u;
        var projectionMatrix = new Matrix3D_1.Matrix3D();
        var w = manager.renderer.view.width;
        var h = manager.renderer.view.height;
        projectionMatrix.setOrthographicProjection(0, w, h, 0, -1000, 1000);
        u = new UniformCache_1.UniformCache();
        u.name = "uSampler";
        u.type = WebGLDataType_1.WebGLDataType.USampler2D;
        u.value = 0;
        u.texture = null;
        uniforms.set(u.name, u);
        u = new UniformCache_1.UniformCache();
        u.name = "uProjectionMatrix";
        u.type = WebGLDataType_1.WebGLDataType.UMat4;
        u.value = projectionMatrix.toArray();
        u.transpose = false;
        uniforms.set(u.name, u);
    };
    BufferedShader.SHADER_CLASS_NAME = "BufferedShader";
    BufferedShader.FRAGMENT_SOURCE = FragmentShaders_1.FragmentShaders.buffered;
    BufferedShader.VERTEX_SOURCE = VertexShaders_1.VertexShaders.buffered;
    return BufferedShader;
}(ShaderBase_1.ShaderBase));
exports.BufferedShader = BufferedShader;

//# sourceMappingURL=BufferedShader.js.map
