/**
 * Created by MIC on 2015/11/18.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ApplicationError_1 = require("./ApplicationError");
var ArgumentError = (function (_super) {
    __extends(ArgumentError, _super);
    function ArgumentError(message, argument) {
        if (message === void 0) { message = "Argument error"; }
        if (argument === void 0) { argument = null; }
        _super.call(this, message);
        this._argument = null;
        this._argument = argument;
    }
    Object.defineProperty(ArgumentError.prototype, "argument", {
        get: function () {
            return this._argument;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArgumentError.prototype, "name", {
        get: function () {
            return "ArgumentError";
        },
        enumerable: true,
        configurable: true
    });
    return ArgumentError;
})(ApplicationError_1.ApplicationError);
exports.ArgumentError = ArgumentError;

//# sourceMappingURL=ArgumentError.js.map
