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

export default class ColorTransformShader extends BufferedShader {

    constructor(manager: ShaderManager) {
        super(manager, ColorTransformShader.VERTEX_SOURCE, ColorTransformShader.FRAGMENT_SOURCE);
    }

    setColorMatrix(r4c5: number[]): void {
        if (r4c5.length < 20) {
            console.warn("ColorTransformShader.setColorMatrix needs a 4x5 matrix.");
            return;
        }
        this._uniforms.get("uColorMatrix").value = r4c5.slice();
    }

    static SHADER_CLASS_NAME: string = "ColorTransformShader";
    static FRAGMENT_SOURCE: string = FragmentShaders.colorTransform;
    static VERTEX_SOURCE: string = VertexShaders.buffered;

    protected _$localInit(manager: ShaderManager, uniforms: Map<string, UniformCache>, attributes: Map<string, AttributeCache>): void {
        super._$localInit(manager, uniforms, attributes);

        var u: UniformCache;
        var defaultColorMatrix = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0
        ];

        u = Object.create(null);
        u.name = "uColorMatrix";
        u.type = WebGLDataType.U1FV;
        u.value = defaultColorMatrix;
        uniforms.set(u.name, u);
    }

}
