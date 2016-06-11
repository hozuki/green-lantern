/**
 * Created by MIC on 2015/11/18.
 */

import {Matrix3D} from "./Matrix3D";
import {Point} from "./Point";
import {NotImplementedError} from "../errors/NotImplementedError";
import {MathUtil} from "../../glantern/MathUtil";

export class PerspectiveProjection {

    constructor() {
        this.projectionCenter = new Point();
    }

    get fieldOfView():number {
        return this._fieldOfView;
    }

    set fieldOfView(v:number) {
        this._fieldOfView = MathUtil.limitInto(v, 0, 180);
    }

    focalLength:number = 10;
    projectionCenter:Point = null;

    toMatrix3D():Matrix3D {
        throw new NotImplementedError();
    }

    _fieldOfView:number = 90;

}
