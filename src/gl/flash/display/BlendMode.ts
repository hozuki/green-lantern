/**
 * Created by MIC on 2015/11/18.
 */

abstract class BlendMode {

    static get ADD(): string {
        return "add";
    }

    static get ALPHA(): string {
        return "alpha";
    }

    static get DARKEN(): string {
        return "darken";
    }

    static get DIFFERENCE(): string {
        return "difference";
    }

    static get ERASE(): string {
        return "erase";
    }

    static get HARDLIGHT(): string {
        return "hardlight";
    }

    static get INVERT(): string {
        return "invert";
    }

    static get LAYER(): string {
        return "layer";
    }

    static get LIGHTEN(): string {
        return "lighten";
    }

    static get MULTIPLY(): string {
        return "multiply";
    }

    static get NORMAL(): string {
        return "normal";
    }

    static get OVERLAY(): string {
        return "overlay";
    }

    static get SCREEN(): string {
        return "screen";
    }

    static get SHADER(): string {
        return "shader";
    }

    static get SUBTRACT(): string {
        return "subtract";
    }

}

export default BlendMode;
