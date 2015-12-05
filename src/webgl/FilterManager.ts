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
                for (var j = 0; j < filterGroup.length; j++) {
                    filterGroup[j].dispose();
                }
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
            console.warn("Filter alert: input and output are the same, abandon processing.");
            return;
        }

        // 处理时仅最后一层有效，因为都是渲染到缓冲区上的，这一层渲染完后会作为源传给下一层
        if (this.hasFilterGroups) {
            var filterGroup:IBitmapFilter[] = this._filterGroups[this._filterGroups.length - 1];
            var filter:IBitmapFilter;
            var t1 = input, t2 = this._tempTarget;
            var t:RenderTarget2D;
            for (var i = 0; i < filterGroup.length; i++) {
                filter = filterGroup[i];
                if (filter !== null) {
                    //filter.process(renderer, currentInput);
                    //currentInput = filter.result;
                    filter.process(renderer, t1, t2, true);
                    t = t1;
                    t1 = t2;
                    t2 = t;
                }
            }
            renderer.copyRenderTargetContent(t1, output, clearOutput);
            //output.renderRenderTarget(currentInput, false);
        }
        /*
         if (this._filters.length > 0) {
         if (this._filters.length == 1) {
         this._filters[0].process(renderer, input, output, false);
         } else {
         var t1 = renderer.createCopyRenderTarget(), t2 = renderer.createCopyRenderTarget();
         this._filters[0].process(renderer, input, t1, true);
         for (var i = 1; i < this._filters.length - 1; i++) {
         if (i % 2 == 0) {
         this._filters[i].process(renderer, t2, t1, true);
         } else {
         this._filters[i].process(renderer, t1, t2, true);
         }
         }
         if (this._filters.length == 2) {
         this._filters[1].process(renderer, t1, output, false);
         } else {
         var t = (this._filters.length - 1) % 2 == 0 ? t2 : t1;
         this._filters[this._filters.length - 1].process(renderer, t, output, false);
         }
         renderer.recycleCopyRenderTarget(t1);
         renderer.recycleCopyRenderTarget(t2);
         }
         }
         */
    }

    private _tempTarget:RenderTarget2D = null;
    private _renderer:WebGLRenderer = null;
    private _filterGroups:IBitmapFilter[][] = null;

}
