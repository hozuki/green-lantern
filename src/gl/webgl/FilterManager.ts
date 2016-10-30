/**
 * Created by MIC on 2015/11/17.
 */

import {WebGLRenderer} from "./WebGLRenderer";
import {RenderTarget2D} from "./targets/RenderTarget2D";
import {IDisposable} from "../mic/IDisposable";
import {IBitmapFilter} from "./IBitmapFilter";
import {RenderHelper} from "./RenderHelper";

export class FilterManager implements IDisposable {

    constructor(renderer: WebGLRenderer) {
        this._renderer = renderer;
        this._filterGroups = [];
        this._tempTarget = renderer.createRenderTarget();
    }

    dispose(): void {
        this._renderer.releaseRenderTarget(this._tempTarget);
        this.clearFilterGroups();
        this._tempTarget = null;
        this._filterGroups = null;
        this._renderer = null;
    }

    clearFilterGroups(): void {
        var filterGroups = this._filterGroups;
        if (filterGroups.length > 0) {
            for (var i = 0; i < filterGroups.length; ++i) {
                var filterGroup = filterGroups[i];
                while (filterGroup.length > 0) {
                    filterGroup.pop();
                }
            }
        }
        while (filterGroups.length > 0) {
            filterGroups.pop();
        }
    }

    pushFilterGroup(group: IBitmapFilter[]): void {
        this._filterGroups.push(group.slice());
    }

    popFilterGroup(): IBitmapFilter[] {
        return this.hasFilterGroups ? this._filterGroups.pop() : null;
    }

    get hasFilterGroups(): boolean {
        return this._filterGroups.length > 0;
    }

    get renderer(): WebGLRenderer {
        return this._renderer;
    }

    /**
     * @param renderer
     * @param input
     * @param output {RenderTarget2D} Expected: screen ({@code renderer.screenRenderTarget}).
     * @param clearOutput
     */
    processFilters(renderer: WebGLRenderer, input: RenderTarget2D, output: RenderTarget2D, clearOutput: boolean): void {
        if (input === output) {
            console.warn("Filter alert: input and output are the same, processing aborted.");
            return;
        }

        if (this.hasFilterGroups) {
            var filterGroup: IBitmapFilter[] = this._filterGroups[this._filterGroups.length - 1];
            var filter: IBitmapFilter;
            var t1 = input, t2 = this._tempTarget;
            t2.clear();
            var t: RenderTarget2D;
            for (var i = 0; i < filterGroup.length; i++) {
                filter = filterGroup[i];
                if (filter !== null) {
                    filter.process(renderer, t1, t2, true);
                    t = t1;
                    t1 = t2;
                    t2 = t;
                }
            }
            // Y-axis should be flipped from element to screen, due to the difference between OpenGL coordinate
            // system and Flash coordinate system.
            RenderHelper.copyTargetContent(renderer, t1, output, false, true, clearOutput);
        }
    }

    private _tempTarget: RenderTarget2D = null;
    private _renderer: WebGLRenderer = null;
    private _filterGroups: IBitmapFilter[][] = null;

}
