/**
 * Created by MIC on 2015/11/20.
 */

import {DisplayObject} from "./DisplayObject";
import {Stage} from "./Stage";
import {DisplayObjectContainer} from "./DisplayObjectContainer";
import {BitmapData} from "./BitmapData";
import {PixelSnapping} from "./PixelSnapping";
import {WebGLRenderer} from "../../webgl/WebGLRenderer";
import {ShaderManager} from "../../webgl/ShaderManager";
import {ShaderID} from "../../webgl/ShaderID";
import {RenderHelper} from "../../webgl/RenderHelper";
import {RenderTarget2D} from "../../webgl/RenderTarget2D";
import {TimeInfo} from "../../glantern/TimeInfo";

export class Bitmap extends DisplayObject {

    constructor(root:Stage, parent:DisplayObjectContainer, bitmapData:BitmapData = null,
                pixelSnapping:string = PixelSnapping.AUTO, smoothing:boolean = false) {
        super(root, parent);
        this.bitmapData = bitmapData;
        this.pixelSnapping = pixelSnapping;
        this.smoothing = smoothing;
    }

    get bitmapData():BitmapData {
        return this._bitmapData;
    }

    set bitmapData(v:BitmapData) {
        this.__disposeRenderTarget();
        this._bitmapData = v;
        // HACK: not-assured cast.
        this._renderTarget = (<Stage>this.root).worldRenderer.createRenderTarget(v.canvas);
    }

    get pixelSnapping():string {
        return this._pixelSnapping;
    }

    set pixelSnapping(v:string) {
        this._pixelSnapping = v;
    }

    get smoothing():boolean {
        return this._smoothing;
    }

    set smoothing(v:boolean) {
        this._smoothing = v;
    }

    dispose():void {
        this.__disposeRenderTarget();
        super.dispose();
    }

    protected _$update(timeInfo:TimeInfo):void {
    }

    protected _$render(renderer:WebGLRenderer):void {
        if (!this.bitmapData) {
            return;
        }
        RenderHelper.renderImage(renderer, this._renderTarget, renderer.currentRenderTarget, false);
    }

    protected _$selectShader(shaderManager:ShaderManager):void {
        shaderManager.selectShader(ShaderID.COPY_IMAGE);
    }

    private __disposeRenderTarget():void {
        if (this._renderTarget) {
            this._renderTarget.dispose();
            this._renderTarget = null;
        }
    }

    private _bitmapData:BitmapData = null;
    private _renderTarget:RenderTarget2D = null;
    private _pixelSnapping:string = null;
    private _smoothing:boolean = false;

}
