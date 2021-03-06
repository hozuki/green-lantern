/**
 * Created by MIC on 2015/12/22.
 */

import RenderTarget2D from "../targets/RenderTarget2D";
import WebGLRenderer from "../WebGLRenderer";
import FilterManager from "../FilterManager";
import FilterBase from "../FilterBase";
import RenderHelper from "../RenderHelper";
import ShaderID from "../ShaderID";
import Blur2Shader from "../shaders/Blur2Shader";
import MathUtil from "../../mic/MathUtil";

export default class Blur2Filter extends FilterBase {

    constructor(manager: FilterManager) {
        super(manager);
    }

    get strengthX(): number {
        return this._strengthX;
    }

    set strengthX(v: number) {
        if (v < 0) {
            v = 1;
        }
        this._strengthX = v;
    }

    get strengthY(): number {
        return this._strengthY;
    }

    set strengthY(v: number) {
        if (v < 0) {
            v = 1;
        }
        this._strengthY = v;
    }

    get pass(): number {
        return this._pass;
    }

    set pass(v: number) {
        v = MathUtil.clamp(v, 1, 3) | 0;
        this._pass = v;
    }

    process(renderer: WebGLRenderer, input: RenderTarget2D, output: RenderTarget2D, clearOutput: boolean): void {
        // Larger value makes image smoother, darker (or less contrastive), but greatly improves efficiency.
        const passCoeff = 3;

        // See http://rastergrid.com/blog/2010/09/efficient-gaussian-blur-with-linear-sampling/
        const tempTarget = this.filterManager.requestTempTarget();
        let t1 = input, t2 = tempTarget;
        t2.clear();
        let t: RenderTarget2D;
        for (let i = 0; i < this.pass * passCoeff; ++i) {
            RenderHelper.renderBuffered(renderer, t1, t2, ShaderID.BLUR2, true, (renderer: WebGLRenderer): void => {
                const shader = <Blur2Shader>renderer.shaderManager.currentShader;
                shader.setStrength(this.strengthX / 4 / this.pass / (t1.fitWidth / t1.originalWidth));
                shader.setResolution(input.fitWidth);
                shader.setBlurDirection([1.0, 0.0]);
            });
            t = t1;
            t1 = t2;
            t2 = t;
        }
        for (let i = 0; i < this.pass * passCoeff; ++i) {
            RenderHelper.renderBuffered(renderer, t1, t2, ShaderID.BLUR2, true, (renderer: WebGLRenderer): void => {
                const shader = <Blur2Shader>renderer.shaderManager.currentShader;
                shader.setStrength(this.strengthY / 4 / this.pass / (t1.fitWidth / t1.originalWidth));
                shader.setResolution(input.fitHeight);
                shader.setBlurDirection([0.0, 1.0]);
            });
            t = t1;
            t1 = t2;
            t2 = t;
        }
        RenderHelper.copyTargetContent(renderer, t1, output, this.flipX, this.flipY, clearOutput);
        this.filterManager.returnTempTarget(tempTarget);
    }

    protected _$initialize(): void {
    }

    protected _$dispose(): void {
    }

    private _strengthX: number = 5;
    private _strengthY: number = 5;
    private _pass: number = 1;

}
