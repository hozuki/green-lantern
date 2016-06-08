/**
 * Created by MIC on 2015/11/17.
 */
"use strict";
var libtess = require("libtess");
var ShaderManager_1 = require("./ShaderManager");
var FilterManager_1 = require("./FilterManager");
var RenderTarget2D_1 = require("./RenderTarget2D");
var WebGLUtils_1 = require("./WebGLUtils");
var BlendMode_1 = require("../flash/display/BlendMode");
var GLUtil_1 = require("../GLUtil");
var gl = this.WebGLRenderingContext || window.WebGLRenderingContext;
/**
 * The WebGL renderer, main provider of the rendering services.
 */
var WebGLRenderer = (function () {
    /**
     * Instantiates a new {@link WebGLRenderer}.
     * @param width {Number} The width for presentation of the renderer.
     * @param height {Number} The height for presentation of the renderer.
     * @param options {RendererOptions} Options for initializing the newly created {@link WebGLRenderer}.
     * @implements {IDisposable}
     */
    function WebGLRenderer(width, height, options) {
        this._currentRenderTarget = null;
        this._currentBlendMode = null;
        this._screenTarget = null;
        this._filterManager = null;
        this._shaderManager = null;
        this._tessellator = null;
        this._context = null;
        this._options = null;
        this._isInitialized = false;
        this.__initialize(width, height, options);
    }
    /**
     * Clear the screen.
     */
    WebGLRenderer.prototype.clear = function () {
        if (this._screenTarget !== null) {
            this._screenTarget.clear();
        }
    };
    /**
     * Disposes the {@link WebGLRenderer} and related resources.
     */
    WebGLRenderer.prototype.dispose = function () {
        if (this._isInitialized) {
            this._screenTarget.dispose();
            this._filterManager.dispose();
            this._shaderManager.dispose();
            this._filterManager = null;
            this._shaderManager = null;
            this._screenTarget = null;
            this._context = null;
            if (this._view.parentNode !== null && this._view.parentNode !== undefined) {
                this._view.parentNode.removeChild(this._view);
            }
            this._view = null;
        }
    };
    /**
     * Switches current render target to a specified {@link RenderTarget2D}.
     * @param [target] {RenderTarget2D} The {@link RenderTarget2D} that will be used. Null means using the default first-time
     * render target of the {@link WebGLRenderer}. The default value is null.
     */
    WebGLRenderer.prototype.setRenderTarget = function (target) {
        if (target === void 0) { target = null; }
        if (target === this._currentRenderTarget && target !== null) {
            return;
        }
        if (GLUtil_1.GLUtil.isUndefinedOrNull(target)) {
            this._currentRenderTarget = this._screenTarget;
        }
        else {
            this._currentRenderTarget = target;
        }
        this._currentRenderTarget.activate();
    };
    Object.defineProperty(WebGLRenderer.prototype, "currentRenderTarget", {
        /**
         * Returns current render target of the {@link WebGLRenderer}.
         * @returns {RenderTarget2D} Current render target of the {@link WebGLRenderer}.
         */
        get: function () {
            return this._currentRenderTarget;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebGLRenderer.prototype, "view", {
        /**
         * Returns the output &lt;canvas&gt; for displaying the contents rendered.
         * @returns {HTMLCanvasElement} The output &lt;canvas&gt;.
         */
        get: function () {
            return this._view;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebGLRenderer.prototype, "context", {
        /**
         * Returns the {@link WebGLRenderingContext} attached to the {@link WebGLRenderer}.
         * @returns {WebGLRenderingContext} The {@link WebGLRenderingContext} attached to the {@link WebGLRenderer}.
         */
        get: function () {
            return this._context;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebGLRenderer.prototype, "shaderManager", {
        /**
         * Returns the {@link ShaderManager} used by the {@link WebGLRenderer}.
         * @returns {ShaderManager} The {@link ShaderManager} used by the {@link WebGLRenderer}.
         */
        get: function () {
            return this._shaderManager;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebGLRenderer.prototype, "filterManager", {
        /**
         * Returns the {@link FilterManager} used by the {@link WebGLRenderer}.
         * @returns {FilterManager} The {@link FilterManager} used by the {@link WebGLRenderer}.
         */
        get: function () {
            return this._filterManager;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebGLRenderer.prototype, "tessellator", {
        /**
         * Returns the tessellator used by the {@link WebGLRenderer}.
         * @returns {libtess.GluTesselator} The tessellator used by the {@link WebGLRenderer}.
         */
        get: function () {
            return this._tessellator;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebGLRenderer.prototype, "screenTarget", {
        /**
         * Returns the final output of the {@link WebGLRenderer}. This target is always a root render target, which directly
         * renders to the attached &lt;canvas&gt;. If FXAA is enabled, the copying process from {@link WebGLRenderer.inputTarget}
         * to this target performs a FXAA filtering. If not, it is a simple replicating process.
         * @returns {RenderTarget2D} The output of the {@link WebGLRenderer}.
         */
        get: function () {
            return this._screenTarget;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a new {@link RenderTarget2D} as a buffer. {@link RenderTarget2D}s should be only instanted through this
     * factory method, and be released using {@link WebGLRenderer.releaseRenderTarget}.
     * @param [image] {ImageData|HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} See {@link RenderTarget2D.image}
     * for more information.
     * @returns {RenderTarget2D} The created {@link RenderTarget2D}.
     */
    WebGLRenderer.prototype.createRenderTarget = function (image) {
        if (image === void 0) { image = null; }
        return new RenderTarget2D_1.RenderTarget2D(this, image, false);
    };
    /**
     * Creates a new {@link RenderTarget2D} as an output to the screen. {@link RenderTarget2D}s should be only instanted
     * through this factory method, and be released using {@link WebGLRenderer.releaseRenderTarget}.
     * @param [image] {ImageData|HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} See {@link RenderTarget2D.image}
     * for more information.
     * @returns {RenderTarget2D} The created {@link RenderTarget2D}.
     */
    WebGLRenderer.prototype.createRootRenderTarget = function (image) {
        if (image === void 0) { image = null; }
        return new RenderTarget2D_1.RenderTarget2D(this, image, true);
    };
    /**
     * Releases a {@link RenderTarget2D} created by the {@link WebGLRenderer}.
     * @param target {RenderTarget2D} The {@link RenderTarget2D} to be released.
     */
    WebGLRenderer.prototype.releaseRenderTarget = function (target) {
        if (target !== null && target !== undefined) {
            target.dispose();
        }
    };
    /**
     * Set current blend mode. Blend modes affects how the visual contents are rendered.
     * @param blendMode {String} See {@link BlendMode} for more information.
     * @see {@link BlendMode}
     */
    WebGLRenderer.prototype.setBlendMode = function (blendMode) {
        if (!this._isInitialized) {
            return;
        }
        if (this._currentBlendMode === blendMode) {
            return;
        }
        var config = BMS[blendMode] || BMS[BlendMode_1.BlendMode.NORMAL];
        var glc = this._context;
        if (config[0] >= 0) {
            glc.blendEquation(gl.FUNC_ADD);
        }
        else {
            glc.blendEquation(gl.FUNC_SUBTRACT);
        }
        glc.blendFunc(config[1], config[2]);
        this._currentBlendMode = blendMode;
    };
    /**
     * Initializes the newly created {@link WebGLRenderer}.
     * @param width {Number} The width, in pixels.
     * @param height {Number} The height, in pixels.
     * @param options {RendererOptions} Initialization options.
     * @private
     */
    WebGLRenderer.prototype.__initialize = function (width, height, options) {
        if (this._isInitialized) {
            return;
        }
        this._isInitialized = true;
        this._options = GLUtil_1.GLUtil.deepClone(options);
        var canvas = window.document.createElement("canvas");
        canvas.className = "glantern-view";
        canvas.width = width;
        canvas.height = height;
        var attributes = Object.create(null);
        attributes.alpha = options.transparent;
        attributes.antialias = options.antialias;
        attributes.premultipliedAlpha = true;
        attributes.depth = false;
        this._context = WebGLUtils_1.WebGLUtils.setupWebGL(canvas, attributes);
        this._view = canvas;
        var glc = this._context;
        glc.disable(gl.DEPTH_TEST);
        glc.disable(gl.CULL_FACE);
        glc.enable(gl.BLEND);
        this.setBlendMode(BlendMode_1.BlendMode.NORMAL);
        this._screenTarget = this.createRootRenderTarget();
        canvas.addEventListener("webglcontextlost", this.onContextLost.bind(this));
        canvas.addEventListener("webglcontextrestored", this.onContextRestored.bind(this));
        this._tessellator = new libtess.GluTesselator();
        this._shaderManager = new ShaderManager_1.ShaderManager(this);
        this._filterManager = new FilterManager_1.FilterManager(this);
        this.setRenderTarget(null);
        this.__initializeTessellator();
    };
    /**
     * Initializes the tessellator.
     * @private
     */
    WebGLRenderer.prototype.__initializeTessellator = function () {
        var tess = this._tessellator;
        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA, function (data, polyVertArray) {
            polyVertArray[polyVertArray.length - 1].push(data[0], data[1], data[2]);
        });
        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_BEGIN_DATA, function (type, vertexArrays) {
            if (type !== libtess.primitiveType.GL_TRIANGLES) {
                console.warn('{TESS} expected TRIANGLES but got type: ' + type);
            }
            vertexArrays.push([]);
        });
        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_ERROR, function (errorCode) {
            console.warn('{TESS} error number: ', errorCode);
        });
        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_COMBINE, function (coords, data, weight) {
            return [coords[0], coords[1], coords[2]];
        });
        tess.gluTessCallback(libtess.gluEnum.GLU_TESS_EDGE_FLAG, function (flag) {
            // Do nothing
        });
    };
    /**
     * The event handler for handling the lost of active {@link WebGLRenderingContext}.
     * @param ev {Event} Event parameters.
     */
    WebGLRenderer.prototype.onContextLost = function (ev) {
    };
    /**
     * The event handler for handling the restoration of active {@link WebGLRenderingContext}.
     * @param ev {Event} Event parameters.
     */
    WebGLRenderer.prototype.onContextRestored = function (ev) {
    };
    /**
     * The default {@link RendererOptions} for instantiating a {@link WebGLRenderer}.
     * @type {RendererOptions}
     */
    WebGLRenderer.DEFAULT_OPTIONS = {
        antialias: true,
        depth: false,
        transparent: true
    };
    return WebGLRenderer;
}());
exports.WebGLRenderer = WebGLRenderer;
var BMS = Object.create(null);
BMS[BlendMode_1.BlendMode.ADD] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
BMS[BlendMode_1.BlendMode.ALPHA] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
BMS[BlendMode_1.BlendMode.DARKEN] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
BMS[BlendMode_1.BlendMode.DIFFERENCE] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
BMS[BlendMode_1.BlendMode.ERASE] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
BMS[BlendMode_1.BlendMode.HARDLIGHT] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
BMS[BlendMode_1.BlendMode.INVERT] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
BMS[BlendMode_1.BlendMode.LAYER] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
BMS[BlendMode_1.BlendMode.LIGHTEN] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
BMS[BlendMode_1.BlendMode.MULTIPLY] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
BMS[BlendMode_1.BlendMode.NORMAL] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
BMS[BlendMode_1.BlendMode.OVERLAY] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
BMS[BlendMode_1.BlendMode.SCREEN] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
BMS[BlendMode_1.BlendMode.SHADER] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
BMS[BlendMode_1.BlendMode.SUBTRACT] = [1, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];

//# sourceMappingURL=WebGLRenderer.js.map
