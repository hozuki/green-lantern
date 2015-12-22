/**
 * Created by MIC on 2015/11/18.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ApplicationError_1 = require("./ApplicationError");
var NotImplementedError = (function (_super) {
    __extends(NotImplementedError, _super);
    function NotImplementedError(message) {
        if (message === void 0) { message = "Not implemented"; }
        _super.call(this, message);
    }
    Object.defineProperty(NotImplementedError.prototype, "name", {
        get: function () {
            return "NotImplementedError";
        },
        enumerable: true,
        configurable: true
    });
    return NotImplementedError;
})(ApplicationError_1.ApplicationError);
exports.NotImplementedError = NotImplementedError;

//# sourceMappingURL=NotImplementedError.js.map
