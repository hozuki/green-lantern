/**
 * Created by MIC on 2015/11/20.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StrokeRendererBase_1 = require("./StrokeRendererBase");
var GRAPHICS_CONST_1 = require("./GRAPHICS_CONST");
var RenderHelper_1 = require("../RenderHelper");
var GLUtil_1 = require("../../../../lib/glantern-utils/src/GLUtil");
var NotImplementedError_1 = require("../../../../lib/glantern-utils/src/NotImplementedError");
var SolidStrokeRenderer = (function (_super) {
    __extends(SolidStrokeRenderer, _super);
    function SolidStrokeRenderer(graphics, lastPathStartX, lastPathStartY, currentX, currentY, lineWidth, color, alpha) {
        _super.call(this, graphics, lastPathStartX, lastPathStartY, currentX, currentY);
        this._r = 0;
        this._g = 0;
        this._b = 0;
        this._a = 1;
        this._w = 1;
        this._a = GLUtil_1.GLUtil.limitInto(alpha, 0, 1);
        this._r = ((color >>> 16) & 0xff) / 0xff;
        this._g = ((color >>> 8) & 0xff) / 0xff;
        this._b = (color & 0xff) / 0xff;
        this._w = lineWidth;
    }
    SolidStrokeRenderer.prototype.bezierCurveTo = function (cx1, cy1, cx2, cy2, x, y) {
        if (this._w > 0) {
            this._isDirty = true;
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
                this.lineTo(xa, ya);
            }
        }
        this._currentX = x;
        this._currentY = y;
    };
    SolidStrokeRenderer.prototype.curveTo = function (cx, cy, x, y) {
        if (this._w > 0) {
            this._isDirty = true;
            var j;
            var fromX = this._currentX, fromY = this._currentY;
            var xa, ya;
            for (var i = 1; i <= GRAPHICS_CONST_1.CURVE_ACCURACY; i++) {
                j = i / GRAPHICS_CONST_1.CURVE_ACCURACY;
                xa = fromX + (cx - fromX) * j;
                ya = fromY + (cy - fromY) * j;
                xa = xa + (cx + (x - cx) * j - xa) * j;
                ya = ya + (cy + (y - cy) * j - ya) * j;
                this.lineTo(xa, ya);
            }
        }
        this._currentX = x;
        this._currentY = y;
    };
    SolidStrokeRenderer.prototype.drawCircle = function (x, y, radius) {
        this.moveTo(x - radius, y);
        if (this._w > 0) {
            this._isDirty = true;
            var thetaNext;
            var thetaBegin;
            var x2, y2;
            var halfPi = Math.PI / 2;
            thetaBegin = Math.PI;
            // Draw 4 segments of arcs, [-PI, -PI/2] [-PI/2, 0] [0, PI/2] [PI/2 PI]
            for (var k = 0; k < 4; k++) {
                for (var i = 1; i <= GRAPHICS_CONST_1.CURVE_ACCURACY; i++) {
                    thetaNext = thetaBegin - i / GRAPHICS_CONST_1.CURVE_ACCURACY * halfPi;
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
    };
    SolidStrokeRenderer.prototype.drawEllipse = function (x, y, width, height) {
        this.moveTo(x, y + height / 2);
        if (this._w > 0) {
            this._isDirty = true;
            var thetaNext;
            var thetaBegin;
            var centerX = x + width / 2, centerY = y + height / 2;
            var x2, y2;
            var halfPi = Math.PI / 2;
            thetaBegin = Math.PI;
            // Draw 4 segments of arcs, [-PI, -PI/2] [-PI/2, 0] [0, PI/2] [PI/2 PI]
            // Brute, huh? Luckily there are 20 segments per PI/2...
            for (var k = 0; k < 4; k++) {
                for (var i = 1; i <= GRAPHICS_CONST_1.CURVE_ACCURACY; i++) {
                    thetaNext = thetaBegin - i / GRAPHICS_CONST_1.CURVE_ACCURACY * halfPi;
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
    };
    SolidStrokeRenderer.prototype.drawRect = function (x, y, width, height) {
        this._isDirty = true;
        this.moveTo(x, y);
        this.lineTo(x, y + height);
        this.lineTo(x + width, y + height);
        this.lineTo(x + width, y);
        this.lineTo(x, y);
    };
    SolidStrokeRenderer.prototype.drawRoundRect = function (x, y, width, height, ellipseWidth, ellipseHeight) {
        if (ellipseHeight === void 0) { ellipseHeight = NaN; }
        throw new NotImplementedError_1.NotImplementedError();
    };
    SolidStrokeRenderer.prototype.lineTo = function (x, y) {
        if (this._w > 0) {
            this._isDirty = true;
            var vertices = this.__getSimLineVertices(this._currentX, this._currentY, x, y, GRAPHICS_CONST_1.STD_Z, this._w);
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
    };
    SolidStrokeRenderer.prototype.render = function (renderer) {
        if (this._vertices.length > 0) {
            var target = renderer.currentRenderTarget;
            RenderHelper_1.RenderHelper.renderPrimitives2(renderer, target, this._vertexBuffer, this._colorBuffer, this._indexBuffer, false, target.isRoot, false);
        }
    };
    return SolidStrokeRenderer;
})(StrokeRendererBase_1.StrokeRendererBase);
exports.SolidStrokeRenderer = SolidStrokeRenderer;

//# sourceMappingURL=SolidStrokeRenderer.js.map
