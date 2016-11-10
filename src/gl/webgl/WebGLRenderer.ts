/**
 * Created by MIC on 2015/11/17.
 */

import * as libtess from "libtess";
import RendererOptions from "./RendererOptions";
import ShaderManager from "./ShaderManager";
import FilterManager from "./FilterManager";
import RenderTarget2D from "./targets/RenderTarget2D";
import WebGLUtils from "./WebGLUtils";
import IDisposable from "../mic/IDisposable";
import BlendMode from "../flash/display/BlendMode";
import VirtualDom from "../mic/VirtualDom";
import CommonUtil from "../mic/CommonUtil";
import FrameImage from "./FrameImage";

const gl = VirtualDom.WebGLRenderingContext;

/**
 * The WebGL $renderer, main provider of the rendering services.
 * @implements {IDisposable}
 */
export default class WebGLRenderer implements IDisposable {

    /**
     * Creates a new {@link WebGLRenderer}.
     * @param canvas {HTMLCanvasElement} If canvas is not null, the new {@link WebGLRenderer} will use it as target.
     * @param width {Number} The width for presentation of the $renderer.
     * @param height {Number} The height for presentation of the $renderer.
     * @param options {RendererOptions} Options for initializing the newly created {@link WebGLRenderer}.
     */
    constructor(options: RendererOptions, canvas: HTMLCanvasElement = null, width?: number, height?: number) {
        this.__initialize(options, canvas, width, height);
    }

    /**
     * Clear the screen.
     */
    clear(): void {
        if (this.screenRenderTarget !== null) {
            this.screenRenderTarget.clear();
        }
    }

    /**
     * Disposes the {@link WebGLRenderer} and related resources.
     */
    dispose(): void {
        if (!this._isInitialized) {
            return;
        }
        this.screenRenderTarget.dispose();
        this.filterManager.dispose();
        this.shaderManager.dispose();
        this._filterManager = null;
        this._shaderManager = null;
        this._screenRenderTarget = null;
        this._context = null;
        if (!CommonUtil.isUndefinedOrNull(this.view)) {
            this.view.parentNode.removeChild(this.view);
        }
        this._view = null;
    }

    beginDrawMaskObject(): void {
        var context = this.context;
        context.stencilFunc(gl.ALWAYS, 1, 0xff);
        context.stencilMask(0xff);
        context.enable(gl.STENCIL_TEST);
        context.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
        context.colorMask(false, false, false, false);
        this._isStencilTestEnabled = true;
    }

    beginDrawMaskedObjects(): void {
        var context = this.context;
        context.stencilFunc(gl.EQUAL, 1, 0xff);
        context.stencilMask(0);
        context.enable(gl.STENCIL_TEST);
        context.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
        context.colorMask(true, true, true, true);
        this._isStencilTestEnabled = true;
    }

    beginDrawNormalObjects(): void {
        var context = this.context;
        context.disable(gl.STENCIL_TEST);
        context.stencilMask(0);
        context.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
        context.colorMask(true, true, true, true);
        this._isStencilTestEnabled = false;
    }

    get isStencilTestEnabled(): boolean {
        return this._isStencilTestEnabled;
    }

    // get currentTarget(): BufferedBitmapTarget {
    //     return this._currentTarget;
    // }
    //
    // set currentTarget(v: BufferedBitmapTarget) {
    //     this._currentTarget = v;
    // }

    /**
     * Returns current $render target of the {@link WebGLRenderer}.
     * @returns {RenderTarget2D} Current $render target of the {@link WebGLRenderer}.
     */
    get currentRenderTarget(): RenderTarget2D {
        return this._currentRenderTarget;
    }

    /**
     * Switches current $render target to a specified {@link RenderTarget2D}.
     * @param v {RenderTarget2D} The {@link RenderTarget2D} that will be used. Null means using the default first-time
     * $render target of the {@link WebGLRenderer}. The default value is null.
     */
    set currentRenderTarget(v: RenderTarget2D) {
        if (v === this._currentRenderTarget && CommonUtil.ptr(v)) {
            return;
        }
        var t = this._currentRenderTarget = CommonUtil.ptr(v) ? v : this._screenRenderTarget;
        t.activate();
    }

    /**
     * Returns the output &lt;canvas&gt; for displaying the contents rendered.
     * @returns {HTMLCanvasElement} The output &lt;canvas&gt;.
     */
    get view(): HTMLCanvasElement {
        return this._view;
    }

    /**
     * Returns the {@link WebGLRenderingContext} attached to the {@link WebGLRenderer}.
     * @returns {WebGLRenderingContext} The {@link WebGLRenderingContext} attached to the {@link WebGLRenderer}.
     */
    get context(): WebGLRenderingContext {
        return this._context;
    }

    /**
     * Returns the {@link ShaderManager} used by the {@link WebGLRenderer}.
     * @returns {ShaderManager} The {@link ShaderManager} used by the {@link WebGLRenderer}.
     */
    get shaderManager(): ShaderManager {
        return this._shaderManager;
    }

    /**
     * Returns the {@link FilterManager} used by the {@link WebGLRenderer}.
     * @returns {FilterManager} The {@link FilterManager} used by the {@link WebGLRenderer}.
     */
    get filterManager(): FilterManager {
        return this._filterManager;
    }

    /**
     * Returns the tessellator used by the {@link WebGLRenderer}.
     * @returns {libtess.GluTesselator} The tessellator used by the {@link WebGLRenderer}.
     */
    get tessellator(): libtess.GluTesselator {
        return this._tessellator;
    }

    /**
     * Returns the final output of the {@link WebGLRenderer}. This target is always a root $render target, which directly
     * renders to the attached &lt;canvas&gt;. If FXAA is enabled, the copying process from {@link WebGLRenderer.currentRenderTarget}
     * to this target performs a FXAA filtering. If not, it is a simple replicating process.
     * @returns {RenderTarget2D} The output of the {@link WebGLRenderer}.
     */
    get screenRenderTarget(): RenderTarget2D {
        return this._screenRenderTarget;
    }

    /**
     * Creates a new {@link RenderTarget2D} as a buffer. {@link RenderTarget2D}s should be only instanted through this
     * factory method, and be released using {@link WebGLRenderer.releaseRenderTarget}.
     * @param [image] {FrameImage} See {@link RenderTarget2D.image}
     * for more information.
     * @returns {RenderTarget2D} The created {@link RenderTarget2D}.
     */
    createRenderTarget(image: FrameImage = null): RenderTarget2D {
        return new RenderTarget2D(this, image, false);
    }

    /**
     * Creates a new {@link RenderTarget2D} as an output to the screen. {@link RenderTarget2D}s should be only instanted
     * through this factory method, and be released using {@link WebGLRenderer.releaseRenderTarget}.
     * @param [image] {FrameImage} See {@link RenderTarget2D.image}
     * for more information.
     * @returns {RenderTarget2D} The created {@link RenderTarget2D}.
     */
    createRootRenderTarget(image: FrameImage = null): RenderTarget2D {
        return new RenderTarget2D(this, image, true);
    }

    /**
     * Releases a {@link RenderTarget2D} created by the {@link WebGLRenderer}.
     * @param target {RenderTarget2D} The {@link RenderTarget2D} to be released.
     */
    releaseRenderTarget(target: RenderTarget2D): void {
        if (!CommonUtil.isUndefinedOrNull(target)) {
            target.dispose();
        }
    }

    /**
     * Set current blend mode. Blend modes affects how the visual contents are rendered.
     * @param blendMode {String} See {@link BlendMode} for more information.
     * @see {@link BlendMode}
     */
    set blendMode(blendMode: string) {
        if (!this._isInitialized) {
            return;
        }
        if (this._blendMode === blendMode) {
            return;
        }

        var config: number[] = BMS[blendMode] || BMS[BlendMode.NORMAL];
        var glc = this._context;
        if (config[0] >= 0) {
            glc.blendEquation(gl.FUNC_ADD);
        } else {
            glc.blendEquation(gl.FUNC_SUBTRACT);
        }
        glc.blendFunc(config[1], config[2]);
        this._blendMode = blendMode;
    }

    /**
     * @returns {String}
     */
    get blendMode(): string {
        return this._blendMode;
    }

    /**
     * The default {@link RendererOptions} for instantiating a {@link WebGLRenderer}.
     * @type {RendererOptions}
     */
    static DEFAULT_OPTIONS: RendererOptions = {
        antialias: true,
        depth: false,
        transparent: true
    };

    /**
     * Initializes the newly created {@link WebGLRenderer}.
     * @param options {RendererOptions} Initialization options.
     * @param [canvas] {HTMLCanvasElement} Base canvas. If not specified, then a new canvas will be created using
     *                                     parameters width and height.
     * @param [width] {Number} The width, in pixels.
     * @param [height] {Number} The height, in pixels.
     * @private
     */
    private __initialize(options: RendererOptions, canvas: HTMLCanvasElement = null, width?: number, height?: number) {
        if (this._isInitialized) {
            return;
        }
        this._isInitialized = true;
        this._options = CommonUtil.deepClone(options);

        if (!canvas) {
            canvas = VirtualDom.createElement<HTMLCanvasElement>("canvas");
            canvas.className = "glantern-view";
        }
        if (!CommonUtil.isUndefined(width)) {
            canvas.width = width;
        }
        if (!CommonUtil.isUndefined(height)) {
            canvas.height = height;
        }

        var attributes: WebGLContextAttributes = Object.create(null);
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
        this.blendMode = BlendMode.NORMAL;

        this._screenRenderTarget = this.createRootRenderTarget();

        canvas.addEventListener("webglcontextlost", this.__onContextLost.bind(this));
        canvas.addEventListener("webglcontextrestored", this.__onContextRestored.bind(this));

        this._tessellator = new libtess.GluTesselator();
        this._shaderManager = new ShaderManager(this);
        this._filterManager = new FilterManager(this);

        this.currentRenderTarget = null;

        this.__initializeTessellator();
    }

    /**
     * Initializes the tessellator.
     * @private
     */
    private __initializeTessellator(): void {
        var tess = this._tessellator;
        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA,
            (data: number[], polyVertArray: number[][]): void => {
                polyVertArray[polyVertArray.length - 1].push(data[0], data[1], data[2]);
            });
        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_BEGIN_DATA,
            (type: number, vertexArrays: number[][]): void => {
                if (type !== libtess.primitiveType.GL_TRIANGLES) {
                    console.warn('{TESS} expected TRIANGLES but got type: ' + type);
                }
                vertexArrays.push([]);
            });
        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_ERROR,
            (errorCode: number): void => {
                console.warn('{TESS} error number: ', errorCode);
            });
        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_COMBINE,
            (coords: number[], data: any, weight: number): number[] => {
                return [coords[0], coords[1], coords[2]];
            });
        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_EDGE_FLAG,
            (flag: any): void => {
                // Do nothing
            });
    }

    /**
     * The event handler for handling the lost of active {@link WebGLRenderingContext}.
     * @param ev {Event} Event parameters.
     */
    private __onContextLost(ev: Event): void {
    }

    /**
     * The event handler for handling the restoration of active {@link WebGLRenderingContext}.
     * @param ev {Event} Event parameters.
     */
    private __onContextRestored(ev: Event): void {
    }

    private _currentRenderTarget: RenderTarget2D = null;
    private _blendMode: string = null;
    private _screenRenderTarget: RenderTarget2D = null;
    private _filterManager: FilterManager = null;
    private _shaderManager: ShaderManager = null;
    private _tessellator: libtess.GluTesselator = null;
    private _isStencilTestEnabled: boolean = false;
    private _context: WebGLRenderingContext = null;
    private _view: HTMLCanvasElement;
    private _options: RendererOptions = null;
    private _isInitialized: boolean = false;

}

var BMS: {[k: string]: number[]} = Object.create(null);
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
