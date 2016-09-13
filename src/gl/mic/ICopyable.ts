/**
 * Created by MIC on 2015/11/19.
 */

export interface ICopyable<T> {
    copyFrom(source: T): void;
}
