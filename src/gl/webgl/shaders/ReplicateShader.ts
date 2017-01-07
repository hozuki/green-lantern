/**
 * Created by MIC on 2015/11/18.
 */

import UniformCache from "../UniformCache";
import AttributeCache from "../AttributeCache";
import ShaderManager from "../ShaderManager";
import VertexShaders from "../VertexShaders";
import FragmentShaders from "../FragmentShaders";
import BufferedShader from "./BufferedShader";
import WebGLDataType from "../WebGLDataType";

export default class ReplicateShader extends BufferedShader {

    constructor(manager: ShaderManager) {
        super(manager, ReplicateShader.VERTEX_SOURCE, ReplicateShader.FRAGMENT_SOURCE);
    }

    setFlipX(flip: boolean): void {
        this._uniforms.get("uFlipX").value = flip;
    }

    setFlipY(flip: boolean): void {
        this._uniforms.get("uFlipY").value = flip;
    }

    setOriginalSize(xy: number[]): void {
        this._uniforms.get("uOriginalSize").value = xy.slice();
    }

    setFitSize(xy: number[]): void {
        this._uniforms.get("uFitSize").value = xy.slice();
    }

    static SHADER_CLASS_NAME: string = "ReplicateShader";
    static FRAGMENT_SOURCE: string = FragmentShaders.buffered;
    static VERTEX_SOURCE: string = VertexShaders.replicate;

    protected _$localInit(manager: ShaderManager, uniforms: Map<string, UniformCache>, attributes: Map<string, AttributeCache>): void {
        super._$localInit(manager, uniforms, attributes);

        let u: UniformCache;

        u = Object.create(null);
        u.name = "uFlipX";
        u.type = WebGLDataType.UBool;
        u.value = false;
        uniforms.set(u.name, u);

        u = Object.create(null);
        u.name = "uFlipY";
        u.type = WebGLDataType.UBool;
        u.value = false;
        uniforms.set(u.name, u);

        u = Object.create(null);
        u.name = "uOriginalSize";
        u.type = WebGLDataType.U2F;
        u.value = [0, 0];
        uniforms.set(u.name, u);

        u = Object.create(null);
        u.name = "uFitSize";
        u.type = WebGLDataType.U2F;
        u.value = [0, 0];
        uniforms.set(u.name, u);
    }

}
