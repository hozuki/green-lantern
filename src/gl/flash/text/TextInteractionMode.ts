/**
 * Created by MIC on 2015/12/23.
 */

abstract class TextInteractionMode {

    static get NORMAL(): string {
        return "normal";
    }

    static get SELECTION(): string {
        return "selection";
    }

}

export default TextInteractionMode;
