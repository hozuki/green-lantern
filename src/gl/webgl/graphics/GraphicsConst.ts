/**
 * Created by MIC on 2015/11/20.
 */

interface GraphicsConstObject {

    VertexComponentCount: number;

}

const GraphicsConst: GraphicsConstObject = Object.create(null);

export default GraphicsConst;

GraphicsConst.VertexComponentCount = 2;
