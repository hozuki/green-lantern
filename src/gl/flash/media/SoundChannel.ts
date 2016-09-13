/**
 * Created by MIC on 2016/9/13.
 */

import {EventDispatcher} from "../events/EventDispatcher";
import {NotImplementedError} from "../errors/NotImplementedError";
import {SoundTransform} from "./SoundTransform";

export class SoundChannel extends EventDispatcher {

    constructor() {
        super();
    }

    get leftPeak(): number {
        throw new NotImplementedError();
    }

    get position(): number {
        throw new NotImplementedError();
    }

    get rightPeak(): number {
        throw new NotImplementedError();
    }

    get soundTransform(): SoundTransform {
        return this._soundTransform;
    }

    set soundTransform(v: SoundTransform) {
        this._soundTransform = v;
    }

    stop(): void {
        throw new NotImplementedError();
    }

    static get SOUND_COMPLETE(): string {
        return "soundComplete";
    }

    private _soundTransform: SoundTransform = null;

}
