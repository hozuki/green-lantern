/**
 * Created by MIC on 2015/11/20.
 */

import {RenderTarget2D} from "./RenderTarget2D";
import {WebGLRenderer} from "./WebGLRenderer";
import {IDisposable} from "../glantern/IDisposable";

export interface IWebGLElement extends IDisposable {

    update():void;
    render(renderer:WebGLRenderer):void;

}
