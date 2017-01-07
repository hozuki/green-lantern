/**
 * Created by MIC on 2015/11/20.
 */
import WebGLRenderer from "../../webgl/WebGLRenderer";
import ICopyable from "../../mic/ICopyable";
import DisplayObject from "./DisplayObject";
import Matrix from "../geom/Matrix";
import SpreadMethod from "./SpreadMethod";
import InterpolationMethod from "./InterpolationMethod";
import GraphicsPathWinding from "./GraphicsPathWinding";
import GraphicsPathCommand from "./GraphicsPathCommand";
import TriangleCulling from "./TriangleCulling";
import LineScaleMode from "./LineScaleMode";
import BrushType from "../../webgl/graphics/BrushType";
import IFillDataRenderer from "../../webgl/graphics/IFillDataRenderer";
import IStrokeDataRenderer from "../../webgl/graphics/IStrokeDataRenderer";
import StrokeRendererBase from "../../webgl/graphics/StrokeRendererBase";
import SolidStrokeRenderer from "../../webgl/graphics/SolidStrokeRenderer";
import IGraphicsData from "./IGraphicsData";
import BitmapData from "./BitmapData";
import SolidFillRenderer from "../../webgl/graphics/SolidFillRenderer";
import Shader from "./Shader";
import RenderTarget2D from "../../webgl/targets/RenderTarget2D";
import IDisposable from "../../mic/IDisposable";
import NotImplementedError from "../errors/NotImplementedError";
import MathUtil from "../../mic/MathUtil";
import CommonUtil from "../../mic/CommonUtil";

class Graphics implements ICopyable<Graphics>, IDisposable {

    constructor(attachTo: DisplayObject, renderer: WebGLRenderer) {
        this._displayObject = attachTo;
        this._renderer = renderer;
        this._isDirty = true;
        this._isFilling = false;
        this._strokeRenderers = [];
        this._fillRenderers = [];
        this._bufferTarget = renderer.createRenderTarget();
        this.__updateCurrentPoint(0, 0);
        this.__resetStyles();
        this.clear();
    }

    beginBitmapFill(bitmap: BitmapData, matrix: Matrix = null, repeat: boolean = false, smooth: boolean = false): void {
        throw new NotImplementedError();
    }

    beginFill(color: number, alpha: number = 1.0): void {
        if (this.$isFilling) {
            this.endFill();
        }
        if (!this.$isFilling) {
            this.$isFilling = true;
            this._currentStrokeRenderer = this.__newStroke();
            this._strokeRenderers.push(this._currentStrokeRenderer);
            this._currentFillRenderer = new SolidFillRenderer(this, this._currentX, this._currentY, color, alpha);
            this._currentFillRenderer.beginIndex = this._strokeRenderers.length - 1;
        }
    }

    beginGradientFill(type: string, colors: number[], alphas: number[], ratios: number[],
                      matrix: Matrix = null, spreadMethod: string = SpreadMethod.PAD,
                      interpolationMethod: string = InterpolationMethod.RGB, focalPointRatio: number = 0): void {
        throw new NotImplementedError();
    }

    beginShaderFill(shader: Shader, matrix: Matrix = null): void {
        throw new NotImplementedError();
    }

    clear(): void {
        const strokeRenderers = this._strokeRenderers;
        if (strokeRenderers && strokeRenderers.length > 0) {
            this._isDirty = this._isDirty || strokeRenderers.length > 0;
            for (let i = 0; i < strokeRenderers.length; ++i) {
                strokeRenderers[i].dispose();
            }
            strokeRenderers.splice(0, strokeRenderers.length);
        }
        const fillRenderers = this._fillRenderers;
        if (fillRenderers && fillRenderers.length > 0) {
            this._isDirty = this._isDirty || fillRenderers.length > 0;
            for (let i = 0; i < fillRenderers.length; ++i) {
                fillRenderers[i].dispose();
            }
            fillRenderers.splice(0, fillRenderers.length);
        }
        if (this._currentFillRenderer !== null) {
            this._currentFillRenderer.dispose();
            this._isDirty = true;
        }
        // create stroke and fill renderers according to current state
        // and push them into the stack
        this._currentFillRenderer = null;
        this._currentStrokeRenderer = this.__newStroke();
        strokeRenderers.push(this._currentStrokeRenderer);
        this.$isFilling = false;
    }

    copyFrom(sourceGraphics: Graphics): void {
        throw new NotImplementedError();
    }

    curveTo(controlX: number, controlY: number, anchorX: number, anchorY: number): void {
        if (this.$isFilling) {
            this._currentFillRenderer.curveTo(controlX, controlY, anchorX, anchorY);
        }
        this._currentStrokeRenderer.curveTo(controlX, controlY, anchorX, anchorY);
        this.__updateCurrentPoint(anchorX, anchorY);
        this._isDirty = true;
    }

    drawCircle(x: number, y: number, radius: number): void {
        if (this.$isFilling) {
            this._currentFillRenderer.drawCircle(x, y, radius);
        }
        this._currentStrokeRenderer.drawCircle(x, y, radius);
        this.__updateCurrentPoint(x, y);
        this.__updateLastPathStartPoint(x + radius, y);
        this._isDirty = true;
    }

    drawEllipse(x: number, y: number, width: number, height: number): void {
        if (this.$isFilling) {
            this._currentFillRenderer.drawEllipse(x, y, width, height);
        }
        this._currentStrokeRenderer.drawEllipse(x, y, width, height);
        this.__updateCurrentPoint(x + width, y + height / 2);
        this.__updateLastPathStartPoint(x + width, y + height / 2);
        this._isDirty = true;
    }

    drawGraphicsData(graphicsData: IGraphicsData[]): void {
        throw new NotImplementedError();
    }

    /**
     *
     * @param commands
     * @param data
     * @param winding
     * @param checkCommands Bulletproof
     */
    drawPath(commands: number[], data: number[], winding: string = GraphicsPathWinding.EVEN_ODD, checkCommands: boolean = true): void {
        if (checkCommands && !__checkPathCommands(commands, data)) {
            return;
        }
        const commandLength = commands.length;
        const isFilling = this.$isFilling;
        const strokeRenderer = this._currentStrokeRenderer;
        const fillRenderer = this._currentFillRenderer;
        let newX: number, newY: number;
        let j = 0;
        for (let i = 0; i < commandLength; ++i) {
            switch (commands[i]) {
                case GraphicsPathCommand.CUBIC_CURVE_TO:
                    if (isFilling) {
                        fillRenderer.bezierCurveTo(data[j], data[j + 1], data[j + 2], data[j + 3], data[j + 4], data[j + 5]);
                    }
                    strokeRenderer.bezierCurveTo(data[j], data[j + 1], data[j + 2], data[j + 3], data[j + 4], data[j + 5]);
                    newX = data[j + 4];
                    newY = data[j + 5];
                    j += 6;
                    break;
                case GraphicsPathCommand.CURVE_TO:
                    if (isFilling) {
                        fillRenderer.curveTo(data[j], data[j + 1], data[j + 2], data[j + 3]);
                    }
                    strokeRenderer.curveTo(data[j], data[j + 1], data[j + 2], data[j + 3]);
                    newX = data[j + 2];
                    newY = data[j + 3];
                    j += 4;
                    break;
                case GraphicsPathCommand.LINE_TO:
                    if (isFilling) {
                        fillRenderer.lineTo(data[j], data[j + 1]);
                    }
                    strokeRenderer.lineTo(data[j], data[j + 1]);
                    newX = data[j];
                    newY = data[j + 1];
                    j += 2;
                    break;
                case GraphicsPathCommand.MOVE_TO:
                    if (isFilling) {
                        fillRenderer.moveTo(data[j], data[j + 1]);
                    }
                    strokeRenderer.moveTo(data[j], data[j + 1]);
                    newX = data[j];
                    newY = data[j + 1];
                    j += 2;
                    break;
                case GraphicsPathCommand.NO_OP:
                    break;
                case GraphicsPathCommand.WIDE_LINE_TO:
                    if (isFilling) {
                        fillRenderer.lineTo(data[j + 2], data[j + 3]);
                    }
                    strokeRenderer.lineTo(data[j + 2], data[j + 3]);
                    newX = data[j + 2];
                    newY = data[j + 3];
                    j += 4;
                    break;
                case GraphicsPathCommand.WIDE_MOVE_TO:
                    if (isFilling) {
                        fillRenderer.moveTo(data[j + 2], data[j + 3]);
                    }
                    strokeRenderer.moveTo(data[j + 2], data[j + 3]);
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
    }

    drawRect(x: number, y: number, width: number, height: number): void {
        if (this.$isFilling) {
            this._currentFillRenderer.drawRect(x, y, width, height);
        }
        this._currentStrokeRenderer.drawRect(x, y, width, height);
        this.__updateCurrentPoint(x, y);
        this.__updateLastPathStartPoint(x, y);
        this._isDirty = true;
    }

    drawRoundRect(x: number, y: number, width: number, height: number, ellipseWidth: number, ellipseHeight: number = NaN): void {
        if (MathUtil.isNaN(ellipseHeight)) {
            ellipseHeight = ellipseWidth;
        }
        throw new NotImplementedError();
    }

    drawTriangles(vectors: number[], indices: number[] = null, uvtData: number[] = null, culling: string = TriangleCulling.NONE): void {
        // jabbany, mostly
        if (indices === null) {
            indices = new Array<number>((vectors.length / 2) | 0);
            for (let i = 0; i < indices.length; ++i) {
                indices[i] = i;
            }
        } else {
            indices = indices.slice();
        }
        if (indices.length % 3 !== 0) {
            CommonUtil.trace("Graphics.drawTriangles: malformed indices count. Must be multiple of 3.");
            return;
        }
        /** Do culling of triangles here to lessen work later **/
        if (culling !== TriangleCulling.NONE) {
            for (let i = 0; i < indices.length / 3; i++) {
                let ux = vectors[2 * indices[i * 3 + 1]] - vectors[2 * indices[i * 3]],
                    uy = vectors[2 * indices[i * 3 + 1] + 1] - vectors[2 * indices[i * 3] + 1],
                    vx = vectors[2 * indices[i * 3 + 2]] - vectors[2 * indices[i * 3 + 1]],
                    vy = vectors[2 * indices[i * 3 + 2] + 1] - vectors[2 * indices[i * 3 + 1] + 1];
                let zComponent = ux * vy - vx * uy;
                if (zComponent < 0 && culling === TriangleCulling.POSITIVE ||
                    zComponent > 0 && culling === TriangleCulling.NEGATIVE) {
                    /** Remove the indices. Leave the vertices. **/
                    indices.splice(i * 3, 3);
                    i--;
                }
            }
        }
        const commands: number[] = [], data: number[] = [];
        for (let i = 0; i < indices.length / 3; i++) {
            const a = indices[3 * i],
                b = indices[3 * i + 1],
                c = indices[3 * i + 2];
            const ax = vectors[2 * a], ay = vectors[2 * a + 1];
            const bx = vectors[2 * b], by = vectors[2 * b + 1];
            const cx = vectors[2 * c], cy = vectors[2 * c + 1];
            commands.push(1, 2, 2, 2);
            data.push(ax, ay, bx, by, cx, cy, ax, ay);
        }
        // TODO: Can be optimized by using native WebGL
        this.drawPath(commands, data, void(0), false);
    }

    endFill(): void {
        if (this.$isFilling) {
            this.$isFilling = false;
            this._currentFillRenderer.endIndex = this._strokeRenderers.length - 1;
            this._currentFillRenderer.closePath();
            this._currentStrokeRenderer.closePath();
            this._fillRenderers.push(this._currentFillRenderer);
            if (this._currentFillRenderer.hasDrawnAnything) {
                this._isDirty = true;
            }
            this._currentFillRenderer = null;
        }
    }

    lineBitmapStyle(bitmap: BitmapData, matrix: Matrix = null, repeat: boolean = true, smooth: boolean = false): void {
        throw new NotImplementedError();
    }

    lineGradientStyle(type: string, colors: number[], alphas: number[], ratios: number[],
                      matrix: Matrix = null, spreadMethod: string = SpreadMethod.PAD,
                      interpolationMethod: string = InterpolationMethod.RGB, focalPointRatio: number = 0): void {
        throw new NotImplementedError();
    }

    lineShaderStyle(shader: Shader, matrix: Matrix = null): void {
        throw new NotImplementedError();
    }

    lineStyle(thickness: number = NaN, color: number = 0, alpha: number = 1.0, pixelHinting: boolean = false,
              scaleMode: string = LineScaleMode.NORMAL, caps: string = null, joints: string = null, miterLimit: number = 3): void {
        if (this._lineType !== BrushType.SOLID || this._lineWidth !== thickness || this._lineColor !== color || this._lineAlpha !== alpha) {
            this._lineType = BrushType.SOLID;
            if (!MathUtil.isNaN(thickness)) {
                this._lineWidth = thickness;
            }
            this._lineColor = color;
            this._lineAlpha = alpha;
            this._currentStrokeRenderer = new SolidStrokeRenderer(this, this._lastPathStartX, this._lastPathStartY, this._currentX, this._currentY, thickness, color, alpha);
            this._strokeRenderers.push(this._currentStrokeRenderer);
        }
    }

    lineTo(x: number, y: number): void {
        if (this.$isFilling) {
            this._currentFillRenderer.lineTo(x, y);
        }
        this._currentStrokeRenderer.lineTo(x, y);
        this.__updateCurrentPoint(x, y);
        this._isDirty = true;
    }

    moveTo(x: number, y: number): void {
        if (this.$isFilling) {
            this._currentFillRenderer.moveTo(x, y);
        }
        this._currentStrokeRenderer.moveTo(x, y);
        this.__updateCurrentPoint(x, y);
        this.__updateLastPathStartPoint(x, y);
        this._isDirty = true;
    }

    $update(): void {
        if (this._isDirty) {
            const fillRenderers = this._fillRenderers;
            const strokeRenderers = this._strokeRenderers;
            let j = 0;
            for (let i = 0; i < strokeRenderers.length; ++i) {
                if (j < fillRenderers.length && i === fillRenderers[j].beginIndex) {
                    fillRenderers[j].update();
                    j++;
                }
                strokeRenderers[i].update();
            }
            this._shouldUpdateRenderTarget = true;
            this._isDirty = false;
        }
    }

    $render(renderer: WebGLRenderer): void {
        const fillRenderers = this._fillRenderers;
        const strokeRenderers = this._strokeRenderers;
        let j = 0;
        // TODO: Extend texture copy shader.
        // When _shouldUpdateRenderTarget and _bufferTarget are enabled, content of Graphics
        // is cached so that rendering performance is improved but transforms and alpha changes
        // are not reflected. To fix this behavior, consider extending the replicate shader to
        // support state changes.
        if (true || this._shouldUpdateRenderTarget) {
            this._bufferTarget.clear();
            for (let i = 0; i < strokeRenderers.length; ++i) {
                if (j < fillRenderers.length && i === fillRenderers[j].beginIndex) {
                    fillRenderers[j].render(renderer);
                    j++;
                }
                strokeRenderers[i].render(renderer);
            }
            this._shouldUpdateRenderTarget = false;
        }
    }

    dispose(): void {
        const strokeRenderers = this._strokeRenderers;
        if (strokeRenderers && strokeRenderers.length > 0) {
            this._isDirty = this._isDirty || strokeRenderers.length > 0;
            for (let i = 0; i < strokeRenderers.length; ++i) {
                strokeRenderers[i].dispose();
            }
            strokeRenderers.splice(0, strokeRenderers.length);
        }
        const fillRenderers = this._fillRenderers;
        if (fillRenderers && fillRenderers.length > 0) {
            this._isDirty = this._isDirty || fillRenderers.length > 0;
            for (let i = 0; i < fillRenderers.length; ++i) {
                fillRenderers[i].dispose();
            }
            fillRenderers.splice(0, fillRenderers.length);
        }
        this._currentStrokeRenderer.dispose();
        this._currentStrokeRenderer = null;
        this._bufferTarget.dispose();
        this._bufferTarget = null;
    }

    get $renderer(): WebGLRenderer {
        return this._renderer;
    }

    get $isFilling(): boolean {
        return this._isFilling;
    }

    set $isFilling(v: boolean) {
        this._isFilling = v;
    }

    private __newStroke(): StrokeRendererBase {
        switch (this._lineType) {
            case BrushType.SOLID:
                return new SolidStrokeRenderer(this, this._lastPathStartX, this._lastPathStartY, this._currentX, this._currentY, this._lineWidth, this._lineColor, this._lineAlpha);
            default:
                throw new NotImplementedError();
        }
    }

    private __updateCurrentPoint(x: number, y: number): void {
        this._currentX = x;
        this._currentY = y;
    }

    private __updateLastPathStartPoint(x: number, y: number): void {
        this._lastPathStartX = x;
        this._lastPathStartY = y;
    }

    private __resetStyles(): void {
        this._lineType = BrushType.SOLID;
        this._lineWidth = 1;
        this._lineColor = 0x000000;
        this._lineAlpha = 1;
    }

    private _displayObject: DisplayObject = null;
    private _isFilling: boolean = false;
    private _renderer: WebGLRenderer = null;
    private _bufferTarget: RenderTarget2D = null;
    private _isDirty: boolean = true;
    private _shouldUpdateRenderTarget: boolean = false;

    private _lineType: BrushType = BrushType.SOLID;
    private _lineWidth: number = 1;
    private _lineAlpha: number = 1;
    private _lineColor: number = 0;
    private _currentX: number = 0;
    private _currentY: number = 0;
    private _lastPathStartX: number = 0;
    private _lastPathStartY: number = 0;

    private _currentStrokeRenderer: IStrokeDataRenderer = null;
    private _currentFillRenderer: IFillDataRenderer = null;
    private _strokeRenderers: IStrokeDataRenderer[] = null;
    private _fillRenderers: IFillDataRenderer[] = null;

}

function __checkPathCommands(commands: number[], data: number[]): boolean {
    if (commands === null || data === null || data.length % 2 !== 0) {
        return false;
    }
    const commandLength = commands.length;
    let dataLength = data.length;
    for (let i = 0; i < commandLength; i++) {
        switch (commands[i]) {
            case GraphicsPathCommand.CUBIC_CURVE_TO:
                dataLength -= 2 * 3;
                if (dataLength < 0) {
                    return false;
                }
                break;
            case GraphicsPathCommand.CURVE_TO:
                dataLength -= 2 * 2;
                if (dataLength < 0) {
                    return false;
                }
                break;
            case GraphicsPathCommand.LINE_TO:
                dataLength -= 2 * 1;
                if (dataLength < 0) {
                    return false;
                }
                break;
            case GraphicsPathCommand.MOVE_TO:
                dataLength -= 2 * 1;
                if (dataLength < 0) {
                    return false;
                }
                break;
            case GraphicsPathCommand.NO_OP:
                break;
            case GraphicsPathCommand.WIDE_LINE_TO:
                dataLength -= 2 * 2;
                if (dataLength < 0) {
                    return false;
                }
                break;
            case GraphicsPathCommand.WIDE_MOVE_TO:
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

export default Graphics;
