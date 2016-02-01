# Q&A

## Why named "GLantern"?

To remark the relationship between the Green Lantern and the Flash (both from DC Comics).

`GLantern` is also a mocking of frequently used naming style in OpenGL, e.g. `GLenum`.
Not `GL_ENUM` but `GLenum`, weird, isn't it?

## Why aren't there any `module`s?

Using `module`s is a good approach on playing with TypeScript. But `modules` are designed to be
in one big file and I can't use them as C# namespaces, so I have to place them all in the root
scope, and `require()` them when needed. To generate a `.d.ts` definition, please do it yourself.
Currently a hand-written definition can be found at [`build/glantern.d.ts`](bulid/glantern.d.ts).

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

But the compiler emitted lumps of error messages due to large number of classes.
I could not stand it anymore. Also, `interface`s and `enum`s can't be modified by `export default`.
`enum`s can be overcome using a trick (`export default SomeEnum;`), but `interface`s are hopeless
because of the ES6 standard and the implementation of TypeScript compiler.

As a conclusion, currently the best practice is to use some sort of manual indexing, like what
I did in this repo, a module-like organization and `export` approach, based on directories. Please
refer to the `index.ts` in each directory to see how it works.