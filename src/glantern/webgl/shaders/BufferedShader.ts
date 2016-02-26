/**
 * Created by MIC on 2015/11/18.
 */

import {Matrix3D} from "../../flash/geom/Matrix3D";
import {UniformCache} from "../UniformCache";
import {AttributeCache} from "../AttributeCache";
import {ShaderManager} from "../ShaderManager";
import {VertexShaders} from "../VertexShaders";
import {FragmentShaders} from "../FragmentShaders";
import {ShaderBase} from "../ShaderBase";
import {WebGLDataType} from "../WebGLDataType";

export class BufferedShader extends ShaderBase {

    constructor(manager:ShaderManager, vertexSource:string, fragmentSource:string) {
        super(manager, vertexSource, fragmentSource, null, null);
    }

    setTexture(texture:WebGLTexture):void {
        // Must contains a "uSampler" uniform.
        this._uniforms.get("uSampler").texture = texture;
    }

    static SHADER_CLASS_NAME:string = "BufferedShader";
    static FRAGMENT_SOURCE:string = FragmentShaders.buffered;
    static VERTEX_SOURCE:string = VertexShaders.buffered;

    protected __localInit(manager:ShaderManager, uniforms:Map<string, UniformCache>, attributes:Map<string, AttributeCache>):void {
        super.__localInit(manager, uniforms, attributes);

        var u:UniformCache;
        var projectionMatrix = new Matrix3D();
        var w = manager.renderer.view.width;
        var h = manager.renderer.view.height;
        projectionMatrix.setOrthographicProjection(0, w, h, 0, -1000, 1000);

        u = new UniformCache();
        u.name = "uSampler";
        u.type = WebGLDataType.USampler2D;
        u.value = 0;
        u.texture = null;
        uniforms.set(u.name, u);

        u = new UniformCache();
        u.name = "uProjectionMatrix";
        u.type = WebGLDataType.UMat4;
        u.value = projectionMatrix.toArray();
        u.transpose = false;
        uniforms.set(u.name, u);
    }

}
