/**
 * Created by MIC on 2015/11/18.
 */
var RenderTarget2D_1 = require("./RenderTarget2D");
var PackedArrayBuffer_1 = require("./PackedArrayBuffer");
var ShaderID_1 = require("./ShaderID");
var _util_1 = require("../_util/_util");
var gl = this.WebGLRenderingContext || window.WebGLRenderingContext;
var RenderHelper = (function () {
    function RenderHelper() {
    }
    RenderHelper.renderPrimitives = function (renderer, renderTo, vertices, colors, indices, clearOutput) {
        renderer.shaderManager.selectShader(ShaderID_1.ShaderID.PRIMITIVE);
        var shader = renderer.shaderManager.currentShader;
        var glc = renderer.context;
        var attributeLocation;
        renderTo.activate();
        shader.syncUniforms();
        vertices.syncBufferData();
        attributeLocation = shader.getAttributeLocation("aVertexPosition");
        glc.vertexAttribPointer(attributeLocation, 3, vertices.elementGLType, false, vertices.elementSize * 3, 0);
        glc.enableVertexAttribArray(attributeLocation);
        colors.syncBufferData();
        attributeLocation = shader.getAttributeLocation("aVertexColor");
        glc.vertexAttribPointer(attributeLocation, 4, colors.elementGLType, false, colors.elementSize * 4, 0);
        glc.enableVertexAttribArray(attributeLocation);
        indices.syncBufferData();
        if (clearOutput) {
            renderTo.clear();
        }
        glc.viewport(0, 0, renderTo.originalWidth, renderTo.originalHeight);
        glc.drawElements(gl.TRIANGLES, indices.elementCount, indices.elementGLType, 0);
    };
    RenderHelper.renderPrimitives2 = function (renderer, renderTo, vertices, colors, indices, flipX, flipY, clearOutput) {
        renderer.shaderManager.selectShader(ShaderID_1.ShaderID.PRIMITIVE2);
        var shader = renderer.shaderManager.currentShader;
        var glc = renderer.context;
        var attributeLocation;
        renderTo.activate();
        shader.setOriginalSize([renderTo.originalWidth, renderTo.originalHeight]);
        shader.setFlipX(flipX);
        shader.setFlipY(flipY);
        shader.syncUniforms();
        vertices.syncBufferData();
        attributeLocation = shader.getAttributeLocation("aVertexPosition");
        glc.vertexAttribPointer(attributeLocation, 3, vertices.elementGLType, false, vertices.elementSize * 3, 0);
        glc.enableVertexAttribArray(attributeLocation);
        colors.syncBufferData();
        attributeLocation = shader.getAttributeLocation("aVertexColor");
        glc.vertexAttribPointer(attributeLocation, 4, colors.elementGLType, false, colors.elementSize * 4, 0);
        glc.enableVertexAttribArray(attributeLocation);
        indices.syncBufferData();
        if (clearOutput) {
            renderTo.clear();
        }
        glc.viewport(0, 0, renderTo.originalWidth, renderTo.originalHeight);
        glc.drawElements(gl.TRIANGLES, indices.elementCount, indices.elementGLType, 0);
    };
    RenderHelper.copyTargetContent = function (renderer, source, destination, flipX, flipY, clearOutput) {
        RenderHelper.renderBuffered(renderer, source, destination, ShaderID_1.ShaderID.REPLICATE, clearOutput, function (r) {
            var shader = r.shaderManager.currentShader;
            shader.setFlipX(flipX);
            shader.setFlipY(flipY);
            if (flipX || flipY) {
                shader.setOriginalSize([destination.originalWidth, destination.originalHeight]);
                shader.setFitSize([destination.fitWidth, destination.fitHeight]);
            }
        });
    };
    RenderHelper.copyImageContent = function (renderer, source, destination, flipX, flipY, transform, alpha, clearOutput) {
        RenderHelper.renderBuffered(renderer, source, destination, ShaderID_1.ShaderID.COPY_IMAGE, clearOutput, function (r) {
            var shader = r.shaderManager.currentShader;
            shader.setFlipX(flipX);
            shader.setFlipY(flipY);
            shader.setAlpha(alpha);
            shader.setTransform(transform);
            if (flipX || flipY) {
                shader.setOriginalSize([destination.originalWidth, destination.originalHeight]);
                shader.setFitSize([destination.fitWidth, destination.fitHeight]);
            }
        });
    };
    RenderHelper.renderImage = function (renderer, source, destination, clearOutput) {
        RenderHelper.renderBuffered(renderer, source, destination, ShaderID_1.ShaderID.COPY_IMAGE, clearOutput, function (r) {
            var shader = r.shaderManager.currentShader;
            shader.setFlipX(false);
            shader.setFlipY(false);
        });
    };
    RenderHelper.renderBuffered = function (renderer, source, destination, shaderID, clearOutput, shaderInit) {
        if (!__checkRenderTargets(source, destination)) {
            return;
        }
        var glc = renderer.context;
        renderer.shaderManager.selectShader(shaderID);
        shaderInit(renderer);
        var shader = renderer.shaderManager.currentShader;
        // Target must have a 'uSampler' sample2D uniform
        shader.setTexture(source.texture);
        shader.syncUniforms();
        if (RenderHelper._glVertexPositionBuffer === null) {
            var vertexPositions = [
                0, source.fitHeight, 0,
                source.fitWidth, source.fitHeight, 0,
                0, 0, 0,
                source.fitWidth, 0, 0
            ];
            RenderHelper._glVertexPositionBuffer = PackedArrayBuffer_1.PackedArrayBuffer.create(glc, vertexPositions, gl.FLOAT, gl.ARRAY_BUFFER);
        }
        var attributeLocation;
        attributeLocation = shader.getAttributeLocation("aVertexPosition");
        if (attributeLocation >= 0) {
            var glVertexPositionBuffer = RenderHelper._glVertexPositionBuffer;
            glVertexPositionBuffer.syncBufferData();
            glc.vertexAttribPointer(attributeLocation, 3, glVertexPositionBuffer.elementGLType, false, glVertexPositionBuffer.elementSize * 3, 0);
            glc.enableVertexAttribArray(attributeLocation);
        }
        // Some shaders, e.g. the blur-2 shader, has no texture coordinates.
        attributeLocation = shader.getAttributeLocation("aTextureCoord");
        if (attributeLocation >= 0) {
            var textureCoords = RenderTarget2D_1.RenderTarget2D.textureCoords;
            textureCoords.syncBufferData();
            glc.vertexAttribPointer(attributeLocation, 2, textureCoords.elementGLType, false, textureCoords.elementSize * 2, 0);
            glc.enableVertexAttribArray(attributeLocation);
        }
        var textureIndices = RenderTarget2D_1.RenderTarget2D.textureIndices;
        textureIndices.syncBufferData();
        destination.activate();
        if (clearOutput) {
            destination.clear();
        }
        glc.viewport(0, 0, destination.originalWidth, destination.originalHeight);
        glc.enable(gl.SCISSOR_TEST);
        glc.scissor(0, 0, source.originalWidth, source.originalHeight);
        glc.drawElements(gl.TRIANGLES, textureIndices.elementCount, textureIndices.elementGLType, 0);
        glc.disable(gl.SCISSOR_TEST);
    };
    // Be careful! Manually dispose it when the whole module is finalizing.
    RenderHelper._glVertexPositionBuffer = null;
    return RenderHelper;
})();
exports.RenderHelper = RenderHelper;
function __checkRenderTargets(source, destination) {
    if (_util_1._util.isUndefinedOrNull(source)) {
        console.warn("Cannot render a null RenderTarget2D onto another RenderTarget2D.");
        return false;
    }
    if (source.texture === null) {
        console.warn("Cannot use a RenderTarget2D without texture-based frame buffer to render onto another RenderTarget2D.");
        return false;
    }
    if (source.isRoot) {
        console.warn("Cannot use a root RenderTarget2D as source.");
        return false;
    }
    if (source === destination) {
        console.warn("Source and destination must not be the same RenderTarget2D.");
        return false;
    }
    return true;
}

//# sourceMappingURL=RenderHelper.js.map
