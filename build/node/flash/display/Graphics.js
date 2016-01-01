/**
 * Created by MIC on 2015/11/20.
 */
var NotImplementedError_1 = require("../../_util/NotImplementedError");
var SpreadMethod_1 = require("./SpreadMethod");
var InterpolationMethod_1 = require("./InterpolationMethod");
var GraphicsPathWinding_1 = require("./GraphicsPathWinding");
var GraphicsPathCommand_1 = require("./GraphicsPathCommand");
var _util_1 = require("../../_util/_util");
var TriangleCulling_1 = require("./TriangleCulling");
var LineScaleMode_1 = require("./LineScaleMode");
var BrushType_1 = require("../../webgl/graphics/BrushType");
var SolidStrokeRenderer_1 = require("../../webgl/graphics/SolidStrokeRenderer");
var SolidFillRenderer_1 = require("../../webgl/graphics/SolidFillRenderer");
var Graphics = (function () {
    function Graphics(attachTo, renderer) {
        this._displayObject = null;
        this._isFilling = false;
        this._renderer = null;
        this._bufferTarget = null;
        this._isDirty = true;
        this._shouldUpdateRenderTarget = false;
        this._lineType = BrushType_1.BrushType.SOLID;
        this._lineWidth = 1;
        this._lineAlpha = 1;
        this._lineColor = 0;
        this._currentX = 0;
        this._currentY = 0;
        this._lastPathStartX = 0;
        this._lastPathStartY = 0;
        this._currentStrokeRenderer = null;
        this._currentFillRenderer = null;
        this._strokeRenderers = null;
        this._fillRenderers = null;
        this._displayObject = attachTo;
        this._renderer = renderer;
        this._isDirty = true;
        this._strokeRenderers = [];
        this._fillRenderers = [];
        this._bufferTarget = renderer.createRenderTarget();
        this.__updateCurrentPoint(0, 0);
        this.__resetStyles();
        this.clear();
    }
    Graphics.prototype.beginBitmapFill = function (bitmap, matrix, repeat, smooth) {
        if (matrix === void 0) { matrix = null; }
        if (repeat === void 0) { repeat = false; }
        if (smooth === void 0) { smooth = false; }
        throw new NotImplementedError_1.NotImplementedError();
    };
    Graphics.prototype.beginFill = function (color, alpha) {
        if (alpha === void 0) { alpha = 1.0; }
        if (this._isFilling) {
            this.endFill();
        }
        if (!this._isFilling) {
            this._isFilling = true;
            this._currentStrokeRenderer = this.__createStrokeRendererWithCurrentSettings();
            this._strokeRenderers.push(this._currentStrokeRenderer);
            this._currentFillRenderer = new SolidFillRenderer_1.SolidFillRenderer(this, this._currentX, this._currentY, color, alpha);
            this._currentFillRenderer.beginIndex = this._strokeRenderers.length - 1;
        }
    };
    Graphics.prototype.beginGradientFill = function (type, colors, alphas, ratios, matrix, spreadMethod, interpolationMethod, focalPointRatio) {
        if (matrix === void 0) { matrix = null; }
        if (spreadMethod === void 0) { spreadMethod = SpreadMethod_1.SpreadMethod.PAD; }
        if (interpolationMethod === void 0) { interpolationMethod = InterpolationMethod_1.InterpolationMethod.RGB; }
        if (focalPointRatio === void 0) { focalPointRatio = 0; }
        throw new NotImplementedError_1.NotImplementedError();
    };
    Graphics.prototype.beginShaderFill = function (shader, matrix) {
        if (matrix === void 0) { matrix = null; }
        throw new NotImplementedError_1.NotImplementedError();
    };
    Graphics.prototype.clear = function () {
        var i;
        if (this._strokeRenderers !== null) {
            for (i = 0; i < this._strokeRenderers.length; ++i) {
                this._strokeRenderers[i].dispose();
            }
        }
        if (this._fillRenderers !== null) {
            for (i = 0; i < this._fillRenderers.length; ++i) {
                this._fillRenderers[i].dispose();
            }
        }
        if (this._currentFillRenderer !== null) {
            this._currentFillRenderer.dispose();
        }
        while (this._strokeRenderers.length > 0) {
            this._strokeRenderers.pop();
        }
        while (this._fillRenderers.length > 0) {
            this._fillRenderers.pop();
        }
        // create stroke and fill renderers according to current state
        // and push them into the stack
        this._currentFillRenderer = null;
        this._currentStrokeRenderer = this.__createStrokeRendererWithCurrentSettings();
        this._strokeRenderers.push(this._currentStrokeRenderer);
        this._isFilling = false;
    };
    Graphics.prototype.copyFrom = function (sourceGraphics) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    Graphics.prototype.curveTo = function (controlX, controlY, anchorX, anchorY) {
        if (this._isFilling) {
            this._currentFillRenderer.curveTo(controlX, controlY, anchorX, anchorY);
        }
        this._currentStrokeRenderer.curveTo(controlX, controlY, anchorX, anchorY);
        this.__updateCurrentPoint(anchorX, anchorY);
        this._isDirty = true;
    };
    Graphics.prototype.drawCircle = function (x, y, radius) {
        if (this._isFilling) {
            this._currentFillRenderer.drawCircle(x, y, radius);
        }
        this._currentStrokeRenderer.drawCircle(x, y, radius);
        this.__updateCurrentPoint(x, y);
        this.__updateLastPathStartPoint(x + radius, y);
        this._isDirty = true;
    };
    Graphics.prototype.drawEllipse = function (x, y, width, height) {
        if (this._isFilling) {
            this._currentFillRenderer.drawEllipse(x, y, width, height);
        }
        this._currentStrokeRenderer.drawEllipse(x, y, width, height);
        this.__updateCurrentPoint(x + width, y + height / 2);
        this.__updateLastPathStartPoint(x + width, y + height / 2);
        this._isDirty = true;
    };
    Graphics.prototype.drawGraphicsData = function (graphicsData) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    /**
     *
     * @param commands
     * @param data
     * @param winding
     * @param checkCommands Bulletproof
     */
    Graphics.prototype.drawPath = function (commands, data, winding, checkCommands) {
        if (winding === void 0) { winding = GraphicsPathWinding_1.GraphicsPathWinding.EVEN_ODD; }
        if (checkCommands === void 0) { checkCommands = true; }
        if (checkCommands && !__checkPathCommands(commands, data)) {
            return;
        }
        var commandLength = commands.length;
        var j = 0;
        var isInFill = this._isFilling;
        var sr = this._currentStrokeRenderer;
        var fr = this._currentFillRenderer;
        var newX, newY;
        for (var i = 0; i < commandLength; ++i) {
            switch (commands[i]) {
                case GraphicsPathCommand_1.GraphicsPathCommand.CUBIC_CURVE_TO:
                    if (isInFill) {
                        fr.bezierCurveTo(data[j], data[j + 1], data[j + 2], data[j + 3], data[j + 4], data[j + 5]);
                    }
                    sr.bezierCurveTo(data[j], data[j + 1], data[j + 2], data[j + 3], data[j + 4], data[j + 5]);
                    newX = data[j + 4];
                    newY = data[j + 5];
                    j += 6;
                    break;
                case GraphicsPathCommand_1.GraphicsPathCommand.CURVE_TO:
                    if (isInFill) {
                        fr.curveTo(data[j], data[j + 1], data[j + 2], data[j + 3]);
                    }
                    sr.curveTo(data[j], data[j + 1], data[j + 2], data[j + 3]);
                    newX = data[j + 2];
                    newY = data[j + 3];
                    j += 4;
                    break;
                case GraphicsPathCommand_1.GraphicsPathCommand.LINE_TO:
                    if (isInFill) {
                        fr.lineTo(data[j], data[j + 1]);
                    }
                    sr.lineTo(data[j], data[j + 1]);
                    newX = data[j];
                    newY = data[j + 1];
                    j += 2;
                    break;
                case GraphicsPathCommand_1.GraphicsPathCommand.MOVE_TO:
                    if (isInFill) {
                        fr.moveTo(data[j], data[j + 1]);
                    }
                    sr.moveTo(data[j], data[j + 1]);
                    newX = data[j];
                    newY = data[j + 1];
                    j += 2;
                    break;
                case GraphicsPathCommand_1.GraphicsPathCommand.NO_OP:
                    break;
                case GraphicsPathCommand_1.GraphicsPathCommand.WIDE_LINE_TO:
                    if (isInFill) {
                        fr.lineTo(data[j + 2], data[j + 3]);
                    }
                    sr.lineTo(data[j + 2], data[j + 3]);
                    newX = data[j + 2];
                    newY = data[j + 3];
                    j += 4;
                    break;
                case GraphicsPathCommand_1.GraphicsPathCommand.WIDE_MOVE_TO:
                    if (isInFill) {
                        fr.moveTo(data[j + 2], data[j + 3]);
                    }
                    sr.moveTo(data[j + 2], data[j + 3]);
                    newX = data[j + 2];
                    newY = data[j + 3];
                    j += 4;
                    break;
                default:
                    break;
            }
        }
        if (commandLength > 0) {
            this.__updateCurrentPoint(newX, newY);
        }
        this._isDirty = true;
    };
    Graphics.prototype.drawRect = function (x, y, width, height) {
        if (this._isFilling) {
            this._currentFillRenderer.drawRect(x, y, width, height);
        }
        this._currentStrokeRenderer.drawRect(x, y, width, height);
        this.__updateCurrentPoint(x, y);
        this.__updateLastPathStartPoint(x, y);
        this._isDirty = true;
    };
    Graphics.prototype.drawRoundRect = function (x, y, width, height, ellipseWidth, ellipseHeight) {
        if (ellipseHeight === void 0) { ellipseHeight = NaN; }
        if (isNaN(ellipseHeight)) {
            ellipseHeight = ellipseWidth;
        }
        throw new NotImplementedError_1.NotImplementedError();
    };
    Graphics.prototype.drawTriangles = function (vectors, indices, uvtData, culling) {
        if (indices === void 0) { indices = null; }
        if (uvtData === void 0) { uvtData = null; }
        if (culling === void 0) { culling = TriangleCulling_1.TriangleCulling.NONE; }
        // jabbany, mostly
        if (indices === null) {
            indices = [];
            for (var i = 0; i < vectors.length; i += 2) {
                indices.push(i / 2);
            }
        }
        else {
            indices = indices.slice(0);
        }
        if (indices.length % 3 !== 0) {
            _util_1._util.trace("Graphics.drawTriangles malformed indices count. Must be multiple of 3.", "err");
            return;
        }
        /** Do culling of triangles here to lessen work later **/
        if (culling !== TriangleCulling_1.TriangleCulling.NONE) {
            for (var i = 0; i < indices.length / 3; i++) {
                var ux = vectors[2 * indices[i * 3 + 1]] - vectors[2 * indices[i * 3]], uy = vectors[2 * indices[i * 3 + 1] + 1] - vectors[2 * indices[i * 3] + 1], vx = vectors[2 * indices[i * 3 + 2]] - vectors[2 * indices[i * 3 + 1]], vy = vectors[2 * indices[i * 3 + 2] + 1] - vectors[2 * indices[i * 3 + 1] + 1];
                var zcomp = ux * vy - vx * uy;
                if (zcomp < 0 && culling === TriangleCulling_1.TriangleCulling.POSITIVE ||
                    zcomp > 0 && culling === TriangleCulling_1.TriangleCulling.NEGATIVE) {
                    /** Remove the indices. Leave the vertices. **/
                    indices.splice(i * 3, 3);
                    i--;
                }
            }
        }
        var commands = [], data = [];
        for (var i = 0; i < indices.length / 3; i++) {
            var a = indices[3 * i], b = indices[3 * i + 1], c = indices[3 * i + 2];
            var ax = vectors[2 * a], ay = vectors[2 * a + 1];
            var bx = vectors[2 * b], by = vectors[2 * b + 1];
            var cx = vectors[2 * c], cy = vectors[2 * c + 1];
            commands.push(1, 2, 2, 2);
            data.push(ax, ay, bx, by, cx, cy, ax, ay);
        }
        // TODO: Can be optimized by using native WebGL
        this.drawPath(commands, data, void (0), false);
    };
    Graphics.prototype.endFill = function () {
        if (this._isFilling) {
            this._isFilling = false;
            this._currentFillRenderer.endIndex = this._strokeRenderers.length - 1;
            this._currentFillRenderer.closePath();
            this._currentStrokeRenderer.closePath();
            this._fillRenderers.push(this._currentFillRenderer);
            this._currentFillRenderer = null;
        }
    };
    Graphics.prototype.lineBitmapStyle = function (bitmap, matrix, repeat, smooth) {
        if (matrix === void 0) { matrix = null; }
        if (repeat === void 0) { repeat = true; }
        if (smooth === void 0) { smooth = false; }
        throw new NotImplementedError_1.NotImplementedError();
    };
    Graphics.prototype.lineGradientStyle = function (type, colors, alphas, ratios, matrix, spreadMethod, interpolationMethod, focalPointRatio) {
        if (matrix === void 0) { matrix = null; }
        if (spreadMethod === void 0) { spreadMethod = SpreadMethod_1.SpreadMethod.PAD; }
        if (interpolationMethod === void 0) { interpolationMethod = InterpolationMethod_1.InterpolationMethod.RGB; }
        if (focalPointRatio === void 0) { focalPointRatio = 0; }
        throw new NotImplementedError_1.NotImplementedError();
    };
    Graphics.prototype.lineShaderStyle = function (shader, matrix) {
        if (matrix === void 0) { matrix = null; }
        throw new NotImplementedError_1.NotImplementedError();
    };
    Graphics.prototype.lineStyle = function (thickness, color, alpha, pixelHinting, scaleMode, caps, joints, miterLimit) {
        if (thickness === void 0) { thickness = NaN; }
        if (color === void 0) { color = 0; }
        if (alpha === void 0) { alpha = 1.0; }
        if (pixelHinting === void 0) { pixelHinting = false; }
        if (scaleMode === void 0) { scaleMode = LineScaleMode_1.LineScaleMode.NORMAL; }
        if (caps === void 0) { caps = null; }
        if (joints === void 0) { joints = null; }
        if (miterLimit === void 0) { miterLimit = 3; }
        if (this._lineType !== BrushType_1.BrushType.SOLID || this._lineWidth !== thickness || this._lineColor !== color || this._lineAlpha !== alpha) {
            this._lineType = BrushType_1.BrushType.SOLID;
            if (!isNaN(thickness)) {
                this._lineWidth = thickness;
            }
            this._lineColor = color;
            this._lineAlpha = alpha;
            this._currentStrokeRenderer = new SolidStrokeRenderer_1.SolidStrokeRenderer(this, this._lastPathStartX, this._lastPathStartY, this._currentX, this._currentY, thickness, color, alpha);
            this._strokeRenderers.push(this._currentStrokeRenderer);
        }
    };
    Graphics.prototype.lineTo = function (x, y) {
        if (this._isFilling) {
            this._currentFillRenderer.lineTo(x, y);
        }
        this._currentStrokeRenderer.lineTo(x, y);
        this.__updateCurrentPoint(x, y);
        this._isDirty = true;
    };
    Graphics.prototype.moveTo = function (x, y) {
        if (this._isFilling) {
            this._currentFillRenderer.moveTo(x, y);
        }
        this._currentStrokeRenderer.moveTo(x, y);
        this.__updateCurrentPoint(x, y);
        this.__updateLastPathStartPoint(x, y);
        this._isDirty = true;
    };
    Graphics.prototype.update = function () {
        if (this._isDirty) {
            var j = 0, fillLen = this._fillRenderers.length;
            for (var i = 0; i < this._strokeRenderers.length; ++i) {
                if (j < fillLen && i === this._fillRenderers[j].beginIndex) {
                    this._fillRenderers[j].update();
                    j++;
                }
                this._strokeRenderers[i].update();
            }
            this._shouldUpdateRenderTarget = true;
        }
        this._isDirty = false;
    };
    Graphics.prototype.render = function (renderer, target, clearOutput) {
        var j = 0, fillLen = this._fillRenderers.length;
        if (this._shouldUpdateRenderTarget) {
            this._bufferTarget.clear();
            for (var i = 0; i < this._strokeRenderers.length; ++i) {
                if (j < fillLen && i === this._fillRenderers[j].beginIndex) {
                    this._fillRenderers[j].render(renderer, this._bufferTarget);
                    j++;
                }
                this._strokeRenderers[i].render(renderer, this._bufferTarget);
            }
            this._shouldUpdateRenderTarget = false;
        }
        renderer.copyRenderTargetContent(this._bufferTarget, target, clearOutput);
    };
    Graphics.prototype.dispose = function () {
        this.clear();
        this._strokeRenderers.pop();
        this._currentStrokeRenderer.dispose();
        this._currentStrokeRenderer = null;
        this._bufferTarget.dispose();
        this._bufferTarget = null;
    };
    Object.defineProperty(Graphics.prototype, "renderer", {
        get: function () {
            return this._renderer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Graphics.prototype, "isFilling", {
        get: function () {
            return this._isFilling;
        },
        enumerable: true,
        configurable: true
    });
    Graphics.prototype.__createStrokeRendererWithCurrentSettings = function () {
        switch (this._lineType) {
            case BrushType_1.BrushType.SOLID:
                return new SolidStrokeRenderer_1.SolidStrokeRenderer(this, this._lastPathStartX, this._lastPathStartY, this._currentX, this._currentY, this._lineWidth, this._lineColor, this._lineAlpha);
                break;
            default:
                throw new NotImplementedError_1.NotImplementedError();
        }
    };
    Graphics.prototype.__updateCurrentPoint = function (x, y) {
        this._currentX = x;
        this._currentY = y;
    };
    Graphics.prototype.__updateLastPathStartPoint = function (x, y) {
        this._lastPathStartX = x;
        this._lastPathStartY = y;
    };
    Graphics.prototype.__resetStyles = function () {
        this._lineType = BrushType_1.BrushType.SOLID;
        this._lineWidth = 1;
        this._lineColor = 0x000000;
        this._lineAlpha = 1;
    };
    return Graphics;
})();
exports.Graphics = Graphics;
function __checkPathCommands(commands, data) {
    if (commands === null || data === null || data.length % 2 !== 0) {
        return false;
    }
    var commandLength = commands.length;
    var dataLength = data.length;
    for (var i = 0; i < commandLength; i++) {
        switch (commands[i]) {
            case GraphicsPathCommand_1.GraphicsPathCommand.CUBIC_CURVE_TO:
                dataLength -= 2 * 3;
                if (dataLength < 0) {
                    return false;
                }
                break;
            case GraphicsPathCommand_1.GraphicsPathCommand.CURVE_TO:
                dataLength -= 2 * 2;
                if (dataLength < 0) {
                    return false;
                }
                break;
            case GraphicsPathCommand_1.GraphicsPathCommand.LINE_TO:
                dataLength -= 2 * 1;
                if (dataLength < 0) {
                    return false;
                }
                break;
            case GraphicsPathCommand_1.GraphicsPathCommand.MOVE_TO:
                dataLength -= 2 * 1;
                if (dataLength < 0) {
                    return false;
                }
                break;
            case GraphicsPathCommand_1.GraphicsPathCommand.NO_OP:
                break;
            case GraphicsPathCommand_1.GraphicsPathCommand.WIDE_LINE_TO:
                dataLength -= 2 * 2;
                if (dataLength < 0) {
                    return false;
                }
                break;
            case GraphicsPathCommand_1.GraphicsPathCommand.WIDE_MOVE_TO:
                dataLength -= 2 * 2;
                if (dataLength < 0) {
                    return false;
                }
                break;
            default:
                return false;
        }
    }
    return true;
}

//# sourceMappingURL=Graphics.js.map
