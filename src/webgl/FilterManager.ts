/**
 * Created by MIC on 2015/11/17.
 */

import {WebGLRenderer} from "./WebGLRenderer";
import {RenderTarget2D} from "./RenderTarget2D";
import {IDisposable} from "../IDisposable";
import {IBitmapFilter} from "./IBitmapFilter";

export class FilterManager implements IDisposable {

    constructor(renderer:WebGLRenderer) {
        this._renderer = renderer;
        this._filterGroups = [];
        this._tempTarget = renderer.createRenderTarget();
    }

    dispose():void {
        this._renderer.releaseRenderTarget(this._tempTarget);
        this.clearFilterGroups();
        this._tempTarget = null;
        this._filterGroups = null;
        this._renderer = null;
    }

    clearFilterGroups():void {
        var filterGroup:IBitmapFilter[];
        var filterGroups = this._filterGroups;
        if (filterGroups.length > 0) {
            for (var i = 0; i < filterGroups.length; ++i) {
                filterGroup = filterGroups[i];
                while (filterGroup.length > 0) {
                    filterGroup.pop();
                }
            }
        }
        while (filterGroups.length > 0) {
            filterGroups.pop();
        }
    }

    pushFilterGroup(group:IBitmapFilter[]):void {
        this._filterGroups.push(group.slice());
    }

    popFilterGroup():IBitmapFilter[] {
        return this.hasFilterGroups ? this._filterGroups.pop() : null;
    }

    get hasFilterGroups():boolean {
        return this._filterGroups.length > 0;
    }

    get renderer():WebGLRenderer {
        return this._renderer;
    }

    processFilters(renderer:WebGLRenderer, input:RenderTarget2D, output:RenderTarget2D, clearOutput:boolean):void {
        if (input === output) {
            console.warn("Filter alert: input and output are the same, processing aborted.");
            return;
        }

        // 处理时仅最后一层有效，因为都是渲染到缓冲区上的，这一层渲染完后会作为源传给下一层
        if (this.hasFilterGroups) {
            var filterGroup:IBitmapFilter[] = this._filterGroups[this._filterGroups.length - 1];
            var filter:IBitmapFilter;
            var t1 = input, t2 = this._tempTarget;
            t2.clear();
            var t:RenderTarget2D;
            for (var i = 0; i < filterGroup.length; i++) {
                filter = filterGroup[i];
                if (filter !== null) {
                    filter.process(renderer, t1, t2, true);
                    t = t1;
                    t1 = t2;
                    t2 = t;
                }
            }
            renderer.copyRenderTargetContent(t1, output, clearOutput);
        }
    }

    private _tempTarget:RenderTarget2D = null;
    private _renderer:WebGLRenderer = null;
    private _filterGroups:IBitmapFilter[][] = null;

}
