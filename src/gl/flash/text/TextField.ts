/**
 * Created by MIC on 2015/12/23.
 */

import {InteractiveObject} from "../display/InteractiveObject";
import {WebGLRenderer} from "../../webgl/WebGLRenderer";
import {ShaderManager} from "../../webgl/ShaderManager";
import {Stage} from "../display/Stage";
import {DisplayObjectContainer} from "../display/DisplayObjectContainer";
import {AntiAliasType} from "./AntiAliasType";
import {TextFieldAutoSize} from "./TextFieldAutoSize";
import {TextFormat} from "./TextFormat";
import {GridFitType} from "./GridFitType";
import {StyleSheet} from "./StyleSheet";
import {TextInteractionMode} from "./TextInteractionMode";
import {TextFieldType} from "./TextFieldType";
import {Rectangle} from "../geom/Rectangle";
import {DisplayObject} from "../display/DisplayObject";
import {TextLineMetrics} from "./TextLineMetrics";
import {RenderTarget2D} from "../../webgl/targets/RenderTarget2D";
import {ShaderID} from "../../webgl/ShaderID";
import {RenderHelper} from "../../webgl/RenderHelper";
import {NotImplementedError} from "../errors/NotImplementedError";
import {GLUtil} from "../../mic/glantern/GLUtil";
import {TimeInfo} from "../../mic/TimeInfo";
import {VirtualDom} from "../../mic/VirtualDom";
import {CommonUtil} from "../../mic/CommonUtil";
import {Vector3D} from "../geom/Vector3D";
import {Matrix3D} from "../geom/Matrix3D";

export class TextField extends InteractiveObject {

    constructor(root: Stage, parent: DisplayObjectContainer) {
        super(root, parent);
        if (root !== null) {
            this._canvasTarget = this._$createCanvasTarget(root.$worldRenderer);
        }
        this._textFormatChangedHandler = this.__textFormatChanged.bind(this);
        this.defaultTextFormat = new TextFormat();
    }

    appendText(newText: string): void {
        this.text += newText;
    }

    alwaysShowSelection: boolean = false;
    antiAliasType: string = AntiAliasType.NORMAL;
    autoSize: string = TextFieldAutoSize.NONE;

    get background(): boolean {
        return this._background;
    }

    set background(v: boolean) {
        var b = v !== this._background;
        if (b) {
            this._background = v;
            this._isContentChanged = true;
        }
    }

    get backgroundColor(): number {
        return this._backgroundColor;
    }

    set backgroundColor(v: number) {
        var b = v !== this._backgroundColor;
        if (b) {
            this._backgroundColor = v;
            this._isContentChanged = true;
        }
    }

    get border(): boolean {
        return this._border;
    }

    set border(v: boolean) {
        var b = v !== this._border;
        if (b) {
            this._border = v;
            this._isContentChanged = true;
        }
    }

    get borderColor(): number {
        return this._borderColor;
    }

    set borderColor(v: number) {
        var b = v !== this._borderColor;
        if (b) {
            this._borderColor = v;
            this._isContentChanged = true;
        }
    }

    get bottomScrollV(): number {
        throw new NotImplementedError();
    }

    get caretIndex(): number {
        throw new NotImplementedError();
    }

    condenseWhite: boolean = false;

    get defaultTextFormat(): TextFormat {
        return this._defaultTextFormat;
    }

    set defaultTextFormat(v: TextFormat) {
        if (this._defaultTextFormat !== null) {
            this._defaultTextFormat.removeEventListener(TextFormat.TEXT_FORMAT_CHANGE, this._textFormatChangedHandler);
        }
        this._defaultTextFormat = CommonUtil.ptr(v) ? v : new TextFormat();
        this._defaultTextFormat.addEventListener(TextFormat.TEXT_FORMAT_CHANGE, this._textFormatChangedHandler);
    }

    displayAsPassword: boolean = false;
    embedFonts: boolean = false;

    getCharBoundaries(): Rectangle {
        throw new NotImplementedError();
    }

    getCharIndexAtPoint(x: number, y: number): number {
        throw new NotImplementedError();
    }

    getFirstCharInParagraph(charIndex: number): number {
        throw new NotImplementedError();
    }

    getImageReference(id: string): DisplayObject {
        throw new NotImplementedError();
    }

    getLineIndexAtPoint(x: number, y: number): number {
        throw new NotImplementedError();
    }

    getLineIndexOfChar(charIndex: number): number {
        throw new NotImplementedError();
    }

    getLineLength(lineIndex: number): number {
        throw new NotImplementedError();
    }

    getLineMetrics(lineIndex: number): TextLineMetrics {
        throw new NotImplementedError();
    }

    getLineOffset(lineIndex: number): number {
        throw new NotImplementedError();
    }

    getLineText(lineIndex: number): string {
        throw new NotImplementedError();
    }

    getParagraphLength(charIndex: number): number {
        throw new NotImplementedError();
    }

    getTextFormat(beginIndex: number = -1, endIndex: number = -1): TextFormat {
        throw new NotImplementedError();
    }

    isFontCompatible(fontName: string, fontStyle: number): boolean {
        throw new NotImplementedError();
    }

    replaceSelectedText(value: string): void {
        throw new NotImplementedError();
    }

    replaceText(beginIndex: number, endIndex: number, newText: string): void {
        throw new NotImplementedError();
    }

    setSelection(beginIndex: number, endIndex: number): void {
        throw new NotImplementedError();
    }

    setTextFormat(format: TextFormat, beginIndex: number = -1, endIndex: number = -1): void {
        throw new NotImplementedError();
    }

    gridFitType: string = GridFitType.PIXEL;
    htmlText: string = null;

    get length(): number {
        return CommonUtil.ptr(this.text) ? this.text.length : 0;
    }

    maxChars: number = 0;

    get maxScrollH(): number {
        throw new NotImplementedError();
    }

    get maxScrollV(): number {
        throw new NotImplementedError();
    }

    mouseWheelEnabled: boolean = true;
    multiline: boolean = true;

    get numLines(): number {
        throw new NotImplementedError();
    }

    restrict: string = null;
    scrollH: number = 0;
    scrollV: number = 1;
    selectable: boolean = true;

    get selectionBeginIndex(): number {
        throw new NotImplementedError();
    }

    get selectionEndIndex(): number {
        throw new NotImplementedError();
    }

    sharpness: number = 0;
    styleSheet: StyleSheet = null;

    get text(): string {
        return this._text;
    }

    set text(v: string) {
        var b = this._text !== v;
        if (b) {
            this._text = v;
            this._isContentChanged = true;
        }
    }

    get textColor(): number {
        return this.defaultTextFormat.color;
    }

    set textColor(v: number) {
        var b = this.defaultTextFormat.color !== v;
        this.defaultTextFormat.color = v;
        if (b && !this.customOutlineEnabled) {
            this.textOutlineColor = v;
        }
    }

    /**
     * Non-standard extension.
     * @returns {Number}
     */
    get textOutlineColor(): number {
        return this._textOutlineColor;
    }

    /**
     * Non-standard extension.
     * @param v {Number}
     */
    set textOutlineColor(v: number) {
        var b = this._textOutlineColor !== v;
        if (b) {
            this._textOutlineColor = v;
            this._isContentChanged = true;
        }
    }

    /**
     * When set to true, outline color will not change when setting {@link textColor}, enabling drawing a
     * colorful outline. The default value is false.
     * Non-standard extension.
     * @type {Boolean}
     */
    customOutlineEnabled: boolean = false;

    get textHeight(): number {
        // TODO: This only works under single line circumstances.
        var height = this.defaultTextFormat.size * 1.5;
        if (this.thickness > 0) {
            height += this.thickness * 2;
        }
        return height;
    }

    textInteractionMode: string = TextInteractionMode.NORMAL;

    get textWidth(): number {
        // TODO: This only works under single line circumstances.
        var metrics: TextMetrics = this._context2D.measureText(this.text);
        var width = metrics.width;
        if (this.thickness > 0) {
            width += this.thickness * 2;
        }
        return width;
    }

    get thickness(): number {
        return this._thickness;
    }

    set thickness(v: number) {
        var b = this._thickness !== v;
        if (b) {
            this._thickness = v;
            this._isContentChanged = true;
        }
    }

    type: string = TextFieldType.DYNAMIC;
    useRichTextClipboard: boolean = false;
    wordWrap: boolean = false;

    dispose(): void {
        super.dispose();
        var renderer = this.$rawRoot.$worldRenderer;
        renderer.releaseRenderTarget(this._canvasTarget);
        this._canvasTarget = null;
        this._canvas = null;
        this._context2D = null;
    }

    protected _$update(timeInfo: TimeInfo): void {
        if (!this._isContentChanged) {
            return;
        }
        this._canvasTarget.updateImageSize();
        this._$updateCanvasTextStyle(this._context2D);
        this._$drawTextElements(this._context2D);
        this._isContentChanged = false;
    }

    protected _$render(renderer: WebGLRenderer): void {
        if (this.visible && this.alpha > 0 && this.text !== null && this.text.length > 0) {
            var canvasTarget = this._canvasTarget;
            canvasTarget.updateImageContent();
            var decomposed = this.transform.matrix3D.decompose();
            var matrix3D = new Matrix3D();
            // translation, rotation, skew, scale
            matrix3D.recompose([Vector3D.ORIGIN, decomposed[1], decomposed[2], decomposed[3]]);
            // Always invert Y axis, unless the target is a stencil.
            var renderTarget = renderer.currentRenderTarget;
            RenderHelper.copyImageContent(renderer, canvasTarget, renderTarget, false, !renderTarget.isStencil, matrix3D, this.alpha, false);
            console.log("TextField: target is stencil: " + renderTarget.isStencil);
        }
    }

    protected _$selectShader(shaderManager: ShaderManager): void {
        shaderManager.selectShader(ShaderID.COPY_IMAGE);
    }

    protected _$createCanvasTarget(renderer: WebGLRenderer): RenderTarget2D {
        if (this._canvas === null) {
            var canvas = VirtualDom.createElement<HTMLCanvasElement>("canvas");
            canvas.width = renderer.view.width;
            canvas.height = renderer.view.height;
            this._canvas = canvas;
            this._context2D = canvas.getContext("2d");
        }
        return renderer.createRenderTarget(this._canvas);
    }

    protected _$updateCanvasTextStyle(context2D: CanvasRenderingContext2D): void {
        var fontStyles: string[] = [];
        if (this.defaultTextFormat.bold) {
            fontStyles.push("bold");
        }
        if (this.defaultTextFormat.italic) {
            fontStyles.push("italic");
        }
        fontStyles.push(this.defaultTextFormat.size.toString() + "pt");
        fontStyles.push("\"" + this.defaultTextFormat.font + "\"");
        context2D.font = fontStyles.join(" ");
    }

    protected _$drawTextElements(context2D: CanvasRenderingContext2D): void {
        // TextField is a special class that do not actually draw vertices, so we have to calculate the transform
        // ourselves.
        // TODO: What about clipping bounds?
        var matrix3D = this.transform.matrix3D;
        var positionVector3 = new Vector3D(this.x, this.y, this.z);
        positionVector3 = matrix3D.transformVector(positionVector3);
        var x = positionVector3.x, y = positionVector3.y;
        var baseX = this.thickness;
        var baseY = this.thickness;
        var borderThickness = 1;
        context2D.clearRect(0, 0, this._canvas.width, this._canvas.height);
        if (this.background) {
            context2D.fillStyle = GLUtil.colorToCssSharp(this.backgroundColor);
            context2D.fillRect(x, y, this.textWidth + borderThickness * 2, this.textHeight + borderThickness * 2);
        }
        context2D.fillStyle = GLUtil.colorToCssSharp(this.textColor);
        context2D.fillText(this.text, x + baseX + borderThickness, y + this.textHeight * 0.75 + borderThickness);
        if (this.thickness > 0) {
            context2D.lineWidth = this.thickness;
            context2D.strokeStyle = GLUtil.colorToCssSharp(this.textOutlineColor);
            context2D.strokeText(this.text, x + baseX + borderThickness, y + this.textHeight * 0.75 + borderThickness);
        }
        if (this.border) {
            context2D.lineWidth = 1;
            context2D.strokeStyle = GLUtil.colorToCssSharp(this.borderColor);
            context2D.strokeRect(x + borderThickness, y + borderThickness, this.textWidth + borderThickness * 2, this.textHeight + borderThickness * 2);
        }
    }

    private __textFormatChanged(): void {
        // Cannot be declared as static or TypeScript compilation will fail.
        this._isContentChanged = true;
    }

    private _textFormatChangedHandler: Function = null;
    protected _defaultTextFormat: TextFormat = null;
    protected _isContentChanged: boolean = true;
    protected _canvasTarget: RenderTarget2D = null;
    protected _canvas: HTMLCanvasElement = null;
    protected _context2D: CanvasRenderingContext2D = null;
    protected _text: string = null;
    protected _background: boolean = false;
    protected _backgroundColor: number = 0xffffff;
    protected _border: boolean = false;
    protected _borderColor: number = 0x000000;
    protected _textColor: number = 0x000000;
    protected _textOutlineColor: number = 0x000000;
    protected _thickness: number = 0;

}
