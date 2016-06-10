/**
 * Created by MIC on 2015/11/18.
 */

import {BlurXShader} from "../shaders/BlurXShader";
import {RenderTarget2D} from "../RenderTarget2D";
import {WebGLRenderer} from "../WebGLRenderer";
import {FilterManager} from "../FilterManager";
import {FilterBase} from "../FilterBase";
import {ShaderID} from "../ShaderID";
import {RenderHelper} from "../RenderHelper";
import {GLUtil} from "../../GLUtil";

export class BlurXFilter extends FilterBase {

    constructor(manager:FilterManager) {
        super(manager);
    }

    get strength():number {
        return this._strength;
    }

    set strength(v:number) {
        if (v < 0) {
            v = 1;
        }
        this._strength = v;
    }

    get pass():number {
        return this._pass;
    }

    set pass(v:number) {
        v = GLUtil.limitInto(v, 1, 3) | 0;
        this._pass = v;
    }

    process(renderer:WebGLRenderer, input:RenderTarget2D, output:RenderTarget2D, clearOutput:boolean):void {
        // Larger value makes image smoother, darker (or less contrastive), but greatly improves efficiency.
        var passCoeff = 3;
        var t1 = input, t2 = this._tempTarget;
        t2.clear();
        var t:RenderTarget2D;
        for (var i = 0; i < passCoeff * this.pass; ++i) {
            RenderHelper.renderBuffered(renderer, t1, t2, ShaderID.BLUR_X, true, (renderer:WebGLRenderer):void => {
                var shader = <BlurXShader>renderer.shaderManager.currentShader;
                shader.setStrength(this.strength / 4 / this.pass / (t1.fitWidth / t1.originalWidth));
            });
            t = t1;
            t1 = t2;
            t2 = t;
        }
        //renderer.copyRenderTargetContent(t1, output, clearOutput);
        RenderHelper.copyTargetContent(renderer, t1, output, this.flipX, this.flipY, clearOutput);
    }

    protected _$initialize():void {
        this._tempTarget = this.filterManager.renderer.createRenderTarget();
    }

    protected _$dispose():void {
        this.filterManager.renderer.releaseRenderTarget(this._tempTarget);
        this._tempTarget = null;
    }

    private _strength:number = 5;
    private _pass:number = 1;
    private _tempTarget:RenderTarget2D = null;

}
