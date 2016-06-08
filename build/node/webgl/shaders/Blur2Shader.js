/**
 * Created by MIC on 2015/12/22.
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
var Blur2Shader = (function (_super) {
    __extends(Blur2Shader, _super);
    function Blur2Shader(manager) {
        _super.call(this, manager, Blur2Shader.VERTEX_SOURCE, Blur2Shader.FRAGMENT_SOURCE);
    }
    Blur2Shader.prototype.setStrength = function (strength) {
        if (strength < 0) {
            strength = 1;
        }
        this._uniforms.get("uStrength").value = strength;
    };
    Blur2Shader.prototype.getStrength = function () {
        return this._uniforms.get("uStrength").value;
    };
    Blur2Shader.prototype.setResolution = function (resolution) {
        if (resolution < 0) {
            resolution = 1;
        }
        this._uniforms.get("uResolution").value = resolution;
    };
    Blur2Shader.prototype.setBlurDirection = function (direction) {
        this._uniforms.get("uBlurDirection").value = [direction[0], direction[1]];
    };
    Blur2Shader.prototype.__localInit = function (manager, uniforms, attributes) {
        _super.prototype.__localInit.call(this, manager, uniforms, attributes);
        var u;
        u = new UniformCache_1.UniformCache();
        u.name = "uStrength";
        u.type = WebGLDataType_1.WebGLDataType.U1F;
        u.value = 5;
        uniforms.set(u.name, u);
        u = new UniformCache_1.UniformCache();
        u.name = "uResolution";
        u.type = WebGLDataType_1.WebGLDataType.U1F;
        u.value = 1;
        uniforms.set(u.name, u);
        u = new UniformCache_1.UniformCache();
        u.name = "uBlurDirection";
        u.type = WebGLDataType_1.WebGLDataType.U2F;
        u.value = [1.0, 0.0];
        uniforms.set(u.name, u);
    };
    Blur2Shader.SHADER_CLASS_NAME = "Blur2Shader";
    Blur2Shader.FRAGMENT_SOURCE = FragmentShaders_1.FragmentShaders.blur2;
    Blur2Shader.VERTEX_SOURCE = VertexShaders_1.VertexShaders.blur2;
    return Blur2Shader;
}(BufferedShader_1.BufferedShader));
exports.Blur2Shader = Blur2Shader;

//# sourceMappingURL=Blur2Shader.js.map
