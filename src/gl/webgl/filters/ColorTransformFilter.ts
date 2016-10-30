/**
 * Created by MIC on 2015/11/18.
 */

import {ColorTransformShader} from "../shaders/ColorTransformShader";
import {RenderTarget2D} from "../targets/RenderTarget2D";
import {WebGLRenderer} from "../WebGLRenderer";
import {FilterManager} from "../FilterManager";
import {FilterBase} from "../FilterBase";
import {RenderHelper} from "../RenderHelper";
import {ShaderID} from "../ShaderID";

export class ColorTransformFilter extends FilterBase {

    constructor(manager: FilterManager) {
        super(manager);
    }

    setColorMatrix(r4c5: number[]): void {
        this._colorMatrix = r4c5.slice();
    }

    process(renderer: WebGLRenderer, input: RenderTarget2D, output: RenderTarget2D, clearOutput: boolean): void {
        RenderHelper.renderBuffered(renderer, input, this._tempTarget, ShaderID.COLOR_TRANSFORM, true, (renderer: WebGLRenderer): void => {
            var shader = <ColorTransformShader>renderer.shaderManager.currentShader;
            shader.setColorMatrix(this._colorMatrix);
        });
        RenderHelper.copyTargetContent(renderer, this._tempTarget, output, this.flipX, this.flipY, clearOutput);
    }

    protected _$initialize(): void {
        this._tempTarget = this.filterManager.renderer.createRenderTarget();
    }

    protected _$dispose(): void {
        this.filterManager.renderer.releaseRenderTarget(this._tempTarget);
        this._tempTarget = null;
    }

    private _colorMatrix: number[] = [
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 1, 0
    ];
    private _tempTarget: RenderTarget2D = null;

}
