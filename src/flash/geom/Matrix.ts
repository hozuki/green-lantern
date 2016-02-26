/**
 * Created by MIC on 2015/11/18.
 */

import {Point} from "./Point";
import {Vector3D} from "./Vector3D";
import {ICloneable} from "../../ICloneable";
import {ICopyable} from "../../ICopyable";
import {NotImplementedError} from "../../../lib/glantern-utils/src/NotImplementedError";

export class Matrix implements ICloneable<Matrix>, ICopyable<Matrix> {

    constructor(a:number = 1, b:number = 0, c:number = 1, d:number = 1, tx:number = 0, ty:number = 0) {
        this._data = [a, c, tx, b, d, ty, 0, 0, 1];
    }

    get a():number {
        return this._data[0];
    }

    set a(v:number) {
        this._data[0] = v;
    }

    get b():number {
        return this._data[3];
    }

    set b(v:number) {
        this._data[3] = v;
    }

    get c():number {
        return this._data[1];
    }

    set c(v:number) {
        this._data[1] = v;
    }

    get d():number {
        return this._data[4];
    }

    set d(v:number) {
        this._data[4] = v;
    }

    get tx():number {
        return this._data[2];
    }

    set tx(v:number) {
        this._data[2] = v;
    }

    get ty():number {
        return this._data[5];
    }

    set ty(v:number) {
        this._data[5] = v;
    }

    clone():Matrix {
        return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
    }

    concat(m:Matrix):void {
        this._data = Matrix.dotProduct(this._data, m._data);
    }

    copyColumnFrom(column:number, vector3D:Vector3D):void {
        if (column < 0 || column > 2) {
            throw new RangeError('Column must be 0, 1, or 2.');
        }
        this._data[column * 3] = vector3D.x;
        this._data[1 + column * 3] = vector3D.y;
        this._data[2 + column * 3] = vector3D.z;
    }

    copyColumnTo(column:number, vector3D:Vector3D):void {
        if (column < 0 || column > 2) {
            throw new RangeError('Column must be 0, 1, or 2.');
        }
        vector3D.x = this._data[column * 3];
        vector3D.y = this._data[1 + column * 3];
        vector3D.z = this._data[2 + column * 3];
    }

    copyFrom(sourceMatrix:Matrix):void {
        this._data = sourceMatrix._data.slice();
    }

    copyRowFrom(row:number, vector3D:Vector3D):void {
        if (row < 0 || row > 2) {
            throw new RangeError('Row must be 0, 1, or 2.');
        }
        this._data[row] = vector3D.x;
        this._data[row + 3] = vector3D.y;
        this._data[row + 6] = vector3D.z;
    }

    copyRowTo(row:number, vector3D:Vector3D):void {
        if (row < 0 || row > 2) {
            throw new RangeError('Column must be 0, 1, or 2.');
        }
        vector3D.x = this._data[row];
        vector3D.y = this._data[3 + row];
        vector3D.z = this._data[6 + row];
    }

    createBox(scaleX:number, scaleY:number, rotation:number = 0, tx:number = 0, ty:number = 0):void {
        this.identity();
        this.rotate(rotation);
        this.scale(scaleX, scaleY);
        this.translate(tx, ty);
    }

    createGradientBox(width:number, height:number, rotation:number = 0, tx:number = 0, ty:number = 0):void {
        this.createBox(width, height, rotation, tx, ty);
    }

    deltaTransformPoint(point:Point):Point {
        throw new NotImplementedError();
    }

    identity():void {
        this._data = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    }

    invert():boolean {
        throw new NotImplementedError();
    }

    rotate(angle:number):void {
        this._data = Matrix.dotProduct(this._data, [
            Math.cos(angle), -Math.sin(angle), 0,
            Math.sin(angle), Math.cos(angle), 0,
            0, 0, 1
        ]);
    }

    scale(sx:number, sy:number):void {
        this._data = Matrix.dotProduct(this._data, [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1
        ]);
    }

    skew(skewX:number, skewY:number):void {
        this._data = Matrix.dotProduct(this._data, [
            0, Math.tan(skewX), 0,
            Math.tan(skewY), 0, 0,
            0, 0, 1
        ]);
    }

    setTo(aa:number, ba:number, ca:number, da:number, txa:number, tya:number):void {
        this._data = [aa, ca, txa, ba, da, tya, 0, 0, 1];
    }

    toString():string {
        return `[${this.a} ${this.b} 0\r\n${this.c} ${this.d} 0\r\n${this.tx} ${this.ty} 1]`;
    }

    transformPoint(point:Point):Point {
        // 由于 Flash 所用的矩阵是转置过的，所以这里变成了行×行
        //var pointVector = [point.x, point.y, 1];
        //var x = pointVector[0] * this._data[0] + pointVector[1] * this._data[1] + pointVector[2] * this._data[2];
        //var y = pointVector[0] * this._data[3] + pointVector[1] * this._data[4] + pointVector[2] * this._data[5];
        //return new Point(x, y);
        return new Point(point.x * this._data[0] + point.y * this._data[1] + this._data[2],
            point.x * this._data[3] + point.y * this._data[4] + this._data[5]);
    }

    translate(dx:number, dy:number):void {
        this.tx += dx;
        this.ty += dy;
    }

    private _data:number[];

    private static dotProduct(a:number[], b:number[]):number[] {
        if (b.length != 9) {
            throw new Error('Matrix dot product requires a 3x3 matrix.');
        }
        var result = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                for (var k = 0; k < 3; k++) {
                    result[i * 3 + j] += a[i * 3 + k] * b[k * 3 + j];
                }
            }
        }
        return result;
    }

}
