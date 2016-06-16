/**
 * Created by MIC on 2015/11/20.
 */

import {Graphics} from "../../flash/display/Graphics";
import {IGraphicsDataRenderer} from "./IGraphicsDataRenderer";
import {WebGLRenderer} from "../WebGLRenderer";
import {PackedArrayBuffer} from "../PackedArrayBuffer";
import {NotImplementedError} from "../../flash/errors/NotImplementedError";

const gl = (<any>window).WebGLRenderingContext;

export class GraphicsDataRendererBase implements IGraphicsDataRenderer {

    constructor(graphics:Graphics, lastPathStartX:number, lastPathStartY:number, currentX:number, currentY:number) {
        this._graphics = graphics;
        this._glc = graphics.renderer.context;
        this.__initializeBuffers();
        this._hasDrawnAnything = false;
        this._lastPathStartX = lastPathStartX;
        this._lastPathStartY = lastPathStartY;
        this.moveTo(currentX, currentY);
        this._isDirty = true;
    }

    bezierCurveTo(cx1:number, cy1:number, cx2:number, cy2:number, x:number, y:number):void {
        throw new NotImplementedError();
    }

    closePath():void {
        // TODO: Consider the sample
        // g.beginFill(0xff0000); g.drawRect(100, 100, 100, 100); g.lineStyle(0xff0000, 1);
        // g.lineTo(400, 100); g.lineTo(200, 300); g.endFill();
        if (this._hasDrawnAnything && (this._currentX != this._lastPathStartX || this._currentY != this._lastPathStartY)) {
            this.lineTo(this._lastPathStartX, this._lastPathStartY);
        }
    }

    curveTo(cx:number, cy:number, x:number, y:number):void {
        throw new NotImplementedError();
    }

    drawCircle(x:number, y:number, radius:number):void {
        throw new NotImplementedError();
    }

    drawEllipse(x:number, y:number, width:number, height:number):void {
        throw new NotImplementedError();
    }

    drawRect(x:number, y:number, width:number, height:number):void {
        throw new NotImplementedError();
    }

    drawRoundRect(x:number, y:number, width:number, height:number, ellipseWidth:number, ellipseHeight:number = NaN):void {
        throw new NotImplementedError();
    }

    lineTo(x:number, y:number):void {
        throw new NotImplementedError();
    }

    moveTo(x:number, y:number):void {
        // Multiple movements are combined into one, which will be flushed at each
        // IGraphicsDataRenderer call that draws concrete elements
        throw new NotImplementedError();
    }

    update():void {
        // check whether to update the typed buffer
        this._$syncBuffers();
    }

    render(renderer:WebGLRenderer):void {
        console.warn("Do not call GraphicsDataRendererBase.render().");
    }

    dispose():void {
        this._vertexBuffer.dispose();
        this._colorBuffer.dispose();
        this._indexBuffer.dispose();
        this._vertexBuffer = this._colorBuffer = this._indexBuffer = null;
        this._vertices = this._colors = this._indices = null;
        this._glc = null;
    }

    becomeDirty():void {
        this._isDirty = true;
    }

    get hasDrawnAnything():boolean {
        return this._hasDrawnAnything;
    }

    protected _$syncBuffers():void {
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

    private __initializeBuffers():void {
        this._vertices = [];
        this._colors = [];
        this._indices = [];
        this._vertexBuffer = PackedArrayBuffer.create(this._glc, this._vertices, gl.FLOAT, gl.ARRAY_BUFFER);
        this._colorBuffer = PackedArrayBuffer.create(this._glc, this._colors, gl.FLOAT, gl.ARRAY_BUFFER);
        this._indexBuffer = PackedArrayBuffer.create(this._glc, this._indices, gl.UNSIGNED_SHORT, gl.ELEMENT_ARRAY_BUFFER);
    }

    protected _graphics:Graphics = null;
    protected _glc:WebGLRenderingContext = null;
    protected _isDirty:boolean = true;
    // Local points buffer, format: X, Y, Z(=STD_Z)
    protected _vertices:number[] = null;
    // Colors of points, format: R, G, B, A
    protected _colors:number[] = null;
    // Local indices (for points) buffer
    protected _indices:number[] = null;
    protected _vertexBuffer:PackedArrayBuffer = null;
    protected _colorBuffer:PackedArrayBuffer = null;
    protected _indexBuffer:PackedArrayBuffer = null;
    protected _currentX:number = 0;
    protected _currentY:number = 0;
    protected _hasDrawnAnything:boolean = false;
    protected _lastPathStartX:number = 0;
    protected _lastPathStartY:number = 0;

}
