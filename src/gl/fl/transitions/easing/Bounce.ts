/**
 * Created by MIC on 2015/12/26.
 */

export abstract class Bounce {

    static easeIn(t: number, b: number, c: number, d: number): number {
        return c - Bounce.easeOut(d - t, 0, c, d) + b;
    }

    static easeInOut(t: number, b: number, c: number, d: number): number {
        if (t < d / 2) {
            return Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
        } else {
            return Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
    }

    static easeOut(t: number, b: number, c: number, d: number): number {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        }
    }

}
