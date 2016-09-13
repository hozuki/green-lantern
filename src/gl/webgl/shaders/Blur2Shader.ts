/**
 * Created by MIC on 2015/12/22.
 */

import {UniformCache} from "../UniformCache";
import {AttributeCache} from "../AttributeCache";
import {ShaderManager} from "../ShaderManager";
import {VertexShaders} from "../VertexShaders";
import {FragmentShaders} from "../FragmentShaders";
import {BufferedShader} from "./BufferedShader";
import {WebGLDataType} from "../WebGLDataType";

export class Blur2Shader extends BufferedShader {

    constructor(manager: ShaderManager) {
        super(manager, Blur2Shader.VERTEX_SOURCE, Blur2Shader.FRAGMENT_SOURCE);
    }

    setStrength(strength: number): void {
        if (strength < 0) {
            strength = 1;
        }
        this._uniforms.get("uStrength").value = strength;
    }

    getStrength(): number {
        return this._uniforms.get("uStrength").value;
    }

    setResolution(resolution: number): void {
        if (resolution < 0) {
            resolution = 1;
        }
        this._uniforms.get("uResolution").value = resolution;
    }

    setBlurDirection(direction: number[]): void {
        this._uniforms.get("uBlurDirection").value = [direction[0], direction[1]];
    }

    static SHADER_CLASS_NAME: string = "Blur2Shader";
    static FRAGMENT_SOURCE: string = FragmentShaders.blur2;
    static VERTEX_SOURCE: string = VertexShaders.blur2;

    protected _$localInit(manager: ShaderManager, uniforms: Map<string, UniformCache>, attributes: Map<string, AttributeCache>): void {
        super._$localInit(manager, uniforms, attributes);

        var u: UniformCache;

        u = new UniformCache();
        u.name = "uStrength";
        u.type = WebGLDataType.U1F;
        u.value = 5;
        uniforms.set(u.name, u);

        u = new UniformCache();
        u.name = "uResolution";
        u.type = WebGLDataType.U1F;
        u.value = 1;
        uniforms.set(u.name, u);

        u = new UniformCache();
        u.name = "uBlurDirection";
        u.type = WebGLDataType.U2F;
        u.value = [1.0, 0.0];
        uniforms.set(u.name, u);
    }

}
