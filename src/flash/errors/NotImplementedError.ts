/**
 * Created by MIC on 2015/11/18.
 */

import {ErrorBase} from "../../ErrorBase";

export class NotImplementedError extends ErrorBase {

    constructor(message:string = "") {
        super(message);
    }

    get name():string {
        return "NotImplementedError";
    }

}
