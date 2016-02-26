/**
 * Created by MIC on 2015/11/18.
 */
var VertexShaders_1 = require("./VertexShaders");
var FragmentShaders_1 = require("./FragmentShaders");
var WebGLDataType_1 = require("./WebGLDataType");
var GLUtil_1 = require("../../lib/glantern-utils/src/GLUtil");
var gl = this.WebGLRenderingContext || window.WebGLRenderingContext;
var ShaderBase = (function () {
    function ShaderBase(manager, vertexSource, fragmentSource, uniforms, attributes) {
        this._shaderManager = null;
        this._vertexSource = null;
        this._fragmentSource = null;
        this._vertexShader = null;
        this._fragmentShader = null;
        this._program = null;
        this._uniforms = null;
        this._attributes = null;
        this._id = -1;
        this._glc = null;
        this._shaderManager = manager;
        this._vertexSource = vertexSource;
        this._fragmentSource = fragmentSource;
        this._id = manager.getNextAvailableID();
        this.__initialize(manager.context, vertexSource, fragmentSource);
        this.select();
        if (GLUtil_1.GLUtil.isUndefinedOrNull(uniforms) || GLUtil_1.GLUtil.isUndefinedOrNull(attributes)) {
            this._uniforms = new Map();
            this._attributes = new Map();
            this.__localInit(manager, this._uniforms, this._attributes);
        }
        else {
            this._uniforms = uniforms;
            this._attributes = attributes;
        }
        this.__cacheUniformLocations();
        this.__cacheAttributeLocations();
        this.syncUniforms();
    }
    Object.defineProperty(ShaderBase.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    ShaderBase.prototype.dispose = function () {
        var glc = this._glc;
        glc.deleteProgram(this._program);
        glc.deleteShader(this._vertexShader);
        glc.deleteShader(this._fragmentShader);
        this._glc = null;
        this._uniforms = null;
        this._attributes = null;
        this._vertexShader = null;
        this._fragmentShader = null;
        this._vertexSource = null;
        this._fragmentSource = null;
        this._shaderManager = null;
    };
    ShaderBase.prototype.syncUniforms = function () {
        var _this = this;
        this._uniforms.forEach(function (v) {
            _this.__syncUniform(v);
        });
    };
    ShaderBase.prototype.changeValue = function (name, callback) {
        var uniform = this._uniforms.get(name);
        if (uniform !== undefined && uniform !== null) {
            callback(uniform);
        }
    };
    ShaderBase.prototype.select = function () {
        this._glc.useProgram(this._program);
    };
    ShaderBase.prototype.getUniformLocation = function (name) {
        return this._program !== null ? this._glc.getUniformLocation(this._program, name) : null;
    };
    ShaderBase.prototype.getAttributeLocation = function (name) {
        return this._program !== null ? this._glc.getAttribLocation(this._program, name) : -1;
    };
    Object.defineProperty(ShaderBase.prototype, "vertexSource", {
        get: function () {
            return this._vertexSource;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderBase.prototype, "fragmentSource", {
        get: function () {
            return this._fragmentSource;
        },
        enumerable: true,
        configurable: true
    });
    ShaderBase.prototype.__initialize = function (glc, vertexSource, fragmentSource) {
        this._glc = glc;
        function error(message, extra) {
            if (this._vertexShader !== null) {
                glc.deleteShader(this._vertexShader);
            }
            if (this._fragmentShader !== null) {
                glc.deleteShader(this._fragmentShader);
            }
            if (this._program !== null) {
                glc.deleteProgram(this._program);
            }
            this._vertexShader = this._fragmentShader = this._program = null;
            if (message !== undefined && message !== null) {
                if (extra !== undefined) {
                    console.warn(message, extra);
                }
                else {
                    console.warn(message);
                }
            }
        }
        this._vertexShader = createShaderFromSource(glc, vertexSource, gl.VERTEX_SHADER);
        this._fragmentShader = createShaderFromSource(glc, fragmentSource, gl.FRAGMENT_SHADER);
        if (this._vertexShader === null || this._fragmentShader === null) {
            return error("Vertex shader or fragment shader is null.");
        }
        this._program = glc.createProgram();
        if (this._program === null) {
            return error("Failed to create program.");
        }
        glc.attachShader(this._program, this._vertexShader);
        glc.attachShader(this._program, this._fragmentShader);
        glc.linkProgram(this._program);
        var isLinked = glc.getProgramParameter(this._program, gl.LINK_STATUS);
        if (!isLinked) {
            var errorLog = glc.getProgramInfoLog(this._program);
            return error("Failed to link program: ", errorLog);
        }
    };
    ShaderBase.prototype.__syncUniform = function (uniform) {
        var location = uniform.location;
        var value = uniform.value;
        var glc = this._glc;
        /**
         * @type {Number}
         */
        var i = 0;
        /**
         * @type {Number}
         */
        var il = 0;
        switch (uniform.type) {
            case WebGLDataType_1.WebGLDataType.UBool:
                glc.uniform1i(location, value ? 1 : 0);
                break;
            case WebGLDataType_1.WebGLDataType.U1I:
                glc.uniform1i(location, value);
                break;
            case WebGLDataType_1.WebGLDataType.U1F:
                glc.uniform1f(location, value);
                break;
            case WebGLDataType_1.WebGLDataType.U2F:
                glc.uniform2f(location, value[0], value[1]);
                break;
            case WebGLDataType_1.WebGLDataType.U3F:
                glc.uniform3f(location, value[0], value[1], value[2]);
                break;
            case WebGLDataType_1.WebGLDataType.U4F:
                glc.uniform4f(location, value[0], value[1], value[2], value[3]);
                break;
            case WebGLDataType_1.WebGLDataType.UV2:
                glc.uniform2f(location, value.x, value.y);
                break;
            case WebGLDataType_1.WebGLDataType.UV3:
                glc.uniform3f(location, value.x, value.y, value.z);
                break;
            case WebGLDataType_1.WebGLDataType.UV4:
                glc.uniform4f(location, value.x, value.y, value.z, value.w);
                break;
            case WebGLDataType_1.WebGLDataType.U1IV:
                glc.uniform1iv(location, value);
                break;
            case WebGLDataType_1.WebGLDataType.U2IV:
                glc.uniform2iv(location, value);
                break;
            case WebGLDataType_1.WebGLDataType.U3IV:
                glc.uniform3iv(location, value);
                break;
            case WebGLDataType_1.WebGLDataType.U4IV:
                glc.uniform4iv(location, value);
                break;
            case WebGLDataType_1.WebGLDataType.U1FV:
                glc.uniform1fv(location, value);
                break;
            case WebGLDataType_1.WebGLDataType.U2FV:
                glc.uniform2fv(location, value);
                break;
            case WebGLDataType_1.WebGLDataType.U3FV:
                glc.uniform3fv(location, value);
                break;
            case WebGLDataType_1.WebGLDataType.U4FV:
                glc.uniform4fv(location, value);
                break;
            case WebGLDataType_1.WebGLDataType.UMat2:
                glc.uniformMatrix2fv(location, uniform.transpose, value);
                break;
            case WebGLDataType_1.WebGLDataType.UMat3:
                glc.uniformMatrix3fv(location, uniform.transpose, value);
                break;
            case WebGLDataType_1.WebGLDataType.UMat4:
                glc.uniformMatrix4fv(location, uniform.transpose, value);
                break;
            case WebGLDataType_1.WebGLDataType.UIV:
                glc.uniform3iv(location, value);
                break;
            case WebGLDataType_1.WebGLDataType.UFV:
                glc.uniform3fv(location, value);
                break;
            case WebGLDataType_1.WebGLDataType.UV2V:
                if (!uniform.array) {
                    uniform.array = new Float32Array(2 * value.length);
                }
                for (i = 0, il = value.length; i < il; i++) {
                    uniform.array[i * 2] = value[i].x;
                    uniform.array[i * 2 + 1] = value[i].y;
                }
                glc.uniform2fv(location, uniform.array);
                break;
            case WebGLDataType_1.WebGLDataType.UV3V:
                if (!uniform.array) {
                    uniform.array = new Float32Array(3 * value.length);
                }
                for (i = 0, il = value.length; i < il; i++) {
                    uniform.array[i * 3] = value[i].x;
                    uniform.array[i * 3 + 1] = value[i].y;
                    uniform.array[i * 3 + 2] = value[i].z;
                }
                glc.uniform2fv(location, uniform.array);
                break;
            case WebGLDataType_1.WebGLDataType.UV4V:
                if (!uniform.array) {
                    uniform.array = new Float32Array(4 * value.length);
                }
                for (i = 0, il = value.length; i < il; i++) {
                    uniform.array[i * 4] = value[i].x;
                    uniform.array[i * 4 + 1] = value[i].y;
                    uniform.array[i * 4 + 2] = value[i].z;
                    uniform.array[i * 4 + 3] = value[i].w;
                }
                glc.uniform2fv(location, uniform.array);
                break;
            case WebGLDataType_1.WebGLDataType.USampler2D:
                glc.activeTexture(gl["TEXTURE" + value.toString()]);
                glc.bindTexture(gl.TEXTURE_2D, uniform.texture);
                glc.uniform1i(location, value);
                break;
            default:
                console.warn("Uniform [" + uniform.name + "]: unknown format " + uniform.type);
                break;
        }
    };
    ShaderBase.prototype.__cacheUniformLocations = function () {
        var glc = this._glc;
        var program = this._program;
        this._uniforms.forEach(function (v, k) {
            v.location = glc.getUniformLocation(program, k);
        });
    };
    ShaderBase.prototype.__cacheAttributeLocations = function () {
        var glc = this._glc;
        var program = this._program;
        this._attributes.forEach(function (v, k) {
            v.location = glc.getAttribLocation(program, k);
        });
    };
    ShaderBase.prototype.__localInit = function (manager, uniforms, attributes) {
    };
    ShaderBase.SHADER_CLASS_NAME = "ShaderBase";
    ShaderBase.FRAGMENT_SOURCE = FragmentShaders_1.FragmentShaders.buffered;
    ShaderBase.VERTEX_SOURCE = VertexShaders_1.VertexShaders.buffered;
    return ShaderBase;
})();
exports.ShaderBase = ShaderBase;
function createShaderFromSource(glc, source, type) {
    var shader = glc.createShader(type);
    if (shader === null) {
        console.warn("Cannot create shader.");
        return null;
    }
    glc.shaderSource(shader, source);
    glc.compileShader(shader);
    var isCompiled = glc.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!isCompiled) {
        var error = glc.getShaderInfoLog(shader);
        console.warn("Failed to load shader: " + error);
        glc.deleteShader(shader);
        return null;
    }
    return shader;
}

//# sourceMappingURL=ShaderBase.js.map
