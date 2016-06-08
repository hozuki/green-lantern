/**
 * Created by MIC on 2015/11/17.
 */
"use strict";
var WebGLDataType_1 = require("./WebGLDataType");
var UniformCache = (function () {
    function UniformCache() {
        this.name = null;
        this.type = WebGLDataType_1.WebGLDataType.UUnknown;
        this.location = null;
        this.value = undefined;
        this.transpose = false;
        this.array = null;
        this.texture = null;
    }
    return UniformCache;
}());
exports.UniformCache = UniformCache;

//# sourceMappingURL=UniformCache.js.map
