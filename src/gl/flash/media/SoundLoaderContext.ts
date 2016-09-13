/**
 * Created by MIC on 2016/9/13.
 */

export class SoundLoaderContext {

    constructor(bufferTime: number = 1000, checkPolicyFile: boolean = false) {
        this._bufferTime = bufferTime;
        this._checkPolicyFile = checkPolicyFile;
    }

    get bufferTime(): number {
        return this._bufferTime;
    }

    set bufferTime(v: number) {
        this._bufferTime = v;
    }

    get checkPolicyFile(): boolean {
        return this._checkPolicyFile;
    }

    set checkPolicyFile(v: boolean) {
        this._checkPolicyFile = v;
    }

    private _bufferTime: number = 1000;
    private _checkPolicyFile: boolean = false;

}
