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
var FxaaShader = (function (_super) {
    __extends(FxaaShader, _super);
    function FxaaShader(manager) {
        _super.call(this, manager, FxaaShader.VERTEX_SOURCE, FxaaShader.FRAGMENT_SOURCE);
    }
    FxaaShader.prototype.setResolutionXY = function (xy) {
        this._uniforms.get("uResolution").value = xy.slice();
    };
    FxaaShader.prototype.__localInit = function (manager, uniforms, attributes) {
        _super.prototype.__localInit.call(this, manager, uniforms, attributes);
        var u;
        u = new UniformCache_1.UniformCache();
        u.name = "uResolution";
        u.type = WebGLDataType_1.WebGLDataType.U2F;
        u.value = [1, 1];
        uniforms.set(u.name, u);
    };
    FxaaShader.SHADER_CLASS_NAME = "FxaaShader";
    FxaaShader.FRAGMENT_SOURCE = FragmentShaders_1.FragmentShaders.fxaa;
    FxaaShader.VERTEX_SOURCE = VertexShaders_1.VertexShaders.fxaa;
    return FxaaShader;
}(BufferedShader_1.BufferedShader));
exports.FxaaShader = FxaaShader;

//# sourceMappingURL=FxaaShader.js.map
