/**
 * Created by MIC on 2015/11/18.
 */

import {ErrorBase} from "../../mic/ErrorBase";

export class ArgumentError extends ErrorBase {

    constructor(message: string = "", argument: string = null) {
        super(message);
        this._argument = argument;
    }

    get argument(): string {
        return this._argument;
    }

    get name(): string {
        return "ArgumentError";
    }

    private _argument: string = null;

}
