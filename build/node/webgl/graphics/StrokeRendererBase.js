/**
 * Created by MIC on 2015/11/20.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GraphicsDataRendererBase_1 = require("./GraphicsDataRendererBase");
var StrokeRendererBase = (function (_super) {
    __extends(StrokeRendererBase, _super);
    function StrokeRendererBase(graphics, lastPathStartX, lastPathStartY, currentX, currentY) {
        _super.call(this, graphics, lastPathStartX, lastPathStartY, currentX, currentY);
        this._lineVerticesStorage = null;
        this._lineVerticesStorage = [[0, 0], [0, 0], [0, 0], [0, 0]];
    }
    StrokeRendererBase.prototype.moveTo = function (x, y) {
        // This action seems weird...
        if (this._graphics.isFilling) {
            this.closePath();
        }
        this._currentX = x;
        this._currentY = y;
        this._lastPathStartX = x;
        this._lastPathStartY = y;
    };
    StrokeRendererBase.prototype.__getSimLineVertices = function (x1, y1, x2, y2, z, width) {
        if (width < 0) {
            return [];
        }
        var halfWidth = width / 2;
        var vert1 = this._lineVerticesStorage[0], vert2 = this._lineVerticesStorage[1], vert3 = this._lineVerticesStorage[2], vert4 = this._lineVerticesStorage[3];
        if (x1 === x2) {
            vert1[0] = x1 - halfWidth;
            vert1[1] = y1 > y2 ? y1 + halfWidth : y1 - halfWidth;
            vert2[0] = x1 + halfWidth;
            vert2[1] = y1 > y2 ? y1 + halfWidth : y1 - halfWidth;
            vert3[0] = x2 - halfWidth;
            vert3[1] = y1 > y2 ? y2 - halfWidth : y2 + halfWidth;
            vert4[0] = x2 + halfWidth;
            vert4[1] = y1 > y2 ? y2 - halfWidth : y2 + halfWidth;
        }
        else {
            var slope = (y2 - y1) / (x2 - x1);
            var ct = 1 / Math.sqrt(1 + slope * slope);
            var st = Math.sqrt(1 - ct * ct);
            // dx/dy: additional length considering the line width perpendicular to the line itself
            var dx = halfWidth * st;
            var dy = halfWidth * ct;
            // dtx/dty: additional length considering the line width at end points
            var dtx = dy;
            var dty = dx;
            // move the line to their new end points
            if (x1 > x2) {
                x1 += dtx;
                x2 -= dtx;
            }
            else {
                x1 -= dtx;
                x2 += dtx;
            }
            if (y1 > y2) {
                y1 += dty;
                y2 -= dty;
            }
            else {
                y1 -= dty;
                y2 += dty;
            }
            // and calculate simulating rectangle
            vert1[0] = x1 - dx;
            vert2[0] = x1 + dx;
            vert3[0] = x2 - dx;
            vert4[0] = x2 + dx;
            if (slope >= 0) {
                vert1[1] = y1 + dy;
                vert2[1] = y1 - dy;
                vert3[1] = y2 + dy;
                vert4[1] = y2 - dy;
            }
            else {
                vert1[1] = y1 - dy;
                vert2[1] = y1 + dy;
                vert3[1] = y2 - dy;
                vert4[1] = y2 + dy;
            }
        }
        return [
            vert1[0], vert1[1], z, vert2[0], vert2[1], z,
            vert3[0], vert3[1], z, vert4[0], vert4[1], z
        ];
    };
    return StrokeRendererBase;
}(GraphicsDataRendererBase_1.GraphicsDataRendererBase));
exports.StrokeRendererBase = StrokeRendererBase;

//# sourceMappingURL=StrokeRendererBase.js.map
