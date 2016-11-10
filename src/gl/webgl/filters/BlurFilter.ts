/**
 * Created by MIC on 2015/11/18.
 */

import BlurYFilter from "./BlurYFilter";
import BlurXFilter from "./BlurXFilter";
import RenderTarget2D from "../targets/RenderTarget2D";
import WebGLRenderer from "../WebGLRenderer";
import FilterManager from "../FilterManager";
import FilterBase from "../FilterBase";
import MathUtil from "../../mic/MathUtil";

export default class BlurFilter extends FilterBase {

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
        if (this._blurXFilter !== null) {
            this._blurXFilter.strength = v;
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
        if (this._blurYFilter !== null) {
            this._blurYFilter.strength = v;
        }
    }

    get pass(): number {
        return this._pass;
    }

    set pass(v: number) {
        v = MathUtil.clamp(v, 1, 3) | 0;
        this._pass = v;
        if (this._blurXFilter !== null) {
            this._blurXFilter.pass = v;
        }
        if (this._blurYFilter !== null) {
            this._blurYFilter.pass = v;
        }
    }

    process(renderer: WebGLRenderer, input: RenderTarget2D, output: RenderTarget2D, clearOutput: boolean): void {
        var tempTarget = this.filterManager.requestTempTarget();
        this._blurXFilter.process(renderer, input, tempTarget, true);
        this._blurYFilter.process(renderer, tempTarget, output, clearOutput);
        this.filterManager.returnTempTarget(tempTarget);
    }

    protected _$initialize(): void {
        this._blurXFilter = new BlurXFilter(this.filterManager);
        this._blurYFilter = new BlurYFilter(this.filterManager);
        this._blurXFilter.initialize();
        this._blurYFilter.initialize();
        this._blurXFilter.strength = this.strengthX;
        this._blurYFilter.strength = this.strengthY;
        this._blurXFilter.pass = this.pass;
        this._blurYFilter.pass = this.pass;
        this._blurXFilter.flipY = false;
    }

    protected _$dispose(): void {
        this._blurXFilter.dispose();
        this._blurYFilter.dispose();
        this._blurXFilter = this._blurYFilter = null;
    }

    private _strengthX: number = 5;
    private _strengthY: number = 5;
    private _pass: number = 1;
    private _blurXFilter: BlurXFilter = null;
    private _blurYFilter: BlurYFilter = null;

}
