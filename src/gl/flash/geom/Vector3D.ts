/**
 * Created by MIC on 2015/11/18.
 */

import ICopyable from "../../mic/ICopyable";
import ICloneable from "../../mic/ICloneable";
import MathUtil from "../../mic/MathUtil";

export default class Vector3D implements ICloneable<Vector3D>, ICopyable<Vector3D> {

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    static get X_AXIS(): Vector3D {
        return new Vector3D(1, 0, 0);
    }

    static get Y_AXIS(): Vector3D {
        return new Vector3D(0, 1, 0);
    }

    static get Z_AXIS(): Vector3D {
        return new Vector3D(0, 0, 1);
    }

    static get ORIGIN(): Vector3D {
        return new Vector3D(0, 0, 0);
    }

    w: number = 0;
    x: number = 0;
    y: number = 0;
    z: number = 0;

    get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    get lengthSquared(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    add(a: Vector3D): Vector3D {
        return new Vector3D(this.x + a.x, this.y + a.y, this.z + a.z, this.w);
    }

    static angleBetween(a: Vector3D, b: Vector3D): number {
        var mulNom = a.x * b.x + a.y * b.y + a.z * b.z;
        var den = a.length * b.length;
        var val = Math.sqrt(mulNom * mulNom / den);
        return Math.acos(val);
    }

    clone(): Vector3D {
        return new Vector3D(this.x, this.y, this.z, this.w);
    }

    copyFrom(a: Vector3D): void {
        this.x = a.x;
        this.y = a.y;
        this.z = a.z;
        this.w = a.w;
    }

    crossProduct(a: Vector3D): Vector3D {
        var i = this.y * a.z - this.z * a.y;
        var j = this.z * a.x - this.x * a.z;
        var k = this.x * a.y - this.y * a.x;
        return new Vector3D(i, j, k, this.w);
    }

    decrementBy(a: Vector3D): void {
        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;
    }

    static distance(pt1: Vector3D, pt2: Vector3D): number {
        return Math.sqrt((pt1.x - pt2.x) * (pt1.x - pt2.x) + (pt1.y - pt2.y) * (pt1.y - pt2.y) + (pt1.z - pt2.z) * (pt1.z - pt2.z));
    }

    dotProduct(a: Vector3D): number {
        return this.x * a.x + this.y * a.y + this.z * a.z;
    }

    equals(toCompare: Vector3D, allFour: boolean = false): boolean {
        return this.x == toCompare.x && this.y == toCompare.y && this.z == toCompare.y && !(allFour && this.w != toCompare.w);
    }

    incrementBy(a: Vector3D): void {
        this.x += a.x;
        this.y += a.y;
        this.z += a.z;
    }

    nearEquals(toCompare: Vector3D, tolerance: number, allFour: boolean = false): boolean {
        return MathUtil.isValueBetweenNotEquals(this.x, toCompare.x - tolerance, toCompare.x + tolerance) &&
            MathUtil.isValueBetweenNotEquals(this.y, toCompare.y - tolerance, toCompare.y + tolerance) &&
            MathUtil.isValueBetweenNotEquals(this.z, toCompare.z - tolerance, toCompare.z + tolerance) && !(
                allFour && !MathUtil.isValueBetweenNotEquals(this.w, toCompare.w - tolerance, toCompare.w + tolerance)
            );
    }

    negate(): void {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
    }

    normalize(): number {
        var len = this.length;
        if (len > 0) {
            this.x /= len;
            this.y /= len;
            this.z /= len;
        }
        return len;
    }

    project(): void {
        if (this.w != null && this.w != 0) {
            this.x /= this.w;
            this.y /= this.w;
            this.z /= this.w;
        }
    }

    scaleBy(s: number): void {
        this.x *= s;
        this.y *= s;
        this.z *= s;
    }

    setTo(xa: number, ya: number, za: number): void {
        this.x = xa;
        this.y = ya;
        this.z = za;
    }

    subtract(a: Vector3D): Vector3D {
        return new Vector3D(this.x - a.x, this.y - a.y, this.z - a.z, this.w);
    }

    toString(): string {
        return `[x=${this.x}, y=${this.y}, z=${this.z}, w=${this.w}]`;
    }

}
