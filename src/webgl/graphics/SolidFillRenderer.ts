/**
 * Created by MIC on 2015/11/20.
 */

import libtess = require("libtess");

import {FillRendererBase} from "./FillRendererBase";
import {Graphics} from "../../flash/display/Graphics";
import {CURVE_ACCURACY, STD_Z} from "./GRAPHICS_CONST";
import {WebGLRenderer} from "../WebGLRenderer";
import {RenderHelper} from "../RenderHelper";
import {RenderTarget2D} from "../RenderTarget2D";
import {GLUtil} from "../../../lib/glantern-utils/src/GLUtil";
import {NotImplementedError} from "../../../lib/glantern-utils/src/NotImplementedError";

export class SolidFillRenderer extends FillRendererBase {

    constructor(graphics:Graphics, startX:number, startY:number, color:number, alpha:number) {
        super(graphics, startX, startY);
        this._a = GLUtil.limitInto(alpha, 0, 1);
        this._r = ((color >>> 16) & 0xff) / 0xff;
        this._g = ((color >>> 8 ) & 0xff) / 0xff;
        this._b = (color & 0xff) / 0xff;
    }

    bezierCurveTo(cx1:number, cy1:number, cx2:number, cy2:number, x:number, y:number):void {
        this._isDirty = true;
        var currentContour = this.getContourForLines();
        if (!this._hasDrawnAnything || this._startingNewContour) {
            currentContour.push(this._currentX, this._currentY, STD_Z);
        }
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
            currentContour.push(xa, ya, STD_Z);
        }
        this._currentX = x;
        this._currentY = y;
        this._hasDrawnAnything = true;
        this._startingNewContour = false;
    }

    curveTo(cx:number, cy:number, x:number, y:number):void {
        this._isDirty = true;
        var currentContour = this.getContourForLines();
        if (!this._hasDrawnAnything || this._startingNewContour) {
            currentContour.push(this._currentX, this._currentY, STD_Z);
        }
        var j:number;
        var fromX = this._currentX, fromY = this._currentY;
        var xa:number, ya:number;
        for (var i = 1; i <= CURVE_ACCURACY; i++) {
            j = i / CURVE_ACCURACY;
            xa = fromX + (cx - fromX) * j;
            ya = fromY + (cy - fromY) * j;
            xa = xa + (cx + (x - cx) * j - xa) * j;
            ya = ya + (cy + (y - cy) * j - ya) * j;
            currentContour.push(xa, ya, STD_Z);
        }
        this._currentX = x;
        this._currentY = y;
        this._hasDrawnAnything = true;
        this._startingNewContour = false;
    }

    drawCircle(x:number, y:number, radius:number):void {
        this._isDirty = true;
        this.moveTo(x, y);
        var currentContour = this.getContourForClosedShapes();
        var thetaNext:number;
        var thetaBegin:number;
        var x2:number, y2:number;
        var halfPi = Math.PI / 2;
        currentContour.push(this._currentX + radius, this._currentY, STD_Z);
        thetaBegin = 0;
        // Draw 4 segments of arcs, [-PI, -PI/2] [-PI/2, 0] [0, PI/2] [PI/2 PI]
        for (var k = 0; k < 4; k++) {
            for (var i = 1; i <= CURVE_ACCURACY; i++) {
                thetaNext = thetaBegin - i / CURVE_ACCURACY * halfPi;
                x2 = x + radius * Math.cos(thetaNext);
                y2 = y + radius * Math.sin(thetaNext);
                currentContour.push(x2, y2, STD_Z);
            }
            thetaBegin -= halfPi;
        }
        this._currentX = x + radius;
        this._currentY = y;
        this._lastPathStartX = x + radius;
        this._lastPathStartY = y;
        this._hasDrawnAnything = true;
        this._startingNewContour = false;
    }

    drawEllipse(x:number, y:number, width:number, height:number):void {
        this._isDirty = true;
        this.moveTo(x, y + height / 2);
        var currentContour = this.getContourForClosedShapes();
        var thetaNext:number;
        var thetaBegin:number;
        var centerX = x + width / 2, centerY = y + height / 2;
        var x2:number, y2:number;
        var halfPi = Math.PI / 2;
        currentContour.push(this._currentX, this._currentY, STD_Z);
        thetaBegin = Math.PI;
        // Draw 4 segments of arcs, [-PI, -PI/2] [-PI/2, 0] [0, PI/2] [PI/2 PI]
        // Brute, huh? Luckily there are 20 segments per PI/2...
        for (var k = 0; k < 4; k++) {
            for (var i = 1; i <= CURVE_ACCURACY; i++) {
                thetaNext = thetaBegin - i / CURVE_ACCURACY * halfPi;
                x2 = centerX + width / 2 * Math.cos(thetaNext);
                y2 = centerY + height / 2 * Math.sin(thetaNext);
                currentContour.push(x2, y2, STD_Z);
            }
            thetaBegin -= halfPi;
        }
        this._currentX = x + width;
        this._currentY = y + height / 2;
        this._lastPathStartX = x + width;
        this._lastPathStartY = y + height / 2;
        this._hasDrawnAnything = true;
        this._startingNewContour = false;
    }

    drawRect(x:number, y:number, width:number, height:number):void {
        this._isDirty = true;
        this.moveTo(x, y);
        // Create a new contour and draw a independent rectangle, should not use lineTo().
        var currentContour = this.getContourForClosedShapes();
        currentContour.push(x, y, STD_Z);
        currentContour.push(x + width, y, STD_Z);
        currentContour.push(x + width, y + height, STD_Z);
        currentContour.push(x, y + height, STD_Z);
        this._currentX = x;
        this._currentY = y;
        this._hasDrawnAnything = true;
        this._startingNewContour = false;
    }

    drawRoundRect(x:number, y:number, width:number, height:number, ellipseWidth:number, ellipseHeight:number = NaN):void {
        throw new NotImplementedError();
    }

    lineTo(x:number, y:number):void {
        this._isDirty = true;
        var currentContour = this.getContourForLines();
        if (!this._hasDrawnAnything || this._startingNewContour) {
            currentContour.push(this._currentX, this._currentY, STD_Z);
        }
        currentContour.push(x, y, STD_Z);
        this._currentX = x;
        this._currentY = y;
        this._hasDrawnAnything = true;
        this._startingNewContour = false;
    }

    update():void {
        if (this._isDirty) {
            // Triangulate first
            var tess = this._graphics.renderer.tessellator;
            tess.gluTessProperty(libtess.gluEnum.GLU_TESS_WINDING_RULE, libtess.windingRule.GLU_TESS_WINDING_ODD);
            tess.gluTessNormal(0, 0, 1);
            var resultArray:number[][] = [];
            tess.gluTessBeginPolygon(resultArray);
            var contour:number[];
            for (var i = 0; i < this._contours.length; i++) {
                contour = this._contours[i];
                if (contour.length > 0) {
                    tess.gluTessBeginContour();
                    for (var j = 0; j < contour.length; j += 3) {
                        var coords = [contour[j], contour[j + 1], contour[j + 2]];
                        tess.gluTessVertex(coords, coords);
                    }
                    tess.gluTessEndContour();
                }
            }
            tess.gluTessEndPolygon();

            this._vertices = [];
            this._colors = [];
            this._indices = [];
            var colors = this._colors;
            var indices = this._indices;
            var vertices = this._vertices;
            j = 0;
            var tempArray:number[];
            for (var i = 0; i < resultArray.length; i++) {
                tempArray = resultArray[i];
                for (var j = 0; j < tempArray.length; j++) {
                    vertices.push(tempArray[j]);
                }
            }
            j = 0;
            for (var i = 0; i < vertices.length; i += 3) {
                colors.push(this._r * this._a, this._g * this._a, this._b * this._a, this._a);
                indices.push(j);
                j++;
            }
        }

        // Then update buffers
        super.update();
    }

    render(renderer:WebGLRenderer):void {
        if (this._vertices.length > 0) {
            var target = renderer.currentRenderTarget;
            RenderHelper.renderPrimitives2(renderer, target, this._vertexBuffer, this._colorBuffer, this._indexBuffer, false, target.isRoot, false);
        }
    }

    private _r:number = 0;
    private _g:number = 0;
    private _b:number = 0;
    private _a:number = 1;

}
