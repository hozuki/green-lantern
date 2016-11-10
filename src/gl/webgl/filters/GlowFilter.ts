/**
 * Created by MIC on 2015/11/18.
 */

import ColorTransformFilter from "./ColorTransformFilter";
import RenderTarget2D from "../targets/RenderTarget2D";
import WebGLRenderer from "../WebGLRenderer";
import FilterBase from "../FilterBase";
import FilterManager from "../FilterManager";
import Blur2Filter from "./Blur2Filter";
import RenderHelper from "../RenderHelper";
import MathUtil from "../../mic/MathUtil";

export default class GlowFilter extends FilterBase {

    constructor(manager: FilterManager) {
        super(manager);
    }

    get strengthX(): number {
        return this._strengthX;
    }

    set strengthX(v: number) {
        if (v < 0) {
            v = 1;
        }
        this._strengthX = v;
        if (this._blurFilter !== null) {
            this._blurFilter.strengthX = v;
        }
    }

    get strengthY(): number {
        return this._strengthY;
    }

    set strengthY(v: number) {
        if (v < 0) {
            v = 1;
        }
        this._strengthY = v;
        if (this._blurFilter !== null) {
            this._blurFilter.strengthY = v;
        }
    }

    get pass(): number {
        return this._pass;
    }

    set pass(v: number) {
        v = MathUtil.clamp(v, 1, 3) | 0;
        this._pass = v;
        if (this._blurFilter !== null) {
            this._blurFilter.pass = v;
        }
    }

    setColorMatrix(r4c5: number[]): void {
        if (this._colorTransformFilter !== null) {
            this._colorTransformFilter.setColorMatrix(r4c5);
        }
        this._colorMatrix = r4c5.slice();
    }

    process(renderer: WebGLRenderer, input: RenderTarget2D, output: RenderTarget2D, clearOutput: boolean): void {
        var tempOriginalTarget = this.filterManager.requestTempTarget();
        var tempColorTransformedTarget = this.filterManager.requestTempTarget();
        RenderHelper.copyTargetContent(renderer, input, tempOriginalTarget, false, false, true);
        this._colorTransformFilter.process(renderer, input, tempColorTransformedTarget, true);
        this._blurFilter.process(renderer, tempColorTransformedTarget, output, false);
        RenderHelper.copyTargetContent(renderer, tempOriginalTarget, output, this.flipX, this.flipY, false);
        this.filterManager.returnTempTarget(tempOriginalTarget);
        this.filterManager.returnTempTarget(tempColorTransformedTarget);
    }

    protected _$initialize(): void {
        this._blurFilter = new Blur2Filter(this.filterManager);
        this._colorTransformFilter = new ColorTransformFilter(this.filterManager);
        this._blurFilter.initialize();
        this._colorTransformFilter.initialize();
        this._blurFilter.strengthX = this.strengthX;
        this._blurFilter.strengthY = this.strengthY;
        this._blurFilter.pass = this.pass;
        this._colorTransformFilter.setColorMatrix(this._colorMatrix);
    }

    protected _$dispose(): void {
        this._blurFilter.dispose();
        this._colorTransformFilter.dispose();
        this._blurFilter = this._colorTransformFilter = null;
    }

    private _strengthX: number = 5;
    private _strengthY: number = 5;
    private _pass: number = 1;
    private _colorMatrix: number[] = [
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 1, 0
    ];
    /**
     * Use {@link BlurFilter} for better performance, or {@link Blur2Filter} for better quality.
     * @type {FilterBase}
     * @private
     */
    private _blurFilter: Blur2Filter = null;
    private _colorTransformFilter: ColorTransformFilter = null;

}
