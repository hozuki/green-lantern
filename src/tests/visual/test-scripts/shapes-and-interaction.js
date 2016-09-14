GLantern.injectToGlobal(window);

var s = new flash.display.Shape(lantern.stage, lantern.stage);
lantern.stage.addChild(s);
var g = s.graphics;

g.lineStyle(6, 0xff0000);
g.beginFill(0x00ff00, 0.8);
g.drawRect(0, 0, 200, 200);
g.endFill();
g.drawCircle(50, 50, 70);

document.body.addEventListener("mousedown",
    /**
     * @param ev {MouseEvent}
     */
    function (ev) {
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
    function (ev) {
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

var added = 0;

lantern.runOneFrame();

function addNewShape(a) {
    var s = new flash.display.Shape(lantern.stage, lantern.stage);
    lantern.stage.addChild(s);
    var g = s.graphics;

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
