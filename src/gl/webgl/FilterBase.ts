/**
 * Created by MIC on 2015/11/18.
 */

import FilterManager from "./FilterManager";
import RenderTarget2D from "./targets/RenderTarget2D";
import WebGLRenderer from "./WebGLRenderer";
import IBitmapFilter from "./IBitmapFilter";

abstract class FilterBase implements IBitmapFilter {

    constructor(manager: FilterManager) {
        this._filterManager = manager;
    }

    abstract process(renderer: WebGLRenderer, input: RenderTarget2D, output: RenderTarget2D, clearOutput: boolean): void;

    /**
     * Called when it is added to a {@link DisplayObject.filters} array.
     * Notice that it may be called multiple times, but a filter should only be initialized once
     * if its output buffer is null.
     */
    notifyAdded(): void {
        if (this._referenceCount <= 0) {
            this._$initialize();
        }
        this._referenceCount++;
    }

    /**
     * Called when it is removed from a {@link DisplayObject.filters} array.
     * Notice that it may be called multiple times, but should do nothing if its output is already null.
     */
    notifyRemoved(): void {
        this._referenceCount--;
        if (this._referenceCount <= 0) {
            this._$dispose();
        }
    }

    dispose(): void {
        this._$dispose();
    }

    initialize(): void {
        this._$initialize();
    }

    get filterManager(): FilterManager {
        return this._filterManager;
    }

    get flipX(): boolean {
        return this._flipX;
    }

    set flipX(v: boolean) {
        this._flipX = v;
    }

    get flipY(): boolean {
        return this._flipY;
    }

    set flipY(v: boolean) {
        this._flipY = v;
    }

    protected _$initialize(): void {
    }

    protected _$dispose(): void {
    }

    private _filterManager: FilterManager = null;
    private _flipY: boolean = false;
    private _flipX: boolean = false;
    private _referenceCount: number = 0;

}

export default FilterBase;
