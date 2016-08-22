/**
 * Created by MIC on 2015/11/18.
 */

export abstract class ShaderID {

    static get PRIMITIVE(): number {
        return 0;
    }

    static get BLUR_X(): number {
        return 1;
    }

    static get BLUR_Y(): number {
        return 2;
    }

    static get REPLICATE(): number {
        return 3;
    }

    static get COLOR_TRANSFORM(): number {
        return 4;
    }

    static get FXAA(): number {
        return 5;
    }

    static get BLUR2(): number {
        return 6;
    }

    static get COPY_IMAGE(): number {
        return 7;
    }

    static get PRIMITIVE2(): number {
        return 8;
    }

}
