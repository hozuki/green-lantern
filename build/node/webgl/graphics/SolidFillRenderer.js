/**
 * Created by MIC on 2015/11/20.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var libtess = require("libtess");
var FillRendererBase_1 = require("./FillRendererBase");
var _util_1 = require("../../_util/_util");
var GRAPHICS_CONST_1 = require("./GRAPHICS_CONST");
var NotImplementedError_1 = require("../../_util/NotImplementedError");
var RenderHelper_1 = require("../RenderHelper");
var SolidFillRenderer = (function (_super) {
    __extends(SolidFillRenderer, _super);
    function SolidFillRenderer(graphics, startX, startY, color, alpha) {
        _super.call(this, graphics, startX, startY);
        this._r = 0;
        this._g = 0;
        this._b = 0;
        this._a = 1;
        this._a = _util_1._util.limitInto(alpha, 0, 1);
        this._r = ((color >>> 16) & 0xff) / 0xff;
        this._g = ((color >>> 8) & 0xff) / 0xff;
        this._b = (color & 0xff) / 0xff;
    }
    SolidFillRenderer.prototype.bezierCurveTo = function (cx1, cy1, cx2, cy2, x, y) {
        this._isDirty = true;
        var currentContour = this.getContourForLines();
        if (!this._hasDrawnAnything || this._startingNewContour) {
            currentContour.push(this._currentX, this._currentY, GRAPHICS_CONST_1.STD_Z);
        }
        var dt1, dt2, dt3;
        var t2, t3;
        var fromX = this._currentX, fromY = this._currentY;
        var xa, ya;
        var j;
        for (var i = 1; i <= GRAPHICS_CONST_1.CURVE_ACCURACY; i++) {
            j = i / GRAPHICS_CONST_1.CURVE_ACCURACY;
            dt1 = 1 - j;
            dt2 = dt1 * dt1;
            dt3 = dt2 * dt1;
            t2 = j * j;
            t3 = t2 * j;
            xa = dt3 * fromX + 3 * dt2 * j * cx1 + 3 * dt1 * t2 * cx2 + t3 * x;
            ya = dt3 * fromY + 3 * dt2 * j * cy1 + 3 * dt1 * t2 * cy2 + t3 * y;
            currentContour.push(xa, ya, GRAPHICS_CONST_1.STD_Z);
        }
        this._currentX = x;
        this._currentY = y;
        this._hasDrawnAnything = true;
        this._startingNewContour = false;
    };
    SolidFillRenderer.prototype.curveTo = function (cx, cy, x, y) {
        this._isDirty = true;
        var currentContour = this.getContourForLines();
        if (!this._hasDrawnAnything || this._startingNewContour) {
            currentContour.push(this._currentX, this._currentY, GRAPHICS_CONST_1.STD_Z);
        }
        var j;
        var fromX = this._currentX, fromY = this._currentY;
        var xa, ya;
        for (var i = 1; i <= GRAPHICS_CONST_1.CURVE_ACCURACY; i++) {
            j = i / GRAPHICS_CONST_1.CURVE_ACCURACY;
            xa = fromX + (cx - fromX) * j;
            ya = fromY + (cy - fromY) * j;
            xa = xa + (cx + (x - cx) * j - xa) * j;
            ya = ya + (cy + (y - cy) * j - ya) * j;
            currentContour.push(xa, ya, GRAPHICS_CONST_1.STD_Z);
        }
        this._currentX = x;
        this._currentY = y;
        this._hasDrawnAnything = true;
        this._startingNewContour = false;
    };
    SolidFillRenderer.prototype.drawCircle = function (x, y, radius) {
        this._isDirty = true;
        this.moveTo(x, y);
        var currentContour = this.getContourForClosedShapes();
        var thetaNext;
        var thetaBegin;
        var x2, y2;
        var halfPi = Math.PI / 2;
        currentContour.push(this._currentX + radius, this._currentY, GRAPHICS_CONST_1.STD_Z);
        thetaBegin = 0;
        // Draw 4 segments of arcs, [-PI, -PI/2] [-PI/2, 0] [0, PI/2] [PI/2 PI]
        for (var k = 0; k < 4; k++) {
            for (var i = 1; i <= GRAPHICS_CONST_1.CURVE_ACCURACY; i++) {
                thetaNext = thetaBegin - i / GRAPHICS_CONST_1.CURVE_ACCURACY * halfPi;
                x2 = x + radius * Math.cos(thetaNext);
                y2 = y + radius * Math.sin(thetaNext);
                currentContour.push(x2, y2, GRAPHICS_CONST_1.STD_Z);
            }
            thetaBegin -= halfPi;
        }
        this._currentX = x + radius;
        this._currentY = y;
        this._lastPathStartX = x + radius;
        this._lastPathStartY = y;
        this._hasDrawnAnything = true;
        this._startingNewContour = false;
    };
    SolidFillRenderer.prototype.drawEllipse = function (x, y, width, height) {
        this._isDirty = true;
        this.moveTo(x, y + height / 2);
        var currentContour = this.getContourForClosedShapes();
        var thetaNext;
        var thetaBegin;
        var centerX = x + width / 2, centerY = y + height / 2;
        var x2, y2;
        var halfPi = Math.PI / 2;
        currentContour.push(this._currentX, this._currentY, GRAPHICS_CONST_1.STD_Z);
        thetaBegin = Math.PI;
        // Draw 4 segments of arcs, [-PI, -PI/2] [-PI/2, 0] [0, PI/2] [PI/2 PI]
        // Brute, huh? Luckily there are 20 segments per PI/2...
        for (var k = 0; k < 4; k++) {
            for (var i = 1; i <= GRAPHICS_CONST_1.CURVE_ACCURACY; i++) {
                thetaNext = thetaBegin - i / GRAPHICS_CONST_1.CURVE_ACCURACY * halfPi;
                x2 = centerX + width / 2 * Math.cos(thetaNext);
                y2 = centerY + height / 2 * Math.sin(thetaNext);
                currentContour.push(x2, y2, GRAPHICS_CONST_1.STD_Z);
            }
            thetaBegin -= halfPi;
        }
        this._currentX = x + width;
        this._currentY = y + height / 2;
        this._lastPathStartX = x + width;
        this._lastPathStartY = y + height / 2;
        this._hasDrawnAnything = true;
        this._startingNewContour = false;
    };
    SolidFillRenderer.prototype.drawRect = function (x, y, width, height) {
        this._isDirty = true;
        this.moveTo(x, y);
        // Create a new contour and draw a independent rectangle, should not use lineTo().
        var currentContour = this.getContourForClosedShapes();
        currentContour.push(x, y, GRAPHICS_CONST_1.STD_Z);
        currentContour.push(x + width, y, GRAPHICS_CONST_1.STD_Z);
        currentContour.push(x + width, y + height, GRAPHICS_CONST_1.STD_Z);
        currentContour.push(x, y + height, GRAPHICS_CONST_1.STD_Z);
        this._currentX = x;
        this._currentY = y;
        this._hasDrawnAnything = true;
        this._startingNewContour = false;
    };
    SolidFillRenderer.prototype.drawRoundRect = function (x, y, width, height, ellipseWidth, ellipseHeight) {
        if (ellipseHeight === void 0) { ellipseHeight = NaN; }
        throw new NotImplementedError_1.NotImplementedError();
    };
    SolidFillRenderer.prototype.lineTo = function (x, y) {
        this._isDirty = true;
        var currentContour = this.getContourForLines();
        if (!this._hasDrawnAnything || this._startingNewContour) {
            currentContour.push(this._currentX, this._currentY, GRAPHICS_CONST_1.STD_Z);
        }
        currentContour.push(x, y, GRAPHICS_CONST_1.STD_Z);
        this._currentX = x;
        this._currentY = y;
        this._hasDrawnAnything = true;
        this._startingNewContour = false;
    };
    SolidFillRenderer.prototype.update = function () {
        if (this._isDirty) {
            // Triangulate first
            var tess = this._graphics.renderer.tessellator;
            tess.gluTessProperty(libtess.gluEnum.GLU_TESS_WINDING_RULE, libtess.windingRule.GLU_TESS_WINDING_ODD);
            tess.gluTessNormal(0, 0, 1);
            var resultArray = [];
            tess.gluTessBeginPolygon(resultArray);
            var contour;
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
            var tempArray;
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
        _super.prototype.update.call(this);
    };
    SolidFillRenderer.prototype.render = function (renderer, target) {
        if (this._vertices.length > 0) {
            //primitiveTarget.renderPrimitives(this._vertexBuffer, this._colorBuffer, this._indexBuffer, false);
            RenderHelper_1.RenderHelper.renderPrimitives(renderer, target, this._vertexBuffer, this._colorBuffer, this._indexBuffer, false);
        }
    };
    return SolidFillRenderer;
})(FillRendererBase_1.FillRendererBase);
exports.SolidFillRenderer = SolidFillRenderer;

//# sourceMappingURL=SolidFillRenderer.js.map
