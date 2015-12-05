/**
 * Created by MIC on 2015/11/18.
 */

import {_util} from "../../_util/_util";
import {IDisposable} from "../../IDisposable";

export abstract class EventDispatcher implements IDisposable {

    constructor() {
        this._listeners = new Map<string, Function[]>();
    }

    addEventListener(type:string, listener:Function, useCapture:boolean = false):void {
        // jabbany
        if (!this._listeners.has(type)) {
            this._listeners.set(type, []);
        }
        this._listeners.get(type).push(listener);
    }

    dispatchEvent(event:Event, data?:any):boolean {
        // jabbany
        if (this._listeners.has(event.type) && this._listeners.get(event.type) !== null) {
            var arr = this._listeners.get(event.type);
            for (var i = 0; i < arr.length; ++i) {
                try {
                    arr[i].call(null, data);
                } catch (ex) {
                    if (ex.hasOwnProperty("stack")) {
                        _util.trace(ex.stack.toString(), "dispatchEvent: error");
                    } else {
                        _util.trace(ex.toString(), "dispatchEvent: error");
                    }
                }
            }
            return true;
        } else {
            return false;
        }
    }

    removeEventListener(type:string, listener:Function, useCapture:boolean = false):void {
        // jabbany
        if (!this._listeners.has(type) || this._listeners.get(type).length === 0) {
            return;
        }
        var index = this._listeners.get(type).indexOf(listener);
        if (index >= 0) {
            this._listeners.get(type).splice(index, 1);
        }
    }

    hasEventListener(type:string):boolean {
        return this._listeners.has(type);
    }

    willTrigger(type:string):boolean {
        return this.hasEventListener(type) && this._listeners.get(type).length > 0;
    }

    abstract dispose():void;

    private _listeners:Map<string, Function[]> = null;

}
