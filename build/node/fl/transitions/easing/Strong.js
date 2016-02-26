/**
 * Created by MIC on 2015/12/26.
 */
var NotImplementedError_1 = require("../../../../lib/glantern-utils/src/NotImplementedError");
var Strong = (function () {
    function Strong() {
    }
    Strong.easeIn = function (t, b, c, d) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    Strong.easeInOut = function (t, b, c, d) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    Strong.easeOut = function (t, b, c, d) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    return Strong;
})();
exports.Strong = Strong;

//# sourceMappingURL=Strong.js.map
