/**
 * Created by MIC on 2015/11/20.
 */
import IBitmapDrawable from "./IBitmapDrawable";
import Rectangle from "../geom/Rectangle";
import Point from "../geom/Point";
import BitmapFilter from "../filters/BitmapFilter";
import ICloneable from "../../mic/ICloneable";
import ColorTransform from "../geom/ColorTransform";
import NotImplementedError from "../errors/NotImplementedError";
import ByteArray from "../utils/ByteArray";
import IDisposable from "../../mic/IDisposable";
import Matrix from "../geom/Matrix";
import GLUtil from "../../mic/glantern/GLUtil";
import MathUtil from "../../mic/MathUtil";
import ArgumentError from "../errors/ArgumentError";
import StageQuality from "./StageQuality";
import DisplayObject from "./DisplayObject";
import WebGLRenderer from "../../webgl/WebGLRenderer";
import BlendMode from "./BlendMode";
import RgbaColor from "../../mic/RgbaColor";
import EOFError from "../errors/EOFError";
import VirtualDom from "../../mic/VirtualDom";

// TODO: Endian matters.
// On Windows (x86/x86-64, little endian), the conversion of 32-bit RGBA to 8-bit bytes are correct. When retrieving
// ImageData objects, the data is always in [RR,GG,BB,AA] order. Thus when constructing a Uint32Array from a Uint8ClampedArray,
// reading from the Uint32Array automatically outputs 0xAABBGGRR. However, on big endian systems, it may outputs 0xRRGGBBAA.

export default class BitmapData implements IBitmapDrawable, IDisposable, ICloneable<BitmapData> {

    constructor(width: number, height: number, transparent: boolean = true, fillColor: number = 0xffffffff) {
        const canvas = VirtualDom.createElement<HTMLCanvasElement>("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
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
        const bitmapData = new BitmapData(this.width, this.height, this._supportsTransparent);
        bitmapData._context.putImageData(this.__getArea(0, 0, this.width, this.height), 0, 0);
        return bitmapData;
    }

    colorTransform(rect: Rectangle, colorTransform: ColorTransform): void {
        const realRect = rect.clone();
        realRect.width = MathUtil.clampUpper(realRect.width, this.width - realRect.x);
        realRect.height = MathUtil.clampUpper(realRect.height, this.height - realRect.y);
        const imageData = this.__getArea(realRect.x, realRect.y, realRect.width, realRect.height);
        const imageArray = new Uint32Array(imageData.data.buffer);
        for (let i = 0; i < imageArray.length; ++i) {
            imageArray[i] = colorTransform.transform(imageArray[i]);
        }
        this.__setArea(imageData, realRect.x, realRect.y);
    }

    compare(otherBitmapData: BitmapData): BitmapData;
    compare(otherBitmapData: BitmapData): number;
    compare(otherBitmapData: BitmapData): BitmapData | number {
        if (this.width !== otherBitmapData.width) {
            return -3;
        }
        if (this.height !== otherBitmapData.height) {
            return -4;
        }
        const thisData = this.__getArea(0, 0, this.width, this.height);
        const thatData = otherBitmapData.__getArea(0, 0, otherBitmapData.width, otherBitmapData.height);
        const thisArray = new Uint32Array(thisData.data.buffer), thatArray = new Uint32Array(thatData.data.buffer);
        let imageData: ImageData = null;
        let imageArray: Uint32Array = null;
        for (let i = 0; i < thisArray.length; ++i) {
            let thisColor = GLUtil.decomposeRgba(thisArray[i]), thatColor = GLUtil.decomposeRgba(thatArray[i]);
            let colorDiff: RgbaColor = {
                r: Math.abs(thisColor.r - thatColor.r),
                g: Math.abs(thisColor.g - thatColor.g),
                b: Math.abs(thisColor.b - thatColor.b),
                a: Math.abs(thisColor.a - thatColor.a)
            };
            if (colorDiff.r || colorDiff.g || colorDiff.b) {
                if (!imageData) {
                    imageData = new ImageData(this.width, this.height);
                    imageArray = new Uint32Array(imageData.data);
                }
                imageArray[i] = GLUtil.rgb(colorDiff.r, colorDiff.g, colorDiff.b);
            } else if (colorDiff.a) {
                if (!imageData) {
                    imageData = new ImageData(this.width, this.height);
                    imageArray = new Uint32Array(imageData.data);
                }
                imageArray[i] = (colorDiff.a << 24) | 0x00ffffff;
            }
        }
        return imageData ? BitmapData.fromImageData(imageData) : 0;
    }

    copyChannel(sourceBitmapData: BitmapData, sourceRect: Rectangle, destPoint: Point, sourceChannel: number, destChannel: number): void {
        const realRect = sourceRect.clone();
        realRect.width = MathUtil.clampUpper(realRect.width, sourceBitmapData.width - realRect.x);
        realRect.height = MathUtil.clampUpper(realRect.height, sourceBitmapData.height - realRect.y);
        realRect.width = MathUtil.clampUpper(realRect.width, this.width - destPoint.x);
        realRect.height = MathUtil.clampUpper(realRect.height, this.height - destPoint.y);
        const thisData = this.__getArea(destPoint.x, destPoint.y, realRect.width, realRect.height);
        const thatData = sourceBitmapData.__getArea(realRect.x, realRect.y, realRect.width, realRect.height);
        const thisArray = thisData.data, thatArray = thatData.data;
        const srcIndex = Math.round(Math.LOG2E * Math.log(sourceChannel));
        const destIndex = Math.round(Math.LOG2E * Math.log(destChannel));
        for (let i = 0; i < thisArray.length; i += 4) {
            thisArray[i + destIndex] = thatArray[i + srcIndex];
        }
        this.__setArea(thisData, destPoint.x, destPoint.y);
    }

    copyPixels(sourceBitmapData: BitmapData, sourceRect: Rectangle, destPoint: Point, alphaBitmapData: BitmapData = null,
               alphaPoint: Point = null, mergeAlpha: boolean = false): void {
        const realRect = sourceRect.clone();
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
        const thisData = new ImageData(realRect.width, realRect.height);
        const thatData = sourceBitmapData.__getArea(realRect.x, realRect.y, realRect.width, realRect.height);
        const thisArray = new Uint32Array(thisData.data.buffer), thatArray = new Uint32Array(thatData.data.buffer);
        let alphaData: ImageData = null, alphaArray: Uint32Array = null;
        if (alphaBitmapData) {
            alphaData = alphaBitmapData.__getArea(alphaPoint.x, alphaPoint.y, realRect.width, realRect.height);
            alphaArray = new Uint32Array(alphaData.data.buffer);
        }
        for (let i = 0; i < thisArray.length; ++i) {
            let value = thatArray[i];
            if (alphaBitmapData && mergeAlpha) {
                let alphaAlpha = alphaArray[i] >>> 24;
                let sourceAlpha = (value & 0xff000000) >>> 24;
                sourceAlpha *= (alphaAlpha / 0xff) | 0;
                value = (value & 0x00ffffff) | (sourceAlpha << 24);
            }
            thisArray[i] = value;
        }
        this.__setArea(thisData, destPoint.x, destPoint.y);
    }

    copyPixelsToByteArray(rect: Rectangle, data: ByteArray): void {
        const expectedLength = rect.width * rect.height * 4;
        if (data.bytesAvailable < expectedLength) {
            data.length = data.position + expectedLength;
        }
        const imageData = this.__getArea(rect.x, rect.y, rect.width, rect.height);
        const dataArray = new Uint32Array(imageData.data.buffer);
        for (let i = 0; i < dataArray.length; ++i) {
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
            const displayObject = <DisplayObject>source;
            this.__buildRenderer();
            const renderer = this._cachedRenderer;
            renderer.blendMode = blendMode || BlendMode.NORMAL;
            displayObject.$render(renderer);
        } else {
            throw new NotImplementedError();
        }
    }

    encode(rect: Rectangle, compressor: Object, byteArray: ByteArray = null): ByteArray {
        throw new NotImplementedError();
    }

    fillRect(rect: Rectangle, color: number): void {
        const context = this._context;
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
        const imageData = this.__getArea(x, y, 1, 1);
        const dataBuffer = imageData.data;
        // ImageData order: r,g,b,a
        return GLUtil.rgb(dataBuffer[0], dataBuffer[1], dataBuffer[2]);
    }

    getPixel32(x: number, y: number): number {
        const imageData = this.__getArea(x, y, 1, 1);
        const dataBuffer = imageData.data;
        return GLUtil.rgba(dataBuffer[0], dataBuffer[1], dataBuffer[2], dataBuffer[3]);
    }

    getPixels(rect: Rectangle): ByteArray {
        const imageData = this.__getArea(rect.x, rect.y, rect.width, rect.height);
        const dataBuffer = imageData.data;
        return ByteArray.from(dataBuffer.buffer);
    }

    getVector(rect: Rectangle): number[] {
        const imageData = this.__getArea(rect.x, rect.y, rect.width, rect.height);
        const dataBuffer = imageData.data;
        const uint32Array = new Uint32Array(dataBuffer.buffer);
        const ret: number[] = new Array<number>(uint32Array.length);
        for (let i = 0; i < uint32Array.length; ++i) {
            ret[i] = uint32Array[i];
        }
        return ret;
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
        const imageData = new ImageData(1, 1);
        const rgba = GLUtil.decomposeRgba(color);
        const dataBuffer = imageData.data;
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
        const r = rect.clone();
        r.width = MathUtil.clampUpper(r.width, this.width - r.x);
        r.height = MathUtil.clampUpper(r.height, this.height - r.y);
        const originalPosition = inputByteArray.position;
        const expectedLength = rect.width * rect.height * 4;
        const pixelsToRead = (inputByteArray.bytesAvailable / 4) | 0;
        const imageData = this.__getArea(rect.x, rect.y, rect.width, rect.height);
        const dataBuffer = new Uint32Array(imageData.data.buffer);
        for (let i = 0; i < expectedLength; ++i) {
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
        const r = rect.clone();
        r.width = MathUtil.clampUpper(r.width, this.width - r.x);
        r.height = MathUtil.clampUpper(r.height, this.height - r.y);
        const expectedLength = rect.width * rect.height;
        if (inputVector.length !== expectedLength) {
            throw new ArgumentError("Invalid vector is used when trying to set pixels.");
        }
        const imageData = new ImageData(r.width, r.height);
        const dataBuffer = imageData.data;
        const uint32Array = new Uint32Array(dataBuffer.buffer);
        for (let i = 0; i < dataBuffer.length; ++i) {
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
        const bitmapData = new BitmapData(imageData.width, imageData.height, true, 0x00000000);
        bitmapData._context.putImageData(imageData, 0, 0);
        return bitmapData;
    }

    private __getArea(x: number, y: number, width: number, height: number): ImageData {
        if (this.isLocked) {
            const imageData = this._cachedImageData;
            const imageArray = new Uint32Array(imageData.data.buffer);
            const resultData = new ImageData(width, height);
            const resultArray = new Uint32Array(resultData.data.buffer);
            if (x === 0 && y === 0 && width === this.width && height === this.height) {
                // Fast copy
                for (let i = 0; i < imageArray.length; ++i) {
                    resultArray[i] = imageArray[i];
                }
            } else {
                width = MathUtil.clampUpper(width, this.width - x);
                height = MathUtil.clampUpper(height, this.height - y);
                let lineWidth = this.width;
                let k = 0;
                for (let i = 0; i < imageArray.length; ++i) {
                    let row = (i / lineWidth) | 0;
                    let col = i - row * lineWidth;
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
            const cachedData = this._cachedImageData;
            const cachedArray = new Uint32Array(cachedData.data.buffer);
            const imageArray = new Uint32Array(imageData.data.buffer);
            if (x === 0 && y === 0 && imageData.width === this.width && imageData.height === this.height) {
                // Fast copy
                for (let i = 0; i < cachedArray.length; ++i) {
                    cachedArray[i] = imageArray[i];
                }
            } else {
                const width = MathUtil.clampUpper(imageData.width, this.width - x);
                const height = MathUtil.clampUpper(imageData.height, this.height - y);
                const lineWidth = this.width;
                let k = 0;
                for (let i = 0; i < cachedArray.length; ++i) {
                    let row = (i / lineWidth) | 0;
                    let col = i - row * lineWidth;
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
        this._cachedRenderer = new WebGLRenderer(WebGLRenderer.DEFAULT_OPTIONS, this._canvas);
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
    const imageData = getCall(0, 0, bitmapData.width, bitmapData.height);
    const dataBuffer = imageData.data.buffer;
    const u32 = new Uint32Array(dataBuffer);
    const lineWidth = bitmapData.width;

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
    const queue: Coordinate[] = [{x: x, y: y}];
    const visited: boolean[] = new Array<boolean>(u32.length);
    const refColor = getColor(x, y);
    visited[point2Index(x, y)] = true;
    while (queue.length > 0) {
        const coord = queue.shift();
        setColor(coord.x, coord.y, color);
        let index: number;
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
