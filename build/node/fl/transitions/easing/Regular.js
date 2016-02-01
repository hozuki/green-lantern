/**
 * Created by MIC on 2015/12/26.
 */
var NotImplementedError_1 = require("../../../_util/NotImplementedError");
var Regular = (function () {
    function Regular() {
    }
    Regular.easeIn = function (t, b, c, d) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    Regular.easeInOut = function (t, b, c, d) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    Regular.easeOut = function (t, b, c, d) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    return Regular;
})();
exports.Regular = Regular;

//# sourceMappingURL=Regular.js.map
