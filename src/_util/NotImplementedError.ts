/**
 * Created by MIC on 2015/11/18.
 */

import {ApplicationError} from "./ApplicationError";

export class NotImplementedError extends ApplicationError {

    constructor(message:string = "Not implemented") {
        super(message);
    }

    get name():string {
        return "NotImplementedError";
    }

}
