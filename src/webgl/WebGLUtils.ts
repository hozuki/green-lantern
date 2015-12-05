/**
 * Created by MIC on 2015/11/13.
 */

var gl = (<any>this).WebGLRenderingContext || (<any>window).WebGLRenderingContext;

export abstract class WebGLUtils {

    static setupWebGL(canvas:HTMLCanvasElement, optionalAttributes:any):WebGLRenderingContext {
        function showLink(str:string) {
            var failHtml:string = makeFailHtml(str);
            console.error(failHtml);
            var container = canvas.parentElement;
            if (container) {
                container.innerHTML = failHtml;
            }
        }

        if (gl === undefined) {
            showLink(GET_A_WEBGL_BROWSER);
            return null;
        }
        var context = create3DContext(canvas, optionalAttributes);
        if (context == null) {
            showLink(OTHER_PROBLEM);
        }
        return context;
    }

}

function makeFailHtml(message:string):string {
    return '' +
        '<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>' +
        '<td align="center">' +
        '<div style="display: table-cell; vertical-align: middle;">' +
        '<div style="">' + message + '</div>' +
        '</div>' +
        '</td></tr></table>';
}

function create3DContext(canvas:HTMLCanvasElement, optionalAttributes:any):WebGLRenderingContext {
    var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    var context:WebGLRenderingContext = null;
    for (var i = 0; i < names.length; ++i) {
        try {
            context = <WebGLRenderingContext>canvas.getContext(names[i], optionalAttributes);
        } catch (e) {
        }
        if (context) {
            break;
        }
    }
    return context;
}

var GET_A_WEBGL_BROWSER:string = '' +
    'This page requires a browser that supports WebGL.<br/>' +
    '<a href="http://get.webgl.org">Click here to upgrade your browser.</a>';

var OTHER_PROBLEM:string = '' +
    "It doesn't appear your computer can support WebGL.<br/>" +
    '<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>';