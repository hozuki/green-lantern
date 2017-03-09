/**
 * Created by MIC on 2015/11/20.
 */

interface GraphicsConstObject {

    CurveAccuracy: number;
    VertexComponentCount: number;

}

const GraphicsConst: GraphicsConstObject = Object.create(null);

export default GraphicsConst;

GraphicsConst.CurveAccuracy = 20;
GraphicsConst.VertexComponentCount = 2;
