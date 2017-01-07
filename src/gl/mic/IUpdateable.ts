/**
 * Created by MIC on 2016/10/30.
 */

import TimeInfo from "./TimeInfo";

interface IUpdateable {
    enabled: boolean;
    update(timeInfo: TimeInfo): void;
}

export default IUpdateable;
