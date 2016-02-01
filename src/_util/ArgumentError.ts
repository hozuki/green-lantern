/**
 * Created by MIC on 2015/11/18.
 */

import {ApplicationError} from "./ApplicationError";

export class ArgumentError extends ApplicationError {

    constructor(message:string = "Argument error", argument:string = null) {
        super(message);
        this._argument = argument;
    }

    get argument():string {
        return this._argument;
    }

    get name():string {
        return "ArgumentError";
    }

    private _argument:string = null;

}
