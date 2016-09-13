/**
 * Created by MIC on 2015/11/30.
 */

import {BitmapFilter} from "./BitmapFilter";
import {Blur2Filter as WebGLBlur2Filter} from "../../webgl/filters/Blur2Filter";
import {BitmapFilterQuality} from "./BitmapFilterQuality";
import {FilterManager} from "../../webgl/FilterManager";

/**
 * Derive from {@link BlurFilter} for better performance, or {@link Blur2Filter} for better quality.
 */
export class BlurFilter extends WebGLBlur2Filter implements BitmapFilter {

    constructor(filterManager: FilterManager, blurX: number = 4.0, blurY: number = 4.0, quality: number = BitmapFilterQuality.LOW) {
        super(filterManager);
        this.blurX = blurX;
        this.blurY = blurY;
        this.quality = quality;
    }

    get blurX(): number {
        return this.strengthX;
    }

    set blurX(v: number) {
        this.strengthX = v;
    }

    get blurY(): number {
        return this.strengthY;
    }

    set blurY(v: number) {
        this.strengthY = v;
    }

    get quality(): number {
        return this.pass;
    }

    set quality(v: number) {
        this.pass = v;
    }

    clone(): BlurFilter {
        return new BlurFilter(this.filterManager, this.blurX, this.blurY, this.quality);
    }

}
