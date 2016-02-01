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

export class FxaaShader extends BufferedShader {

    constructor(manager:ShaderManager) {
        super(manager, FxaaShader.VERTEX_SOURCE, FxaaShader.FRAGMENT_SOURCE);
    }

    setResolutionXY(xy:number[]):void {
        this._uniforms.get("uResolution").value = xy.slice();
    }

    static SHADER_CLASS_NAME:string = "FxaaShader";
    static FRAGMENT_SOURCE:string = FragmentShaders.fxaa;
    static VERTEX_SOURCE:string = VertexShaders.fxaa;

    protected __localInit(manager:ShaderManager, uniforms:Map<string, UniformCache>, attributes:Map<string, AttributeCache>):void {
        super.__localInit(manager, uniforms, attributes);

        var u:UniformCache;

        u = new UniformCache();
        u.name = "uResolution";
        u.type = WebGLDataType.U2F;
        u.value = [1, 1];
        uniforms.set(u.name, u);
    }

}
