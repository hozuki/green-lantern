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

export default class FxaaShader extends BufferedShader {

    constructor(manager: ShaderManager) {
        super(manager, FxaaShader.VERTEX_SOURCE, FxaaShader.FRAGMENT_SOURCE);
    }

    setResolutionXY(xy: number[]): void {
        this._uniforms.get("uResolution").value = xy.slice();
    }

    static SHADER_CLASS_NAME: string = "FxaaShader";
    static FRAGMENT_SOURCE: string = FragmentShaders.fxaa;
    static VERTEX_SOURCE: string = VertexShaders.fxaa;

    protected _$localInit(manager: ShaderManager, uniforms: Map<string, UniformCache>, attributes: Map<string, AttributeCache>): void {
        super._$localInit(manager, uniforms, attributes);

        let u: UniformCache;

        u = Object.create(null);
        u.name = "uResolution";
        u.type = WebGLDataType.U2F;
        u.value = [1, 1];
        uniforms.set(u.name, u);
    }

}
