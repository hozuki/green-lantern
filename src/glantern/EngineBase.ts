/**
 * Created by MIC on 2015/11/25.
 */

import {WebGLRenderer} from "../webgl/WebGLRenderer";
import {Stage} from "../flash/display/Stage";
import {RendererOptions} from "../webgl/RendererOptions";
import {FlashEvent} from "../flash/events/FlashEvent";
import {IDisposable} from "./IDisposable";
import {GLUtil} from "./GLUtil";
import {VisualUtil} from "./VisualUtil";

export class EngineBase implements IDisposable {

    constructor() {
        this._attachedUpdateFunction = [];
    }

    initialize(width:number, height:number, options:RendererOptions = WebGLRenderer.DEFAULT_OPTIONS):void {
        if (this._isInitialized) {
            return;
        }
        this._renderer = new WebGLRenderer(width, height, options);
        this._stage = new Stage(this._renderer);
        this._loopFunction = this.__mainLoop.bind(this);
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
        while (this._attachedUpdateFunction.length > 0) {
            this._attachedUpdateFunction.pop();
        }
        this._isInitialized = false;
    }

    startAnimation():void {
        if (!this._isInitialized) {
            return;
        }
        this._isRunning = true;
        VisualUtil.requestAnimationFrame(this._loopFunction);
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
        if (this._attachedUpdateFunction.length > 0) {
            for (var i = 0; i < this._attachedUpdateFunction.length; ++i) {
                var func = this._attachedUpdateFunction[i];
                if (typeof func === "function") {
                    func();
                }
            }
        }
        this._stage.update();
        this._stage.render(this._renderer);
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
        if (typeof func === "function" && this._attachedUpdateFunction.indexOf(func) < 0) {
            this._attachedUpdateFunction.push(func);
        }
    }

    private __mainLoop(time:number):void {
        if (!this._isRunning || !this._isInitialized) {
            return;
        }
        this.runOneFrame();
        VisualUtil.requestAnimationFrame(this._loopFunction);
    }

    protected _isRunning:boolean = false;
    protected _renderer:WebGLRenderer = null;
    protected _stage:Stage = null;
    protected _isInitialized:boolean = false;
    protected _attachedUpdateFunction:(() => void)[] = null;
    private _loopFunction:(time:number) => void = null;

}
