/**
 * Created by MIC on 2015/11/20.
 */

import {NotImplementedError} from "../../_util/NotImplementedError";
import {WebGLRenderer} from "../WebGLRenderer";
import {_util} from "../../_util/_util";
import {Graphics} from "../../flash/display/Graphics";
import {StrokeRendererBase} from "./StrokeRendererBase";
import {CURVE_ACCURACY, STD_Z} from "./GRAPHICS_CONST";
import {RenderHelper} from "../RenderHelper";
import {RenderTarget2D} from "../RenderTarget2D";

export class SolidStrokeRenderer extends StrokeRendererBase {

    constructor(graphics:Graphics, lastPathStartX:number, lastPathStartY:number, currentX:number, currentY:number, lineWidth:number, color:number, alpha:number = 1.0) {
        super(graphics, lastPathStartX, lastPathStartY, currentX, currentY);
        this._a = _util.limitInto(alpha, 0, 1);
        this._r = ((color >>> 16) & 0xff) / 0xff;
        this._g = ((color >>> 8 ) & 0xff) / 0xff;
        this._b = (color & 0xff) / 0xff;
        this._w = lineWidth;
    }

    bezierCurveTo(cx1:number, cy1:number, cx2:number, cy2:number, x:number, y:number):void {
        if (this._w > 0) {
            this._isDirty = true;
            var dt1:number, dt2:number, dt3:number;
            var t2:number, t3:number;
            var fromX = this._currentX, fromY = this._currentY;
            var xa:number, ya:number;
            var j:number;
            for (var i = 1; i <= CURVE_ACCURACY; i++) {
                j = i / CURVE_ACCURACY;
                dt1 = 1 - j;
                dt2 = dt1 * dt1;
                dt3 = dt2 * dt1;
                t2 = j * j;
                t3 = t2 * j;
                xa = dt3 * fromX + 3 * dt2 * j * cx1 + 3 * dt1 * t2 * cx2 + t3 * x;
                ya = dt3 * fromY + 3 * dt2 * j * cy1 + 3 * dt1 * t2 * cy2 + t3 * y;
                this.lineTo(xa, ya);
            }
        }
        this._currentX = x;
        this._currentY = y;
    }

    curveTo(cx:number, cy:number, x:number, y:number):void {
        if (this._w > 0) {
            this._isDirty = true;
            var j:number;
            var fromX = this._currentX, fromY = this._currentY;
            var xa:number, ya:number;
            for (var i = 1; i <= CURVE_ACCURACY; i++) {
                j = i / CURVE_ACCURACY;
                xa = fromX + (cx - fromX) * j;
                ya = fromY + (cy - fromY) * j;
                xa = xa + (cx + (x - cx) * j - xa) * j;
                ya = ya + (cy + (y - cy) * j - ya) * j;
                this.lineTo(xa, ya);
            }
        }
        this._currentX = x;
        this._currentY = y;
    }

    drawCircle(x:number, y:number, radius:number):void {
        this.moveTo(x - radius, y);
        if (this._w > 0) {
            this._isDirty = true;
            var thetaNext:number;
            var thetaBegin:number;
            var x2:number, y2:number;
            var halfPi = Math.PI / 2;
            thetaBegin = Math.PI;
            // Draw 4 segments of arcs, [-PI, -PI/2] [-PI/2, 0] [0, PI/2] [PI/2 PI]
            for (var k = 0; k < 4; k++) {
                for (var i = 1; i <= CURVE_ACCURACY; i++) {
                    thetaNext = thetaBegin - i / CURVE_ACCURACY * halfPi;
                    x2 = x + radius * Math.cos(thetaNext);
                    y2 = y + radius * Math.sin(thetaNext);
                    this.lineTo(x2, y2);
                }
                thetaBegin -= halfPi;
            }
        }
        this._currentX = x + radius;
        this._currentY = y;
        this._lastPathStartX = x + radius;
        this._lastPathStartY = y;
    }

    drawEllipse(x:number, y:number, width:number, height:number):void {
        this.moveTo(x, y + height / 2);
        if (this._w > 0) {
            this._isDirty = true;
            var thetaNext:number;
            var thetaBegin:number;
            var centerX = x + width / 2, centerY = y + height / 2;
            var x2:number, y2:number;
            var halfPi = Math.PI / 2;
            thetaBegin = Math.PI;
            // Draw 4 segments of arcs, [-PI, -PI/2] [-PI/2, 0] [0, PI/2] [PI/2 PI]
            // Brute, huh? Luckily there are 20 segments per PI/2...
            for (var k = 0; k < 4; k++) {
                for (var i = 1; i <= CURVE_ACCURACY; i++) {
                    thetaNext = thetaBegin - i / CURVE_ACCURACY * halfPi;
                    x2 = centerX + width / 2 * Math.cos(thetaNext);
                    y2 = centerY + height / 2 * Math.sin(thetaNext);
                    this.lineTo(x2, y2);
                }
                thetaBegin -= halfPi;
            }
        }
        this._currentX = x + width;
        this._currentY = y + height / 2;
        this._lastPathStartX = x + width;
        this._lastPathStartY = y + height / 2;
    }

    drawRect(x:number, y:number, width:number, height:number):void {
        this._isDirty = true;
        this.moveTo(x, y);
        this.lineTo(x, y + height);
        this.lineTo(x + width, y + height);
        this.lineTo(x + width, y);
        this.lineTo(x, y);
    }

    drawRoundRect(x:number, y:number, width:number, height:number, ellipseWidth:number, ellipseHeight:number = NaN):void {
        throw new NotImplementedError();
    }

    lineTo(x:number, y:number):void {
        if (this._w > 0) {
            this._isDirty = true;
            var vertices = this.__getSimLineVertices(this._currentX, this._currentY, x, y, STD_Z, this._w);
            if (vertices.length > 0) {
                // Generated 4 vertices, matching with 6 indices (2 triangles)
                var cur = this._vertices.length / 3;
                for (var i = 0; i < 12; i++) {
                    this._vertices.push(vertices[i]);
                }
                for (var i = 0; i < 4; i++) {
                    this._colors.push(this._r * this._a, this._g * this._a, this._b * this._a, this._a);
                }
                this._indices.push(cur, cur + 1, cur + 2, cur + 1, cur + 2, cur + 3);
                this._hasDrawnAnything = true;
            }
        }
        this._currentX = x;
        this._currentY = y;
    }

    render(renderer:WebGLRenderer, target:RenderTarget2D):void {
        if (this._vertices.length > 0) {
            //primitiveTarget.renderPrimitives(this._vertexBuffer, this._colorBuffer, this._indexBuffer, false);
            RenderHelper.renderPrimitives(renderer, target, this._vertexBuffer, this._colorBuffer, this._indexBuffer, false);
        }
    }

    private _r:number = 0;
    private _g:number = 0;
    private _b:number = 0;
    private _a:number = 1;
    private _w:number = 1;

}
