/**
 * Created by MIC on 2015/11/18.
 */

import {ColorTransformFilter} from "./ColorTransformFilter";
import {BlurFilter} from "./BlurFilter";
import {RenderTarget2D} from "../RenderTarget2D";
import {WebGLRenderer} from "../WebGLRenderer";
import {_util} from "../../_util/_util";
import {FilterBase} from "../FilterBase";
import {FilterManager} from "../FilterManager";

export class GlowFilter extends FilterBase {

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
        if (this._blurFilter !== null) {
            this._blurFilter.strengthX = v;
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
        if (this._blurFilter !== null) {
            this._blurFilter.strengthY = v;
        }
    }

    get pass():number {
        return this._pass;
    }

    set pass(v:number) {
        v = _util.limitInto(v, 1, 3) | 0;
        this._pass = v;
        if (this._blurFilter !== null) {
            this._blurFilter.pass = v;
        }
    }

    setColorMatrix(r4c5:number[]):void {
        this._colorMatrix = r4c5.slice();
        if (this._colorTransformFilter !== null) {
            this._colorTransformFilter.setColorMatrix(r4c5);
        }
    }

    process(renderer:WebGLRenderer, input:RenderTarget2D, output:RenderTarget2D, clearOutput:boolean):void {
    }

    protected __initialize():void {
        this._blurFilter = new BlurFilter(this._filterManager);
        this._colorTransformFilter = new ColorTransformFilter(this._filterManager);
        this._blurFilter.initialize();
        this._colorTransformFilter.initialize();
        this._blurFilter.strengthX = this.strengthX;
        this._blurFilter.strengthY = this.strengthY;
        this._blurFilter.pass = this.pass;
        this._colorTransformFilter.setColorMatrix(this._colorMatrix);
    }

    protected __cleanup():void {
        this._blurFilter.dispose();
        this._colorTransformFilter.dispose();
        this._blurFilter = this._colorTransformFilter = null;
    }

    private _strengthX:number = 5;
    private _strengthY:number = 5;
    private _pass:number = 1;
    private _colorMatrix:number[] = [
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0
    ];
    private _blurFilter:BlurFilter = null;
    private _colorTransformFilter:ColorTransformFilter = null;

}
