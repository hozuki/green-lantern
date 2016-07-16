/**
 * Created by MIC on 2015/11/30.
 */

import {IDisposable} from "../glantern/IDisposable";
import {RenderTarget2D} from "./RenderTarget2D";
import {WebGLRenderer} from "./WebGLRenderer";

export interface IBitmapFilter extends IDisposable {

    initialize():void;
    process(renderer:WebGLRenderer, input:RenderTarget2D, output:RenderTarget2D, clearOutput:boolean):void;
    notifyAdded():void;
    notifyRemoved():void;

}
