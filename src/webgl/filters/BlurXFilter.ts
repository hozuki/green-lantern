/**
 * Created by MIC on 2015/11/18.
 */

import {BlurXShader} from "../shaders/BlurXShader";
import {RenderTarget2D} from "../RenderTarget2D";
import {WebGLRenderer} from "../WebGLRenderer";
import {_util} from "../../_util/_util";
import {FilterManager} from "../FilterManager";
import {FilterBase} from "../FilterBase";
import {ShaderID} from "../ShaderID";
import {RenderHelper} from "../RenderHelper";

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
        v = _util.limitInto(v, 1, 3) | 0;
        this._pass = v;
    }

    process(renderer:WebGLRenderer, input:RenderTarget2D, output:RenderTarget2D, clearOutput:boolean):void {
        var t1 = input, t2 = this._tempTarget;
        t2.clear();
        var t:RenderTarget2D;
        for (var i = 0; i < this.pass * 5; ++i) {
            RenderHelper.renderBuffered(renderer, t1, t2, ShaderID.BLUR_X, true, (renderer:WebGLRenderer):void => {
                var shader = <BlurXShader>renderer.shaderManager.currentShader;
                shader.setStrength(this.strength / 4 / this.pass / (t1.fitWidth / t1.originalWidth));
            });
            t = t1;
            t1 = t2;
            t2 = t;
        }
        renderer.copyRenderTargetContent(t1, output, clearOutput);
    }

    __initialize():void {
        this._tempTarget = this._filterManager.renderer.createRenderTarget();
    }

    __dispose():void {
        this._filterManager.renderer.releaseRenderTarget(this._tempTarget);
        this._tempTarget = null;
    }

    private _strength:number = 5;
    private _pass:number = 1;
    private _tempTarget:RenderTarget2D = null;

}
