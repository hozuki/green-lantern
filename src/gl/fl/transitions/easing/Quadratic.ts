/**
 * Created by MIC on 2015/12/26.
 */

abstract class Quadratic {

    static easeIn(t: number, b: number, c: number, d: number): number {
        return c * (t /= d) * t + b;
    }

    static easeInOut(t: number, b: number, c: number, d: number): number {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        } else {
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        }
    }

    static easeOut(t: number, b: number, c: number, d: number): number {
        return -c * (t /= d) * (t - 2) + b;
    }

}

export default Quadratic;
