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

export default class BlurYShader extends BufferedShader {

    constructor(manager: ShaderManager) {
        super(manager, BlurYShader.VERTEX_SOURCE, BlurYShader.FRAGMENT_SOURCE);
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

    static SHADER_CLASS_NAME: string = "BlurYShader";
    static FRAGMENT_SOURCE: string = FragmentShaders.blur;
    static VERTEX_SOURCE: string = VertexShaders.blurY;

    protected _$localInit(manager: ShaderManager, uniforms: Map<string, UniformCache>, attributes: Map<string, AttributeCache>): void {
        super._$localInit(manager, uniforms, attributes);

        var u: UniformCache;

        u = Object.create(null);
        u.name = "uStrength";
        u.type = WebGLDataType.U1F;
        u.value = 5;
        uniforms.set(u.name, u);
    }

}
