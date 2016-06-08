/**
 * Created by MIC on 2015/12/26.
 */

export abstract class Sine {

    static easeIn(t:number, b:number, c:number, d:number):number {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    }

    static easeInOut(t:number, b:number, c:number, d:number):number {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    }

    static easeOut(t:number, b:number, c:number, d:number):number {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    }

}
