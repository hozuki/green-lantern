/**
 * Created by MIC on 2015/11/13.
 */
var gl = this.WebGLRenderingContext || window.WebGLRenderingContext;
var WebGLUtils = (function () {
    function WebGLUtils() {
    }
    WebGLUtils.setupWebGL = function (canvas, optionalAttributes) {
        function showLink(str) {
            var failHtml = makeFailHtml(str);
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
    };
    return WebGLUtils;
})();
exports.WebGLUtils = WebGLUtils;
function makeFailHtml(message) {
    return '' +
        '<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>' +
        '<td align="center">' +
        '<div style="display: table-cell; vertical-align: middle;">' +
        '<div style="">' + message + '</div>' +
        '</div>' +
        '</td></tr></table>';
}
function create3DContext(canvas, optionalAttributes) {
    var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    var context = null;
    for (var i = 0; i < names.length; ++i) {
        try {
            context = canvas.getContext(names[i], optionalAttributes);
        }
        catch (e) {
        }
        if (context) {
            break;
        }
    }
    return context;
}
var GET_A_WEBGL_BROWSER = '' +
    'This page requires a browser that supports WebGL.<br/>' +
    '<a href="http://get.webgl.org">Click here to upgrade your browser.</a>';
var OTHER_PROBLEM = '' +
    "It doesn't appear your computer can support WebGL.<br/>" +
    '<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>';

//# sourceMappingURL=WebGLUtils.js.map
