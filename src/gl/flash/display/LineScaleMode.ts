/**
 * Created by MIC on 2015/11/20.
 */

abstract class LineScaleMode {

    static get HORIZONTAL(): string {
        return "horizontal";
    }

    static get NONE(): string {
        return "none";
    }

    static get NORMAL(): string {
        return "normal";
    }

    static get VERTICAL(): string {
        return "vertical";
    }

}

export default LineScaleMode;
