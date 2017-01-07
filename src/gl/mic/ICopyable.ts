/**
 * Created by MIC on 2015/11/19.
 */

interface ICopyable<T> {
    copyFrom(source: T): void;
}

export default ICopyable;
