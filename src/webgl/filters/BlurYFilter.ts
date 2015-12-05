/**
 * Created by MIC on 2015/11/18.
 */

import {BlurYShader} from "../shaders/BlurYShader";
import {RenderTarget2D} from "../RenderTarget2D";
import {WebGLRenderer} from "../WebGLRenderer";
import {_util} from "../../_util/_util";
import {FilterManager} from "../FilterManager";
import {FilterBase} from "../FilterBase";
import {ShaderID} from "../ShaderID";
import {RenderHelper} from "../RenderHelper";

export class BlurYFilter extends FilterBase {

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
        if (this._blurYShader !== null) {
            this._blurYShader.setStrength(v);
        }
    }

    get pass():number {
        return this._pass;
    }

    set pass(v:number) {
        v = _util.limitInto(v, 1, 3) | 0;
        this._pass = v;
    }

    process(renderer:WebGLRenderer, input:RenderTarget2D, output:RenderTarget2D, clearOutput:boolean):void {
        RenderHelper.bufferedRender(renderer, input, output, ShaderID.BLUR_Y, clearOutput, (renderer:WebGLRenderer):void => {
            var shader = <BlurYShader>renderer.shaderManager.currentShader;
            shader.setStrength(this.strength);
        });
    }

    protected __initialize():void {
        this._blurYShader = new BlurYShader(this._filterManager.renderer.shaderManager);
        this._blurYShader = new BlurYShader(this._filterManager.renderer.shaderManager);
        this._blurYShader.setStrength(this._strength);
    }

    protected __cleanup():void {
        if (this._blurYShader !== null) {
            this._blurYShader.dispose();
            this._blurYShader = null;
        }
    }

    private _strength:number = 5;
    private _pass:number = 1;
    private _blurYShader:BlurYShader = null;

}
