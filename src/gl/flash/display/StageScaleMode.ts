/**
 * Created by MIC on 2015/11/18.
 */

abstract class StageScaleMode {

    static get EXACT_FIT(): string {
        return 'exactFit';
    }

    static get NO_BORDER(): string {
        return 'noBorder';
    }

    static get NO_SCALE(): string {
        return 'noScale';
    }

    static get SHOW_ALL(): string {
        return 'showAll';
    }

}

export default StageScaleMode;
