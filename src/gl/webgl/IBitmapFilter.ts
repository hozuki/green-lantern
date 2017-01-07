/**
 * Created by MIC on 2015/11/30.
 */

import IDisposable from "../mic/IDisposable";
import RenderTarget2D from "./targets/RenderTarget2D";
import WebGLRenderer from "./WebGLRenderer";

interface IBitmapFilter extends IDisposable {

    initialize(): void;
    process(renderer: WebGLRenderer, input: RenderTarget2D, output: RenderTarget2D, clearOutput: boolean): void;
    notifyAdded(): void;
    notifyRemoved(): void;

}

export default IBitmapFilter;
