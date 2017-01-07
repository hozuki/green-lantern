"use strict";

(() => {
    const circleShape = Display.createShape();
    const circleGraphics = circleShape.graphics;
    // The color doesn't matter.
    circleGraphics.beginFill(0x0000ff);
    circleGraphics.drawCircle(200, 160, 180);
    circleGraphics.endFill();
    const boxShape1 = Display.createShape();
    const boxGraphics1 = boxShape1.graphics;
    boxGraphics1.lineStyle(3, 0xff0000);
    boxGraphics1.beginFill(0xffff00);
    boxGraphics1.drawRect(0, 0, 200, 200);
    boxGraphics1.endFill();
    boxShape1.mask = circleShape;

    const textField = Display.createText();
    textField.x = 350;
    textField.y = 60;
    textField.text = "Elon 'Mask'";
    textField.defaultTextFormat.size = 30;
    textField.textColor = 0xff00ff;
    const boxShape2 = Display.createShape();
    const boxGraphics2 = boxShape2.graphics;
    boxGraphics2.lineStyle(10, 0x00ff00);
    boxGraphics2.beginFill(0xffffff);
    boxGraphics2.drawRect(250, 0, 200, 200);
    boxGraphics2.endFill();
    boxShape2.mask = textField;

    lantern.runOneFrame();

    let alpha = 1;
    let direction = -1;
    const handle = window.setInterval(() => {
        alpha += 0.05 * direction;
        if (alpha >= 1) {
            direction = -1;
        } else if (alpha <= 0) {
            direction = 1;
        }
        boxShape1.alpha = boxShape2.alpha = alpha;
        lantern.runOneFrame();
    }, 40);
    window.addEventListener("beforeunload", () => {
        window.clearInterval(handle);
    });
})();
