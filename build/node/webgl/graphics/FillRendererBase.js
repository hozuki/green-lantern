/**
 * Created by MIC on 2015/11/20.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GraphicsDataRendererBase_1 = require("./GraphicsDataRendererBase");
var FillRendererBase = (function (_super) {
    __extends(FillRendererBase, _super);
    function FillRendererBase(graphics, currentX, currentY) {
        _super.call(this, graphics, currentX, currentY, currentX, currentY);
        // Use to track the relative rendering order, based on stroke renderers' orders
        this.beginIndex = -1;
        this.endIndex = -1;
        // See libtess.js Degenerate Hourglass test.
        this._contours = null;
        this._startingNewContour = true;
        this._contours = [[]];
        this.beginIndex = -1;
        this.endIndex = -1;
        this._hasDrawnAnything = false;
        this._startingNewContour = true;
    }
    FillRendererBase.prototype.moveTo = function (x, y) {
        // Consider the code sample:
        // g.beginFill(0xff0000, 1);
        // g.lineStyle(1, 0xffffff);
        // g.moveTo(100, 100);
        // Flash closes the path before each moveTo() call
        this.closePath();
        if (this._hasDrawnAnything) {
            if (this._currentX !== x || this._currentY !== y) {
                this._startingNewContour = true;
            }
        }
        else {
            this._startingNewContour = true;
        }
        this._currentX = x;
        this._currentY = y;
        this._lastPathStartX = x;
        this._lastPathStartY = y;
    };
    FillRendererBase.prototype.getContourForClosedShapes = function () {
        var currentContour;
        if (this._hasDrawnAnything) {
            currentContour = [];
            this._contours.push(currentContour);
            this._startingNewContour = false;
        }
        else {
            currentContour = this._contours[0];
        }
        return currentContour;
    };
    FillRendererBase.prototype.getContourForLines = function () {
        var currentContour;
        if (this._hasDrawnAnything) {
            if (this._startingNewContour) {
                currentContour = [];
                this._contours.push(currentContour);
                this._startingNewContour = false;
            }
            else {
                currentContour = this._contours[this._contours.length - 1];
            }
        }
        else {
            currentContour = this._contours[0];
        }
        return currentContour;
    };
    return FillRendererBase;
})(GraphicsDataRendererBase_1.GraphicsDataRendererBase);
exports.FillRendererBase = FillRendererBase;

//# sourceMappingURL=FillRendererBase.js.map
