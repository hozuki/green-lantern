var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventDispatcher_1 = require("../events/EventDispatcher");
/**
 * Created by MIC on 2016/1/7.
 */
var Sound = (function (_super) {
    __extends(Sound, _super);
    function Sound() {
        _super.apply(this, arguments);
    }
    return Sound;
})(EventDispatcher_1.EventDispatcher);
exports.Sound = Sound;

//# sourceMappingURL=Sound.js.map
