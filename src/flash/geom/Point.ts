/**
 * Created by MIC on 2015/11/18.
 */

import {ICopyable} from "../../glantern/ICopyable";
import {ICloneable} from "../../glantern/ICloneable";
import {MathUtil} from "../../glantern/MathUtil";

export class Point implements ICloneable<Point>, ICopyable<Point> {

    constructor(x:number = 0, y:number = 0) {
        this.x = x;
        this.y = y;
    }

    add(v:Point):Point {
        return new Point(this.x + v.x, this.y + v.y);
    }

    clone():Point {
        return new Point(this.x, this.y);
    }

    copyFrom(sourcePoint:Point):void {
        this.x = sourcePoint.x;
        this.y = sourcePoint.y;
    }

    static distance(pt1:Point, pt2:Point):number {
        return Math.sqrt((pt1.x - pt2.x) * (pt1.x - pt2.x) + (pt1.y - pt2.y) * (pt1.y - pt2.y));
    }

    equals(toCompare:Point):boolean {
        return this.x === toCompare.x && this.y === toCompare.y;
    }

    static interpolate(pt1:Point, pt2:Point, f:number):Point {
        f = MathUtil.clamp(f, 0, 1);
        return new Point(pt1.x * f + pt2.x * (1 - f), pt1.y * f + pt2.y * (1 - f));
    }

    get length():number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize(thickness:number):void {
        var len = this.length;
        if (len > 0) {
            this.x *= thickness / len;
            this.y *= thickness / len;
        }
    }

    offset(dx:number, dy:number):void {
        this.x += dx;
        this.y += dy;
    }

    static polar(len:number, angle:number):Point {
        return new Point(len * Math.cos(angle), len * Math.sin(angle));
    }

    setTo(xa:number, ya:number):void {
        this.x = xa;
        this.y = ya;
    }

    subtract(v:Point):Point {
        return new Point(this.x - v.x, this.y - v.y);
    }

    toString():string {
        return `(X=${this.x}, y=${this.y})`;
    }

    x:number = 0;
    y:number = 0;

}
