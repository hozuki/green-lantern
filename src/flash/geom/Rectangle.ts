/**
 * Created by MIC on 2015/11/18.
 */

import {Point} from "./Point";
import {ICopyable} from "../../glantern/ICopyable";
import {ICloneable} from "../../glantern/ICloneable";

export class Rectangle implements ICloneable<Rectangle>, ICopyable<Rectangle> {

    constructor(x:number = 0, y:number = 0, width:number = 0, height:number = 0) {
        this._x = x >= 0 ? x : 0;
        this._y = y >= 0 ? y : 0;
        this._w = width >= 0 ? width : 0;
        this._h = height >= 0 ? height : 0;
    }

    get bottom():number {
        return this._y + this._h;
    }

    set bottom(v:number) {
        if (v < this._y) {
            v = this._y;
        }
        this._h = v - this._y;
    }

    get bottomRight():Point {
        return new Point(this._x + this._w, this._y + this._h);
    }

    set bottomRight(v:Point) {
        this.right = v.x;
        this.bottom = v.y;
    }

    clone():Rectangle {
        return new Rectangle(this._x, this._y, this._w, this._h);
    }

    contains(x:number, y:number):boolean {
        return this.left <= x && x <= this.right && this.top <= y && y <= this.bottom;
    }

    containsPoint(point:Point):boolean {
        return this.contains(point.x, point.y);
    }

    containsRect(rect:Rectangle):boolean {
        return this.containsPoint(rect.topLeft) && this.containsPoint(rect.bottomRight);
    }

    copyFrom(sourceRect:Rectangle):void {
        this._x = sourceRect._x;
        this._y = sourceRect._y;
        this._w = sourceRect._w;
        this._h = sourceRect._h;
    }

    equals(toCompare:Rectangle):boolean {
        return this._x == toCompare._x && this._y == toCompare._y && this._w == toCompare._w && this._h == toCompare._h;
    }

    get height():number {
        return this._h;
    }

    set height(v:number) {
        this._h = v >= 0 ? v : 0;
    }

    inflate(dx:number, dy:number):void {
        // TODO: bug when dx or dy is less than 0
        this.x -= dx;
        this.width += dx + dx;
        this.y -= dy;
        this.height += dy + dy;
    }

    inflatePoint(point:Point):void {
        this.inflate(point.x, point.y);
    }

    intersection(toIntersect:Rectangle):Rectangle {
        var x:number;
        var y:number;
        var w:number;
        var h:number;
        var rect1:Rectangle;
        var rect2:Rectangle;
        if (this.left < toIntersect.left) {
            rect1 = this;
            rect2 = toIntersect;
        } else {
            rect1 = toIntersect;
            rect2 = this;
        }
        if (rect1.right < rect2.left) {
            return new Rectangle(); // Does not intersect
        } else {
            x = rect2.left;
            w = Math.min(rect1.right, rect2.right) - x;
        }
        if (this.top < toIntersect.top) {
            rect1 = this;
            rect2 = toIntersect;
        } else {
            rect1 = toIntersect;
            rect2 = this;
        }
        if (rect1.bottom < rect2.top) {
            return new Rectangle(); // Does not intersect
        } else {
            y = rect2.top;
            h = Math.min(rect1.bottom, rect2.bottom) - y;
        }
        return new Rectangle(x, y, w, h);
    }

    intersects(toIntersect:Rectangle):boolean {
        var rect1:Rectangle;
        var rect2:Rectangle;
        if (this.left < toIntersect.left) {
            rect1 = this;
            rect2 = toIntersect;
        } else {
            rect1 = toIntersect;
            rect2 = this;
        }
        if (rect1.right < rect2.left) {
            return false;
        }
        if (this.top < toIntersect.top) {
            rect1 = this;
            rect2 = toIntersect;
        } else {
            rect1 = toIntersect;
            rect2 = this;
        }
        return rect1.bottom >= rect2.top
    }

    isEmpty():boolean {
        return this._w <= 0 || this._h <= 0;
    }

    get left():number {
        return this._x;
    }

    set left(v:number) {
        this._x = v >= 0 ? v : 0;
    }

    offset(dx:number, dy:number):void {
        this.x += dx;
        this.y += dy;
    }

    offsetPoint(point:Point):void {
        this.offset(point.x, point.y);
    }

    get right():number {
        return this._x + this._w;
    }

    set right(v:number) {
        if (v < this._x) {
            v = this._x;
        }
        this._w = v - this._x;
    }

    setEmpty():void {
        this._x = this._y = this._w = this._h = 0;
    }

    setTo(xa:number, ya:number, widtha:number, heighta:number):void {
        this.x = xa;
        this.y = ya;
        this.width = widtha;
        this.height = heighta;
    }

    get size():Point {
        return new Point(this._w, this._h);
    }

    set size(v:Point) {
        this._w = v.x;
        this._h = v.y;
    }

    get top():number {
        return this._y;
    }

    set top(v:number) {
        if (v > this._y + this._h) {
            v = this._y + this._h;
        }
        this._h = this._y + this._h - v;
        this._y = v;
    }

    get topLeft():Point {
        return new Point(this._x, this._y);
    }

    set topLeft(v:Point) {
        this.left = v.x;
        this.top = v.y;
    }

    toString():string {
        return `(x=${this.x}, y=${this.y}, w=${this.width}, h=${this.height})`;
    }

    union(toUnion:Rectangle):Rectangle {
        var x = Math.min(this.x, toUnion.x);
        var y = Math.min(this.y, toUnion.y);
        var r = Math.max(this.right, toUnion.right);
        var b = Math.max(this.bottom, toUnion.bottom);
        return new Rectangle(x, y, r - x, b - y);
    }

    get width():number {
        return this._w;
    }

    set width(v:number) {
        this._w = v >= 0 ? v : 0;
    }

    get x():number {
        return this._x;
    }

    set x(v:number) {
        this._x = v;
    }

    get y():number {
        return this._y;
    }

    set y(v:number) {
        this._y = v;
    }

    private _x:number = 0;
    private _y:number = 0;
    private _w:number = 0;
    private _h:number = 0;

}
