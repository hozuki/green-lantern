/**
 * Created by MIC on 2015/11/25.
 */

import {WebGLRenderer} from "./webgl/WebGLRenderer";
import {Stage} from "./flash/display/Stage";
import {RendererOptions} from "./webgl/RendererOptions";
import {_util} from "./_util/_util";
import {FlashEvent} from "./flash/events/FlashEvent";
import {IDisposable} from "./IDisposable";

export class GLantern implements IDisposable {

    constructor() {
    }

    initialize(width:number, height:number, options:RendererOptions = WebGLRenderer.DEFAULT_OPTIONS):void {
        if (this._isInitialized) {
            return;
        }
        this._renderer = new WebGLRenderer(width, height, options);
        this._stage = new Stage(this._renderer);
        this._isInitialized = true;
    }

    dispose():void {
        if (!this._isInitialized) {
            return;
        }
        this._stage.dispose();
        this._renderer.dispose();
        this._stage = null;
        this._renderer = null;
        this._isInitialized = false;
    }

    startAnimation():void {
        if (!this._isInitialized) {
            return;
        }
        this._isRunning = true;
        _util.requestAnimationFrame(this.__mainLoop.bind(this));
    }

    stopAnimation():void {
        if (!this._isInitialized) {
            return;
        }
        this._isRunning = false;
    }

    clear():void {
        this._renderer.clear();
    }

    runOneFrame():void {
        if (!this._isInitialized) {
            return;
        }
        this._stage.dispatchEvent(FlashEvent.create(FlashEvent.ENTER_FRAME));
        if (this._attachedUpdateFunction !== null && this._attachedUpdateFunction instanceof Function) {
            this._attachedUpdateFunction();
        }
        this._stage.update();
        this._stage.render(this._renderer);
        this._renderer.present();
    }

    get stage():Stage {
        return this._stage;
    }

    get renderer():WebGLRenderer {
        return this._renderer;
    }

    get view():HTMLCanvasElement {
        return this._isInitialized ? this._renderer.view : null;
    }

    attachUpdateFunction(func:() => void):void {
        this._attachedUpdateFunction = func;
    }

    private __mainLoop(time:number):void {
        if (!this._isRunning || !this._isInitialized) {
            return;
        }
        this.runOneFrame();
        _util.requestAnimationFrame(this.__mainLoop.bind(this));
    }

    private _isRunning:boolean = false;
    private _renderer:WebGLRenderer = null;
    private _stage:Stage = null;
    private _isInitialized:boolean = false;
    private _attachedUpdateFunction:() => void = null;

}
