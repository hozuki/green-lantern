/**
 * Created by MIC on 2016/10/29.
 */
import BitmapTargetBase from "../BitmapTargetBase";
import WebGLRenderer from "../WebGLRenderer";
import PackedArrayBuffer from "../PackedArrayBuffer";
import VirtualDom from "../../mic/VirtualDom";

const gl = VirtualDom.WebGLRenderingContext;

let isInitializedStatically: boolean = false;

abstract class BufferedBitmapTarget extends BitmapTargetBase {

    constructor(renderer: WebGLRenderer, isRoot: boolean) {
        super(renderer);
        if (!isInitializedStatically) {
            initStaticFields(renderer.context);
        }
        this._isRoot = isRoot;
    }

    dispose(): void {
        this.context.deleteTexture(this.texture);
        this._texture = null;
        super.dispose();
    }

    /**
     * Returns the underlying {@link WebGLTexture} of the {@link BufferedBitmapTarget}. May be null if the target is a root target.
     * @returns {WebGLTexture} The underlying texture.
     */
    get texture(): WebGLTexture {
        return this._texture;
    }

    /**
     * Returns whether the {@link BufferedBitmapTarget} is a root for display. A root {@link BufferedBitmapTarget}
     * has no underlying textures and renders directly to the output buffer (i.e. the &lt;canvas&gt; attached to the
     * {@link WebGLRenderer}. So they must be used as final $render target, not buffers.
     * @returns {Boolean} True if the {@link BufferedBitmapTarget} is a root target, and false otherwise.
     */
    get isRoot(): boolean {
        return this._isRoot;
    }

    private _isRoot: boolean = false;
    protected _texture: WebGLTexture = null;

}

function initStaticFields(glc: WebGLRenderingContext) {
    if (isInitializedStatically) {
        return;
    }
    const textureCoords: number[] = [
        0, 1,
        1, 1,
        0, 0,
        1, 0
    ];
    const textureIndices: number[] = [
        0, 1, 2,
        1, 2, 3
    ];
    BufferedBitmapTarget.textureCoords = PackedArrayBuffer.create(glc, textureCoords, gl.FLOAT, gl.ARRAY_BUFFER);
    BufferedBitmapTarget.textureIndices = PackedArrayBuffer.create(glc, textureIndices, gl.UNSIGNED_SHORT, gl.ELEMENT_ARRAY_BUFFER);
    isInitializedStatically = true;
}

export default BufferedBitmapTarget;
