/**
 * Created by MIC on 2016/1/7.
 */

import ICloneable from "../../mic/ICloneable";
import FlashEvent from "./FlashEvent";
import NotImplementedError from "../errors/NotImplementedError";

export default class TimerEvent extends FlashEvent implements ICloneable<TimerEvent> {

    constructor(type: string, bubbles: boolean = false, cancelable: boolean = false) {
        super(type, bubbles, cancelable);
    }

    static get TIMER(): string {
        return 'timer';
    }

    static get TIMER_COMPLETE(): string {
        return 'timerComplete';
    }

    updateAfterEvent(): void {
        throw new NotImplementedError();
    }

    clone(): TimerEvent {
        throw new NotImplementedError();
    }

}
