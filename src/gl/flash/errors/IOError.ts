/**
 * Created by MIC on 2016/6/11.
 */

import ErrorBase from "../../mic/ErrorBase";

export default class IOError extends ErrorBase {

    constructor(message: string = "") {
        super(message);
    }

    get name(): string {
        return "IOError";
    }

}
