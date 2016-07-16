/**
 * Created by MIC on 2016/6/11.
 */

export abstract class VisualUtil {

    static requestAnimationFrame(f:FrameRequestCallback):number {
        return window.requestAnimationFrame(f);
    }

    static cancelAnimationFrame(handle:number):void {
        window.cancelAnimationFrame(handle);
    }

}
