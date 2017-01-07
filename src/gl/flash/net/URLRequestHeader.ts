/**
 * Created by MIC on 2016/9/13.
 */

export default class URLRequestHeader {

    constructor(name: string = "", value: string = "") {
        this._name = name;
        this._value = value;
    }

    get name(): string {
        return this._name;
    }

    set name(v: string) {
        this._name = v;
    }

    get value(): string {
        return this._value;
    }

    set value(v: string) {
        this._value = v;
    }

    private _name: string = null;
    private _value: string = null;

}
