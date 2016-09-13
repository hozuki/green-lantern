/**
 * Created by MIC on 2016/1/7.
 */

import {EventDispatcher} from "../events/EventDispatcher";
import {URLRequest} from "../net/URLRequest";
import {SoundLoaderContext} from "./SoundLoaderContext";
import {NotImplementedError} from "../errors/NotImplementedError";
import {ByteArray} from "../utils/ByteArray";
import {SoundTransform} from "./SoundTransform";
import {SoundChannel} from "./SoundChannel";

export class Sound extends EventDispatcher {

    constructor(stream: URLRequest = null, context: SoundLoaderContext = null) {
        super();
        this._source = stream;
        if (!stream === null) {
            this.load(stream, context);
        }
    }

    get bytesLoaded(): number {
        throw new NotImplementedError();
    }

    get bytesTotal(): number {
        throw new NotImplementedError();
    }

    get isBuffering(): boolean {
        throw new NotImplementedError();
    }

    get isURLInaccessible(): boolean {
        throw new NotImplementedError();
    }

    get length(): number {
        throw new NotImplementedError();
    }

    get url(): string {
        return this._source === null ? "" : this._source.url;
    }

    close(): void {
        throw new NotImplementedError();
    }

    extract(target: ByteArray, length: number, startPosition: number = -1) {
        throw new NotImplementedError();
    }

    load(stream: URLRequest, context: SoundLoaderContext = null): void {
        throw new NotImplementedError();
    }

    loadPCMFromByteArray(bytes: ByteArray, samples: number, format: string = "float", stereo: boolean = true, sampleRate: number = 44100): void {
        throw new NotImplementedError();
    }

    play(startTime: number = 0, loops: number = 0, soundTransform: SoundTransform = null): SoundChannel {
        throw new NotImplementedError();
    }

    static get COMPLETE(): string {
        return "complete";
    }

    static get OPEN(): string {
        return "open";
    }

    static get PROGRESS(): string {
        return "progress";
    }

    static get SAMPLE_DATA(): string {
        return "sampleData";
    }

    private _source: URLRequest = null;

}
