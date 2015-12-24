/**
 * Created by MIC on 2015/11/18.
 */

/*
 import * as fs from "fs";

 var Locations = {
 "buffered": "./src/webgl/shaders/glsl/buffered.frag",
 "blur": "./src/webgl/shaders/glsl/blur.frag",
 "primitive": "./src/webgl/shaders/glsl/primitive.frag",
 "colorTransform": "./src/webgl/shaders/glsl/color-transform.frag",
 "fxaa": "./src/webgl/shaders/glsl/fxaa.frag"
 };

 var encoding:string = "utf-8";

 var Values = {
 "buffered": fs.readFileSync(Locations.buffered, encoding),
 "blur": fs.readFileSync(Locations.blur, encoding),
 "primitive": fs.readFileSync(Locations.primitive, encoding),
 "colorTransform": fs.readFileSync(Locations.colorTransform, encoding),
 "fxaa": fs.readFileSync(Locations.fxaa, encoding)
 };
 */

interface FragmentShadersObject {
    buffered?:string;
    blur?:string;
    primitive?:string;
    colorTransform?:string;
    fxaa?:string;
    blur2?:string;
    copyImage?:string;
}

var Values:FragmentShadersObject = {};

export abstract class FragmentShaders {

    static get buffered():string {
        return Values.buffered;
    }

    static get blur():string {
        return Values.blur;
    }

    static get primitive():string {
        return Values.primitive;
    }

    static get colorTransform():string {
        return Values.colorTransform;
    }

    static get fxaa():string {
        return Values.fxaa;
    }

    static get blur2():string {
        return Values.blur2;
    }

    static get copyImage():string {
        return Values.copyImage;
    }

}

Values.buffered = [
    "precision mediump float;",
    "",
    "uniform sampler2D uSampler;",
    "",
    "varying vec2 vTextureCoord;",
    "",
    "void main() {",
    "    gl_FragColor = texture2D(uSampler, vTextureCoord);",
    "}"
].join("\n");

Values.blur = [
    "precision lowp float;",
    "",
    "varying vec2 vTextureCoord;",
    "varying vec2 vBlurTexCoords[6];",
    "",
    "uniform sampler2D uSampler;",
    "",
    "void main()",
    "{",
    "   gl_FragColor = vec4(0.0);",
    "   ",
    "   gl_FragColor += texture2D(uSampler, vBlurTexCoords[0]) * 0.004431848411938341;",
    "   gl_FragColor += texture2D(uSampler, vBlurTexCoords[1]) * 0.05399096651318985;",
    "   gl_FragColor += texture2D(uSampler, vBlurTexCoords[2]) * 0.2419707245191454;",
    "   gl_FragColor += texture2D(uSampler, vTextureCoord    ) * 0.3989422804014327;",
    "   gl_FragColor += texture2D(uSampler, vBlurTexCoords[3]) * 0.2419707245191454;",
    "   gl_FragColor += texture2D(uSampler, vBlurTexCoords[4]) * 0.05399096651318985;",
    "   gl_FragColor += texture2D(uSampler, vBlurTexCoords[5]) * 0.004431848411938341;",
    "}"
].join("\n");

Values.primitive = [
    "precision mediump float;",
    "",
    "uniform float uAlpha;",
    "",
    "varying vec4 vVertexColor;",
    "",
    "void main() {",
    "   gl_FragColor = vVertexColor * uAlpha;",
    "}"
].join("\n");

Values.colorTransform = [
    "precision mediump float;",
    "",
    "varying vec2 vTextureCoord;",
    "uniform sampler2D uSampler;",
    "uniform float uColorMatrix[25];",
    "",
    "void main(void)",
    "{",
    "   vec4 c = texture2D(uSampler, vTextureCoord);",
    "   ",
    "   gl_FragColor.r =  (uColorMatrix[0] * c.r);",
    "   gl_FragColor.r += (uColorMatrix[1] * c.g);",
    "   gl_FragColor.r += (uColorMatrix[2] * c.b);",
    "   gl_FragColor.r += (uColorMatrix[3] * c.a);",
    "   gl_FragColor.r +=  uColorMatrix[4];",
    "   ",
    "   gl_FragColor.g =  (uColorMatrix[5] * c.r);",
    "   gl_FragColor.g += (uColorMatrix[6] * c.g);",
    "   gl_FragColor.g += (uColorMatrix[7] * c.b);",
    "   gl_FragColor.g += (uColorMatrix[8] * c.a);",
    "   gl_FragColor.g +=  uColorMatrix[9];",
    "   ",
    "   gl_FragColor.b =  (uColorMatrix[10] * c.r);",
    "   gl_FragColor.b += (uColorMatrix[11] * c.g);",
    "   gl_FragColor.b += (uColorMatrix[12] * c.b);",
    "   gl_FragColor.b += (uColorMatrix[13] * c.a);",
    "   gl_FragColor.b +=  uColorMatrix[14];",
    "   ",
    "   gl_FragColor.a =  (uColorMatrix[15] * c.r);",
    "   gl_FragColor.a += (uColorMatrix[16] * c.g);",
    "   gl_FragColor.a += (uColorMatrix[17] * c.b);",
    "   gl_FragColor.a += (uColorMatrix[18] * c.a);",
    "   gl_FragColor.a +=  uColorMatrix[19];",
    "}"
].join("\n");

// For the full license, please refer to shaders/glsl/fxaa.frag
Values.fxaa = [
    "precision lowp float;",
    "",
    "#ifndef FXAA_REDUCE_MIN",
    "#define FXAA_REDUCE_MIN   (1.0/ 128.0)",
    "#endif",
    "#ifndef FXAA_REDUCE_MUL",
    "#define FXAA_REDUCE_MUL   (1.0 / 8.0)",
    "#endif",
    "#ifndef FXAA_SPAN_MAX",
    "#define FXAA_SPAN_MAX     8.0",
    "#endif",
    "",
    "vec4 fxaa(sampler2D tex, vec2 fragCoord, vec2 resolution,",
    "vec2 v_rgbNW, vec2 v_rgbNE,",
    "vec2 v_rgbSW, vec2 v_rgbSE,",
    "vec2 v_rgbM) {",
    "vec4 color;",
    "mediump vec2 inverseVP = vec2(1.0 / resolution.x, 1.0 / resolution.y);",
    "vec3 rgbNW = texture2D(tex, v_rgbNW).xyz;",
    "vec3 rgbNE = texture2D(tex, v_rgbNE).xyz;",
    "vec3 rgbSW = texture2D(tex, v_rgbSW).xyz;",
    "vec3 rgbSE = texture2D(tex, v_rgbSE).xyz;",
    "vec4 texColor = texture2D(tex, v_rgbM);",
    "vec3 rgbM  = texColor.xyz;",
    "vec3 luma = vec3(0.299, 0.587, 0.114);",
    "float lumaNW = dot(rgbNW, luma);",
    "float lumaNE = dot(rgbNE, luma);",
    "float lumaSW = dot(rgbSW, luma);",
    "float lumaSE = dot(rgbSE, luma);",
    "float lumaM  = dot(rgbM,  luma);",
    "float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));",
    "float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));",
    "",
    "mediump vec2 dir;",
    "dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));",
    "dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));",
    "",
    "float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *",
    "    (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);",
    "",
    "float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);",
    "dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),",
    "        max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),",
    "            dir * rcpDirMin)) * inverseVP;",
    "",
    "vec3 rgbA = 0.5 * (",
    "    texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +",
    "    texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);",
    "vec3 rgbB = rgbA * 0.5 + 0.25 * (",
    "    texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +",
    "    texture2D(tex, fragCoord * inverseVP + dir * 0.5).xyz);",
    "",
    "float lumaB = dot(rgbB, luma);",
    "if ((lumaB < lumaMin) || (lumaB > lumaMax))",
    "    color = vec4(rgbA, texColor.a);",
    "else",
    "    color = vec4(rgbB, texColor.a);",
    "return color;",
    "}",
    "",
    "varying vec2 vTextureCoord;",
    "varying vec2 vResolution;",
    "",
    "varying vec2 v_rgbNW;",
    "varying vec2 v_rgbNE;",
    "varying vec2 v_rgbSW;",
    "varying vec2 v_rgbSE;",
    "varying vec2 v_rgbM;",
    "",
    "uniform sampler2D uSampler;",
    "",
    "void main() {",
    "    gl_FragColor = fxaa(uSampler, vTextureCoord * vResolution, vResolution, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);",
    "}"
].join("\n");

Values.blur2 = [
    "precision lowp float;",
    "",
    "uniform sampler2D uSampler;",
    "",
    "uniform float uResolution;",
    "uniform float uStrength;",
    "uniform vec2 uBlurDirection;",
    "",
    "varying vec2 vTextureCoord;",
    "",
    "float offset[3];",
    "float weight[3];",
    "",
    "void main()",
    "{",
    "    offset[0] = 0.0; offset[1] = 1.3846153846; offset[2] = 3.2307692308;",
    "    weight[0] = 0.2270270270; weight[1] = 0.3162162162; weight[2] = 0.0702702703;",
    "    gl_FragColor = texture2D(uSampler, vec2(vTextureCoord)) * weight[0];",
    "    float xDir = uBlurDirection.x / sqrt(uBlurDirection.x * uBlurDirection.x + uBlurDirection.y * uBlurDirection.y);",
    "    float yDir = uBlurDirection.y / sqrt(uBlurDirection.x * uBlurDirection.x + uBlurDirection.y * uBlurDirection.y);",
    "    for (int i = 1; i < 3; i++)",
    "    {",
    "        gl_FragColor += texture2D(uSampler, (vec2(vTextureCoord) + vec2(offset[i] * xDir, offset[i] * yDir) * uStrength / uResolution)) * weight[i];",
    "        gl_FragColor += texture2D(uSampler, (vec2(vTextureCoord) - vec2(offset[i] * xDir, offset[i] * yDir) * uStrength / uResolution)) * weight[i];",
    "    }",
    "}"
].join("\n");

Values.copyImage = [
    "precision mediump float;",
    "",
    "uniform sampler2D uSampler;",
    "uniform float uAlpha;",
    "",
    "varying vec2 vTextureCoord;",
    "",
    "void main() {",
    "    gl_FragColor = texture2D(uSampler, vTextureCoord) * uAlpha;",
    "}"
].join("\n");
