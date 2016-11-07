/**
 * Created by MIC on 2016/6/13.
 */

abstract class EventBase implements Event {

    bubbles: boolean = false;
    cancelBubble: boolean = false;
    cancelable: boolean = false;
    currentTarget: EventTarget = null;
    defaultPrevented: boolean = false;
    eventPhase: number = -1;
    isTrusted: boolean = true;
    returnValue: boolean = false;
    srcElement: Element = null;
    target: EventTarget = null;
    timeStamp: number = 0;
    type: string = null;

    AT_TARGET: number = 2;
    BUBBLING_PHASE: number = 0;
    CAPTURING_PHASE: number = 1;

    constructor(type: string, bubbles: boolean = false, cancelable: boolean = false) {
        this.type = type;
        this.bubbles = bubbles;
        this.cancelable = cancelable;
    }

    initEvent(eventTypeArg: string, canBubbleArg: boolean, cancelableArg: boolean): void {
    }

    preventDefault(): void {
    }

    stopImmediatePropagation(): void {
    }

    stopPropagation(): void {
    }

    static create(type: string): EventBase {
        var ev = new PlainEvent(type, false, false);
        ev.timeStamp = Date.now();
        return ev;
    }

}

class PlainEvent extends EventBase {
}

export default EventBase;
