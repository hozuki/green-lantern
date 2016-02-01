/**
 * Created by MIC on 2015/12/26.
 */

export abstract class None {

    static easeIn(t:number, b:number, c:number, d:number):number {
        return c * t / d + b;
    }

    static easeInOut(t:number, b:number, c:number, d:number):number {
        return c * t / d + b;
    }

    static easeNone(t:number, b:number, c:number, d:number):number {
        return t < d ? b : b + c;
    }

    static easeOut(t:number, b:number, c:number, d:number):number {
        return c * t / d + b;
    }

}
