/**
 * Created by MIC on 2015/11/30.
 */

import {BitmapFilter} from "./BitmapFilter";
import {BlurFilter as WebGLBlurFilter} from "../../webgl/filters/BlurFilter";
import {BitmapFilterQuality} from "./BitmapFilterQuality";
import {FilterManager} from "../../webgl/FilterManager";

export class BlurFilter extends WebGLBlurFilter implements BitmapFilter {

    constructor(filterManager:FilterManager, blurX:number = 4.0, blurY:number = 4.0, quality:number = BitmapFilterQuality.LOW) {
        super(filterManager);
        this.blurX = blurX;
        this.blurY = blurY;
        this.quality = quality;
    }

    get blurX():number {
        return this.strengthX;
    }

    set blurX(v:number) {
        this.strengthX = v;
    }

    get blurY():number {
        return this.strengthY;
    }

    set blurY(v:number) {
        this.strengthY = v;
    }

    get quality():number {
        return this.pass;
    }

    set quality(v:number) {
        this.pass = v;
    }

    clone():BlurFilter {
        return new BlurFilter(this._filterManager, this.blurX, this.blurY, this.quality);
    }

}
