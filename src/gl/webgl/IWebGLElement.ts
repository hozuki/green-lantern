/**
 * Created by MIC on 2015/11/20.
 */

import WebGLRenderer from "./WebGLRenderer";
import IDisposable from "../mic/IDisposable";
import TimeInfo from "../mic/TimeInfo";

interface IWebGLElement extends IDisposable {

    $update(timeInfo: TimeInfo): void;
    $render(renderer: WebGLRenderer): void;

}

export default IWebGLElement;
