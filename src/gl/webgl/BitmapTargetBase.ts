/**
 * Created by MIC on 2016/10/29.
 */

import {IDisposable} from "../mic/IDisposable";
import {WebGLRenderer} from "./WebGLRenderer";
import {NotImplementedError} from "../flash/errors/NotImplementedError";
import {PackedArrayBuffer} from "./PackedArrayBuffer";

export abstract class BitmapTargetBase implements IDisposable {

    constructor(renderer: WebGLRenderer) {
        this._renderer = renderer;
        this._context = renderer.context;
    }

    dispose(): void {
        this._context = null;
        this._renderer = null;
    }

    abstract clear(): void;

    abstract activate(): void;

    abstract resize(newWidth: number, newHeight: number): void;

    get originalWidth(): number {
        throw new NotImplementedError();
    }

    get originalHeight(): number {
        throw new NotImplementedError();
    }

    get fitWidth(): number {
        throw new NotImplementedError();
    }

    get fitHeight(): number {
        throw new NotImplementedError();
    }

    get context(): WebGLRenderingContext {
        return this._context;
    }

    get renderer(): WebGLRenderer {
        return this._renderer;
    }

    private _renderer: WebGLRenderer = null;
    private _context: WebGLRenderingContext = null;

    static textureCoords: PackedArrayBuffer = null;
    static textureIndices: PackedArrayBuffer = null;

}
