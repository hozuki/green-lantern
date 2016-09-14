/**
 * Created by MIC on 2016/9/14.
 */

var Display = Object.create({
    /**
     * @param [alpha] {Number}
     * @returns {TextField}
     */
    "createText": function (alpha) {
        if (alpha === void(0)) {
            alpha = 1;
        }
        var s = new GLantern.flash.text.TextField(lantern.stage, lantern.stage);
        lantern.stage.addChild(s);
        s.alpha = alpha;
        return s;
    },
    /**
     * @param [alpha] {Number}
     * @returns {Shape}
     */
    "createShape": function (alpha) {
        if (alpha === void(0)) {
            alpha = 1;
        }
        var s = new GLantern.flash.display.Shape(lantern.stage, lantern.stage);
        lantern.stage.addChild(s);
        s.alpha = alpha;
        return s;
    },
    "createGlowFilter": function (a, b, c, d, e, f, g) {
        return new GLantern.flash.filters.GlowFilter(lantern.renderer.shaderManager, a, b, c, d, e, f, g);
    },
    "createBlurFilter": function (a, b) {
        return new GLantern.flash.filters.BlurFilter(lantern.renderer.shaderManager, a, b);
        //var filter = new GLantern.webgl.filters.Blur2Filter(lantern.renderer.shaderManager);
        //var filter = new GLantern.webgl.filters.BlurFilter(lantern.renderer.shaderManager);
        //filter.strengthX = a;
        //filter.strengthY = b;
        //return filter;
    }
});
