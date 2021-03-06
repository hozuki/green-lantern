/**
 * Created by MIC on 2016/1/7.
 */
import EventDispatcher from "../events/EventDispatcher";
import TimerEvent from "../events/TimerEvent";
import VirtualDom from "../../mic/VirtualDom";

export default class Timer extends EventDispatcher {

    constructor(delay: number, repeatCount: number = 0) {
        super();
        this.delay = delay;
        this.repeatCount = repeatCount;
        this.start();
    }

    get currentCount(): number {
        return this._currentCount;
    }

    get delay(): number {
        return this._delay;
    }

    set delay(v: number) {
        v = Math.floor(v);
        this._delay = v >= 0 ? v : 0;
    }

    enabled: boolean = true;

    get repeatCount(): number {
        return this._repeatCount;
    }

    set repeatCount(v: number) {
        v = Math.floor(v);
        this._repeatCount = v >= 0 ? v : 0;
    }

    get running(): boolean {
        return this._running;
    }

    reset(): void {
        if (!this.running) {
            return;
        }
        VirtualDom.clearInterval(this._handle);
        this._handle = 0;
        this._running = false;
        this._currentCount = 0;
    }

    start(): void {
        if (!this.running && (this.currentCount < this.repeatCount || this.repeatCount === 0)) {
            this._handle = VirtualDom.setInterval(this._$timerCallback.bind(this), this.delay);
            this._running = true;
        }
    }

    stop(): void {
        if (!this.running) {
            return;
        }
        VirtualDom.clearInterval(this._handle);
        this._handle = 0;
        this._running = false;
    }

    dispose(): void {
        super.dispose();
        this.reset();
    }

    protected _$timerCallback(): void {
        if (!this.enabled) {
            return;
        }
        this._currentCount++;
        if (this.repeatCount > 0 && this.currentCount > this.repeatCount) {
            this.stop();
            this._$raiseTimerCompleteEvent();
        } else {
            this._$raiseTimerEvent();
        }
    }

    protected _$raiseTimerEvent(): void {
        const ev = new TimerEvent(TimerEvent.TIMER);
        ev.timeStamp = Date.now();
        this.dispatchEvent(ev);
    }

    protected _$raiseTimerCompleteEvent(): void {
        const ev = new TimerEvent(TimerEvent.TIMER_COMPLETE);
        ev.timeStamp = Date.now();
        this.dispatchEvent(ev);
    }

    private _currentCount: number = 0;
    private _delay: number = 1000;
    private _repeatCount: number = 0;
    private _running: boolean = false;
    private _handle: number = 0;

}
