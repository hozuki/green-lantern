/**
 * Created by MIC on 2015/11/17.
 */
var PrimitiveShader_1 = require("./shaders/PrimitiveShader");
var BlurXShader_1 = require("./shaders/BlurXShader");
var BlurYShader_1 = require("./shaders/BlurYShader");
var ReplicateShader_1 = require("./shaders/ReplicateShader");
var ColorTransformShader_1 = require("./shaders/ColorTransformShader");
var FxaaShader_1 = require("./shaders/FxaaShader");
var Blur2Shader_1 = require("./shaders/Blur2Shader");
var CopyImageShader_1 = require("./shaders/CopyImageShader");
var Primitive2Shader_1 = require("./shaders/Primitive2Shader");
var ShaderManager = (function () {
    function ShaderManager(renderer) {
        this._renderer = null;
        this._shaders = null;
        this._currentShader = null;
        this._renderer = renderer;
        this._shaders = [];
        this.__insertShaders();
    }
    ShaderManager.prototype.dispose = function () {
        for (var i = 0; i < this._shaders.length; ++i) {
            this._shaders[i].dispose();
        }
        this._currentShader = null;
        this._renderer = null;
        this._shaders = null;
    };
    ShaderManager.prototype.getNextAvailableID = function () {
        return this._shaders.length;
    };
    ShaderManager.prototype.loadShader = function (shaderName, uniforms, attributes) {
        var returnID = -1;
        try {
            var SHADER_CLASS = require("./shaders/" + shaderName + "Shader");
            var shaderClassName = SHADER_CLASS.SHADER_CLASS_NAME;
            var shader = null;
            shader = new SHADER_CLASS(this, SHADER_CLASS.VERTEX_SOURCE, SHADER_CLASS.FRAGMENT_SOURCE, uniforms, attributes);
            this._shaders.push(shader);
            returnID = shader.id;
        }
        catch (e) {
        }
        return returnID;
    };
    ShaderManager.prototype.selectShader = function (id) {
        var shader = this.__getShader(id);
        if (shader !== null) {
            shader.select();
            this._currentShader = shader;
        }
    };
    Object.defineProperty(ShaderManager.prototype, "currentShader", {
        get: function () {
            return this._currentShader;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderManager.prototype, "context", {
        get: function () {
            return this._renderer.context;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderManager.prototype, "renderer", {
        get: function () {
            return this._renderer;
        },
        enumerable: true,
        configurable: true
    });
    ShaderManager.prototype.__getShader = function (id) {
        var shader = null;
        try {
            shader = this._shaders[id];
        }
        catch (e) {
        }
        return shader;
    };
    ShaderManager.prototype.__insertShaders = function () {
        var shaderList = this._shaders;
        shaderList.push(new PrimitiveShader_1.PrimitiveShader(this));
        shaderList.push(new BlurXShader_1.BlurXShader(this));
        shaderList.push(new BlurYShader_1.BlurYShader(this));
        shaderList.push(new ReplicateShader_1.ReplicateShader(this));
        shaderList.push(new ColorTransformShader_1.ColorTransformShader(this));
        shaderList.push(new FxaaShader_1.FxaaShader(this));
        shaderList.push(new Blur2Shader_1.Blur2Shader(this));
        shaderList.push(new CopyImageShader_1.CopyImageShader(this));
        shaderList.push(new Primitive2Shader_1.Primitive2Shader(this));
    };
    return ShaderManager;
})();
exports.ShaderManager = ShaderManager;

//# sourceMappingURL=ShaderManager.js.map
