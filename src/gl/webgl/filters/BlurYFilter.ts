/**
 * Created by MIC on 2015/11/18.
 */

import BlurYShader from "../shaders/BlurYShader";
import RenderTarget2D from "../targets/RenderTarget2D";
import WebGLRenderer from "../WebGLRenderer";
import FilterManager from "../FilterManager";
import FilterBase from "../FilterBase";
import ShaderID from "../ShaderID";
import RenderHelper from "../RenderHelper";
import MathUtil from "../../mic/MathUtil";

export default class BlurYFilter extends FilterBase {

    constructor(manager: FilterManager) {
        super(manager);
    }

    get strength(): number {
        return this._strength;
    }

    set strength(v: number) {
        if (v < 0) {
            v = 1;
        }
        this._strength = v;
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
        const tempTarget = this.filterManager.requestTempTarget();
        let t1 = input, t2 = tempTarget;
        t2.clear();
        let t: RenderTarget2D;
        for (let i = 0; i < passCoeff * this.pass; ++i) {
            RenderHelper.renderBuffered(renderer, t1, t2, ShaderID.BLUR_Y, true, (renderer: WebGLRenderer): void => {
                const shader = <BlurYShader>renderer.shaderManager.currentShader;
                shader.setStrength(this.strength / 4 / this.pass / (t1.fitWidth / t1.originalWidth));
            });
            t = t1;
            t1 = t2;
            t2 = t;
        }
        //renderer.copyRenderTargetContent(t1, output, clearOutput);
        RenderHelper.copyTargetContent(renderer, t1, output, this.flipX, this.flipY, clearOutput);
        this.filterManager.returnTempTarget(tempTarget);
    }

    protected _$initialize(): void {
    }

    protected _$dispose(): void {
    }

    private _strength: number = 5;
    private _pass: number = 1;

}
