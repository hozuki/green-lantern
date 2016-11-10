/**
 * Created by MIC on 2015/11/18.
 */

import IDisposable from "../../mic/IDisposable";

abstract class EventDispatcher implements IDisposable {

    constructor() {
        this._listeners = new Map<string, Function[]>();
    }

    addEventListener(type: string, listener: Function, useCapture: boolean = false): void {
        // jabbany
        var listeners = this._listeners;
        if (!listeners.has(type)) {
            listeners.set(type, []);
        }
        listeners.get(type).push(listener);
    }

    dispatchEvent(event: Event, data?: any): boolean {
        // jabbany
        var listeners = this._listeners;
        if (listeners.has(event.type) && listeners.get(event.type) !== null) {
            var arr = listeners.get(event.type);
            for (var i = 0; i < arr.length; ++i) {
                arr[i](data);
            }
            return true;
        } else {
            return false;
        }
    }

    removeEventListener(type: string, listener: Function, useCapture: boolean = false): void {
        // jabbany
        var listeners = this._listeners;
        if (!listeners.has(type) || listeners.get(type).length === 0) {
            return;
        }
        var index = listeners.get(type).indexOf(listener);
        if (index >= 0) {
            listeners.get(type).splice(index, 1);
        }
    }

    hasEventListener(type: string): boolean {
        return this._listeners.has(type);
    }

    willTrigger(type: string): boolean {
        return this.hasEventListener(type) && this._listeners.get(type).length > 0;
    }

    dispose(): void {
        var listeners = this._listeners;
        listeners.forEach((categorizedListeners: Function[]): void => {
            while (categorizedListeners.length > 0) {
                categorizedListeners.pop();
            }
        });
        listeners.clear();
    }

    private _listeners: Map<string, Function[]> = null;

}

export default EventDispatcher;
