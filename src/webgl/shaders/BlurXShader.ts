/**
 * Created by MIC on 2015/11/18.
 */

import {UniformCache} from "../UniformCache";
import {AttributeCache} from "../AttributeCache";
import {ShaderManager} from "../ShaderManager";
import {VertexShaders} from "../VertexShaders";
import {FragmentShaders} from "../FragmentShaders";
import {BufferedShader} from "./BufferedShader";
import {WebGLDataType} from "../WebGLDataType";

export class BlurXShader extends BufferedShader {

    constructor(manager:ShaderManager) {
        super(manager, BlurXShader.VERTEX_SOURCE, BlurXShader.FRAGMENT_SOURCE);
    }

    setStrength(strength:number):void {
        if (strength < 0) {
            strength = 1;
        }
        this._uniforms.get("uStrength").value = strength;
    }

    getStrength():number {
        return this._uniforms.get("uStrength").value;
    }

    static SHADER_CLASS_NAME:string = "BlurXShader";
    static FRAGMENT_SOURCE:string = FragmentShaders.blur;
    static VERTEX_SOURCE:string = VertexShaders.blurX;

    protected __localInit(manager:ShaderManager, uniforms:Map<string, UniformCache>, attributes:Map<string, AttributeCache>):void {
        super.__localInit(manager, uniforms, attributes);

        var u:UniformCache;

        u = new UniformCache();
        u.name = "uStrength";
        u.type = WebGLDataType.U1F;
        u.value = 5;
        uniforms.set(u.name, u);
    }

}
