/**
 * Created by MIC on 2015/11/18.
 */

export class ApplicationError implements Error {

    constructor(message:string = "") {
        this._message = message;
    }

    get message():string {
        return this._message;
    }

    get name():string {
        return "ApplicationError";
    }

    private _message:string = null;

}
