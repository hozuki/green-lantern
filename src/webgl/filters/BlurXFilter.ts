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
        if (this._blurXShader !== null) {
            this._blurXShader.setStrength(v);
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
        RenderHelper.bufferedRender(renderer, input, output, ShaderID.BLUR_X, clearOutput, (renderer:WebGLRenderer):void => {
            var shader = <BlurXShader>renderer.shaderManager.currentShader;
            shader.setStrength(this.strength);
        });
    }

    protected __initialize():void {
        this._blurXShader = new BlurXShader(this._filterManager.renderer.shaderManager);
        this._blurXShader.setStrength(this._strength);
    }

    protected __cleanup():void {
        if (this._blurXShader !== null) {
            this._blurXShader.dispose();
            this._blurXShader = null;
        }
    }

    private _strength:number = 5;
    private _pass:number = 1;
    private _blurXShader:BlurXShader = null;

}
