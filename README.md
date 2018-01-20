# Green-Lantern

[![Travis](https://img.shields.io/travis/hozuki/green-lantern.svg)](https://travis-ci.org/hozuki/GLantern)
[![npm](https://img.shields.io/npm/v/glantern.svg)](https://npmjs.com/package/glantern)

GLantern is a library intended for a Flash-HTML5 shim layer. Enjoy the live preview
from <http://hozuki.github.io/green-lantern>.

Screenshots of test cases can be found [here](res/images).

## Acquiring the Source

Native `git` is highly recommended against other clients:

```bash
git clone https://github.com/hozuki/GLantern.git
```

Or, as an [NPM package](//npmjs.com/package/glantern), you can install it via `npm`:

```bash
npm install glantern --save
```

## Building from the Source

Make sure you have Node.js and NPM installed. The rest is quite simple:

```bash
cd GLantern
npm install
gulp build
```

After building, you will find:

- a `build/node` directory for NW.js and Electron;
- a `build/GLantern-browser.js` file as the full, concatenated JavaScript file for browsers;
- a `build/GLantern-browser.min.js` (and corresponding source mapping) for browsers, as the
minimized file for a better loading speed.

## Using the Library

See the demo page at `test/visual/index.html`. You will need an environment with WebGL, like
modern browsers, [NW.js](http://nwjs.io/), or [Electron](http://electron.atom.io/).

### Importing into Your Project

GLantern supports two styles of importing.

The first one is importing by `<script>` tag. Use its `src` attribute and point it to the compiled result:

```html
<script type="text/javascript" src="GLantern-browser.min.js"></script>
```

In environments that support Node.js, like NW.js or Electron, you can also use the `require` syntax:

```javascript
const GLantern = require("glantern");
```

After importing with either the former or the latter style, the `GLantern` object is globally available.

### Using Exported Members

The package structure of Flash is preserved in GLantern, so adding a `GLantern.` prefix usually
works. If you want to make it more like ActionScript, GLantern provides a `injectToGlobal()` function
to inject the "packages" to the global scope.

```javascript
// Check if GLantern is supported
if (GLantern.isSupported()) {
    const lantern = new GLantern.EngineBase();
    const canvas = document.createElement("canvas");
    lantern.initialize(canvas, 682, 438);
    document.body.appendChild(lantern.view);
    window.addEventListener("unload", function () {
        lantern.dispose();
    });
    draw(true, this);
} else {
    const prompt = document.createElement("span");
    prompt.textContent = "Oops, GLantern is not supported on your browser.";
    document.body.appendChild(prompt);
}

/**
* Draws a rectangle.
*/
function draw() {
    function createShape(alpha) {
        const s = new GLantern.flash.display.Shape(lantern.stage, lantern.stage);
        lantern.stage.addChild(s);
        s.alpha = alpha;
        return s;
    }
    const shape1 = createShape(1);
    shape1.graphics.beginFill(0xffffff);
    shape1.graphics.drawRect(0, 0, 540, 383);
    shape1.graphics.endFill();
}
```

## Q&A

See [QA.md](QA.md).

## License

[The MIT License](//mitlicense.org)

You will also find a copy in [`LICENSE.md`](LICENSE.md).

## Other Resources

- Adobe Flash CC is able to export Flash project as WebGL projects. The tutorial and
restrictions can be found [here](https://helpx.adobe.com/flash/using/creating-publishing-webgl-document.html).
However, it has recently be announced that [Flash is replaced by Animate](http://blogs.adobe.com/flashpro/welcome-adobe-animate-cc-a-new-era-for-flash-professional/).
So fellas, you may want to give a warm welcome to that new solution.
- Mozilla has started a project, [Shumway](https://wiki.mozilla.org/Shumway), which is intended to
provide Flash-like support by using HTML 5 features on Firefox.

## Credits

Part of Green-Lantern uses modifications based on [`webgl-utils.js`](//github.com/KhronosGroup/WebGL/blob/master/sdk/demos/common/webgl-utils.js). Its license file
can be found [here](docs/license/webgl-utils.txt).

Part of Green-Lantern uses modifications based on [`AwayJS.Core.geom`](//github.com/awayjs/core/blob/master/lib/geom/). Its license file can be found
[here](docs/license/awayjs-core.txt).

Part of Green-Lantern uses adaptations from [Anti-Grain Geometry](https://sourceforge.net/projects/agg/),
originally by Maxim Shemanarev in C++. Its license file can be found [here](docs/license/agg.txt).
