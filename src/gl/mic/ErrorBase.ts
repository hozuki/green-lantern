/**
 * Created by MIC on 2015/11/18.
 */

export class ErrorBase implements Error {

    constructor(message: string = "") {
        this._message = message;
    }

    get message(): string {
        return this._message;
    }

    get name(): string {
        return "ErrorBase";
    }

    private _message: string = null;

}
