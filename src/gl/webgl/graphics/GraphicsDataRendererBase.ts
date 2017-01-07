/**
 * Created by MIC on 2015/11/20.
 */

import Graphics from "../../flash/display/Graphics";
import IGraphicsDataRenderer from "./IGraphicsDataRenderer";
import WebGLRenderer from "../WebGLRenderer";
import PackedArrayBuffer from "../PackedArrayBuffer";
import NotImplementedError from "../../flash/errors/NotImplementedError";
import VirtualDom from "../../mic/VirtualDom";

const gl = VirtualDom.WebGLRenderingContext;

abstract class GraphicsDataRendererBase implements IGraphicsDataRenderer {

    constructor(graphics: Graphics, lastPathStartX: number, lastPathStartY: number, currentX: number, currentY: number) {
        this._graphics = graphics;
        this._context = graphics.$renderer.context;
        this.__initializeBuffers();
        this._hasDrawnAnything = false;
        this._lastPathStartX = lastPathStartX;
        this._lastPathStartY = lastPathStartY;
        this.moveTo(currentX, currentY);
        this.becomeDirty();
    }

    bezierCurveTo(cx1: number, cy1: number, cx2: number, cy2: number, x: number, y: number): void {
        throw new NotImplementedError();
    }

    closePath(): void {
        // TODO: Consider the sample
        // g.beginFill(0xff0000); g.drawRect(100, 100, 100, 100); g.lineStyle(0xff0000, 1);
        // g.lineTo(400, 100); g.lineTo(200, 300); g.endFill();
        if (this._hasDrawnAnything && (this._currentX != this._lastPathStartX || this._currentY != this._lastPathStartY)) {
            this.lineTo(this._lastPathStartX, this._lastPathStartY);
        }
    }

    curveTo(cx: number, cy: number, x: number, y: number): void {
        throw new NotImplementedError();
    }

    drawCircle(x: number, y: number, radius: number): void {
        throw new NotImplementedError();
    }

    drawEllipse(x: number, y: number, width: number, height: number): void {
        throw new NotImplementedError();
    }

    drawRect(x: number, y: number, width: number, height: number): void {
        throw new NotImplementedError();
    }

    drawRoundRect(x: number, y: number, width: number, height: number, ellipseWidth: number, ellipseHeight: number = NaN): void {
        throw new NotImplementedError();
    }

    lineTo(x: number, y: number): void {
        throw new NotImplementedError();
    }

    moveTo(x: number, y: number): void {
        // Multiple movements are combined into one, which will be flushed at each
        // IGraphicsDataRenderer call that draws concrete elements
        throw new NotImplementedError();
    }

    update(): void {
        // check whether to $update the typed buffer
        this._$syncBuffers();
    }

    render(renderer: WebGLRenderer): void {
        console.warn("Do not call GraphicsDataRendererBase.$render().");
    }

    dispose(): void {
        if (this.vertexBuffer) {
            this.vertexBuffer.dispose();
        }
        if (this.colorBuffer) {
            this.colorBuffer.dispose();
        }
        if (this.indexBuffer) {
            this.indexBuffer.dispose();
        }
        this._vertexBuffer = this._colorBuffer = this._indexBuffer = null;
        this._vertices = this._colors = this._indices = null;
        this._context = null;
    }

    becomeDirty(): void {
        this._hasDrawnAnything = true;
        this._isDirty = true;
    }

    get isDirty(): boolean {
        return this._isDirty;
    }

    get graphics(): Graphics {
        return this._graphics;
    }

    get context(): WebGLRenderingContext {
        return this._context;
    }

    get vertices(): number[] {
        return this._vertices;
    }

    set vertices(v: number[]) {
        this._vertices = v;
    }

    get colors(): number[] {
        return this._colors;
    }

    set colors(v: number[]) {
        this._colors = v;
    }

    get indices(): number[] {
        return this._indices;
    }

    set indices(v: number[]) {
        this._indices = v;
    }

    get vertexBuffer(): PackedArrayBuffer {
        return this._vertexBuffer;
    }

    get colorBuffer(): PackedArrayBuffer {
        return this._colorBuffer;
    }

    get indexBuffer(): PackedArrayBuffer {
        return this._indexBuffer;
    }

    get hasDrawnAnything(): boolean {
        return this._hasDrawnAnything;
    }

    get currentX(): number {
        return this._currentX;
    }

    set currentX(v: number) {
        this._currentX = v;
    }

    get currentY(): number {
        return this._currentY;
    }

    set currentY(v: number) {
        this._currentY = v;
    }

    get lastPathStartX(): number {
        return this._lastPathStartX;
    }

    set lastPathStartX(v: number) {
        this._lastPathStartX = v;
    }

    get lastPathStartY(): number {
        return this._lastPathStartY;
    }

    set lastPathStartY(v: number) {
        this._lastPathStartY = v;
    }

    protected _$syncBuffers(): void {
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
    }

    private __initializeBuffers(): void {
        this._vertices = [];
        this._colors = [];
        this._indices = [];
        const context = this.context;
        this._vertexBuffer = PackedArrayBuffer.create(context, this._vertices, gl.FLOAT, gl.ARRAY_BUFFER);
        this._colorBuffer = PackedArrayBuffer.create(context, this._colors, gl.FLOAT, gl.ARRAY_BUFFER);
        this._indexBuffer = PackedArrayBuffer.create(context, this._indices, gl.UNSIGNED_SHORT, gl.ELEMENT_ARRAY_BUFFER);
    }

    private _graphics: Graphics = null;
    private _context: WebGLRenderingContext = null;
    private _isDirty: boolean = true;
    // Local points buffer, format: X, Y, Z(=STD_Z)
    private _vertices: number[] = null;
    // Colors of points, format: R, G, B, A
    private _colors: number[] = null;
    // Local indices (for points) buffer
    private _indices: number[] = null;
    private _vertexBuffer: PackedArrayBuffer = null;
    private _colorBuffer: PackedArrayBuffer = null;
    private _indexBuffer: PackedArrayBuffer = null;
    private _currentX: number = 0;
    private _currentY: number = 0;
    private _hasDrawnAnything: boolean = false;
    private _lastPathStartX: number = 0;
    private _lastPathStartY: number = 0;

}

export default GraphicsDataRendererBase;
