/**
 * Created by MIC on 2015/12/26.
 */

import {EventDispatcher} from "../../flash/events/EventDispatcher";
import {NotImplementedError} from "../../flash/errors/NotImplementedError";

export class Tween extends EventDispatcher {

    constructor(obj: Object, prop: string, func: Function, begin: number, finish: number, duration: number, useSeconds: boolean = false) {
        super();
        this.obj = obj;
        this.prop = prop;
        this.func = func;
        this.begin = begin;
        this.finish = finish;
        this.duration = duration;
        this.useSeconds = useSeconds;
    }

    begin: number = NaN;
    duration: number = 5;
    finish: number = 5;
    FPS: number = 60;
    func: Function = null;
    isPlaying: boolean = false;
    looping: boolean = false;
    obj: Object = null;
    position: number = 0;
    prop: string = null;
    time: number = 0;
    useSeconds: boolean = false;

    continueTo(finish: number, duration: number): void {
        throw new NotImplementedError();
    }

    fforward(): void {
        throw new NotImplementedError();
    }

    nextFrame(): void {
        throw new NotImplementedError();
    }

    prevFrame(): void {
        throw new NotImplementedError();
    }

    resume(): void {
        throw new NotImplementedError();
    }

    rewind(t: number = 0): void {
        throw new NotImplementedError();
    }

    start(): void {
        throw new NotImplementedError();
    }

    stop(): void {
        throw new NotImplementedError();
    }

    yoyo(): void {
        throw new NotImplementedError();
    }

}
