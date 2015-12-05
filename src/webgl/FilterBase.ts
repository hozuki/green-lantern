/**
 * Created by MIC on 2015/11/18.
 */

import {FilterManager} from "./FilterManager";
import {RenderTarget2D} from "./RenderTarget2D";
import {WebGLRenderer} from "./WebGLRenderer";
import {IBitmapFilter} from "./IBitmapFilter";

export abstract class FilterBase implements IBitmapFilter {

    constructor(manager:FilterManager) {
        this._filterManager = manager;
    }

    abstract process(renderer:WebGLRenderer, input:RenderTarget2D, output:RenderTarget2D, clearOutput:boolean):void;

    /**
     * Called when it is added to a {@see DisplayObject#filters} array.
     * Notice that it may be called multiple times, but a filter should only be initialized once
     * if its output buffer is null.
     */
    notifyAdded():void {
        if (this._referenceCount <= 0) {
            this.__initialize();
        }
        this._referenceCount++;
    }

    /**
     * Called when it is removed from a {@see DisplayObject#filters} array.
     * Notice that it may be called multiple times, but should do nothing if its output is already null.
     */
    notifyRemoved():void {
        this._referenceCount--;
        if (this._referenceCount <= 0) {
            this.__cleanup();
        }
    }

    dispose():void {
        this.__cleanup();
        this._referenceCount = 0;
        this._filterManager = null;
    }

    initialize():void {
        this.__initialize();
    }

    protected abstract __initialize():void;

    protected abstract __cleanup():void;

    protected _filterManager:FilterManager = null;
    private _referenceCount:number = 0;

}
