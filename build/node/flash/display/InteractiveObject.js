/**
 * Created by MIC on 2015/11/18.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DisplayObject_1 = require("./DisplayObject");
var InteractiveObject = (function (_super) {
    __extends(InteractiveObject, _super);
    function InteractiveObject(root, parent) {
        _super.call(this, root, parent);
        this.doubleClickEnabled = true;
        this.focusRect = true;
        this.mouseEnabled = true;
        this.needsSoftKeyboard = false;
        this.tabEnabled = true;
        this.tabIndex = -1;
    }
    return InteractiveObject;
})(DisplayObject_1.DisplayObject);
exports.InteractiveObject = InteractiveObject;

//# sourceMappingURL=InteractiveObject.js.map
