/**
 * Created by MIC on 2015/11/17.
 */

import {WebGLDataType} from "./WebGLDataType";

export class UniformCache {

    name:string = null;
    type:WebGLDataType = WebGLDataType.UUnknown;
    location:WebGLUniformLocation = null;
    value:any = undefined;
    transpose:boolean = false;
    array:Float32Array = null;
    texture:WebGLTexture = null;

}
