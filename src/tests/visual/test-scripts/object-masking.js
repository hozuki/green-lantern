"use strict";

(function () {
    var circleShape = Display.createShape();
    var circleGraphics = circleShape.graphics;
    // The color doesn't matter.
    circleGraphics.beginFill(0x0000ff);
    circleGraphics.drawCircle(200, 160, 180);
    circleGraphics.endFill();
    var boxShape1 = Display.createShape();
    var boxGraphics1 = boxShape1.graphics;
    boxGraphics1.lineStyle(3, 0xff0000);
    boxGraphics1.beginFill(0xffff00);
    boxGraphics1.drawRect(0, 0, 200, 200);
    boxGraphics1.endFill();
    boxShape1.mask = circleShape;

    var textField = Display.createText();
    textField.x = 350;
    textField.y = 60;
    textField.text = "Elon 'Mask'";
    textField.defaultTextFormat.size = 30;
    textField.textColor = 0xff00ff;
    var boxShape2 = Display.createShape();
    var boxGraphics2 = boxShape2.graphics;
    boxGraphics2.lineStyle(10, 0x00ff00);
    boxGraphics2.beginFill(0xffffff);
    boxGraphics2.drawRect(250, 0, 200, 200);
    boxGraphics2.endFill();
    boxShape2.mask = textField;

    lantern.runOneFrame();

    var alpha = 1;
    var direction = -1;
    var handle = window.setInterval(function () {
        alpha += 0.05 * direction;
        if (alpha >= 1) {
            direction = -1;
        } else if (alpha <= 0) {
            direction = 1;
        }
        boxShape1.alpha = boxShape2.alpha = alpha;
        lantern.runOneFrame();
    }, 40);
    window.addEventListener("beforeunload", function () {
        window.clearInterval(handle);
    });
})();
