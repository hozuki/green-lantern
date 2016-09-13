/**
 * Created by MIC on 2015/11/18.
 */

import {NotImplementedError} from "../errors/NotImplementedError";
import {MathUtil} from "../../mic/MathUtil";
import {GLUtil} from "../../mic/glantern/GLUtil";

export class ColorTransform {

    constructor(redMultiplier: number = 1, greenMultiplier: number = 1, blueMultiplier: number = 1, alphaMultiplier: number = 1,
                redOffset: number = 0, greenOffset: number = 0, blueOffset: number = 0, alphaOffset: number = 0) {
        this.redMultiplier = redMultiplier;
        this.greenMultiplier = greenMultiplier;
        this.blueMultiplier = blueMultiplier;
        this.alphaMultiplier = alphaMultiplier;
        this.redOffset = redOffset;
        this.greenOffset = greenOffset;
        this.blueOffset = blueOffset;
        this.alphaOffset = alphaOffset;
    }

    color: number = 0;

    get alphaMultiplier(): number {
        return this._alphaMultiplier;
    }

    set alphaMultiplier(v: number) {
        this._alphaMultiplier = v;
    }

    get alphaOffset(): number {
        return this._alphaOffset;
    }

    set alphaOffset(v: number) {
        this._alphaOffset = MathUtil.clamp(v, -1, 1);
    }

    get redMultiplier(): number {
        return this._redMultiplier;
    }

    set redMultiplier(v: number) {
        this._redMultiplier = v;
    }

    get redOffset(): number {
        return this._redOffset;
    }

    set redOffset(v: number) {
        this._redOffset = MathUtil.clamp(v, -1, 1);
    }

    get greenMultiplier(): number {
        return this._greenMultiplier;
    }

    set greenMultiplier(v: number) {
        this._greenMultiplier = v;
    }

    get greenOffset(): number {
        return this._greenOffset;
    }

    set greenOffset(v: number) {
        this._greenOffset = MathUtil.clamp(v, -1, 1);
    }

    get blueMultiplier(): number {
        return this._blueMultiplier;
    }

    set blueMultiplier(v: number) {
        this._blueMultiplier = v;
    }

    get blueOffset(): number {
        return this._blueOffset;
    }

    set blueOffset(v: number) {
        this._blueOffset = MathUtil.clamp(v, -1, 1);
    }

    concat(second: ColorTransform): void {
        throw new NotImplementedError();
    }

    // MIC
    transform(color: number): number {
        var rgba = GLUtil.decomposeRgba(color);
        rgba.r = MathUtil.clamp(rgba.r * this.redMultiplier + this.redOffset, 0, 0xff);
        rgba.g = MathUtil.clamp(rgba.g * this.greenMultiplier + this.greenOffset, 0, 0xff);
        rgba.b = MathUtil.clamp(rgba.b * this.blueMultiplier + this.blueOffset, 0, 0xff);
        rgba.a = MathUtil.clamp(rgba.a * this.alphaMultiplier + this.alphaOffset, 0, 0xff);
        return GLUtil.rgba(rgba.r, rgba.g, rgba.b, rgba.a);
    }

    private _alphaMultiplier: number = 1;
    private _alphaOffset: number = 0;
    private _redMultiplier: number = 1;
    private _redOffset: number = 0;
    private _greenMultiplier: number = 1;
    private _greenOffset: number = 0;
    private _blueMultiplier: number = 1;
    private _blueOffset: number = 0;

}
