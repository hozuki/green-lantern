/**
 * Created by MIC on 2015/11/18.
 */

import {Vector3D} from "./Vector3D";
import {Orientation3D} from "./Orientation3D";
import {ICopyable} from "../../mic/ICopyable";
import {ICloneable} from "../../mic/ICloneable";
import {NotImplementedError} from "../errors/NotImplementedError";
import {ArgumentError} from "../errors/ArgumentError";
import {ApplicationError} from "../errors/ApplicationError";
import {MathUtil} from "../../mic/MathUtil";
import {CommonUtil} from "../../mic/CommonUtil";

export class Matrix3D implements ICloneable<Matrix3D>, ICopyable<Matrix3D> {

    constructor(v: number[] | Float32Array = null) {
        if (CommonUtil.isNull(v) || v.length <= 0) {
            v = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ];
        }
        if (CommonUtil.isArray(v)) {
            this.rawData = <number[]>v.slice();
        } else {
            this.rawData = new Array<number>((<Float32Array>v).length);
            for (var i = 0; i < (<Float32Array>v).length; ++i) {
                this.rawData[i] = (<Float32Array>v)[i];
            }
        }
    }

    get determinant(): number {
        throw new NotImplementedError();
    }

    get rawData(): number[] {
        return this._data;
    }

    set rawData(v: number[]) {
        if (v.length < 16) {
            throw new Error("Data length of Matrix3D must be no less than 16.");
        }
        this._data = v.slice();
    }

    append(lhs: Matrix3D): void {
        this._data = Matrix3D.__dotProduct(lhs._data, this._data);
    }

    appendRotation(degrees: number, axis: Vector3D, pivotPoint: Vector3D = null): void {
        if (pivotPoint !== null) {
            this.appendTranslation(pivotPoint.x, pivotPoint.y, pivotPoint.z);
        }
        this._data = Matrix3D.__dotProduct(Matrix3D.__getRotationMatrix(degrees * Math.PI / 180, axis), this._data);
        if (pivotPoint !== null) {
            this.appendTranslation(-pivotPoint.x, -pivotPoint.y, -pivotPoint.z);
        }
    }

    appendScale(xScale: number, yScale: number, zScale: number): void {
        this._data = Matrix3D.__dotProduct([
            xScale, 0, 0, 0,
            0, yScale, 0, 0,
            0, 0, zScale, 0,
            0, 0, 0, 1
        ], this._data);
    }

    /**
     * Appends an incremental skew change along the x, y, and z axes to a {@link Matrix3D} object.
     */
    // AwayJS
    public appendSkew(xSkew: number, ySkew: number, zSkew: number) {
        if (xSkew === 0 && ySkew === 0 && zSkew === 0) {
            return;
        }
        var raw = TEMP_MATRIX_RAW_DATA;
        raw[0] = 1;
        raw[1] = 0;
        raw[2] = 0;
        raw[3] = 0;
        raw[4] = xSkew;
        raw[5] = 1;
        raw[6] = 0;
        raw[7] = 0;
        raw[8] = ySkew;
        raw[9] = zSkew;
        raw[10] = 1;
        raw[11] = 0;
        raw[12] = 0;
        raw[13] = 0;
        raw[14] = 0;
        raw[15] = 1;
        this.append(TEMP_MATRIX);
    }

    appendTranslation(x: number, y: number, z: number): void {
        this._data = Matrix3D.__dotProduct([
            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1
        ], this._data);
    }

    clone(): Matrix3D {
        var m: Matrix3D = new Matrix3D(this.rawData);
        m.position = this.position !== null ? this.position.clone() : null;
        return m;
    }

    copyColumnFrom(column: number, vector3D: Vector3D): void {
        if (column < 0 || column > 3) {
            throw new RangeError("Column must be 0, 1, 2 or 3.");
        }
        this._data[column * 4] = vector3D.x;
        this._data[column * 4 + 1] = vector3D.y;
        this._data[column * 4 + 2] = vector3D.z;
        this._data[column * 4 + 3] = vector3D.w;
    }

    copyColumnTo(column: number, vector3D: Vector3D): void {
        if (column < 0 || column > 3) {
            throw new RangeError("Column must be 0, 1, 2 or 3.");
        }
        vector3D.x = this._data[column * 4];
        vector3D.y = this._data[column * 4 + 1];
        vector3D.z = this._data[column * 4 + 2];
        vector3D.w = this._data[column * 4 + 3];
    }

    copyFrom(sourceMatrix3D: Matrix3D): void {
        this.position = sourceMatrix3D.position !== null ? sourceMatrix3D.position.clone() : null;
        this.rawData = sourceMatrix3D.rawData;
    }

    // AwayJS
    copyRawDataFrom(vector: number[] | Float32Array, index: number = 0, transpose: boolean = false) {
        if (transpose) {
            this.transpose();
        }
        var length = vector.length - index;
        for (var i = 0; i < length; i++) {
            this.rawData[i] = vector[i + index];
        }
        if (transpose) {
            this.transpose();
        }
    }

    // AwayJS
    copyRawDataTo(vector: number[] | Float32Array, index: number = 0, transpose: boolean = false) {
        if (transpose) {
            this.transpose();
        }
        var length = this.rawData.length;
        for (var i = 0; i < length; i++) {
            vector[i + index] = this.rawData[i];
        }
        if (transpose) {
            this.transpose();
        }
    }

    copyRowFrom(row: number, vector3D: Vector3D): void {
        if (row < 0 || row > 3) {
            throw new RangeError("Row must be 0, 1, 2 or 3.");
        }
        this._data[row] = vector3D.x;
        this._data[row + 4] = vector3D.y;
        this._data[row + 8] = vector3D.z;
        this._data[row + 12] = vector3D.w;
    }

    copyRowTo(row: number, vector3D: Vector3D): void {
        if (row < 0 || row > 3) {
            throw new RangeError("Row must be 0, 1, 2 or 3.");
        }
        vector3D.x = this._data[row];
        vector3D.y = this._data[row + 4];
        vector3D.z = this._data[row + 8];
        vector3D.w = this._data[row + 12];
    }

    copyToMatrix3D(dest: Matrix3D): void {
        dest.position = this.position !== null ? this.position.clone() : null;
        dest.rawData = this.rawData;
    }

    // AwayJS
    decompose(orientationStyle: string = Orientation3D.EULER_ANGLES): Vector3D[] {
        var components: Vector3D[] = [new Vector3D(), new Vector3D(), new Vector3D(), new Vector3D()];
        var colX = new Vector3D(this.rawData[0], this.rawData[1], this.rawData[2]);
        var colY = new Vector3D(this.rawData[4], this.rawData[5], this.rawData[6]);
        var colZ = new Vector3D(this.rawData[8], this.rawData[9], this.rawData[10]);

        var translation = components[0];
        translation.x = this.rawData[12];
        translation.y = this.rawData[13];
        translation.z = this.rawData[14];

        var scale = components[3];
        var skew = components[2];

        //compute X scale factor and normalise colX
        scale.x = colX.length;
        colX.scaleBy(1 / scale.x);

        //compute XY shear factor and make colY orthogonal to colX
        skew.x = colX.dotProduct(colY);
        colY = __combineVector(colY, colX, 1, -skew.x);

        //compute Y scale factor and normalise colY
        scale.y = colY.length;
        colY.scaleBy(1 / scale.y);
        skew.x /= scale.y;

        //compute XZ and YZ shears and make colZ orthogonal to colX and colY
        skew.y = colX.dotProduct(colZ);
        colZ = __combineVector(colZ, colX, 1, -skew.y);
        skew.z = colY.dotProduct(colZ);
        colZ = __combineVector(colZ, colY, 1, -skew.z);

        //compute Z scale and normalise colZ
        scale.z = colZ.length;
        colZ.scaleBy(1 / scale.z);
        skew.y /= scale.z;
        skew.z /= scale.z;

        //at this point, the matrix (in cols) is orthonormal
        //check for a coordinate system flip. If the determinant is -1, negate the z scaling factor
        if (colX.dotProduct(colY.crossProduct(colZ)) < 0) {
            scale.z = -scale.z;
            colZ.x = -colZ.x;
            colZ.y = -colZ.y;
            colZ.z = -colZ.z;
        }

        var rotation = components[1];
        switch (orientationStyle) {
            case Orientation3D.AXIS_ANGLE:
                rotation.w = Math.acos((colX.x + colY.y + colZ.z - 1) / 2);
                var len = Math.sqrt((colY.z - colZ.y) * (colY.z - colZ.y) + (colZ.x - colX.z) * (colZ.x - colX.z) + (colX.y - colY.x) * (colX.y - colY.x));
                rotation.x = (colY.z - colZ.y) / len;
                rotation.y = (colZ.x - colX.z) / len;
                rotation.z = (colX.y - colY.x) / len;
                break;
            case Orientation3D.QUATERNION:
                var tr = colX.x + colY.y + colZ.z;
                if (tr > 0) {
                    rotation.w = Math.sqrt(1 + tr) / 2;
                    rotation.x = (colY.z - colZ.y) / (4 * rotation.w);
                    rotation.y = (colZ.x - colX.z) / (4 * rotation.w);
                    rotation.z = (colX.y - colY.x) / (4 * rotation.w);
                } else if ((colX.x > colY.y) && (colX.x > colZ.z)) {
                    rotation.x = Math.sqrt(1 + colX.x - colY.y - colZ.z) / 2;
                    rotation.w = (colY.z - colZ.y) / (4 * rotation.x);
                    rotation.y = (colX.y + colY.x) / (4 * rotation.x);
                    rotation.z = (colZ.x + colX.z) / (4 * rotation.x);
                } else if (colY.y > colZ.z) {
                    rotation.y = Math.sqrt(1 + colY.y - colX.x - colZ.z) / 2;
                    rotation.x = (colX.y + colY.x) / (4 * rotation.y);
                    rotation.w = (colZ.x - colX.z) / (4 * rotation.y);
                    rotation.z = (colY.z + colZ.y) / (4 * rotation.y);
                } else {
                    rotation.z = Math.sqrt(1 + colZ.z - colX.x - colY.y) / 2;
                    rotation.x = (colZ.x + colX.z) / (4 * rotation.z);
                    rotation.y = (colY.z + colZ.y) / (4 * rotation.z);
                    rotation.w = (colX.y - colY.x) / (4 * rotation.z);
                }
                break;
            case Orientation3D.EULER_ANGLES:
                rotation.y = Math.asin(-colX.z);
                if (colX.z != 1 && colX.z != -1) {
                    rotation.x = Math.atan2(colY.z, colZ.z);
                    rotation.z = Math.atan2(colX.y, colX.x);
                } else {
                    rotation.z = 0;
                    rotation.x = Math.atan2(colY.x, colY.y);
                }
                break;
        }
        return components;
    }

    deltaTransformVector(v: Vector3D): Vector3D {
        throw new NotImplementedError();
    }

    identity(): void {
        this._data = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }

    static interpolate(thisMat: Matrix3D, toMat: Matrix3D, percent: number): Matrix3D {
        percent = MathUtil.clamp(percent, 0, 1);
        var data: number[] = [];
        for (var i = 0; i < 16; i++) {
            data.push(thisMat._data[i] * (1 - percent) + toMat._data[i] * percent);
        }
        return new Matrix3D(data);
    }

    interpolateTo(toMat: Matrix3D, percent: number): Matrix3D {
        return Matrix3D.interpolate(this, toMat, percent);
    }

    invert(): boolean {
        throw new NotImplementedError();
    }

    pointAt(pos: Vector3D, at: Vector3D = Vector3D.ORIGIN, up: Vector3D = Vector3D.Z_AXIS): void {
        var fx = at.x - pos.x;
        var fy = at.y - pos.y;
        var fz = at.z - pos.z;
        var rlf = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz);
        fx *= rlf;
        fy *= rlf;
        fz *= rlf;
        var sx = fy * up.z - fz * up.y;
        var sy = fz * up.x - fx * up.z;
        var sz = fx * up.y - fy * up.x;
        var rls = 1 / Math.sqrt(sx * sx + sy * sy + sz * sz);
        sx *= rls;
        sy *= rls;
        sz *= rls;
        var ux = sy * fz - sz * fy;
        var uy = sz * fx - sx * fz;
        var uz = sx * fy - sy * fx;
        var d = this._data;
        d[0] = sx;
        d[1] = sy;
        d[2] = sz;
        d[3] = 0;
        d[4] = ux;
        d[5] = uy;
        d[6] = uz;
        d[7] = 0;
        d[8] = -fx;
        d[9] = -fy;
        d[10] = -fz;
        d[11] = 0;
        d[12] = 0;
        d[13] = 0;
        d[14] = 0;
        d[15] = 1;
        // translate(-pos.x, -pos.y, -pos.z)
        var x = -pos.x, y = -pos.y, z = -pos.z;
        d[3] += d[0] * x + d[1] * y + d[2] * z;
        d[7] += d[4] * x + d[5] * y + d[6] * z;
        d[11] += d[8] * x + d[9] * y + d[10] * z;
        d[15] += d[12] * x + d[13] * y + d[14] * z;
    }

    prepend(rhs: Matrix3D): void {
        this._data = Matrix3D.__dotProduct(this._data, rhs._data);
    }

    prependRotation(degrees: number, axis: Vector3D, pivotPoint: Vector3D = null): void {
        if (pivotPoint !== null) {
            this.prependTranslation(pivotPoint.x, pivotPoint.y, pivotPoint.z);
        }
        this._data = Matrix3D.__dotProduct(this._data, Matrix3D.__getRotationMatrix(degrees * Math.PI / 180, axis));
        if (pivotPoint !== null) {
            this.prependTranslation(-pivotPoint.x, -pivotPoint.y, -pivotPoint.z);
        }
    }

    prependScale(xScale: number, yScale: number, zScale: number): void {
        this._data = Matrix3D.__dotProduct(this._data, [
            xScale, 0, 0, 0,
            0, yScale, 0, 0,
            0, 0, zScale, 0,
            0, 0, 0, 1
        ]);
    }

    /**
     * Prepends an incremental skew change along the x, y, and z axes to a {@link Matrix3D} object.
     */
    // AwayJS
    public prependSkew(xSkew: number, ySkew: number, zSkew: number) {
        if (xSkew === 0 && ySkew === 0 && zSkew === 0) {
            return;
        }
        var raw = TEMP_MATRIX_RAW_DATA;
        raw[0] = 1;
        raw[1] = 0;
        raw[2] = 0;
        raw[3] = 0;
        raw[4] = xSkew;
        raw[5] = 1;
        raw[6] = 0;
        raw[7] = 0;
        raw[8] = ySkew;
        raw[9] = zSkew;
        raw[10] = 1;
        raw[11] = 0;
        raw[12] = 0;
        raw[13] = 0;
        raw[14] = 0;
        raw[15] = 1;
        this.prepend(TEMP_MATRIX);
    }

    prependTranslation(x: number, y: number, z: number): void {
        this._data = Matrix3D.__dotProduct(this._data, [
            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1
        ]);
    }

    // AwayJS
    // TODO: orientationStyle
    recompose(components: Vector3D[], orientationStyle: string = Orientation3D.EULER_ANGLES): boolean {
        if (orientationStyle != Orientation3D.EULER_ANGLES) {
            throw new NotImplementedError();
        }

        if (!CommonUtil.isArray(components)) {
            return false;
        }
        for (var i = 0; i < components.length; ++i) {
            if (CommonUtil.isUndefinedOrNull(components[i]) || !(components[i] instanceof Vector3D)) {
                return false;
            }
        }

        var translation = CommonUtil.ptr(components[0]) ? components[0] : this.position;
        this.identity();
        var scale = components[3];
        if (CommonUtil.ptr(scale) && (scale.x !== 1 || scale.y !== 1 || scale.z !== 1)) {
            this.appendScale(scale.x, scale.y, scale.z);
        }

        var skew = components[2];
        if (CommonUtil.ptr(skew) && (skew.x !== 0 || skew.y !== 0 || skew.z !== 0)) {
            this.appendSkew(skew.x, skew.y, skew.z);
        }

        var sin: number;
        var cos: number;
        var raw = TEMP_MATRIX_RAW_DATA;
        raw[12] = 0;
        raw[13] = 0;
        raw[14] = 0;
        raw[15] = 0;

        var rotation = components[1];
        if (rotation) {
            var angle = -rotation.x;
            if (angle != 0) {
                sin = Math.sin(angle);
                cos = Math.cos(angle);
                raw[0] = 1;
                raw[1] = 0;
                raw[2] = 0;
                raw[3] = 0;
                raw[4] = 0;
                raw[5] = cos;
                raw[6] = -sin;
                raw[7] = 0;
                raw[8] = 0;
                raw[9] = sin;
                raw[10] = cos;
                raw[11] = 0;
                this.append(TEMP_MATRIX);
            }
            angle = -rotation.y;
            if (angle != 0) {
                sin = Math.sin(angle);
                cos = Math.cos(angle);
                raw[0] = cos;
                raw[1] = 0;
                raw[2] = sin;
                raw[3] = 0;
                raw[4] = 0;
                raw[5] = 1;
                raw[6] = 0;
                raw[7] = 0;
                raw[8] = -sin;
                raw[9] = 0;
                raw[10] = cos;
                raw[11] = 0;
                this.append(TEMP_MATRIX);
            }
            angle = -rotation.z;
            if (angle != 0) {
                sin = Math.sin(angle);
                cos = Math.cos(angle);
                raw[0] = cos;
                raw[1] = -sin;
                raw[2] = 0;
                raw[3] = 0;
                raw[4] = sin;
                raw[5] = cos;
                raw[6] = 0;
                raw[7] = 0;
                raw[8] = 0;
                raw[9] = 0;
                raw[10] = 1;
                raw[11] = 0;
                this.append(TEMP_MATRIX);
            }
        }
        this.position = translation;
        this.rawData[15] = 1;
        return true;
    }

    transformVector(v: Vector3D): Vector3D {
        var x = this._data[0] * v.x + this._data[1] * v.y + this._data[2] * v.z + this._data[3] * v.w;
        var y = this._data[4] * v.x + this._data[5] * v.y + this._data[6] * v.z + this._data[7] * v.w;
        var z = this._data[8] * v.x + this._data[9] * v.y + this._data[10] * v.z + this._data[11] * v.w;
        var w = this._data[12] * v.x + this._data[13] * v.y + this._data[14] * v.z + this._data[15] * v.w;
        return new Vector3D(x, y, z, w);
    }

    transformVectors(vin: number[], vout: number[]): void {
        if (vin.length % 3 !== 0) {
            throw new ApplicationError("Matrix3D.transformVectors needs 2 arrays, size of the input array must be multiple of 3.");
        }
        for (var i = 0; i < vin.length / 3; i++) {
            var x = vin[i * 3], y = vin[i * 3 + 1], z = vin[i * 3 + 2];
            var rx = this._data[0] * x + this._data[1] * y + this._data[2] * z;
            var ry = this._data[4] * x + this._data[5] * y + this._data[6] * z;
            var rz = this._data[8] * x + this._data[9] * y + this._data[10] * z;
            vout.push(rx, ry, rz);
        }
    }

    transpose(): void {
        var d = this._data;
        this._data = [
            d[0], d[4], d[8], d[12],
            d[1], d[5], d[9], d[13],
            d[2], d[6], d[10], d[14],
            d[3], d[7], d[11], d[15]
        ];
    }

    toArray(): Float32Array {
        var d = this._data;
        // Matrix3D is stored in row-major order, while WebGL is in column-major order.
        return new Float32Array([
            d[0], d[4], d[8], d[12],
            d[1], d[5], d[9], d[13],
            d[2], d[6], d[10], d[14],
            d[3], d[7], d[11], d[15]
        ]);
    }

    setOrthographicProjection(left: number, right: number, top: number, bottom: number, near: number, far: number): void {
        if (left === right || top === bottom || near === far) {
            throw new ArgumentError("Null frustum");
        }
        var rw = 1 / (right - left);
        var rh = 1 / (top - bottom);
        var rd = 1 / (far - near);
        var d = this._data;
        d[0] = 2 * rw;
        d[1] = 0;
        d[2] = 0;
        d[3] = -(left + right) * rw;
        d[4] = 0;
        d[5] = 2 * rh;
        d[6] = 0;
        d[7] = -(top + bottom) * rh;
        d[8] = 0;
        d[9] = 0;
        d[10] = -2 * rd;
        d[11] = -(near + far) * rd;
        d[12] = 0;
        d[13] = 0;
        d[14] = 0;
        d[15] = 1;
    }

    setPerspectiveProjection(fov: number, aspect: number, near: number, far: number): void {
        if (near === far || aspect === 0) {
            throw new ArgumentError("Null frustum");
        }
        if (near <= 0) {
            throw new ArgumentError("near <= 0");
        }
        if (far <= 0) {
            throw new ArgumentError("far <= 0");
        }
        fov = Math.PI / 2 * fov / 180;
        var s = Math.sin(fov);
        if (s === 0) {
            throw new ArgumentError("Null frustum");
        }
        var rd = 1 / (far - near);
        var ct = Math.cos(fov) / s;
        var d = this._data;
        d[0] = ct / aspect;
        d[1] = 0;
        d[2] = 0;
        d[3] = 0;
        d[4] = 0;
        d[5] = ct;
        d[6] = 0;
        d[7] = 0;
        d[8] = 0;
        d[9] = 0;
        d[10] = -(far + near) * rd;
        d[11] = -2 * near * far * rd;
        d[12] = 0;
        d[13] = 0;
        d[14] = -1;
        d[15] = 0;
    }

    position: Vector3D = null;

    private static __dotProduct(a: number[], b: number[]): number[] {
        if (a.length !== 16 || b.length !== 16) {
            throw new Error("Matrix3D dot product needs a array of 16 elements.");
        }
        var res: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                for (var k = 0; k < 4; k++) {
                    res[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j];
                }
            }
        }
        return res;
    }

    private static __getRotationMatrix(angle: number, axis: Vector3D): number[] {
        // jabbany
        var sT: number = Math.sin(angle), cT: number = Math.cos(angle);
        return [
            cT + axis.x * axis.x * (1 - cT), axis.x * axis.y * (1 - cT) - axis.z * sT, axis.x * axis.z * (1 - cT) + axis.y * sT, 0,
            axis.x * axis.y * (1 - cT) + axis.z * sT, cT + axis.y * axis.y * (1 - cT), axis.y * axis.z * (1 - cT) - axis.x * sT, 0,
            axis.z * axis.x * (1 - cT) - axis.y * sT, axis.z * axis.y * (1 - cT) + axis.x * sT, cT + axis.z * axis.z * (1 - cT), 0,
            0, 0, 0, 1
        ];
    }

    private _data: number[] = null;

}

const TEMP_MATRIX = new Matrix3D();
const TEMP_MATRIX_RAW_DATA = TEMP_MATRIX.rawData;

// AwayJS
function __combineVector(a: Vector3D, b: Vector3D, ascl: number, bscl: number): Vector3D {
    return new Vector3D(a.x * ascl + b.x * bscl, a.y * ascl + b.y * bscl, a.z * ascl + b.z * bscl);
}
