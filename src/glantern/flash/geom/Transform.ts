/**
 * Created by MIC on 2015/11/18.
 */

import {Matrix3D} from "./Matrix3D";
import {ColorTransform} from "./ColorTransform";
import {Matrix} from "./Matrix";
import {PerspectiveProjection} from "./PerspectiveProjection";
import {Rectangle} from "./Rectangle";
import {DisplayObject} from "../display/DisplayObject";
import {NotImplementedError} from "../../../../lib/glantern-utils/src/NotImplementedError";

export class Transform {

    constructor() {
        this.matrix = new Matrix();
        this.matrix3D = new Matrix3D();
        this.colorTransform = new ColorTransform();
        this.perspectiveProjection = new PerspectiveProjection();
    }

    colorTransform:ColorTransform = null;

    get concatenatedColorTransform():ColorTransform {
        throw new NotImplementedError();
    }

    get concatenatedMatrix():Matrix {
        throw new NotImplementedError();
    }

    matrix:Matrix = null;
    matrix3D:Matrix3D = null;
    perspectiveProjection:PerspectiveProjection = null;

    get pixelBounds():Rectangle {
        return this._pixelBounds;
    }

    getRelativeMatrix3D(relativeTo:DisplayObject):Matrix3D {
        throw new NotImplementedError();
    }

    private _pixelBounds:Rectangle = null;

}
