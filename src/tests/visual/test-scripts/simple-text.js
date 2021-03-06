/**
 * Created by MIC on 2015/12/23.
 */

"use strict";

(() => {
    const t = Display.createText(1);
    //t.text = "Hello\nWorld"; // Multiline is not supported in 0.2.0-alpha, so the text will be in one line.
    t.text = "the quick brown fox jumps over the lazy dog";
    t.defaultTextFormat.font = "Comic Sans MS";
    t.defaultTextFormat.size = 20;
    t.textColor = 0x0000ff;
    t.background = true;
    t.backgroundColor = 0xffffff;
    t.border = true;
    t.borderColor = 0xff0000;
    t.thickness = 1;
    t.customOutlineEnabled = true;
    t.textOutlineColor = 0x550055;

    lantern.runOneFrame();

    const canvas = document.querySelector("canvas");
    canvas.addEventListener("mousedown",
        /**
         * @param ev {MouseEvent}
         */
        (ev) => {
            // Click left/right mouse button to enlarge/shrink font.
            if (ev.button === 0) {
                if (t.defaultTextFormat.size <= 150) {
                    t.x += 10;
                    t.defaultTextFormat.size += 4;
                }
            } else {
                if (t.defaultTextFormat.size >= 9) {
                    t.x -= 10;
                    t.defaultTextFormat.size -= 4;
                }
            }
            lantern.runOneFrame();
        });
})();
