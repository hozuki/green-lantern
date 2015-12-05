# GLantern

GLantern is a graphics library based on WebGL, providing a subset of
[Flash](http://www.adobe.com/software/flash/about/)-like API.

## Acquiring the Source

The repository is on [GitHub](http://github.com/Hozuki/GLantern/). You may want to use fine-tuned
[GitHub Desktop](//desktop.github.com/) (for Windows and Mac users), or `git` (for every OS) to
clone it into your computer:

```plain
git clone https://github.com/Hozuki/GLantern.git /preferred/cloning/destination
```

## Building from the Source

Make sure you have Node.js and NPM installed. The rest is quite simple:

```plain
cd /path/to/GLantern/
npm install
gulp build
```

## Using the Library

See the demo page at `test/visual/index.html`. You will need an environment with WebGL, like
modern browsers, [NW.js](http://nwjs.io/), or [Electron](http://electron.atom.io/).

## API References

<del>See [Wiki](//github.com/Hozuki/GLantern/wiki/).</del> (Not written yet.)

Visit the [ActionScript 3 API Reference](http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/) instead.

## Q&A

### Why named "GLantern"?

To remark the relationship between the Green Lantern and the Flash (both from DC Comics).

`GLantern` is also a mocking of frequently used naming style in OpenGL, e.g. `GLenum`.
Not `GL_ENUM` but `GLenum`, weird, isn't it?

### Why isn't there any `module`?

I can't use them as C# namespaces, so I have to place them all in the root scope, and `require()`
them when needed. To generate a `.d.ts` definition, please do it yourself.

I had tried the syntax shown below:

```typescript
// ------- in Export.ts
export module Module {
    export default class Export {
        field:number = 0;
    }
}

// ------- in Import.ts
import Export from "./Export";

export module Module {
    export default class Import {
        static useSomeExports(exp:Export):void {
            console.log(exp);
        }
    }
}
```

However, the compiler emitted lumps of error messages (due to large number of classes).
I could not stand it anymore. Also, `interface`s and `enum`s can't be modified by `export default`.
`enum`s can be overcomed using a trick (`export default SomeEnum;`), but `interface`s are hopeless
because of the ES6 standard and the implementation of TypeScript compiler.

As a conclusion, currently the best practice is to use some sort of manual indexing, like what
I did in this repo, a module-like organization and `export` approach, based on directories. Please
refer to the `index.ts` in each directory to see how it works.

## Other Resources

- Adobe Flash CC is able to export Flash project as WebGL projects. The tutorial and
restrictions can be found [here](https://helpx.adobe.com/flash/using/creating-publishing-webgl-document.html).
However, it has recently be announced that [Flash is replaced by Animate](http://blogs.adobe.com/flashpro/welcome-adobe-animate-cc-a-new-era-for-flash-professional/).
So fellas, you may want to give a warm welcome to that new solution.
- Mozilla has started a project, [Shumway](https://wiki.mozilla.org/Shumway), which is intended to
provide Flash-like support by using HTML 5 features on Firefox.
