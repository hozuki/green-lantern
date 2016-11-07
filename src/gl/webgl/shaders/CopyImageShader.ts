/**
 * Created by MIC on 2015/12/23.
 */

import UniformCache from "../UniformCache";
import AttributeCache from "../AttributeCache";
import ShaderManager from "../ShaderManager";
import VertexShaders from "../VertexShaders";
import FragmentShaders from "../FragmentShaders";
import BufferedShader from "./BufferedShader";
import WebGLDataType from "../WebGLDataType";
import Matrix3D from "../../flash/geom/Matrix3D";

export default class CopyImageShader extends BufferedShader {

    constructor(manager: ShaderManager) {
        super(manager, CopyImageShader.VERTEX_SOURCE, CopyImageShader.FRAGMENT_SOURCE);
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

    setAlpha(alpha: number): void {
        this._uniforms.get("uAlpha").value = alpha;
    }

    setTransform(matrix: Matrix3D): void {
        this._uniforms.get("uTransformMatrix").value = matrix.toArray();
    }

    static SHADER_CLASS_NAME: string = "CopyImageShader";
    static FRAGMENT_SOURCE: string = FragmentShaders.copyImage;
    static VERTEX_SOURCE: string = VertexShaders.copyImage;

    protected _$localInit(manager: ShaderManager, uniforms: Map<string, UniformCache>, attributes: Map<string, AttributeCache>): void {
        super._$localInit(manager, uniforms, attributes);

        var u: UniformCache;
        var transformMatrix = new Matrix3D();
        transformMatrix.identity();

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

        u = Object.create(null);
        u.name = "uTransformMatrix";
        u.type = WebGLDataType.UMat4;
        u.value = transformMatrix.toArray();
        u.transpose = false;
        uniforms.set(u.name, u);

        u = Object.create(null);
        u.name = "uAlpha";
        u.type = WebGLDataType.U1F;
        u.value = 1;
        uniforms.set(u.name, u);
    }

}
