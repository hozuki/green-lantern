/**
 * Created by MIC on 2015/11/18.
 */

import {WebGLRenderer} from "../../webgl/WebGLRenderer";
import {ColorCorrectionSupport} from "./ColorCorrectionSupport";
import {NotImplementedError} from "../../_util/NotImplementedError";
import {Rectangle} from "../geom/Rectangle";
import {StageScaleMode} from "./StageScaleMode";
import {StageQuality} from "./StageQuality";
import {InteractiveObject} from "./InteractiveObject";
import {StageDisplayState} from "./StageDisplayState";
import {ColorCorrection} from "./ColorCorrection";
import {StageAlign} from "./StageAlign";
import {DisplayObjectContainer} from "./DisplayObjectContainer";

export class Stage extends DisplayObjectContainer {

    public constructor(renderer:WebGLRenderer) {
        super(null, null);
        this._root = this;
        this._worldRenderer = renderer;
        this._rawRenderTarget = renderer.createRenderTarget();
        this.resize(renderer.view.width, renderer.view.height);
    }

    public align:string = StageAlign.TOP_LEFT;

    public get allowFullScreen():boolean {
        return this._allowFullScreen;
    }

    public get allowFullScreenInteractive():boolean {
        return this._allowFullScreenInteractive;
    }

    public color:number = 0;
    public colorCorrection:string = ColorCorrection.DEFAULT;

    public get colorCorrectionSupport():string {
        return this._colorCorrectionSupport;
    }

    public displayState:string = StageDisplayState.NORMAL;
    public focus:InteractiveObject = null;
    public frameRate:number = 60;

    public get fullScreenHeight():number {
        return screen.height;
    }

    public fullScreenSourceRect:Rectangle = null;

    public get fullScreenWidth():number {
        return screen.width;
    }

    public mouseChildren:boolean = true;
    public quality:string = StageQuality.HIGH;
    public scaleMode:string = StageScaleMode.NO_SCALE;
    public showDefaultContextMenu:boolean = true;

    public get softKeyboardRect():Rectangle {
        throw new NotImplementedError();
    }

    public get stageHeight():number {
        throw new NotImplementedError();
    }

    public set stageHeight(v:number) {
        throw new NotImplementedError();
    }

    public get stageWidth():number {
        throw new NotImplementedError();
    }

    public set stageWidth(v:number) {
        throw new NotImplementedError();
    }

    public tabChildren:boolean = true;

    public get x():number {
        return 0;
    }

    public get y():number {
        return 0;
    }

    public invalidate():void {
        throw new NotImplementedError();
    }

    public isFocusInaccessible():boolean {
        throw new NotImplementedError();
    }

    public get worldRenderer():WebGLRenderer {
        return this._worldRenderer;
    }

    public resize(width:number, height:number):void {
        this._width = width;
        this._height = height;
        // TODO: Fully implement this
    }

    public render(renderer:WebGLRenderer):void {
        super.render(renderer);
        // Copy it to the screen target.
        //throw new NotImplementedError();
        renderer.copyRenderTargetContent(this.outputRenderTarget, renderer.inputTarget, true);
    }

    protected __render(renderer:WebGLRenderer):void {
        this._rawRenderTarget.clear();
    }

    protected __update():void {
    }

    private _allowFullScreen:boolean = true;
    private _allowFullScreenInteractive:boolean = true;
    private _colorCorrectionSupport:string = ColorCorrectionSupport.DEFAULT_OFF;
    private _stageHeight:number = 0;
    private _stageWidth:number = 0;
    private _worldRenderer:WebGLRenderer = null;

}
