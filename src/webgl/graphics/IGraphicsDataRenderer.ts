/**
 * Created by MIC on 2015/11/20.
 */

import {IDisposable} from "../../IDisposable";
import {WebGLRenderer} from "../WebGLRenderer";
import {RenderTarget2D} from "../RenderTarget2D";

export interface IGraphicsDataRenderer extends IDisposable {

    bezierCurveTo(cx1:number, cy1:number, cx2:number, cy2:number, x:number, y:number):void;
    closePath():void;
    curveTo(cx:number, cy:number, x:number, y:number):void;
    drawCircle(x:number, y:number, radius:number):void;
    drawEllipse(x:number, y:number, width:number, height:number):void;
    drawRect(x:number, y:number, width:number, height:number):void;
    drawRoundRect(x:number, y:number, width:number, height:number, ellipseWidth:number, ellipseHeight?:number):void;
    lineTo(x:number, y:number):void;
    moveTo(x:number, y:number):void;
    update():void;
    render(renderer:WebGLRenderer, target:RenderTarget2D):void;

}
