/**
 * Created by MIC on 2015/12/26.
 */

import {FlashEvent} from "../../flash/events/FlashEvent";
import {ICloneable} from "../../ICloneable";
import {NotImplementedError} from "../../../lib/glantern-utils/src/NotImplementedError";

export class TweenEvent extends FlashEvent implements ICloneable<TweenEvent> {

    constructor(type:string, time:number, position:number, bubbles:boolean = false, cancelable:boolean = false) {
        super(type, bubbles, cancelable);
        this._position = position;
        this._time = time;
    }

    clone():TweenEvent {
        throw new NotImplementedError();
    }

    static get MOTION_CHANGE():string {
        return 'motionChange';
    }

    static get MOTION_FINISH():string {
        return 'motionFinish';
    }

    static get MOTION_LOOP():string {
        return 'motionLoop';
    }

    static get MOTION_RESUME():string {
        return 'motionResume';
    }

    static get MOTION_START():string {
        return 'motionStart';
    }

    static get MOTION_STOP():string {
        return 'motionStop';
    }

    private _position:number = NaN;
    private _time:number = NaN;

}
