/**
 * Created by MIC on 2015/12/23.
 */
var TextLineMetrics = (function () {
    function TextLineMetrics(x, width, height, ascent, descent, leading) {
        this.ascent = 0;
        this.descent = 0;
        this.height = 0;
        this.leading = 0;
        this.width = 0;
        this.x = 0;
        this.x = x;
        this.width = width;
        this.height = height;
        this.ascent = ascent;
        this.descent = descent;
        this.leading = leading;
    }
    return TextLineMetrics;
})();
exports.TextLineMetrics = TextLineMetrics;

//# sourceMappingURL=TextLineMetrics.js.map
