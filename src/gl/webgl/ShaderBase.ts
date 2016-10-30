/**
 * Created by MIC on 2015/11/18.
 */

import {AttributeCache} from "./AttributeCache";
import {UniformCache} from "./UniformCache";
import {ShaderManager} from "./ShaderManager";
import {VertexShaders} from "./VertexShaders";
import {FragmentShaders} from "./FragmentShaders";
import {IDisposable} from "../mic/IDisposable";
import {WebGLDataType} from "./WebGLDataType";
import {VirtualDom} from "../mic/VirtualDom";
import {CommonUtil} from "../mic/CommonUtil";

const gl = <any>VirtualDom.WebGLRenderingContext;

export class ShaderBase implements IDisposable {

    constructor(manager: ShaderManager, vertexSource: string, fragmentSource: string,
                uniforms: Map<string, UniformCache>, attributes: Map<string, AttributeCache>) {
        this._shaderManager = manager;
        this._vertexSource = vertexSource;
        this._fragmentSource = fragmentSource;
        this._id = manager.getNextAvailableID();
        this.__initialize(manager.context, vertexSource, fragmentSource);
        this.select();
        if (CommonUtil.ptr(uniforms) && CommonUtil.ptr(attributes)) {
            this._uniforms = uniforms;
            this._attributes = attributes;
        } else {
            this._uniforms = new Map<string, UniformCache>();
            this._attributes = new Map<string, AttributeCache>();
            this._$localInit(manager, this._uniforms, this._attributes);
        }
        this.__cacheUniformLocations();
        this.__cacheAttributeLocations();
        this.syncUniforms();
    }

    get id(): number {
        return this._id;
    }

    dispose(): void {
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
    }

    syncUniforms(): void {
        this._uniforms.forEach((v): void => {
            this.__syncUniform(v);
        });
    }

    changeValue(name: string, callback: (uniform: UniformCache) => void): void {
        var uniform = this._uniforms.get(name);
        if (uniform !== (void 0) && uniform !== null) {
            callback(uniform);
        }
    }

    select(): void {
        this._glc.useProgram(this._program);
    }

    getUniformLocation(name: string): WebGLUniformLocation {
        return this._program !== null ? this._glc.getUniformLocation(this._program, name) : null;
    }

    getAttributeLocation(name: string): number {
        return this._program !== null ? this._glc.getAttribLocation(this._program, name) : -1;
    }

    get vertexSource(): string {
        return this._vertexSource
    }

    get fragmentSource(): string {
        return this._fragmentSource;
    }

    static SHADER_CLASS_NAME: string = "ShaderBase";
    static FRAGMENT_SOURCE: string = FragmentShaders.buffered;
    static VERTEX_SOURCE: string = VertexShaders.buffered;


    protected _$localInit(manager: ShaderManager, uniforms: Map<string, UniformCache>, attributes: Map<string, AttributeCache>): void {
    }

    private __initialize(glc: WebGLRenderingContext, vertexSource: string, fragmentSource: string): void {
        this._glc = glc;

        function error(message: string, extra?: any): void {
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
                } else {
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
    }

    private __syncUniform(uniform: UniformCache): void {
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
            case WebGLDataType.UBool:
                glc.uniform1i(location, value ? 1 : 0);
                break;
            case WebGLDataType.U1I:
                glc.uniform1i(location, value);
                break;
            case WebGLDataType.U1F:
                glc.uniform1f(location, value);
                break;
            case WebGLDataType.U2F:
                glc.uniform2f(location, value[0], value[1]);
                break;
            case WebGLDataType.U3F:
                glc.uniform3f(location, value[0], value[1], value[2]);
                break;
            case WebGLDataType.U4F:
                glc.uniform4f(location, value[0], value[1], value[2], value[3]);
                break;
            case WebGLDataType.UV2:
                glc.uniform2f(location, value.x, value.y);
                break;
            case WebGLDataType.UV3:
                glc.uniform3f(location, value.x, value.y, value.z);
                break;
            case WebGLDataType.UV4:
                glc.uniform4f(location, value.x, value.y, value.z, value.w);
                break;
            case WebGLDataType.U1IV:
                glc.uniform1iv(location, value);
                break;
            case WebGLDataType.U2IV:
                glc.uniform2iv(location, value);
                break;
            case WebGLDataType.U3IV:
                glc.uniform3iv(location, value);
                break;
            case WebGLDataType.U4IV:
                glc.uniform4iv(location, value);
                break;
            case WebGLDataType.U1FV:
                glc.uniform1fv(location, value);
                break;
            case WebGLDataType.U2FV:
                glc.uniform2fv(location, value);
                break;
            case WebGLDataType.U3FV:
                glc.uniform3fv(location, value);
                break;
            case WebGLDataType.U4FV:
                glc.uniform4fv(location, value);
                break;
            case WebGLDataType.UMat2:
                glc.uniformMatrix2fv(location, uniform.transpose, value);
                break;
            case WebGLDataType.UMat3:
                glc.uniformMatrix3fv(location, uniform.transpose, value);
                break;
            case WebGLDataType.UMat4:
                glc.uniformMatrix4fv(location, uniform.transpose, value);
                break;
            case WebGLDataType.UIV:
                glc.uniform3iv(location, value);
                break;
            case WebGLDataType.UFV:
                glc.uniform3fv(location, value);
                break;
            case WebGLDataType.UV2V:
                if (!uniform.array) {
                    uniform.array = new Float32Array(2 * value.length);
                }
                for (i = 0, il = value.length; i < il; i++) {
                    uniform.array[i * 2] = value[i].x;
                    uniform.array[i * 2 + 1] = value[i].y;
                }
                glc.uniform2fv(location, uniform.array);
                break;
            case WebGLDataType.UV3V:
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
            case WebGLDataType.UV4V:
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
            case WebGLDataType.USampler2D:
                glc.activeTexture(gl["TEXTURE" + value.toString()]);
                glc.bindTexture(gl.TEXTURE_2D, uniform.texture);
                glc.uniform1i(location, value);
                break;
            default:
                console.warn("Uniform [" + uniform.name + "]: unknown format " + uniform.type);
                break;
        }
    }

    private __cacheUniformLocations(): void {
        var glc = this._glc;
        var program = this._program;
        this._uniforms.forEach((v, k): void => {
            v.location = glc.getUniformLocation(program, k);
        });
    }

    private __cacheAttributeLocations(): void {
        var glc = this._glc;
        var program = this._program;
        this._attributes.forEach((v, k): void => {
            v.location = glc.getAttribLocation(program, k);
        });
    }

    protected _shaderManager: ShaderManager = null;
    protected _vertexSource: string = null;
    protected _fragmentSource: string = null;
    protected _vertexShader: WebGLShader = null;
    protected _fragmentShader: WebGLShader = null;
    protected _program: WebGLProgram = null;
    protected _uniforms: Map<string, UniformCache> = null;
    protected _attributes: Map<string, AttributeCache> = null;
    protected _id: number = -1;
    protected _glc: WebGLRenderingContext = null;

}

function createShaderFromSource(glc: WebGLRenderingContext, source: string, type: number): WebGLShader {
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
        console.warn("Failed to load shader: " + error, "Source:\n" + source);
        glc.deleteShader(shader);
        return null;
    }
    return shader;
}