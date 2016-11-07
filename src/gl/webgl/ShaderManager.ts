/**
 * Created by MIC on 2015/11/17.
 */

import ShaderBase from "./ShaderBase";
import WebGLRenderer from "./WebGLRenderer";
import PrimitiveShader from "./shaders/PrimitiveShader";
import BlurXShader from "./shaders/BlurXShader";
import BlurYShader from "./shaders/BlurYShader";
import ReplicateShader from "./shaders/ReplicateShader";
import ColorTransformShader from "./shaders/ColorTransformShader";
import FxaaShader from "./shaders/FxaaShader";
import UniformCache from "./UniformCache";
import AttributeCache from "./AttributeCache";
import IDisposable from "../mic/IDisposable";
import Blur2Shader from "./shaders/Blur2Shader";
import CopyImageShader from "./shaders/CopyImageShader";
import Primitive2Shader from "./shaders/Primitive2Shader";

export default class ShaderManager implements IDisposable {

    constructor(renderer: WebGLRenderer) {
        this._renderer = renderer;
        this._shaders = [];
        this.__insertShaders();
    }

    dispose(): void {
        for (var i = 0; i < this._shaders.length; ++i) {
            this._shaders[i].dispose();
        }
        this._currentShader = null;
        this._renderer = null;
        this._shaders = null;
    }

    getNextAvailableID(): number {
        return this._shaders.length;
    }

    selectShader(id: number): void {
        var shader = this.__getShader(id);
        if (shader !== null) {
            shader.select();
            this._currentShader = shader;
        }
    }

    get currentShader(): ShaderBase {
        return this._currentShader;
    }

    get context(): WebGLRenderingContext {
        return this._renderer.context;
    }

    get renderer(): WebGLRenderer {
        return this._renderer;
    }

    private __getShader(id: number): ShaderBase {
        var shader: ShaderBase = null;
        try {
            shader = this._shaders[id];
        } catch (e) {
        }
        return shader;
    }

    private __insertShaders(): void {
        var shaderList = this._shaders;
        shaderList.push(new PrimitiveShader(this));
        shaderList.push(new BlurXShader(this));
        shaderList.push(new BlurYShader(this));
        shaderList.push(new ReplicateShader(this));
        shaderList.push(new ColorTransformShader(this));
        shaderList.push(new FxaaShader(this));
        shaderList.push(new Blur2Shader(this));
        shaderList.push(new CopyImageShader(this));
        shaderList.push(new Primitive2Shader(this));
    }

    private _renderer: WebGLRenderer = null;
    private _shaders: ShaderBase[] = null;
    private _currentShader: ShaderBase = null;

}
