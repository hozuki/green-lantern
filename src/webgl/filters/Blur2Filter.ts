/**
 * Created by MIC on 2015/12/22.
 */

import {RenderTarget2D} from "../RenderTarget2D";
import {WebGLRenderer} from "../WebGLRenderer";
import {_util} from "../../_util/_util";
import {FilterManager} from "../FilterManager";
import {FilterBase} from "../FilterBase";
import {RenderHelper} from "../RenderHelper";
import {ShaderID} from "../ShaderID";
import {Blur2Shader} from "../shaders/Blur2Shader";

export class Blur2Filter extends FilterBase {

    constructor(manager:FilterManager) {
        super(manager);
        this._tempTarget = manager.renderer.createRenderTarget();
    }

    get strengthX():number {
        return this._strengthX;
    }

    set strengthX(v:number) {
        if (v < 0) {
            v = 1;
        }
        this._strengthX = v;
    }

    get strengthY():number {
        return this._strengthY;
    }

    set strengthY(v:number) {
        if (v < 0) {
            v = 1;
        }
        this._strengthY = v;
    }

    get pass():number {
        return this._pass;
    }

    set pass(v:number) {
        v = _util.limitInto(v, 1, 3) | 0;
        this._pass = v;
    }

    process(renderer:WebGLRenderer, input:RenderTarget2D, output:RenderTarget2D, clearOutput:boolean):void {
        // Larger value makes image smoother, darker (or less contrastive), but greatly improves efficiency.
        var passCoeff = 3;

        // See http://rastergrid.com/blog/2010/09/efficient-gaussian-blur-with-linear-sampling/
        var t1 = input, t2 = this._tempTarget;
        t2.clear();
        var t:RenderTarget2D;
        for (var i = 0; i < this.pass * passCoeff; ++i) {
            RenderHelper.renderBuffered(renderer, t1, t2, ShaderID.BLUR2, true, (renderer:WebGLRenderer):void => {
                var shader = <Blur2Shader>renderer.shaderManager.currentShader;
                shader.setStrength(this.strengthX / 4 / this.pass / (t1.fitWidth / t1.originalWidth));
                shader.setResolution(input.fitWidth);
                shader.setBlurDirection([1.0, 0.0]);
            });
            t = t1;
            t1 = t2;
            t2 = t;
        }
        for (var i = 0; i < this.pass * passCoeff; ++i) {
            RenderHelper.renderBuffered(renderer, t1, t2, ShaderID.BLUR2, true, (renderer:WebGLRenderer):void => {
                var shader = <Blur2Shader>renderer.shaderManager.currentShader;
                shader.setStrength(this.strengthY / 4 / this.pass / (t1.fitWidth / t1.originalWidth));
                shader.setResolution(input.fitHeight);
                shader.setBlurDirection([0.0, 1.0]);
            });
            t = t1;
            t1 = t2;
            t2 = t;
        }
        RenderHelper.copyTargetContent(renderer, t1, output, this.flipX, this.shouldFlipY(output), clearOutput);
    }

    protected __initialize():void {
        this._tempTarget = this.filterManager.renderer.createRenderTarget();
    }

    protected __dispose():void {
        this.filterManager.renderer.releaseRenderTarget(this._tempTarget);
        this._tempTarget = null;
    }

    private _tempTarget:RenderTarget2D = null;
    private _strengthX:number = 5;
    private _strengthY:number = 5;
    private _pass:number = 1;

}
