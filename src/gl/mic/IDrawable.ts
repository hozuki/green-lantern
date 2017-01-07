/**
 * Created by MIC on 2016/10/30.
 */

import WebGLRenderer from "../webgl/WebGLRenderer";

interface IDrawable {
    visible: boolean;
    render(renderer: WebGLRenderer): void;
}

export default IDrawable;
