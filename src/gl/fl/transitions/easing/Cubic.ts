/**
 * Created by MIC on 2015/12/26.
 */

abstract class Cubic {

    static easeIn(t: number, b: number, c: number, d: number): number {
        return c * (t /= d) * t * t + b;
    }

    static easeInOut(t: number, b: number, c: number, d: number): number {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t + b;
        } else {
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        }
    }

    static easeOut(t: number, b: number, c: number, d: number): number {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    }

}

export default Cubic;
