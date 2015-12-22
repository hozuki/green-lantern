/**
 * Created by MIC on 2015/11/18.
 */

import {BlurYFilter} from "./BlurYFilter";
import {BlurXFilter} from "./BlurXFilter";
import {RenderTarget2D} from "../RenderTarget2D";
import {WebGLRenderer} from "../WebGLRenderer";
import {_util} from "../../_util/_util";
import {FilterManager} from "../FilterManager";
import {FilterBase} from "../FilterBase";

export class BlurFilter extends FilterBase {

    constructor(manager:FilterManager) {
        super(manager);
    }

    get strengthX():number {
        return this._strengthX;
    }

    set strengthX(v:number) {
        if (v < 0) {
            v = 1;
        }
        this._strengthX = v;
        if (this._blurXFilter !== null) {
            this._blurXFilter.strength = v;
        }
    }

    get strengthY():number {
        return this._strengthY;
    }

    set strengthY(v:number) {
        if (v < 0) {
            v = 1;
        }
        this._strengthY = v;
        if (this._blurYFilter !== null) {
            this._blurYFilter.strength = v;
        }
    }

    get pass():number {
        return this._pass;
    }

    set pass(v:number) {
        v = _util.limitInto(v, 1, 3) | 0;
        this._pass = v;
        if (this._blurXFilter !== null) {
            this._blurXFilter.pass = v;
        }
        if (this._blurYFilter !== null) {
            this._blurYFilter.pass = v;
        }
    }

    process(renderer:WebGLRenderer, input:RenderTarget2D, output:RenderTarget2D, clearOutput:boolean):void {
        this._blurXFilter.process(renderer, input, this._tempTarget, true);
        this._blurYFilter.process(renderer, this._tempTarget, output, clearOutput);
    }

    protected __initialize():void {
        this._blurXFilter = new BlurXFilter(this._filterManager);
        this._blurYFilter = new BlurYFilter(this._filterManager);
        this._blurXFilter.initialize();
        this._blurYFilter.initialize();
        this._blurXFilter.strength = this.strengthX;
        this._blurYFilter.strength = this.strengthY;
        this._blurXFilter.pass = this.pass;
        this._blurYFilter.pass = this.pass;
        this._tempTarget = this._filterManager.renderer.createRenderTarget();
    }

    protected __dispose():void {
        this._filterManager.renderer.releaseRenderTarget(this._tempTarget);
        this._tempTarget = null;
        this._blurXFilter.dispose();
        this._blurYFilter.dispose();
        this._blurXFilter = this._blurYFilter = null;
    }

    private _tempTarget:RenderTarget2D = null;
    private _strengthX:number = 5;
    private _strengthY:number = 5;
    private _pass:number = 1;
    private _blurXFilter:BlurXFilter = null;
    private _blurYFilter:BlurYFilter = null;

}
