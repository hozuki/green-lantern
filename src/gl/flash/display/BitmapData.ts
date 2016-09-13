/**
 * Created by MIC on 2015/11/20.
 */

import {IBitmapDrawable} from "./IBitmapDrawable";
import {Rectangle} from "../geom/Rectangle";
import {Point} from "../geom/Point";
import {BitmapFilter} from "../filters/BitmapFilter";
import {ICloneable} from "../../mic/ICloneable";
import {ColorTransform} from "../geom/ColorTransform";
import {NotImplementedError} from "../errors/NotImplementedError";
import {ByteArray} from "../utils/ByteArray";
import {IDisposable} from "../../mic/IDisposable";
import {Matrix} from "../geom/Matrix";
import {GLUtil} from "../../mic/glantern/GLUtil";
import {MathUtil} from "../../mic/MathUtil";
import {ArgumentError} from "../errors/ArgumentError";
import {StageQuality} from "./StageQuality";
import {DisplayObject} from "./DisplayObject";
import {WebGLRenderer} from "../../webgl/WebGLRenderer";
import {BlendMode} from "./BlendMode";
import {RgbaColor} from "../../mic/RgbaColor";
import {EOFError} from "../errors/EOFError";
import {VirtualDom} from "../../mic/VirtualDom";

// TODO: Endian matters.
// On Windows (x86/x86-64, little endian), the conversion of 32-bit RGBA to 8-bit bytes are correct. When retrieving
// ImageData objects, the data is always in [RR,GG,BB,AA] order. Thus when constructing a Uint32Array from a Uint8ClampedArray,
// reading from the Uint32Array automatically outputs 0xAABBGGRR. However, on big endian systems, it may outputs 0xRRGGBBAA.

export class BitmapData implements IBitmapDrawable, IDisposable, ICloneable<BitmapData> {

    constructor(width: number, height: number, transparent: boolean = true, fillColor: number = 0xffffffff) {
        var canvas = VirtualDom.createElement<HTMLCanvasElement>("canvas");
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext("2d");
        context.fillStyle = GLUtil.colorToCssSharp(fillColor);
        context.fillRect(0, 0, width, height);
        this._canvas = canvas;
        this._context = context;
        this._supportsTransparent = transparent;
    }

    applyFilter(sourceBitmapData: BitmapData, sourceRect: Rectangle, destPoint: Point, filter: BitmapFilter): void {
        throw new NotImplementedError();
    }

    clone(): BitmapData {
        var bitmapData = new BitmapData(this.width, this.height, this._supportsTransparent);
        bitmapData._context.putImageData(this.__getArea(0, 0, this.width, this.height), 0, 0);
        return bitmapData;
    }

    colorTransform(rect: Rectangle, colorTransform: ColorTransform): void {
        var realRect = rect.clone();
        realRect.width = MathUtil.clampUpper(realRect.width, this.width - realRect.x);
        realRect.height = MathUtil.clampUpper(realRect.height, this.height - realRect.y);
        var imageData = this.__getArea(realRect.x, realRect.y, realRect.width, realRect.height);
        var imageArray = new Uint32Array(imageData.data.buffer);
        for (var i = 0; i < imageArray.length; ++i) {
            imageArray[i] = colorTransform.transform(imageArray[i]);
        }
        this.__setArea(imageData, realRect.x, realRect.y);
    }

    compare(otherBitmapData: BitmapData): BitmapData;
    compare(otherBitmapData: BitmapData): number;
    compare(otherBitmapData: BitmapData): BitmapData|number {
        if (this.width !== otherBitmapData.width) {
            return -3;
        }
        if (this.height !== otherBitmapData.height) {
            return -4;
        }
        var thisData = this.__getArea(0, 0, this.width, this.height);
        var thatData = otherBitmapData.__getArea(0, 0, otherBitmapData.width, otherBitmapData.height);
        var thisArray = new Uint32Array(thisData.data.buffer), thatArray = new Uint32Array(thatData.data.buffer);
        var imageData: ImageData = null;
        var imageArray: Uint32Array = null;
        for (var i = 0; i < thisArray.length; ++i) {
            var thisColor = GLUtil.decomposeRgba(thisArray[i]), thatColor = GLUtil.decomposeRgba(thatArray[i]);
            var colorDiff: RgbaColor = {
                r: Math.abs(thisColor.r - thatColor.r),
                g: Math.abs(thisColor.g - thatColor.g),
                b: Math.abs(thisColor.b - thatColor.b),
                a: Math.abs(thisColor.a - thatColor.a)
            };
            if (colorDiff.r || colorDiff.g || colorDiff.b) {
                initImageData();
                imageArray[i] = GLUtil.rgb(colorDiff.r, colorDiff.g, colorDiff.b);
            } else if (colorDiff.a) {
                initImageData();
                imageArray[i] = (colorDiff.a << 24) | 0x00ffffff;
            }
        }
        return imageData !== null ? BitmapData.fromImageData(imageData) : 0;

        function initImageData(): void {
            if (imageData) {
                return;
            }
            imageData = new ImageData(this.width, this.height);
            imageArray = new Uint32Array(imageData.data);
        }
    }

    copyChannel(sourceBitmapData: BitmapData, sourceRect: Rectangle, destPoint: Point, sourceChannel: number, destChannel: number): void {
        var realRect = sourceRect.clone();
        realRect.width = MathUtil.clampUpper(realRect.width, sourceBitmapData.width - realRect.x);
        realRect.height = MathUtil.clampUpper(realRect.height, sourceBitmapData.height - realRect.y);
        realRect.width = MathUtil.clampUpper(realRect.width, this.width - destPoint.x);
        realRect.height = MathUtil.clampUpper(realRect.height, this.height - destPoint.y);
        var thisData = this.__getArea(destPoint.x, destPoint.y, realRect.width, realRect.height);
        var thatData = sourceBitmapData.__getArea(realRect.x, realRect.y, realRect.width, realRect.height);
        var thisArray = thisData.data, thatArray = thatData.data;
        var srcIndex = Math.round(Math.LOG2E * Math.log(sourceChannel));
        var destIndex = Math.round(Math.LOG2E * Math.log(destChannel));
        for (var i = 0; i < thisArray.length; i += 4) {
            thisArray[i + destIndex] = thatArray[i + srcIndex];
        }
        this.__setArea(thisData, destPoint.x, destPoint.y);
    }

    copyPixels(sourceBitmapData: BitmapData, sourceRect: Rectangle, destPoint: Point, alphaBitmapData: BitmapData = null,
               alphaPoint: Point = null, mergeAlpha: boolean = false): void {
        var realRect = sourceRect.clone();
        realRect.width = MathUtil.clampUpper(realRect.width, sourceBitmapData.width - realRect.x);
        realRect.height = MathUtil.clampUpper(realRect.height, sourceBitmapData.height - realRect.y);
        realRect.width = MathUtil.clampUpper(realRect.width, this.width - destPoint.x);
        realRect.height = MathUtil.clampUpper(realRect.height, this.height - destPoint.y);
        if (alphaBitmapData) {
            if (!alphaPoint) {
                alphaPoint = new Point();
            }
            realRect.width = MathUtil.clampUpper(realRect.width, alphaBitmapData.width - alphaPoint.x);
            realRect.height = MathUtil.clampUpper(realRect.height, alphaBitmapData.height - alphaPoint.y);
        }
        var thisData = new ImageData(realRect.width, realRect.height);
        var thatData = sourceBitmapData.__getArea(realRect.x, realRect.y, realRect.width, realRect.height);
        var thisArray = new Uint32Array(thisData.data.buffer), thatArray = new Uint32Array(thatData.data.buffer);
        var alphaData: ImageData = null, alphaArray: Uint8ClampedArray = null;
        if (alphaBitmapData) {
            alphaData = alphaBitmapData.__getArea(alphaPoint.x, alphaPoint.y, realRect.width, realRect.height);
            alphaArray = new Uint32Array(alphaData.data.buffer);
        }
        for (var i = 0; i < thisArray.length; ++i) {
            var value = thatArray[i];
            if (alphaBitmapData && mergeAlpha) {
                var alphaAlpha = alphaArray[i] >>> 24;
                var sourceAlpha = (value & 0xff000000) >>> 24;
                sourceAlpha *= (alphaAlpha / 0xff) | 0;
                value = (value & 0x00ffffff) | (sourceAlpha << 24);
            }
            thisArray[i] = value;
        }
        this.__setArea(thisData, destPoint.x, destPoint.y);
    }

    copyPixelsToByteArray(rect: Rectangle, data: ByteArray): void {
        var expectedLength = rect.width * rect.height * 4;
        if (data.bytesAvailable < expectedLength) {
            data.length = data.position + expectedLength;
        }
        var imageData = this.__getArea(rect.x, rect.y, rect.width, rect.height);
        var dataArray = new Uint32Array(imageData.data.buffer);
        for (var i = 0; i < dataArray.length; ++i) {
            data.writeUnsignedInt(dataArray[i]);
        }
    }

    dispose(): void {
        this._canvas = null;
        this._context = null;
        if (this._cachedRenderer !== null) {
            this._cachedRenderer.dispose();
            this._cachedRenderer = null;
        }
    }

    draw(source: IBitmapDrawable, matrix: Matrix = null, colorTransform: ColorTransform = null, blendMode: string = null,
         clipRect: Rectangle = null, smoothing: boolean = false): void {
        this.drawWithQuality(source, matrix, colorTransform, blendMode, clipRect, smoothing, StageQuality.MEDIUM);
    }

    drawWithQuality(source: IBitmapDrawable, matrix: Matrix = null, colorTransform: ColorTransform = null, blendMode: string = null,
                    clipRect: Rectangle = null, smoothing: boolean = false, quality: string = null): void {
        if (source instanceof DisplayObject) {
            var displayObject = <DisplayObject>source;
            this.__buildRenderer();
            var renderer = this._cachedRenderer;
            renderer.setBlendMode(blendMode || BlendMode.NORMAL);
            displayObject.render(renderer);
        } else {
            throw new NotImplementedError();
        }
    }

    encode(rect: Rectangle, compressor: Object, byteArray: ByteArray = null): ByteArray {
        throw new NotImplementedError();
    }

    fillRect(rect: Rectangle, color: number): void {
        var context = this._context;
        context.fillStyle = GLUtil.colorToCssSharp(color);
        context.fillRect(rect.x, rect.y, rect.width, rect.height);
    }

    floodFill(x: number, y: number, color: number): void {
        if (this.isLocked) {
            return;
        }
        floodFill(this, this.__getArea, this.__setArea, x, y, color);
    }

    generateFilterRect(sourceRect: Rectangle, filter: BitmapFilter): Rectangle {
        throw new NotImplementedError();
    }

    getColorBoundsRect(mask: number, color: number, findColor: boolean = true): Rectangle {
        throw new NotImplementedError();
    }

    getPixel(x: number, y: number): number {
        var imageData = this.__getArea(x, y, 1, 1);
        var dataBuffer = imageData.data;
        // ImageData order: r,g,b,a
        return GLUtil.rgb(dataBuffer[0], dataBuffer[1], dataBuffer[2]);
    }

    getPixel32(x: number, y: number): number {
        var imageData = this.__getArea(x, y, 1, 1);
        var dataBuffer = imageData.data;
        return GLUtil.rgba(dataBuffer[0], dataBuffer[1], dataBuffer[2], dataBuffer[3]);
    }

    getPixels(rect: Rectangle): ByteArray {
        var imageData = this.__getArea(rect.x, rect.y, rect.width, rect.height);
        var dataBuffer = imageData.data;
        return ByteArray.from(dataBuffer.buffer);
    }

    getVector(rect: Rectangle): number[] {
        var imageData = this.__getArea(rect.x, rect.y, rect.width, rect.height);
        var dataBuffer = imageData.data;
        var uint32Array = new Uint32Array(dataBuffer.buffer);
        var result: number[] = new Array<number>(uint32Array.length);
        for (var i = 0; i < result.length; ++i) {
            result[i] = uint32Array[i];
        }
        return result;
    }

    get height(): number {
        return this._canvas.height;
    }

    histogram(hRect: Rectangle = null): number[][] {
        throw new NotImplementedError();
    }

    hitTest(firstPoint: Point, firstAlphaThreshold: number, secondObject: Object, secondBitmapDataPoint: Point = null,
            secondAlphaThreshold: number = 1): boolean {
        throw new NotImplementedError();
    }

    lock(): void {
        this._isLocked = true;
        this._cachedImageData = this._context.getImageData(0, 0, this.width, this.height);
    }

    merge(sourceBitmapData: BitmapData, sourceRect: Rectangle, destPoint: Point, redMultiplier: number, greenMultiplier: number,
          blueMultiplier: number, alphaMultiplier: number): void {
        throw new NotImplementedError();
    }

    noise(randomSeed: number, low: number = 0, high: number = 255, channelOptions: number = 7, greyScale: boolean = false): void {
        throw new NotImplementedError();
    }

    paletteMap(sourceBitmapData: BitmapData, sourceRect: Rectangle, destPoint: Point, redArray: number[] = null,
               greenArray: number[] = null, blueArray: number[] = null, alphaArray: number[] = null): void {
        throw new NotImplementedError();
    }

    perlinNoise(baseX: number, baseY: number, numOctaves: number, randomSeed: number, stitch: boolean, fractalNoise: boolean,
                channelOptions: number = 7, grayScale: boolean = false, offsets: number[] = null): void {
        throw new NotImplementedError();
    }

    pixelDissolve(sourceBitmapData: BitmapData, sourceRect: Rectangle, destPoint: Point, randomSeed: number = 0,
                  numPixels: number = 0, fillColor: number = 0): number {
        throw new NotImplementedError();
    }

    get rect(): Rectangle {
        return new Rectangle(0, 0, this.width, this.height);
    }

    scroll(x: number, y: number): void {
        throw new NotImplementedError();
    }

    setPixel(x: number, y: number, color: number): void {
        this.setPixel32(x, y, color | 0xff000000);
    }

    setPixel32(x: number, y: number, color: number): void {
        color &= 0xffffffff;
        var imageData = new ImageData(1, 1);
        var rgba = GLUtil.decomposeRgba(color);
        var dataBuffer = imageData.data;
        dataBuffer[0] = rgba.r;
        dataBuffer[1] = rgba.g;
        dataBuffer[2] = rgba.b;
        dataBuffer[3] = rgba.a;
        this.__setArea(imageData, x, y);
    }

    /**
     * http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/display/BitmapData.html#setPixels()
     * @param rect {Rectangle}
     * @param inputByteArray {ByteArray}
     */
    setPixels(rect: Rectangle, inputByteArray: ByteArray): void {
        var r = rect.clone();
        r.width = MathUtil.clampUpper(r.width, this.width - r.x);
        r.height = MathUtil.clampUpper(r.height, this.height - r.y);
        var originalPosition = inputByteArray.position;
        var expectedLength = rect.width * rect.height * 4;
        var pixelsToRead = (inputByteArray.bytesAvailable / 4) | 0;
        var imageData = this.__getArea(rect.x, rect.y, rect.width, rect.height);
        var dataBuffer = new Uint32Array(imageData.data.buffer);
        for (var i = 0; i < expectedLength; ++i) {
            if (i >= pixelsToRead) {
                this._context.putImageData(imageData, rect.x, rect.y);
                throw new EOFError("The input ByteArray is not large enough.");
            }
            dataBuffer[i] = inputByteArray.readUnsignedInt();
        }
        inputByteArray.position = originalPosition;
        this.__setArea(imageData, rect.x, rect.y);
    }

    setVector(rect: Rectangle, inputVector: number[]): void {
        var r = rect.clone();
        r.width = MathUtil.clampUpper(r.width, this.width - r.x);
        r.height = MathUtil.clampUpper(r.height, this.height - r.y);
        var expectedLength = rect.width * rect.height;
        if (inputVector.length !== expectedLength) {
            throw new ArgumentError("Invalid vector is used when trying to set pixels.");
        }
        var imageData = new ImageData(r.width, r.height);
        var dataBuffer = imageData.data;
        var uint32Array = new Uint32Array(dataBuffer.buffer);
        for (var i = 0; i < dataBuffer.length; ++i) {
            uint32Array[i] = inputVector[i] | 0;
        }
        this.__setArea(imageData, rect.x, rect.y);
    }

    threshold(sourceBitmapData: BitmapData, sourceRect: Rectangle, destPoint: Point, operation: string, threshold: number,
              color: number = 0, mask: number = 0xffffffff, copySource: boolean = false): number {
        throw new NotImplementedError();
    }

    get transparent(): boolean {
        return this._supportsTransparent;
    }

    unlock(): void {
        if (this._isDataChangedDuringLockDown) {
            this._context.putImageData(this._cachedImageData, 0, 0);
        }
        this._isLocked = false;
        this._cachedImageData = null;
        this._isDataChangedDuringLockDown = false;
    }

    get width(): number {
        return this._canvas.width;
    }

    // Bulletproof
    get isLocked(): boolean {
        return this._isLocked;
    }

    // Bulletproof
    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    // Bulletproof
    static fromImageData(imageData: ImageData): BitmapData {
        var bitmapData = new BitmapData(imageData.width, imageData.height, true, 0x00000000);
        bitmapData._context.putImageData(imageData, 0, 0);
        return bitmapData;
    }

    private __getArea(x: number, y: number, width: number, height: number): ImageData {
        if (this.isLocked) {
            var imageData = this._cachedImageData;
            var imageArray = new Uint32Array(imageData.data.buffer);
            var resultData = new ImageData(width, height);
            var resultArray = new Uint32Array(resultData.data.buffer);
            if (x === 0 && y === 0 && width === this.width && height === this.height) {
                // Fast copy
                for (var i = 0; i < imageArray.length; ++i) {
                    resultArray[i] = imageArray[i];
                }
            } else {
                width = MathUtil.clampUpper(width, this.width - x);
                height = MathUtil.clampUpper(height, this.height - y);
                var lineWidth = this.width;
                var k = 0;
                for (var i = 0; i < imageArray.length; ++i) {
                    var row = (i / lineWidth) | 0;
                    var col = i - row * lineWidth;
                    if (x <= col && col <= x + width && y <= row && row <= y + height) {
                        resultArray[k++] = imageArray[i];
                    }
                }
            }
            return resultData;
        } else {
            return this._context.getImageData(x, y, width, height);
        }
    }

    private __setArea(imageData: ImageData, x: number, y: number): void {
        if (this.isLocked) {
            var cachedData = this._cachedImageData;
            var cachedArray = new Uint32Array(cachedData.data.buffer);
            var imageArray = new Uint32Array(imageData.data.buffer);
            if (x === 0 && y === 0 && imageData.width === this.width && imageData.height === this.height) {
                // Fast copy
                for (var i = 0; i < cachedArray.length; ++i) {
                    cachedArray[i] = imageArray[i];
                }
            } else {
                var width = MathUtil.clampUpper(imageData.width, this.width - x);
                var height = MathUtil.clampUpper(imageData.height, this.height - y);
                var lineWidth = this.width;
                var k = 0;
                for (var i = 0; i < cachedArray.length; ++i) {
                    var row = (i / lineWidth) | 0;
                    var col = i - row * lineWidth;
                    if (x <= col && col <= x + width && y <= row && row <= y + height) {
                        cachedArray[i] = imageArray[k++];
                    }
                }
            }
            this._isDataChangedDuringLockDown = true;
        } else {
            this._context.putImageData(imageData, x, y);
        }
    }

    private __buildRenderer(): void {
        if (this._cachedRenderer !== null) {
            return;
        }
        this._cachedRenderer = new WebGLRenderer(this._canvas, WebGLRenderer.DEFAULT_OPTIONS);
    }

    private _canvas: HTMLCanvasElement = null;
    private _context: CanvasRenderingContext2D = null;
    private _supportsTransparent: boolean = true;
    private _isLocked: boolean = false;
    private _cachedImageData: ImageData = null;
    private _cachedRenderer: WebGLRenderer = null;
    private _isDataChangedDuringLockDown: boolean = false;

}

function floodFill(bitmapData: BitmapData, getCall: (x: number, y: number, w: number, h: number) => ImageData, setCall: (data: ImageData, x: number, y: number) => void,
                   x: number, y: number, color: number): void {
    var imageData = getCall(0, 0, bitmapData.width, bitmapData.height);
    var dataBuffer = imageData.data.buffer;
    var u32 = new Uint32Array(dataBuffer);
    var lineWidth = bitmapData.width;

    function point2Index(x: number, y: number): number {
        return x + y * lineWidth;
    }

    function getColor(x: number, y: number): number {
        return u32[point2Index(x, y)];
    }

    function setColor(x: number, y: number, c: number): void {
        u32[point2Index(x, y)] = c;
    }

    // The core flood-fill algorithm, based on a queue.
    type Coordinate = {x: number, y: number};
    var queue: Coordinate[] = [{x: x, y: y}];
    var visited: boolean[] = new Array<boolean>(u32.length);
    var refColor = getColor(x, y);
    visited[point2Index(x, y)] = true;
    while (queue.length > 0) {
        var coord = queue.shift();
        setColor(coord.x, coord.y, color);
        var index: number;
        // Top
        if (coord.y > 0) {
            index = point2Index(coord.x, coord.y - 1);
            if (!visited[index] && getColor(coord.x, coord.y - 1) === refColor) {
                visited[index] = true;
                queue.push({x: coord.x, y: coord.y - 1});
            }
        }
        // Left
        if (coord.x > 0) {
            index = point2Index(coord.x - 1, coord.y);
            if (!visited[index] && getColor(coord.x - 1, coord.y) === refColor) {
                visited[index] = true;
                queue.push({x: coord.x - 1, y: coord.y});
            }
        }
        // Bottom
        if (coord.y < this.height - 1) {
            index = point2Index(coord.x, coord.y + 1);
            if (!visited[index] && getColor(coord.x, coord.y + 1) === refColor) {
                visited[index] = true;
                queue.push({x: coord.x, y: coord.y + 1});
            }
        }
        // Right
        if (coord.x < this.width - 1) {
            index = point2Index(coord.x + 1, coord.y);
            if (!visited[index] && getColor(coord.x + 1, coord.y) === refColor) {
                visited[index] = true;
                queue.push({x: coord.x + 1, y: coord.y});
            }
        }
    }
    setCall(imageData, 0, 0);
}
