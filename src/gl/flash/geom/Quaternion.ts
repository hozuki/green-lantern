/**
 * Created by MIC on 2016/9/14.
 */

// Original author: AwayJS Team
// https://github.com/awayjs/core/blob/master/lib/geom/Vector3D.ts
// License: Apache License 2.0 (see /docs/license/awayjs-core.txt)

import Vector3D from "./Vector3D";
import Matrix3D from "./Matrix3D";
import Orientation3D from "./Orientation3D";
import ICloneable from "../../mic/ICloneable";
import ICopyable from "../../mic/ICopyable";
import CommonUtil from "../../mic/CommonUtil";
import MathUtil from "../../mic/MathUtil";

/**
 * A reference to a Vector to be used as a temporary raw data container, to prevent object creation.
 * @type {Float32Array}
 */
const RAW_DATA_CONTAINER: Float32Array = new Float32Array(16);

/**
 * A Quaternion object which can be used to represent rotations.
 */
export default class Quaternion implements ICloneable<Quaternion>, ICopyable<Quaternion> {

    /**
     * Creates a new Quaternion object.
     * @param x {Number} The x value of the quaternion.
     * @param y {Number} The y value of the quaternion.
     * @param z {Number} The z value of the quaternion.
     * @param w {Number} The w value of the quaternion.
     */
    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    /**
     * The x value of the quaternion.
     * @type {Number}
     */
    x: number = 0;

    /**
     * The y value of the quaternion.
     * @type {Number}
     */
    y: number = 0;

    /**
     * The z value of the quaternion.
     * @type {Number}
     */
    z: number = 0;

    /**
     * The w value of the quaternion.
     * @type {Number}
     */
    w: number = 1;

    /**
     * Returns the magnitude of the quaternion object.
     * @returns {Number}
     */
    get magnitude(): number {
        return Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     * Fills the quaternion object with the result from a multiplication of two quaternion objects.
     *
     * @param qa {Quaternion} The first quaternion in the multiplication.
     * @param qb {Quaternion} The second quaternion in the multiplication.
     */
    multiply(qa: Quaternion, qb: Quaternion): void {
        const w1 = qa.w, x1 = qa.x, y1 = qa.y, z1 = qa.z;
        const w2 = qb.w, x2 = qb.x, y2 = qb.y, z2 = qb.z;

        this.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
        this.x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2;
        this.y = w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2;
        this.z = w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2;
    }

    /**
     * @param vector {Vector3D}
     * @param [target] {Quaternion}
     * @returns {Quaternion}
     */
    multiplyVector(vector: Vector3D, target: Quaternion = null): Quaternion {
        if (CommonUtil.isNull(target)) {
            target = new Quaternion();
        }

        const x2 = vector.x;
        const y2 = vector.y;
        const z2 = vector.z;

        target.w = -this.x * x2 - this.y * y2 - this.z * z2;
        target.x = this.w * x2 + this.y * z2 - this.z * y2;
        target.y = this.w * y2 - this.x * z2 + this.z * x2;
        target.z = this.w * z2 + this.x * y2 - this.y * x2;

        return target;
    }

    /**
     * Fills the quaternion object with values representing the given rotation around a vector.
     * @param axis {Vector3D} The axis around which to rotate
     * @param angle {Number} The angle in radians of the rotation.
     */
    fromAxisAngle(axis: Vector3D, angle: number): void {
        const sin_a = Math.sin(angle / 2);
        const cos_a = Math.cos(angle / 2);

        this.x = axis.x * sin_a;
        this.y = axis.y * sin_a;
        this.z = axis.z * sin_a;
        this.w = cos_a;

        this.normalize();
    }

    /**
     * Spherically interpolates between two quaternions, providing an interpolation between rotations with constant angle change rate.
     * @param qa {Quaternion} The first quaternion to interpolate.
     * @param qb {Quaternion} The second quaternion to interpolate.
     * @param t {Number} The interpolation weight, a value between 0 and 1.
     */
    slerp(qa: Quaternion, qb: Quaternion, t: number): void {
        let w1 = qa.w, x1 = qa.x, y1 = qa.y, z1 = qa.z;
        let w2 = qb.w, x2 = qb.x, y2 = qb.y, z2 = qb.z;
        let dot = w1 * w2 + x1 * x2 + y1 * y2 + z1 * z2;

        // shortest direction
        if (dot < 0) {
            dot = -dot;
            w2 = -w2;
            x2 = -x2;
            y2 = -y2;
            z2 = -z2;
        }

        if (dot < 0.95) {
            // interpolate angle linearly
            const angle = Math.acos(dot);
            const s = 1 / Math.sin(angle);
            const s1 = Math.sin(angle * (1 - t)) * s;
            const s2 = Math.sin(angle * t) * s;
            this.w = w1 * s1 + w2 * s2;
            this.x = x1 * s1 + x2 * s2;
            this.y = y1 * s1 + y2 * s2;
            this.z = z1 * s1 + z2 * s2;
        } else {
            // nearly identical angle, interpolate linearly
            this.w = w1 + t * (w2 - w1);
            this.x = x1 + t * (x2 - x1);
            this.y = y1 + t * (y2 - y1);
            this.z = z1 + t * (z2 - z1);
            const len = 1 / Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
            this.w *= len;
            this.x *= len;
            this.y *= len;
            this.z *= len;
        }
    }

    /**
     * Linearly interpolates between two quaternions.
     * @param qa {Quaternion} The first quaternion to interpolate.
     * @param qb {Quaternion} The second quaternion to interpolate.
     * @param t {Number} The interpolation weight, a value between 0 and 1.
     */
    lerp(qa: Quaternion, qb: Quaternion, t: number): void {
        t = MathUtil.clamp(t, 0, 1);
        let w1 = qa.w, x1 = qa.x, y1 = qa.y, z1 = qa.z;
        let w2 = qb.w, x2 = qb.x, y2 = qb.y, z2 = qb.z;

        // shortest direction
        if (w1 * w2 + x1 * x2 + y1 * y2 + z1 * z2 < 0) {
            w2 = -w2;
            x2 = -x2;
            y2 = -y2;
            z2 = -z2;
        }

        this.w = w1 + t * (w2 - w1);
        this.x = x1 + t * (x2 - x1);
        this.y = y1 + t * (y2 - y1);
        this.z = z1 + t * (z2 - z1);

        const len = 1 / Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
        this.w *= len;
        this.x *= len;
        this.y *= len;
        this.z *= len;
    }

    /**
     * Fills the quaternion object with values representing the given euler rotation.
     * @param ax {Number} The angle in radians of the rotation around the ax axis.
     * @param ay {Number} The angle in radians of the rotation around the ay axis.
     * @param az {Number} The angle in radians of the rotation around the az axis.
     */
    fromEulerAngles(ax: number, ay: number, az: number): void {
        const halfX = ax / 2, halfY = ay / 2, halfZ = az / 2;
        const cosX = Math.cos(halfX), sinX = Math.sin(halfX);
        const cosY = Math.cos(halfY), sinY = Math.sin(halfY);
        const cosZ = Math.cos(halfZ), sinZ = Math.sin(halfZ);

        this.w = cosX * cosY * cosZ + sinX * sinY * sinZ;
        this.x = sinX * cosY * cosZ - cosX * sinY * sinZ;
        this.y = cosX * sinY * cosZ + sinX * cosY * sinZ;
        this.z = cosX * cosY * sinZ - sinX * sinY * cosZ;
    }

    /**
     * Fills a target Vector3D object with the Euler angles that form the rotation represented by this quaternion.
     * @param [target] {Vector3D} An optional Vector3D object to contain the Euler angles. If not provided, a new object is created.
     * @returns {Vector3D} The Vector3D containing the Euler angles.
     */
    toEulerAngles(target: Vector3D = null): Vector3D {
        if (CommonUtil.isNull(target)) {
            target = new Vector3D();
        }
        target.x = Math.atan2(2 * (this.w * this.x + this.y * this.z), 1 - 2 * (this.x * this.x + this.y * this.y));
        target.y = Math.asin(2 * (this.w * this.y - this.z * this.x));
        target.z = Math.atan2(2 * (this.w * this.z + this.x * this.y), 1 - 2 * (this.y * this.y + this.z * this.z));
        return target;
    }

    /**
     * Normalises the quaternion object.
     * @param value {Number} Normalized length.
     */
    normalize(value: number = 1): void {
        const magnitude = value / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        this.x *= magnitude;
        this.y *= magnitude;
        this.z *= magnitude;
        this.w *= magnitude;
    }

    /**
     * Used to trace the values of a quaternion.
     * @return A string representation of the quaternion object.
     */
    toString(): string {
        return `{x:${this.x} y:${this.y} z:${this.z} w:${this.w}}`;
    }

    /**
     * Converts the quaternion to a Matrix3D object representing an equivalent rotation.
     * @param [target] {Matrix3D} An optional Matrix3D container to store the transformation in. If not provided, a new object is created.
     * @returns {Matrix3D} A Matrix3D object representing an equivalent rotation.
     */
    toMatrix3D(target: Matrix3D = null): Matrix3D {
        const rawData: Float32Array = RAW_DATA_CONTAINER;
        const xy2 = 2 * this.x * this.y, xz2 = 2 * this.x * this.z, xw2 = 2 * this.x * this.w;
        const yz2 = 2 * this.y * this.z, yw2 = 2 * this.y * this.w, zw2 = 2 * this.z * this.w;
        const xx = this.x * this.x, yy = this.y * this.y, zz = this.z * this.z, ww = this.w * this.w;

        rawData[0] = xx - yy - zz + ww;
        rawData[4] = xy2 - zw2;
        rawData[8] = xz2 + yw2;
        rawData[12] = 0;
        rawData[1] = xy2 + zw2;
        rawData[5] = -xx + yy - zz + ww;
        rawData[9] = yz2 - xw2;
        rawData[13] = 0;
        rawData[2] = xz2 - yw2;
        rawData[6] = yz2 + xw2;
        rawData[10] = -xx - yy + zz + ww;
        rawData[14] = 0;
        rawData[3] = 0;
        rawData[7] = 0;
        rawData[11] = 0;
        rawData[15] = 1;

        if (CommonUtil.isNull(target)) {
            return new Matrix3D(rawData);
        }
        else {
            target.copyRawDataFrom(rawData);
            return target;
        }
    }

    /**
     * Extracts a quaternion rotation matrix out of a given Matrix3D object.
     * @param matrix {Matrix3D} The Matrix3D out of which the rotation will be extracted.
     */
    fromMatrix(matrix: Matrix3D): void {
        const v = matrix.decompose(Orientation3D.QUATERNION)[1];
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = v.w;
    }

    /**
     * Converts the quaternion to a Vector.&lt;Number&gt; matrix representation of a rotation equivalent to this quaternion.
     * @param target {Number[]} The Vector.&lt;Number&gt; to contain the raw matrix data.
     * @param [exclude4thRow] {Boolean} If true, the last row will be omitted, and a 4x3 matrix will be generated instead of a 4x4.
     */
    toRawData(target: number[], exclude4thRow: boolean = false): void {
        const xy2 = 2 * this.x * this.y, xz2 = 2 * this.x * this.z, xw2 = 2 * this.x * this.w;
        const yz2 = 2 * this.y * this.z, yw2 = 2 * this.y * this.w, zw2 = 2 * this.z * this.w;
        const xx = this.x * this.x, yy = this.y * this.y, zz = this.z * this.z, ww = this.w * this.w;

        target[0] = xx - yy - zz + ww;
        target[1] = xy2 - zw2;
        target[2] = xz2 + yw2;
        target[4] = xy2 + zw2;
        target[5] = -xx + yy - zz + ww;
        target[6] = yz2 - xw2;
        target[8] = xz2 - yw2;
        target[9] = yz2 + xw2;
        target[10] = -xx - yy + zz + ww;
        target[3] = target[7] = target[11] = 0;

        if (!exclude4thRow) {
            target[12] = target[13] = target[14] = 0;
            target[15] = 1;
        }
    }

    /**
     * Clones the quaternion.
     * @returns {Quaternion} An exact duplicate of the current Quaternion.
     */
    clone(): Quaternion {
        return new Quaternion(this.x, this.y, this.z, this.w);
    }

    /**
     * Rotates a point.
     * @param vector {Vector3D} The Vector3D object to be rotated.
     * @param [target] {Vector3D} An optional Vector3D object that will contain the rotated coordinates. If not provided, a new object will be created.
     * @returns {Vector3D} A Vector3D object containing the rotated point.
     */
    rotatePoint(vector: Vector3D, target: Vector3D = null): Vector3D {
        if (CommonUtil.isNull(target)) {
            target = new Vector3D();
        }

        const x2 = vector.x, y2 = vector.y, z2 = vector.z;

        // p*q'
        const w1 = -this.x * x2 - this.y * y2 - this.z * z2;
        const x1 = this.w * x2 + this.y * z2 - this.z * y2;
        const y1 = this.w * y2 - this.x * z2 + this.z * x2;
        const z1 = this.w * z2 + this.x * y2 - this.y * x2;

        target.x = -w1 * this.x + x1 * this.w - y1 * this.z + z1 * this.y;
        target.y = -w1 * this.y + x1 * this.z + y1 * this.w - z1 * this.x;
        target.z = -w1 * this.z - x1 * this.y + y1 * this.x + z1 * this.w;

        return target;
    }

    /**
     * Copies the data from a quaternion into this instance.
     * @param q {Quaternion} The quaternion to copy from.
     */
    copyFrom(q: Quaternion): void {
        this.x = q.x;
        this.y = q.y;
        this.z = q.z;
        this.w = q.w;
    }

}
