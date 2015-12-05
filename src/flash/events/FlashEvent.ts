/**
 * Created by MIC on 2015/11/21.
 */

export class FlashEvent implements Event {

    bubbles:boolean = false;
    cancelBubble:boolean = false;
    cancelable:boolean = false;
    currentTarget:EventTarget = null;
    defaultPrevented:boolean = false;
    eventPhase:number = -1;
    isTrusted:boolean = true;
    returnValue:boolean = false;
    srcElement:Element = null;
    target:EventTarget = null;
    timeStamp:number = 0;
    type:string = null;

    AT_TARGET:number = 2;
    BUBBLING_PHASE:number = 0;
    CAPTURING_PHASE:number = 1;

    constructor() {
    }

    initEvent(eventTypeArg:string, canBubbleArg:boolean, cancelableArg:boolean):void {
    }

    preventDefault():void {
    }

    stopImmediatePropagation():void {
    }

    stopPropagation():void {
    }

    static create(type:string):FlashEvent {
        var ev = new FlashEvent();
        ev.type = type;
        ev.timeStamp = Date.now();
        return ev;
    }

    static get ENTER_FRAME():string {
        return "enterFrame";
    }

}
