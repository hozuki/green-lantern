/**
 * Created by MIC on 2015/11/17.
 */

import WebGLDataType from "./WebGLDataType";

interface UniformCache {

    name: string;
    type: WebGLDataType;
    location: WebGLUniformLocation;
    value: any;
    transpose: boolean;
    array: Float32Array;
    texture: WebGLTexture;

}

export default UniformCache;
