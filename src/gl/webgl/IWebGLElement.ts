/**
 * Created by MIC on 2015/11/20.
 */

import {WebGLRenderer} from "./WebGLRenderer";
import {IDisposable} from "../glantern/IDisposable";
import {TimeInfo} from "../glantern/TimeInfo";

export interface IWebGLElement extends IDisposable {

    update(timeInfo:TimeInfo):void;
    render(renderer:WebGLRenderer):void;

}
