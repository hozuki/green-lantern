/**
 * Created by MIC on 2016/6/8.
 */

import ErrorBase from "../../mic/ErrorBase";

export default class ApplicationError extends ErrorBase {

    constructor(message: string = "") {
        super(message);
    }

    get name(): string {
        return "ApplicationError";
    }

}
