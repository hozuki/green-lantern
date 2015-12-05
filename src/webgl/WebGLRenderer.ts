/**
 * Created by MIC on 2015/11/17.
 */

import libtess = require("libtess");

import {RendererOptions} from "./RendererOptions";
import {ShaderManager} from "./ShaderManager";
import {FilterManager} from "./FilterManager";
import {RenderTarget2D} from "./RenderTarget2D";
import {WebGLUtils} from "./WebGLUtils";
import {_util} from "../_util/_util";
import {IDisposable} from "../IDisposable";
import {RenderHelper} from "./RenderHelper";
import {BlendMode} from "../flash/display/BlendMode";

var gl = (<any>this).WebGLRenderingContext || (<any>window).WebGLRenderingContext;

/**
 * The WebGL renderer, main provider of the rendering services.
 */
export class WebGLRenderer implements IDisposable {

    /**
     * Instantiates a new {@link WebGLRenderer}.
     * @param width {Number} The width for presentation of the renderer.
     * @param height {Number} The height for presentation of the renderer.
     * @param options {RendererOptions} Options for initializing the newly created {@link WebGLRenderer}.
     * @implements {IDisposable}
     */
    constructor(width:number, height:number, options:RendererOptions) {
        this.__initialize(width, height, options);
    }

    /**
     * Disposes the {@link WebGLRenderer} and related resources.
     */
    dispose():void {
        if (this._isInitialized) {
            this._inputTarget.dispose();
            this._screenTarget.dispose();
            this._filterManager.dispose();
            this._shaderManager.dispose();
            this._filterManager = null;
            this._shaderManager = null;
            this._inputTarget = null;
            this._screenTarget = null;
            this._context = null;
            if (this._view.parentNode !== null && this._view.parentNode !== undefined) {
                this._view.parentNode.removeChild(this._view);
            }
            this._view = null;
        }
    }

    /**
     * Switches current render target to a specified {@link RenderTarget2D}.
     * @param [target] {RenderTarget2D} The {@link RenderTarget2D} that will be used. Null means using the default first-time
     * render target of the {@link WebGLRenderer}. The default value is null.
     */
    setRenderTarget(target:RenderTarget2D = null):void {
        if (_util.isUndefinedOrNull(target)) {
            this._currentRenderTarget = this._inputTarget;
        } else {
            this._currentRenderTarget = target;
        }
        this._currentRenderTarget.activate();
    }

    /**
     * Returns current render target of the {@link WebGLRenderer}.
     * @returns {RenderTarget2D} Current render target of the {@link WebGLRenderer}.
     */
    get currentRenderTarget():RenderTarget2D {
        return this._currentRenderTarget;
    }

    /**
     * Returns the output &lt;canvas&gt; for displaying the contents rendered.
     * @returns {HTMLCanvasElement} The output &lt;canvas&gt;.
     */
    get view():HTMLCanvasElement {
        return this._view;
    }

    /**
     * Returns the {@link WebGLRenderingContext} attached to the {@link WebGLRenderer}.
     * @returns {WebGLRenderingContext} The {@link WebGLRenderingContext} attached to the {@link WebGLRenderer}.
     */
    get context():WebGLRenderingContext {
        return this._context;
    }

    /**
     * Returns the {@link ShaderManager} used by the {@link WebGLRenderer}.
     * @returns {ShaderManager} The {@link ShaderManager} used by the {@link WebGLRenderer}.
     */
    get shaderManager():ShaderManager {
        return this._shaderManager;
    }

    /**
     * Returns the {@link FilterManager} used by the {@link WebGLRenderer}.
     * @returns {FilterManager} The {@link FilterManager} used by the {@link WebGLRenderer}.
     */
    get filterManager():FilterManager {
        return this._filterManager;
    }

    /**
     * Returns the tessellator used by the {@link WebGLRenderer}.
     * @returns {libtess.GluTesselator} The tessellator used by the {@link WebGLRenderer}.
     */
    get tessellator():libtess.GluTesselator {
        return this._tessellator;
    }

    /**
     * Returns the first-time render target of the {@link WebGLRenderer}. Contents are all rendered to this target. Then,
     * the contents on this target are copied to {@link WebGLRenderer.screenTarget} for postprocessing.
     * @returns {RenderTarget2D} The first-time render target of the {@link WebGLRenderer}.
     */
    get inputTarget():RenderTarget2D {
        return this._inputTarget;
    }

    /**
     * Returns the final output of the {@link WebGLRenderer}. This target is always a root render target, which directly
     * renders to the attached &lt;canvas&gt;. If FXAA is enabled, the copying process from {@link WebGLRenderer.inputTarget}
     * to this target performs a FXAA filtering. If not, it is a simple replicating process.
     * @returns {RenderTarget2D} The output of the {@link WebGLRenderer}.
     */
    get screenTarget():RenderTarget2D {
        return this._screenTarget;
    }

    /**
     * Creates a new {@link RenderTarget2D} as a buffer. {@link RenderTarget2D}s should be only instanted through this
     * factory method, and be released using {@link WebGLRenderer.releaseRenderTarget}.
     * @param [image] {ImageData|HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} See {@link RenderTarget2D.image}
     * for more information.
     * @returns {RenderTarget2D} The created {@link RenderTarget2D}.
     */
    createRenderTarget(image:ImageData|HTMLCanvasElement|HTMLImageElement|HTMLVideoElement = null):RenderTarget2D {
        return new RenderTarget2D(this, image, false);
    }

    /**
     * Creates a new {@link RenderTarget2D} as an output to the screen. {@link RenderTarget2D}s should be only instanted
     * through this factory method, and be released using {@link WebGLRenderer.releaseRenderTarget}.
     * @param [image] {ImageData|HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} See {@link RenderTarget2D.image}
     * for more information.
     * @returns {RenderTarget2D} The created {@link RenderTarget2D}.
     */
    createRootRenderTarget(image:ImageData|HTMLCanvasElement|HTMLImageElement|HTMLVideoElement = null):RenderTarget2D {
        return new RenderTarget2D(this, image, true);
    }

    /**
     * Releases a {@link RenderTarget2D} created by the {@link WebGLRenderer}.
     * @param target {RenderTarget2D} The {@link RenderTarget2D} to be released.
     */
    releaseRenderTarget(target:RenderTarget2D):void {
        if (target !== null && target !== undefined) {
            target.dispose();
        }
    }

    /**
     * Performs a simple copying from the source {@link RenderTarget2D} to the destination {@link RenderTarget2D}.
     * @param source {RenderTarget2D} The source of contents.
     * @param destination {RenderTarget2D} The destination to which the contents are copyied.
     * @param clearOutput {Boolean} Whether to clear the contents of the destination before copying or not.
     */
    copyRenderTargetContent(source:RenderTarget2D, destination:RenderTarget2D, clearOutput:boolean):void {
        RenderHelper.copyTargetContent(this, source, destination, false, false, clearOutput);
    }

    /**
     * Performs an extended copying from the source {@link RenderTarget2D} to the destination {@link RenderTarget2D}.
     * @param source {RenderTarget2D} The source of contents.
     * @param destination {RenderTarget2D} The destination to which the contents are copyied.
     * @param flipX {Boolean} Whether to flip the contents horizontally during copying or not.
     * @param flipY {Boolean} Whether to flip the contents vertically during copying or not.
     * @param clearOutput {Boolean} Whether to clear the contents of the destination before copying or not.
     */
    copyRenderTargetContentEx(source:RenderTarget2D, destination:RenderTarget2D, flipX:boolean, flipY:boolean, clearOutput:boolean):void {
        RenderHelper.copyTargetContent(this, source, destination, flipX, flipY, clearOutput);
    }

    /**
     * Presents the final composition result.
     */
    present():void {
        this.copyRenderTargetContentEx(this._inputTarget, this._screenTarget, false, true, true);
    }

    /**
     * Set current blend mode. Blend modes affects how the visual contents are rendered.
     * @param blendMode {String} See {@link BlendMode} for more information.
     * @see {@link BlendMode}
     */
    setBlendMode(blendMode:string):void {
        if (!this._isInitialized) {
            return;
        }
        if (this._currentBlendMode === blendMode) {
            return;
        }

        var config:number[] = BMS[blendMode] || BMS[BlendMode.NORMAL];
        var glc = this._context;
        if (config[0] >= 0) {
            glc.blendEquation(gl.FUNC_ADD);
        } else {
            glc.blendEquation(gl.FUNC_SUBTRACT);
        }
        glc.blendFunc(config[1], config[2]);
        this._currentBlendMode = blendMode;
    }

    /**
     * Initializes the newly created {@link WebGLRenderer}.
     * @param width {Number} The width, in pixels.
     * @param height {Number} The height, in pixels.
     * @param options {RendererOptions} Initialization options.
     * @private
     */
    private __initialize(width:number, height:number, options:RendererOptions) {
        if (this._isInitialized) {
            return;
        }
        this._options = _util.deepClone(options);

        var canvas:HTMLCanvasElement = window.document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        var attributes:WebGLContextAttributes = Object.create(null);
        attributes.alpha = options.transparent;
        attributes.antialias = options.antialias;
        attributes.premultipliedAlpha = true;
        attributes.depth = false;
        this._context = WebGLUtils.setupWebGL(canvas, attributes);
        this._view = canvas;

        var glc = this._context;
        glc.disable(gl.DEPTH_TEST);
        glc.disable(gl.CULL_FACE);
        glc.enable(gl.BLEND);
        glc.blendEquation(gl.FUNC_ADD);
        //glc.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        glc.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        /*
         if (options.antialias) {
         // If anti-alias is on, then we need to draw the "screen" to a FXAA buffer
         this._receiveTarget = this.createRenderTarget(); // MSAA zoomFactor = 2
         this._screenTarget = this.createRootRenderTarget(); // MSAA zoomFactor = 1
         } else {
         // If anti-alias is off, then we will output to the screen, directly.
         this._receiveTarget = this.createRootRenderTarget();
         }
         */
        this._inputTarget = this.createRenderTarget();
        this._screenTarget = this.createRootRenderTarget();

        canvas.addEventListener("webglcontextlost", this.onContextLost.bind(this));
        canvas.addEventListener("webglcontextrestored", this.onContextRestored.bind(this));

        this._tessellator = new libtess.GluTesselator();
        this._shaderManager = new ShaderManager(this);
        this._filterManager = new FilterManager(this);

        this.setRenderTarget(null);

        this.__initializeTessellator();
        this._isInitialized = true;

    }

    /**
     * Initializes the tessellator.
     * @private
     */
    private __initializeTessellator():void {
        var tess = this._tessellator;
        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA,
            (data:number[], polyVertArray:number[][]):void => {
                polyVertArray[polyVertArray.length - 1].push(data[0], data[1], data[2]);
            });
        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_BEGIN_DATA,
            (type:number, vertexArrays:number[][]):void => {
                if (type !== libtess.primitiveType.GL_TRIANGLES) {
                    console.warn('{TESS} expected TRIANGLES but got type: ' + type);
                }
                vertexArrays.push([]);
            });
        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_ERROR,
            (errorCode:number):void => {
                console.warn('{TESS} error number: ', errorCode);
            });
        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_COMBINE,
            (coords:number[], data:any, weight:number):number[] => {
                return [coords[0], coords[1], coords[2]];
            });
        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_EDGE_FLAG,
            (flag:any):void => {
                // Do nothing
            });
    }

    /**
     * The event handler for handling the lost of active {@link WebGLRenderingContext}.
     * @param ev {Event} Event parameters.
     */
    private onContextLost(ev:Event):void {
    }

    /**
     * The event handler for handling the restoration of active {@link WebGLRenderingContext}.
     * @param ev {Event} Event parameters.
     */
    private onContextRestored(ev:Event):void {
    }

    /**
     * The default {@link RendererOptions} for instantiating a {@link WebGLRenderer}.
     * @type {RendererOptions}
     */
    static DEFAULT_OPTIONS:RendererOptions = {
        antialias: false,
        depth: false,
        transparent: true
    };

    private _currentRenderTarget:RenderTarget2D = null;
    private _currentBlendMode:string = BlendMode.NORMAL;
    private _inputTarget:RenderTarget2D = null;
    private _screenTarget:RenderTarget2D = null;
    private _filterManager:FilterManager = null;
    private _shaderManager:ShaderManager = null;
    private _tessellator:libtess.GluTesselator = null;
    private _context:WebGLRenderingContext = null;
    private _view:HTMLCanvasElement;
    private _options:RendererOptions = null;
    private _isInitialized:boolean = false;

}

var BMS:{[k:string]:number[]} = Object.create(null);
BMS[BlendMode.ADD] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
BMS[BlendMode.ALPHA] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
BMS[BlendMode.DARKEN] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
BMS[BlendMode.DIFFERENCE] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
BMS[BlendMode.ERASE] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
BMS[BlendMode.HARDLIGHT] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
BMS[BlendMode.INVERT] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
BMS[BlendMode.LAYER] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
BMS[BlendMode.LIGHTEN] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
BMS[BlendMode.MULTIPLY] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
BMS[BlendMode.NORMAL] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
BMS[BlendMode.OVERLAY] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
BMS[BlendMode.SCREEN] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
BMS[BlendMode.SHADER] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
BMS[BlendMode.SUBTRACT] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
