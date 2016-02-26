/**
 * Created by MIC on 2015/12/26.
 */

export abstract class Back {

    static easeIn(t:number, b:number, c:number, d:number, s:number = 0):number {
        //if (typeof s == "undefined") s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    }

    static easeInOut(t:number, b:number, c:number, d:number, s:number = 0):number {
        //if (typeof s == "undefined") s = 1.70158;
        if ((t /= d / 2) < 1) {
            return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        } else {
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        }
    }

    static easeOut(t:number, b:number, c:number, d:number, s:number = 0):number {
        //if (typeof s == "undefined") s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    }

}
