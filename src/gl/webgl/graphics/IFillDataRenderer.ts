/**
 * Created by MIC on 2015/11/20.
 */

import IGraphicsDataRenderer from "./IGraphicsDataRenderer";

interface IFillDataRenderer extends IGraphicsDataRenderer {

    beginIndex: number;
    endIndex: number;

}

export default IFillDataRenderer;
