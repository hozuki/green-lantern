"use strict";

(() => {
    const s = Display.createShape();
    const g = s.graphics;

    g.lineStyle(6, 0xff0000);
    g.beginFill(0x00ff00, 0.8);
    g.drawRect(0, 0, 200, 200);
    g.endFill();
    g.drawCircle(50, 50, 70);

    let added = 0;

    const canvas = document.querySelector("canvas");
    canvas.addEventListener("mousedown",
        /**
         * @param ev {MouseEvent}
         */
        (ev) => {
            s.x += (ev.button === 0 ? 1 : -1) * 10;
            if (added < 2) {
                addNewShape(added);
                added++;
            }
            lantern.runOneFrame();
        });

    document.body.addEventListener("keydown",
        /**
         * @param ev {KeyboardEvent}
         */
        (ev) => {
            switch (ev.keyCode) {
                case "w".charCodeAt(0):
                case "W".charCodeAt(0):
                    s.alpha += 0.1;
                    break;
                case "s".charCodeAt(0):
                case "S".charCodeAt(0):
                    s.alpha -= 0.1;
                    break;
            }
            lantern.runOneFrame();
        });

    lantern.runOneFrame();

    function addNewShape(a) {
        const s = Display.createShape();
        const g = s.graphics;
        switch (a) {
            case 0:
                g.lineStyle(0);
                g.beginFill(0xffffff, 0.6);
                g.drawRect(0, 0, 500, 500);
                g.endFill();
                g.lineStyle(2, 0x0000ff);
                g.beginFill(0xff0000, 0.7);
                g.drawRect(150, 150, 250, 250);
                g.endFill();
                g.drawCircle(120, 120, 30);
                break;
            case 1:
                g.lineStyle(1, 0xffffff);
                g.drawCircle(120, 120, 30);
                break;
            default:
                break;
        }
    }
})();
