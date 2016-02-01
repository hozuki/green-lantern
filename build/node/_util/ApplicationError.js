/**
 * Created by MIC on 2015/11/18.
 */
var ApplicationError = (function () {
    function ApplicationError(message) {
        if (message === void 0) { message = ""; }
        this._message = null;
        this._message = message;
    }
    Object.defineProperty(ApplicationError.prototype, "message", {
        get: function () {
            return this._message;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationError.prototype, "name", {
        get: function () {
            return "ApplicationError";
        },
        enumerable: true,
        configurable: true
    });
    return ApplicationError;
})();
exports.ApplicationError = ApplicationError;

//# sourceMappingURL=ApplicationError.js.map
