/**
 * Created by MIC on 2015/11/20.
 */
"use strict";
var PackedArrayBuffer_1 = require("../PackedArrayBuffer");
var NotImplementedError_1 = require("../../flash/errors/NotImplementedError");
var gl = this.WebGLRenderingContext || window.WebGLRenderingContext;
var GraphicsDataRendererBase = (function () {
    function GraphicsDataRendererBase(graphics, lastPathStartX, lastPathStartY, currentX, currentY) {
        this._graphics = null;
        this._glc = null;
        this._isDirty = true;
        // Local points buffer, format: X, Y, Z(=STD_Z)
        this._vertices = null;
        // Colors of points, format: R, G, B, A
        this._colors = null;
        // Local indices (for points) buffer
        this._indices = null;
        this._vertexBuffer = null;
        this._colorBuffer = null;
        this._indexBuffer = null;
        this._currentX = 0;
        this._currentY = 0;
        this._hasDrawnAnything = false;
        this._lastPathStartX = 0;
        this._lastPathStartY = 0;
        this._graphics = graphics;
        this._glc = graphics.renderer.context;
        this.__initializeBuffers();
        this._hasDrawnAnything = false;
        this._lastPathStartX = lastPathStartX;
        this._lastPathStartY = lastPathStartY;
        this.moveTo(currentX, currentY);
        this._isDirty = true;
    }
    GraphicsDataRendererBase.prototype.bezierCurveTo = function (cx1, cy1, cx2, cy2, x, y) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    GraphicsDataRendererBase.prototype.closePath = function () {
        // TODO: Consider the sample
        // g.beginFill(0xff0000); g.drawRect(100, 100, 100, 100); g.lineStyle(0xff0000, 1);
        // g.lineTo(400, 100); g.lineTo(200, 300); g.endFill();
        if (this._hasDrawnAnything && (this._currentX != this._lastPathStartX || this._currentY != this._lastPathStartY)) {
            this.lineTo(this._lastPathStartX, this._lastPathStartY);
        }
    };
    GraphicsDataRendererBase.prototype.curveTo = function (cx, cy, x, y) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    GraphicsDataRendererBase.prototype.drawCircle = function (x, y, radius) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    GraphicsDataRendererBase.prototype.drawEllipse = function (x, y, width, height) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    GraphicsDataRendererBase.prototype.drawRect = function (x, y, width, height) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    GraphicsDataRendererBase.prototype.drawRoundRect = function (x, y, width, height, ellipseWidth, ellipseHeight) {
        if (ellipseHeight === void 0) { ellipseHeight = NaN; }
        throw new NotImplementedError_1.NotImplementedError();
    };
    GraphicsDataRendererBase.prototype.lineTo = function (x, y) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    GraphicsDataRendererBase.prototype.moveTo = function (x, y) {
        // Multiple movements are combined into one, which will be flushed at each
        // IGraphicsDataRenderer call that draws concrete elements
        throw new NotImplementedError_1.NotImplementedError();
    };
    GraphicsDataRendererBase.prototype.update = function () {
        // check whether to update the typed buffer
        this.__syncBuffers();
    };
    GraphicsDataRendererBase.prototype.render = function (renderer) {
        console.warn("Do not call GraphicsDataRendererBase.render().");
    };
    GraphicsDataRendererBase.prototype.dispose = function () {
        this._vertexBuffer.dispose();
        this._colorBuffer.dispose();
        this._indexBuffer.dispose();
        this._vertexBuffer = this._colorBuffer = this._indexBuffer = null;
        this._vertices = this._colors = this._indices = null;
        this._glc = null;
    };
    GraphicsDataRendererBase.prototype.becomeDirty = function () {
        this._isDirty = true;
    };
    Object.defineProperty(GraphicsDataRendererBase.prototype, "hasDrawnAnything", {
        get: function () {
            return this._hasDrawnAnything;
        },
        enumerable: true,
        configurable: true
    });
    GraphicsDataRendererBase.prototype.__initializeBuffers = function () {
        this._vertices = [];
        this._colors = [];
        this._indices = [];
        this._vertexBuffer = PackedArrayBuffer_1.PackedArrayBuffer.create(this._glc, this._vertices, gl.FLOAT, gl.ARRAY_BUFFER);
        this._colorBuffer = PackedArrayBuffer_1.PackedArrayBuffer.create(this._glc, this._colors, gl.FLOAT, gl.ARRAY_BUFFER);
        this._indexBuffer = PackedArrayBuffer_1.PackedArrayBuffer.create(this._glc, this._indices, gl.UNSIGNED_SHORT, gl.ELEMENT_ARRAY_BUFFER);
    };
    GraphicsDataRendererBase.prototype.__syncBuffers = function () {
        if (this._isDirty) {
            // When the array buffers become dirty, their values will be updated automatically
            // at next draw call.
            this._vertexBuffer.setNewData(this._vertices);
            this._vertexBuffer.becomeDirty();
            this._colorBuffer.setNewData(this._colors);
            this._colorBuffer.becomeDirty();
            this._indexBuffer.setNewData(this._indices);
            this._indexBuffer.becomeDirty();
            this._isDirty = false;
        }
    };
    return GraphicsDataRendererBase;
}());
exports.GraphicsDataRendererBase = GraphicsDataRendererBase;

//# sourceMappingURL=GraphicsDataRendererBase.js.map
