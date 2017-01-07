/**
 * Created by MIC on 2015/11/20.
 */

interface GraphicsConstObject {

    CurveAccuracy: number;
    Z0: number;

}

const GraphicsConst: GraphicsConstObject = Object.create(null);

export default GraphicsConst;

GraphicsConst.CurveAccuracy = 20;

GraphicsConst.Z0 = 0;
