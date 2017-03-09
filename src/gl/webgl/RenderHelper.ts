/**
 * Created by MIC on 2015/11/18.
 */
import PackedArrayBuffer from "./PackedArrayBuffer";
import WebGLRenderer from "./WebGLRenderer";
import ReplicateShader from "./shaders/ReplicateShader";
import ShaderID from "./ShaderID";
import BufferedShader from "./shaders/BufferedShader";
import Matrix3D from "../flash/geom/Matrix3D";
import CopyImageShader from "./shaders/CopyImageShader";
import Primitive2Shader from "./shaders/Primitive2Shader";
import PrimitiveShader from "./shaders/PrimitiveShader";
import VirtualDom from "../mic/VirtualDom";
import BitmapTargetBase from "./BitmapTargetBase";
import BufferedBitmapTarget from "./targets/BufferedBitmapTarget";
import GraphicsConst from "./graphics/GraphicsConst";

const gl = VirtualDom.WebGLRenderingContext;

abstract class RenderHelper {

    static renderPrimitives(renderer: WebGLRenderer, renderTo: BitmapTargetBase, vertices: PackedArrayBuffer, colors: PackedArrayBuffer, indices: PackedArrayBuffer, clearOutput: boolean): void {
        renderer.shaderManager.selectShader(ShaderID.PRIMITIVE);

        const shader = <PrimitiveShader>renderer.shaderManager.currentShader;
        const glc = renderer.context;
        let attributeLocation: number;

        renderTo.activate();
        shader.syncUniforms();

        vertices.syncBufferData();
        attributeLocation = shader.getAttributeLocation("aVertexPosition");
        glc.vertexAttribPointer(attributeLocation, GraphicsConst.VertexComponentCount, vertices.elementGLType, false, vertices.elementSize * GraphicsConst.VertexComponentCount, 0);
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
    }

    static renderPrimitives2(renderer: WebGLRenderer, renderTo: BitmapTargetBase, vertices: PackedArrayBuffer, colors: PackedArrayBuffer, indices: PackedArrayBuffer,
                             flipX: boolean, flipY: boolean, clearOutput: boolean): void {
        renderer.shaderManager.selectShader(ShaderID.PRIMITIVE2);

        const shader = <Primitive2Shader>renderer.shaderManager.currentShader;
        const glc = renderer.context;
        let attributeLocation: number;

        renderTo.activate();
        shader.setOriginalSize([renderTo.originalWidth, renderTo.originalHeight]);
        shader.setFlipX(flipX);
        shader.setFlipY(flipY);
        shader.syncUniforms();

        vertices.syncBufferData();
        attributeLocation = shader.getAttributeLocation("aVertexPosition");
        glc.vertexAttribPointer(attributeLocation, GraphicsConst.VertexComponentCount, vertices.elementGLType, false, vertices.elementSize * GraphicsConst.VertexComponentCount, 0);
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
    }


    static copyTargetContent(renderer: WebGLRenderer, source: BufferedBitmapTarget, destination: BitmapTargetBase, flipX: boolean, flipY: boolean, clearOutput: boolean): void {
        RenderHelper.renderBuffered(renderer, source, destination, ShaderID.REPLICATE, clearOutput, (r: WebGLRenderer): void => {
            const shader = <ReplicateShader>r.shaderManager.currentShader;
            shader.setFlipX(flipX);
            shader.setFlipY(flipY);
            if (flipX || flipY) {
                shader.setOriginalSize([destination.originalWidth, destination.originalHeight]);
                shader.setFitSize([destination.fitWidth, destination.fitHeight]);
            }
        });
    }

    static copyImageContent(renderer: WebGLRenderer, source: BufferedBitmapTarget, destination: BitmapTargetBase, flipX: boolean, flipY: boolean, transform: Matrix3D, alpha: number, clearOutput: boolean): void {
        RenderHelper.renderBuffered(renderer, source, destination, ShaderID.COPY_IMAGE, clearOutput, (r: WebGLRenderer): void => {
            const shader = <CopyImageShader>r.shaderManager.currentShader;
            shader.setFlipX(flipX);
            shader.setFlipY(flipY);
            shader.setAlpha(alpha);
            shader.setTransform(transform);
            if (flipX || flipY) {
                shader.setOriginalSize([destination.originalWidth, destination.originalHeight]);
                shader.setFitSize([destination.fitWidth, destination.fitHeight]);
            }
        });
    }

    static renderImage(renderer: WebGLRenderer, source: BufferedBitmapTarget, destination: BitmapTargetBase, clearOutput: boolean): void {
        RenderHelper.renderBuffered(renderer, source, destination, ShaderID.COPY_IMAGE, clearOutput, (r: WebGLRenderer): void => {
            const shader = <CopyImageShader>r.shaderManager.currentShader;
            shader.setFlipX(false);
            shader.setFlipY(false);
        });
    }

    static renderBuffered(renderer: WebGLRenderer, source: BufferedBitmapTarget, destination: BitmapTargetBase, shaderID: number,
                          clearOutput: boolean, shaderInit: (r: WebGLRenderer) => void): void {
        if (!checkRenderTargets(source, destination)) {
            return;
        }

        const glc = renderer.context;
        renderer.shaderManager.selectShader(shaderID);
        shaderInit(renderer);
        const shader = <BufferedShader>renderer.shaderManager.currentShader;
        // Target must have a 'uSampler' sample2D uniform
        shader.setTexture(source.texture);
        shader.syncUniforms();

        if (RenderHelper._glVertexPositionBuffer === null) {
            const vertexPositions = [
                0, source.fitHeight, 0,
                source.fitWidth, source.fitHeight, 0,
                0, 0, 0,
                source.fitWidth, 0, 0
            ];
            RenderHelper._glVertexPositionBuffer = PackedArrayBuffer.create(glc, vertexPositions, gl.FLOAT, gl.ARRAY_BUFFER);
        }

        let attributeLocation: number;

        attributeLocation = shader.getAttributeLocation("aVertexPosition");
        if (attributeLocation >= 0) {
            const glVertexPositionBuffer = RenderHelper._glVertexPositionBuffer;
            glVertexPositionBuffer.syncBufferData();
            glc.vertexAttribPointer(attributeLocation, 3, glVertexPositionBuffer.elementGLType, false, glVertexPositionBuffer.elementSize * 3, 0);
            glc.enableVertexAttribArray(attributeLocation);
        }

        // Some shaders, e.g. the blur-2 shader, have no texture coordinates.
        attributeLocation = shader.getAttributeLocation("aTextureCoord");
        if (attributeLocation >= 0) {
            const textureCoords = BufferedBitmapTarget.textureCoords;
            textureCoords.syncBufferData();
            glc.vertexAttribPointer(attributeLocation, 2, textureCoords.elementGLType, false, textureCoords.elementSize * 2, 0);
            glc.enableVertexAttribArray(attributeLocation);
        }

        const textureIndices = BufferedBitmapTarget.textureIndices;
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
    }

    // Be careful! Manually dispose it when the whole module is finalizing.
    private static _glVertexPositionBuffer: PackedArrayBuffer = null;

}

function checkRenderTargets(source: BufferedBitmapTarget, destination: BitmapTargetBase): boolean {
    if (!source) {
        console.warn("Cannot render a null BitmapTargetBase onto another BitmapTargetBase.");
        return false;
    }
    if (source.texture === null) {
        console.warn("Cannot use a BitmapTargetBase without texture-based frame buffer to render onto another BitmapTargetBase.");
        return false;
    }
    if (source.isRoot) {
        console.warn("Cannot use a root BitmapTargetBase as source.");
        return false;
    }
    if (source === destination) {
        console.warn("Source and destination must not be the same BitmapTargetBase.");
        return false;
    }
    return true;
}

export default RenderHelper;
