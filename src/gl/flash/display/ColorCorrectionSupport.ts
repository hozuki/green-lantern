/**
 * Created by MIC on 2015/11/18.
 */

abstract class ColorCorrectionSupport {

    static get DEFAULT_OFF(): string {
        return 'defaultOff';
    }

    static get DEFAULT_ON(): string {
        return 'defaultOn';
    }

    static get UNSUPPORTED(): string {
        return 'unsupported';
    }

}

export default ColorCorrectionSupport;
