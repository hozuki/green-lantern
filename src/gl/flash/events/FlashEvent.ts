/**
 * Created by MIC on 2015/11/21.
 */

import EventBase from "../../mic/EventBase";

export default class FlashEvent extends EventBase {

    static get ENTER_FRAME(): string {
        return "enterFrame";
    }

}
