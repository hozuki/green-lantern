/**
 * Created by MIC on 2015/11/18.
 */

import {ColorTransformShader} from "../shaders/ColorTransformShader";
import {RenderTarget2D} from "../RenderTarget2D";
import {WebGLRenderer} from "../WebGLRenderer";
import {FilterManager} from "../FilterManager";
import {FilterBase} from "../FilterBase";

export class ColorTransformFilter extends FilterBase {

    constructor(manager:FilterManager) {
        super(manager);
    }

    setColorMatrix(r4c5:number[]):void {
        if (this._colorTransformShader !== null) {
            this._colorTransformShader.setColorMatrix(r4c5);
        }
    }

    process(renderer:WebGLRenderer, input:RenderTarget2D, output:RenderTarget2D, clearOutput:boolean):void {
    }

    protected __initialize():void {
        this._colorTransformShader = new ColorTransformShader(this._filterManager.renderer.shaderManager);
    }

    protected __cleanup():void {
        if (this._colorTransformShader !== null) {
            this._colorTransformShader.dispose();
            this._colorTransformShader = null;
        }
    }

    private _colorTransformShader:ColorTransformShader = null;

}
