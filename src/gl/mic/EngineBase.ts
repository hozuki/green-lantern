/**
 * Created by MIC on 2015/11/25.
 */

import {WebGLRenderer} from "../webgl/WebGLRenderer";
import {Stage} from "../flash/display/Stage";
import {RendererOptions} from "../webgl/RendererOptions";
import {FlashEvent} from "../flash/events/FlashEvent";
import {EventBase} from "./EventBase";
import {TimeInfo} from "./TimeInfo";
import {VirtualDom} from "./VirtualDom";
import {EventDispatcher} from "../flash/events/EventDispatcher";
import {CommonUtil} from "./CommonUtil";

export class EngineBase extends EventDispatcher {

    constructor() {
        super();
        this._attachedUpdateFunctions = [];
    }

    initialize(width: number, height: number, options: RendererOptions = WebGLRenderer.DEFAULT_OPTIONS): void {
        if (this.isInitialized) {
            return;
        }
        this._renderer = new WebGLRenderer(width, height, options);
        this._stage = new Stage(this._renderer);
        this._loopFunction = this.__mainLoop.bind(this);
        this._isInitialized = true;
    }

    dispose(): void {
        if (!this.isInitialized) {
            return;
        }
        this.stage.dispose();
        this.renderer.dispose();
        this._stage = null;
        this._renderer = null;
        var attachedFunctions = this._attachedUpdateFunctions;
        while (attachedFunctions.length > 0) {
            attachedFunctions.pop();
        }
        this._isInitialized = false;
        super.dispose();
    }

    /**
     * Starts the animation loop. Updating and rendering are automatically handled in the loop.
     * By default, {@link startAnimation} uses {@link window.requestAnimationFrame} function and relies
     * on the frame rate adjuster of the browser window.
     */
    startAnimation(): void {
        if (!this.isInitialized) {
            return;
        }
        if (!this.isAnimationRunning) {
            this._lastTimeUpdated = Date.now();
        }
        this._isRunning = true;
        VirtualDom.requestAnimationFrame(this._loopFunction);
    }

    /**
     * Stops the animation loop. Internal state is preserved, and the next {@link startAnimation} call resumes
     * from last state.
     */
    stopAnimation(): void {
        if (!this.isInitialized) {
            return;
        }
        this.__updateTimeCounters();
        this._fps = 0;
        this._isRunning = false;
    }

    clear(): void {
        this.renderer.clear();
    }

    runOneFrame(timeInfo: TimeInfo): void {
        if (!this._isInitialized) {
            return;
        }
        var attachedFunctions = this._attachedUpdateFunctions;
        if (attachedFunctions.length > 0) {
            for (var i = 0; i < attachedFunctions.length; ++i) {
                var func = attachedFunctions[i];
                if (CommonUtil.isFunction(func)) {
                    func(timeInfo);
                }
            }
        }
        var stage = this.stage;
        stage.dispatchEvent(EventBase.create(FlashEvent.ENTER_FRAME));
        stage.update(timeInfo);
        stage.render(this.renderer);
    }

    get stage(): Stage {
        return this._stage;
    }

    get renderer(): WebGLRenderer {
        return this._renderer;
    }

    get view(): HTMLCanvasElement {
        return this.isInitialized ? this._renderer.view : null;
    }

    /**
     * Gets a boolean flag indicating whether the animation loop is running.
     * @returns {Boolean}
     */
    get isAnimationRunning(): boolean {
        return this.isInitialized && this._isRunning;
    }

    get isInitialized(): boolean {
        return this._isInitialized;
    }

    attachUpdateFunction(func: (timeInfo: TimeInfo) => void): void {
        var attachedFunctions = this._attachedUpdateFunctions;
        if (CommonUtil.isFunction(func) && attachedFunctions.indexOf(func) < 0) {
            attachedFunctions.push(func);
        }
    }

    /**
     * Gets total time elapsed in handling the animation loop, in milliseconds.
     * @returns {Number}
     */
    get elapsedMillis(): number {
        return this._elapsedMillis;
    }

    /**
     * Gets the average FPS (frame per second) of last second.
     * @returns {Number}
     */
    get fps(): number {
        return this._fps;
    }

    private __updateTimeCounters(): void {
        if (this._lastTimeUpdated > 0) {
            var now = Date.now();
            this._elapsedMillis += now - this._lastTimeUpdated;
            this._lastTimeUpdated = now;
        }
        ++this._fpsCounter;
        if (this.elapsedMillis - this._lastTimeFpsUpdated > 1000) {
            this._fps = this._fpsCounter / (this.elapsedMillis - this._lastTimeFpsUpdated) * 1000;
            this._fpsCounter = 0;
            this._lastTimeFpsUpdated = this.elapsedMillis;
        }
    }

    /**
     * The main render loop.
     * @param time {Number} The time argument of {@link window#requestAnimationFrame} callback. However, some browsers
     * does not invoke with this argument.
     * @private
     */
    private __mainLoop(time: number): void {
        if (!this.isAnimationRunning) {
            return;
        }
        this.__updateTimeCounters();
        var timeInfo: TimeInfo = {millisFromStartup: this.elapsedMillis};
        this.runOneFrame(timeInfo);
        VirtualDom.requestAnimationFrame(this._loopFunction);
    }

    private _isRunning: boolean = false;
    private _renderer: WebGLRenderer = null;
    private _stage: Stage = null;
    private _isInitialized: boolean = false;
    private _attachedUpdateFunctions: ((timeInfo: TimeInfo) => void)[] = null;
    private _loopFunction: (time: number) => void = null;
    private _elapsedMillis: number = 0;
    private _fps: number = 0;
    private _fpsCounter: number = 0;
    private _lastTimeFpsUpdated: number = 0;
    private _lastTimeUpdated: number = -1;

}
