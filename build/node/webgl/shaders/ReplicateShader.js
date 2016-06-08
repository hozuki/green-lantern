/**
 * Created by MIC on 2015/11/18.
 */
"use strict";
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
var ReplicateShader = (function (_super) {
    __extends(ReplicateShader, _super);
    function ReplicateShader(manager) {
        _super.call(this, manager, ReplicateShader.VERTEX_SOURCE, ReplicateShader.FRAGMENT_SOURCE);
    }
    ReplicateShader.prototype.setFlipX = function (flip) {
        this._uniforms.get("uFlipX").value = flip;
    };
    ReplicateShader.prototype.setFlipY = function (flip) {
        this._uniforms.get("uFlipY").value = flip;
    };
    ReplicateShader.prototype.setOriginalSize = function (xy) {
        this._uniforms.get("uOriginalSize").value = xy.slice();
    };
    ReplicateShader.prototype.setFitSize = function (xy) {
        this._uniforms.get("uFitSize").value = xy.slice();
    };
    ReplicateShader.prototype.__localInit = function (manager, uniforms, attributes) {
        _super.prototype.__localInit.call(this, manager, uniforms, attributes);
        var u;
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
    };
    ReplicateShader.SHADER_CLASS_NAME = "ReplicateShader";
    ReplicateShader.FRAGMENT_SOURCE = FragmentShaders_1.FragmentShaders.buffered;
    ReplicateShader.VERTEX_SOURCE = VertexShaders_1.VertexShaders.replicate;
    return ReplicateShader;
}(BufferedShader_1.BufferedShader));
exports.ReplicateShader = ReplicateShader;

//# sourceMappingURL=ReplicateShader.js.map
