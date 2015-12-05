/**
 * Created by MIC on 2015/11/18.
 */

import {_util} from "../../_util/_util";
import {NotImplementedError} from "../../_util/NotImplementedError";

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

    get alphaMultiplier() {
        return this._alphaMultiplier;
    }

    set alphaMultiplier(v:number) {
        this._alphaMultiplier = v;
    }

    get alphaOffset() {
        return this._alphaOffset;
    }

    set alphaOffset(v:number) {
        this._alphaOffset = _util.limitInto(v, -1, 1);
    }

    get redMultiplier() {
        return this._redMultiplier;
    }

    set redMultiplier(v:number) {
        this._redMultiplier = v;
    }

    get redOffset() {
        return this._redOffset;
    }

    set redOffset(v:number) {
        this._redOffset = _util.limitInto(v, -1, 1);
    }

    get greenMultiplier() {
        return this._greenMultiplier;
    }

    set greenMultiplier(v:number) {
        this._greenMultiplier = v;
    }

    get greenOffset() {
        return this._greenOffset;
    }

    set greenOffset(v:number) {
        this._greenOffset = _util.limitInto(v, -1, 1);
    }

    get blueMultiplier() {
        return this._blueMultiplier;
    }

    set blueMultiplier(v:number) {
        this._blueMultiplier = v;
    }

    get blueOffset() {
        return this._blueOffset;
    }

    set blueOffset(v:number) {
        this._blueOffset = _util.limitInto(v, -1, 1);
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
