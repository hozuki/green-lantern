/**
 * Created by MIC on 2015/11/18.
 */

import {GLUtil} from "../../../lib/glantern-utils/src/GLUtil";
import {NotImplementedError} from "../../../lib/glantern-utils/src/NotImplementedError";

export class ColorTransform {

    constructor(redMultiplier:number = 1, greenMultiplier:number = 1, blueMultiplier:number = 1, alphaMultiplier:number = 1,
                redOffset:number = 0, greenOffset:number = 0, blueOffset:number = 0, alphaOffset:number = 0) {
        this.redMultiplier = redMultiplier;
        this.greenMultiplier = greenMultiplier;
        this.blueMultiplier = blueMultiplier;
        this.alphaMultiplier = alphaMultiplier;
        this.redOffset = redOffset;
        this.greenOffset = greenOffset;
        this.blueOffset = blueOffset;
        this.alphaOffset = alphaOffset;
    }

    color:number = 0;

    get alphaMultiplier():number {
        return this._alphaMultiplier;
    }

    set alphaMultiplier(v:number) {
        this._alphaMultiplier = v;
    }

    get alphaOffset():number {
        return this._alphaOffset;
    }

    set alphaOffset(v:number) {
        this._alphaOffset = GLUtil.limitInto(v, -1, 1);
    }

    get redMultiplier():number {
        return this._redMultiplier;
    }

    set redMultiplier(v:number) {
        this._redMultiplier = v;
    }

    get redOffset():number {
        return this._redOffset;
    }

    set redOffset(v:number) {
        this._redOffset = GLUtil.limitInto(v, -1, 1);
    }

    get greenMultiplier():number {
        return this._greenMultiplier;
    }

    set greenMultiplier(v:number) {
        this._greenMultiplier = v;
    }

    get greenOffset():number {
        return this._greenOffset;
    }

    set greenOffset(v:number) {
        this._greenOffset = GLUtil.limitInto(v, -1, 1);
    }

    get blueMultiplier():number {
        return this._blueMultiplier;
    }

    set blueMultiplier(v:number) {
        this._blueMultiplier = v;
    }

    get blueOffset():number {
        return this._blueOffset;
    }

    set blueOffset(v:number) {
        this._blueOffset = GLUtil.limitInto(v, -1, 1);
    }

    concat(second:ColorTransform):void {
        throw new NotImplementedError();
    }

    private _alphaMultiplier:number = 1;
    private _alphaOffset:number = 0;
    private _redMultiplier:number = 1;
    private _redOffset:number = 0;
    private _greenMultiplier:number = 1;
    private _greenOffset:number = 0;
    private _blueMultiplier:number = 1;
    private _blueOffset:number = 0;

}
