/**
 * Created by MIC on 2016/10/30.
 */

import {TimeInfo} from "./TimeInfo";

export interface IUpdateable {

    enabled: boolean;
    update(timeInfo: TimeInfo): void;

}
