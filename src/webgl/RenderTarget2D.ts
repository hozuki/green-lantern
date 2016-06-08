/**
 * Created by MIC on 2015/11/17.
 */

import {WebGLRenderer} from "./WebGLRenderer";
import {IDisposable} from "../IDisposable";
import {PackedArrayBuffer} from "./PackedArrayBuffer";
import {GLUtil} from "../GLUtil";

var gl = (<any>this).WebGLRenderingContext || (<any>window).WebGLRenderingContext;
var isInitializedStatically:boolean = false;

/**
 * Represents a 2D render target based on WebGL texture.
 */
export class RenderTarget2D implements IDisposable {

    /**
     * Instantiates a new {@link RenderTarget2D}.
     * @param renderer {WebGLRenderer} The {@link WebGLRenderer} used to create this new {@link RenderTarget2D}.
     * @param [image] {ImageData|HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} The initial image or image-related
     * HTML element. See {@link RenderTarget2D.image} for more information. The default value is null.
     * @param [isRoot] {Boolean} Declares whether the {@link RenderTarget2D} is a root for display. See {@link RenderTarget2D.isRoot}
     * for more information. The default value is false.
     * @implements {IDisposable}
     */
    constructor(renderer:WebGLRenderer, image:ImageData|HTMLCanvasElement|HTMLImageElement|HTMLVideoElement = null, isRoot:boolean = false) {
        if (!isInitializedStatically) {
            initStaticFields(renderer.context);
        }
        this._renderer = renderer;
        this.__initialize(renderer.context, renderer.view.width, renderer.view.height, image, isRoot);
    }

    /**
     * Disposes the {@link RenderTarget2D} and related resources.
     */
    dispose():void {
        var glc = this._glc;
        glc.deleteTexture(this._texture);
        glc.deleteFramebuffer(this._frameBuffer);
        glc.deleteRenderbuffer(this._depthBuffer);
        this._texture = null;
        this._frameBuffer = null;
        this._depthBuffer = null;
        this._glc = null;
        this._renderer = null;
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
    get originalWidth():number {
        return this._originalWidth;
    }

    /**
     * Returns the original height of the {@link RenderTarget2D}. See {@link RenderTarget2D.originalWidth} for more information.
     * @see {@link RenderTarget2D.originalWidth}
     * @see {@link RenderTarget2D.fitWidth}
     * @see {@link RenderTarget2D.fitHeight}
     * @returns {number}
     */
    get originalHeight():number {
        return this._originalHeight;
    }

    /**
     * Returns the fit width of the {@link RenderTarget2D}. See {@link RenderTarget2D.originalWidth} for more information.
     * @see {@link RenderTarget2D.originalWidth}
     * @see {@link RenderTarget2D.originalHeight}
     * @see {@link RenderTarget2D.fitHeight}
     * @returns {Number} The fit width of the {@link RenderTarget2D}.
     */
    get fitWidth():number {
        return this._fitWidth;
    }

    /**
     * Returns the fit height of the {@link RenderTarget2D}. See {@link RenderTarget2D.originalWidth} for more information.
     * @see {@link RenderTarget2D.originalWidth}
     * @see {@link RenderTarget2D.originalHeight}
     * @see {@link RenderTarget2D.fitHeight}
     * @returns {number}
     */
    get fitHeight():number {
        return this._fitHeight;
    }

    /**
     * Returns the underlying {@link WebGLTexture} of the {@link RenderTarget2D}. May be null if the target is a root target.
     * @returns {WebGLTexture} The underlying texture.
     */
    get texture():WebGLTexture {
        return this._texture;
    }

    /**
     * The content used to create the {@link RenderTarget2D}. It is useful for importing external images, or dynamically
     * rendering image sequences from {@link HTMLVideoElement}s. Null means this is a blank {@link RenderTarget2D}.
     * @returns {ImageData|HTMLCanvasElement|HTMLImageElement|HTMLVideoElement}
     */
    get image():ImageData|HTMLCanvasElement|HTMLImageElement|HTMLVideoElement {
        return this._image;
    }

    /**
     * Returns whether the {@link RenderTarget2D} is a root for display. A root {@link RenderTarget2D}
     * has no underlying textures and renders directly to the output buffer (i.e. the &lt;canvas&gt; attached to the
     * {@link WebGLRenderer}. So they must be used as final render target, not buffers.
     * @returns {Boolean} True if the {@link RenderTarget2D} is a root target, and false otherwise.
     */
    get isRoot():boolean {
        return this._isRoot;
    }

    /**
     * Activates the {@link RenderTarget2D}, and all the rendering after the activation will be done on this target.
     */
    activate():void {
        var glc = this._glc;
        glc.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);
    }

    /**
     * Clears the content on the {@link RenderTarget2D}.
     */
    clear():void {
        this.activate();
        var glc = this._glc;
        glc.viewport(0, 0, this._fitWidth, this._fitHeight);
        glc.clearColor(0, 0, 0, 0);
        glc.clearDepth(0);
        glc.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    /**
     * Resizes the {@link RenderTarget2D}. Note that currently this function is only a wrapper for the internal one, and
     * public calls are experimental.
     * @param newWidth {Number} The new width, in pixels.
     * @param newHeight {Number} The new height, in pixels.
     */
    resize(newWidth:number, newHeight:number):void {
        this.__resize(newWidth, newHeight, true);
    }

    /**
     * Update the content of this {@link RenderTarget2D} if the source is a {@link HTMLCanvasElement},
     * {@link HTMLImageElement}, {@link HTMLVideoElement}, or {@link ImageData}. This operation will retrieve
     * current image (a snapshot if it is a dynamic canvas or image sequence) and draw it on this
     * {@link RenderTarget2D}.
     */
    updateImageContent():void {
        var image = this._image;
        if (this._texture === null || image === null) {
            return;
        }
        var glc = this._glc;
        glc.bindTexture(gl.TEXTURE_2D, this._texture);
        glc.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, <ImageData>image);
        glc.bindTexture(gl.TEXTURE_2D, null);
    }

    /**
     * Update image size to fit the whole scene.
     */
    updateImageSize():void {
        var image = this._image;
        if (this._texture === null || image === null) {
            return;
        }
        // TODO: Maybe this operation should not be done on each update call.
        // Find a way to optimize, for example, freeze the size when created, or implement a draw call
        // flexible enough to handle all sort of sizes.
        try {
            image.width = GLUtil.power2Roundup(image.width);
            image.height = GLUtil.power2Roundup(image.height);
        } catch (ex) {
        }
        this._originalWidth = this._fitWidth = image.width;
        this._originalHeight = this._fitHeight = image.height;
    }

    /**
     * Initializes the {@link RenderTarget2D}.
     * @param glc {WebGLRenderingContext} The {@link WebGLRenderingContext} used to manipulate the {@link RenderTarget2D}.
     * @param width {Number} The new width, in pixels.
     * @param height {Number} The new height, in pixels.
     * @param image {ImageData|HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} See {@link RenderTarget2D.constructor}
     * for more information.
     * @param isRoot {Boolean} See {@link RenderTarget2D.isRoot} for more information.
     * @private
     */
    private __initialize(glc:WebGLRenderingContext, width:number, height:number,
                         image:ImageData|HTMLCanvasElement|HTMLImageElement|HTMLVideoElement, isRoot:boolean):void {
        this._glc = glc;
        this._isRoot = isRoot;
        this._image = image;

        function error(message:string) {
            glc.deleteFramebuffer(this._frameBuffer);
            glc.deleteRenderbuffer(this._depthBuffer);
            glc.deleteTexture(this._texture);
            console.warn(message);
        }

        if (!isRoot) {
            this._frameBuffer = glc.createFramebuffer();
            if (this._frameBuffer === null) {
                return error("Failed to create the frame buffer.");
            }
            this._depthBuffer = glc.createRenderbuffer();
            if (this._depthBuffer === null) {
                return error("Failed to create the depth buffer.");
            }
            this._texture = glc.createTexture();
            if (this._texture === null) {
                return error("Failed to create the underlying texture.");
            }
        }
        this.__resize(width, height, false);
        if (!isRoot) {
            glc.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);
            glc.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._texture, 0);
            glc.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._depthBuffer);
            var status = glc.checkFramebufferStatus(gl.FRAMEBUFFER);
            if (status !== gl.FRAMEBUFFER_COMPLETE) {
                return error("Frame buffer is not complete: code 0x" + status.toString(16));
            }
        }
        glc.bindRenderbuffer(gl.RENDERBUFFER, null);
        glc.bindTexture(gl.TEXTURE_2D, null);
        glc.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    /**
     * Resizes the {@link RenderTarget2D}.
     * @param newWidth {Number} The new width, in pixels.
     * @param newHeight {Number} The new height, in pixels.
     * @param unbind {Boolean} Whether should unbind the texture after resizing or not. Unbinding is not required during
     * initialization, but should be done during custom resizing.
     * @private
     */
    private __resize(newWidth:number, newHeight:number, unbind:boolean):void {
        var glc = this._glc;
        var image = this._image;
        var isRoot = this._isRoot;
        var texture = this._texture;

        if (image === null) {
            newWidth |= 0;
            newHeight |= 0;
            this._originalWidth = newWidth;
            this._originalHeight = newHeight;
            if (!GLUtil.isPowerOfTwo(newWidth)) {
                newWidth = GLUtil.power2Roundup(newWidth);
            }
            if (!GLUtil.isPowerOfTwo(newHeight)) {
                newHeight = GLUtil.power2Roundup(newHeight);
            }
            this._fitWidth = newWidth;
            this._fitHeight = newHeight;
        } else {
            // TODO: WARNING: Not tested, may also need to round-up to power of 2.
            newWidth = this._originalWidth = this._fitWidth = image.width;
            newHeight = this._originalHeight = this._fitHeight = image.height;
        }

        if (texture !== null) {
            glc.bindTexture(gl.TEXTURE_2D, this._texture);
            glc.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            glc.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            glc.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            glc.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        if (image !== null) {
            // We flip the whole image vertically during the last stage, drawing to the screen.
            // So there is no need to flip the images here - all the contents in child RenderTarget2Ds
            // are vertically mirrored, and they will be transformed in one at last.
            //glc.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            if (texture !== null) {
                glc.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, <ImageData>image);
            }
        } else {
            glc.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
            if (texture !== null) {
                glc.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, newWidth, newHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            }
        }
        if (!isRoot) {
            glc.bindRenderbuffer(gl.RENDERBUFFER, this._depthBuffer);
            glc.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, newWidth, newHeight);
        }
        if (unbind) {
            glc.bindRenderbuffer(gl.RENDERBUFFER, null);
            glc.bindTexture(gl.TEXTURE_2D, null);
        }
    }

    protected _glc:WebGLRenderingContext = null;
    protected _renderer:WebGLRenderer = null;
    protected _frameBuffer:WebGLFramebuffer = null;
    protected _depthBuffer:WebGLRenderbuffer = null;
    protected _texture:WebGLTexture = null;
    protected _originalWidth:number = 0;
    protected _originalHeight:number = 0;
    protected _fitWidth:number = 0;
    protected _fitHeight:number = 0;
    protected _image:ImageData|HTMLCanvasElement|HTMLImageElement|HTMLVideoElement = null;
    private _isRoot:boolean = false;

    static textureCoords:PackedArrayBuffer = null;
    static textureIndices:PackedArrayBuffer = null;

}

function initStaticFields(glc:WebGLRenderingContext) {
    if (isInitializedStatically) {
        return;
    }
    var textureCoords = [
        0, 1,
        1, 1,
        0, 0,
        1, 0
    ];
    var textureIndices = [
        0, 1, 2,
        1, 2, 3
    ];
    RenderTarget2D.textureCoords = PackedArrayBuffer.create(glc, textureCoords, gl.FLOAT, gl.ARRAY_BUFFER);
    RenderTarget2D.textureIndices = PackedArrayBuffer.create(glc, textureIndices, gl.UNSIGNED_SHORT, gl.ELEMENT_ARRAY_BUFFER);
    isInitializedStatically = true;
}
