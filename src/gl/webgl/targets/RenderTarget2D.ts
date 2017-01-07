/**
 * Created by MIC on 2015/11/17.
 */
import WebGLRenderer from "../WebGLRenderer";
import IDisposable from "../../mic/IDisposable";
import MathUtil from "../../mic/MathUtil";
import VirtualDom from "../../mic/VirtualDom";
import FrameImage from "../FrameImage";
import BufferedBitmapTarget from "./BufferedBitmapTarget";

const gl = VirtualDom.WebGLRenderingContext;

/**
 * Represents a 2D $render target based on WebGL texture.
 */
export default class RenderTarget2D extends BufferedBitmapTarget {

    /**
     * Instantiates a new {@link RenderTarget2D}.
     * @param renderer {WebGLRenderer} The {@link WebGLRenderer} used to create this new {@link RenderTarget2D}.
     * @param [image] {FrameImage} The initial image or image-related
     * HTML element. See {@link RenderTarget2D.image} for more information. The default value is null.
     * @param [isRoot] {Boolean} Declares whether the {@link RenderTarget2D} is a root for display. See {@link RenderTarget2D.isRoot}
     * for more information. The default value is false.
     * @implements {IDisposable}
     */
    constructor(renderer: WebGLRenderer, image: FrameImage = null, isRoot: boolean = false) {
        super(renderer, isRoot);
        this.__initialize(renderer.view.width, renderer.view.height, image);
    }

    /**
     * Disposes the {@link RenderTarget2D} and related resources.
     */
    dispose(): void {
        const glc = this.context;
        glc.deleteTexture(this.texture);
        glc.deleteFramebuffer(this.frameBuffer);
        glc.deleteRenderbuffer(this.depthStencilBuffer);
        this._texture = null;
        this._frameBuffer = null;
        this._depthStencilBuffer = null;
        super.dispose();
    }

    /**
     * Returns the original width of the {@link RenderTarget2D}.
     * Old WebGL contexts restrict the width and height of textures to being a power of 2. However, users may want to
     * create custom-sized {@link RenderTarget2D}s, which requires the targets using various sizes of "textures".
     * Creating textures width and height different from power of 2 is not allowed in these cases, so textures slightly
     * larger than needed with width and height being power of 2 is created.
     * Therefore, the original size is the size requested, and the fit size is the real size of texture. During rendering,
     * the original size is used for presenting, and the fit size is used for manipulation.
     * @see {@link RenderTarget2D.originalHeight}
     * @see {@link RenderTarget2D.fitWidth}
     * @see {@link RenderTarget2D.fitHeight}
     * @returns {Number} The original width of the {@link RenderTarget2D}.
     */
    get originalWidth(): number {
        return this._originalWidth;
    }

    /**
     * Returns the original height of the {@link RenderTarget2D}. See {@link RenderTarget2D.originalWidth} for more information.
     * @see {@link RenderTarget2D.originalWidth}
     * @see {@link RenderTarget2D.fitWidth}
     * @see {@link RenderTarget2D.fitHeight}
     * @returns {number}
     */
    get originalHeight(): number {
        return this._originalHeight;
    }

    /**
     * Returns the fit width of the {@link RenderTarget2D}. See {@link RenderTarget2D.originalWidth} for more information.
     * @see {@link RenderTarget2D.originalWidth}
     * @see {@link RenderTarget2D.originalHeight}
     * @see {@link RenderTarget2D.fitHeight}
     * @returns {Number} The fit width of the {@link RenderTarget2D}.
     */
    get fitWidth(): number {
        return this._fitWidth;
    }

    /**
     * Returns the fit height of the {@link RenderTarget2D}. See {@link RenderTarget2D.originalWidth} for more information.
     * @see {@link RenderTarget2D.originalWidth}
     * @see {@link RenderTarget2D.originalHeight}
     * @see {@link RenderTarget2D.fitHeight}
     * @returns {number}
     */
    get fitHeight(): number {
        return this._fitHeight;
    }

    /**
     * The content used to create the {@link RenderTarget2D}. It is useful for importing external images, or dynamically
     * rendering image sequences from {@link HTMLVideoElement}s. Null means this is a blank {@link RenderTarget2D}.
     * @returns {FrameImage}
     */
    get image(): FrameImage {
        return this._image;
    }

    get frameBuffer(): WebGLFramebuffer {
        return this._frameBuffer;
    }

    get depthStencilBuffer(): WebGLRenderbuffer {
        return this._depthStencilBuffer;
    }

    get isStencil(): boolean {
        return this._isStencil;
    }

    set isStencil(v: boolean) {
        this._isStencil = v;
    }

    get isInitialized(): boolean {
        return this._isInitialized;
    }

    /**
     * Activates the {@link RenderTarget2D}, and all the rendering after the activation will be done on this target.
     */
    activate(): void {
        this.context.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);
    }

    /**
     * Clears the content on the {@link RenderTarget2D}.
     */
    clear(): void {
        this.activate();
        const context = this.context;
        context.viewport(0, 0, this.fitWidth, this.fitHeight);
        context.clearColor(0, 0, 0, 0);
        context.clearDepth(0);
        context.clearStencil(0);
        context.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    }

    /**
     * Resizes the {@link RenderTarget2D}. Note that currently this function is only a wrapper for the internal one, and
     * public calls are experimental.
     * @param newWidth {Number} The new width, in pixels.
     * @param newHeight {Number} The new height, in pixels.
     */
    resize(newWidth: number, newHeight: number): void {
        this.__resize(newWidth, newHeight);
    }

    /**
     * Update the content of this {@link RenderTarget2D} if the source is a {@link HTMLCanvasElement},
     * {@link HTMLImageElement}, {@link HTMLVideoElement}, or {@link ImageData}. This operation will retrieve
     * current image (a snapshot if it is a dynamic canvas or image sequence) and draw it on this
     * {@link RenderTarget2D}.
     */
    updateImageContent(): void {
        if (this.texture === null || this.image === null) {
            return;
        }
        const context = this.context;
        context.bindTexture(gl.TEXTURE_2D, this.texture);
        context.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, <ImageData>this.image);
        context.bindTexture(gl.TEXTURE_2D, null);
    }

    /**
     * Update image size to fit the whole scene.
     */
    updateImageSize(): void {
        const image = this.image;
        if (this.texture === null || image === null) {
            return;
        }
        // TODO: Maybe this operation should not be done on each $$$update call.
        // Find a way to optimize, for example, freeze the size when created, or implement a draw call
        // flexible enough to handle all sort of sizes.
        try {
            // Flee from the ImageData's readonly check.
            (<any>image).width = MathUtil.power2Roundup(image.width);
            (<any>image).height = MathUtil.power2Roundup(image.height);
        } catch (ex) {
        }
        this._originalWidth = this._fitWidth = image.width;
        this._originalHeight = this._fitHeight = image.height;
    }

    /**
     * Initializes the {@link RenderTarget2D}.
     * @param width {Number} The new width, in pixels.
     * @param height {Number} The new height, in pixels.
     * @param image {FrameImage} See {@link RenderTarget2D.constructor} for more information.
     * @private
     */
    private __initialize(width: number, height: number, image: FrameImage): void {
        this._image = image;
        const context = this.context;

        const error = (message: string): void => {
            context.deleteFramebuffer(this.frameBuffer);
            context.deleteRenderbuffer(this.depthStencilBuffer);
            context.deleteTexture(this.texture);
            console.warn(message);
        };

        if (!this.isRoot) {
            const frameBuffer = this._frameBuffer = context.createFramebuffer();
            if (frameBuffer === null) {
                return error("Failed to create the frame buffer.");
            }
            const depthBuffer = this._depthStencilBuffer = context.createRenderbuffer();
            if (depthBuffer === null) {
                return error("Failed to create the depth/stencil buffer.");
            }
            const texture = this._texture = context.createTexture();
            if (texture === null) {
                return error("Failed to create the underlying texture.");
            }
        }
        this.__resize(width, height);
        if (!this.isRoot) {
            context.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
            context.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
            context.bindRenderbuffer(gl.RENDERBUFFER, this.depthStencilBuffer);
            context.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.depthStencilBuffer);
            const status = context.checkFramebufferStatus(gl.FRAMEBUFFER);
            if (status !== gl.FRAMEBUFFER_COMPLETE) {
                return error("Frame buffer is not complete: code 0x" + status.toString(16));
            }
        }
        context.bindRenderbuffer(gl.RENDERBUFFER, null);
        context.bindTexture(gl.TEXTURE_2D, null);
        context.bindFramebuffer(gl.FRAMEBUFFER, null);
        this._isInitialized = true;
    }

    /**
     * Resizes the {@link RenderTarget2D}.
     * @param newWidth {Number} The new width, in pixels.
     * @param newHeight {Number} The new height, in pixels.
     * @private
     */
    private __resize(newWidth: number, newHeight: number): void {
        const context = this.context;
        const image = this.image;
        const isRoot = this.isRoot;
        const texture = this.texture;

        if (image === null) {
            newWidth |= 0;
            newHeight |= 0;
            this._originalWidth = newWidth;
            this._originalHeight = newHeight;
            if (!MathUtil.isPowerOfTwo(newWidth)) {
                newWidth = MathUtil.power2Roundup(newWidth);
            }
            if (!MathUtil.isPowerOfTwo(newHeight)) {
                newHeight = MathUtil.power2Roundup(newHeight);
            }
            this._fitWidth = newWidth;
            this._fitHeight = newHeight;
        } else {
            // TODO: WARNING: Not tested, may also need to round-up to power of 2.
            newWidth = this._originalWidth = this._fitWidth = image.width;
            newHeight = this._originalHeight = this._fitHeight = image.height;
        }

        if (texture !== null) {
            context.bindTexture(gl.TEXTURE_2D, this.texture);
            context.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            context.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            context.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            context.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        if (image !== null) {
            // We flip the whole image vertically during the last stage, drawing to the screen.
            // So there is no need to flip the images here - all the contents in child RenderTarget2Ds
            // are vertically mirrored, and they will be transformed in one at last.
            //context.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            if (texture !== null) {
                if (this.isInitialized) {
                    context.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, <ImageData>image);
                } else {
                    context.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, newWidth, newHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                }
            }
        } else {
            context.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
            if (texture !== null) {
                context.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, newWidth, newHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            }
        }
        if (!isRoot) {
            context.bindRenderbuffer(gl.RENDERBUFFER, this.depthStencilBuffer);
            context.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, newWidth, newHeight);
        }
        context.bindRenderbuffer(gl.RENDERBUFFER, null);
        context.bindTexture(gl.TEXTURE_2D, null);

    }

    private _frameBuffer: WebGLFramebuffer = null;
    private _depthStencilBuffer: WebGLRenderbuffer = null;
    private _originalWidth: number = 0;
    private _originalHeight: number = 0;
    private _fitWidth: number = 0;
    private _fitHeight: number = 0;
    private _image: FrameImage = null;
    private _isStencil: boolean = false;
    private _isInitialized: boolean = false;

}


