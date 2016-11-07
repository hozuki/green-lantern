/**
 * Created by MIC on 2016/9/13.
 */

import NotImplementedError from "../errors/NotImplementedError";

export default class SoundTransform {

    constructor(vol: number = 1, panning: number = 0) {
        this._volume = vol;
        this._panning = panning;
    }

    get leftToLeft(): number {
        throw new NotImplementedError();
    }

    set leftToLeft(v: number) {
        throw new NotImplementedError();
    }

    get leftToRight(): number {
        throw new NotImplementedError();
    }

    set leftToRight(v: number) {
        throw new NotImplementedError();
    }

    get pan(): number {
        throw new NotImplementedError();
    }

    set pan(v: number) {
        throw new NotImplementedError();
    }

    get rightToLeft(): number {
        throw new NotImplementedError();
    }

    set rightToLeft(v: number) {
        throw new NotImplementedError();
    }

    get rightToRight(): number {
        throw new NotImplementedError();
    }

    set rightToRight(v: number) {
        throw new NotImplementedError();
    }

    get volume(): number {
        throw new NotImplementedError();
    }

    set volume(v: number) {
        throw new NotImplementedError();
    }

    private _volume: number = 1;
    private _panning: number = 0;
    private _leftToLeft: number = 1;
    private _leftToRight: number = 0;
    private _rightToLeft: number = 0;
    private _rightToRight: number = 1;


}
