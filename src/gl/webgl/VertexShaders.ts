/**
 * Created by MIC on 2015/11/18.
 */

interface VertexShadersObject {
    buffered?: string;
    blurX?: string;
    blurY?: string;
    primitive?: string;
    replicate?: string;
    fxaa?: string;
    blur2?: string;
    copyImage?: string;
    primitive2?: string;
}

const VertexShaders: VertexShadersObject = Object.create(null);

export default VertexShaders;

VertexShaders.buffered = `
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uProjectionMatrix;

varying vec2 vTextureCoord;

void main() {
   gl_Position = uProjectionMatrix * vec4(aVertexPosition.xyz, 1.0);
   vTextureCoord = aTextureCoord;
}`;

VertexShaders.blurX = `
precision mediump float;

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform float uStrength;
uniform mat4 uProjectionMatrix;

varying vec2 vTextureCoord;
varying vec2 vBlurTexCoords[6];

void main()
{
    gl_Position = uProjectionMatrix * vec4(aVertexPosition.xyz, 1.0);
    vTextureCoord = aTextureCoord;

    vBlurTexCoords[0] = aTextureCoord + vec2(-0.012 * uStrength, 0.0);
    vBlurTexCoords[1] = aTextureCoord + vec2(-0.008 * uStrength, 0.0);
    vBlurTexCoords[2] = aTextureCoord + vec2(-0.004 * uStrength, 0.0);
    vBlurTexCoords[3] = aTextureCoord + vec2( 0.004 * uStrength, 0.0);
    vBlurTexCoords[4] = aTextureCoord + vec2( 0.008 * uStrength, 0.0);
    vBlurTexCoords[5] = aTextureCoord + vec2( 0.012 * uStrength, 0.0);
}`;

VertexShaders.blurY = `
precision mediump float;

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform float uStrength;
uniform mat4 uProjectionMatrix;

varying vec2 vTextureCoord;
varying vec2 vBlurTexCoords[6];

void main()
{
    gl_Position = uProjectionMatrix * vec4(aVertexPosition.xyz, 1.0);
    vTextureCoord = aTextureCoord;

    vBlurTexCoords[0] = aTextureCoord + vec2(0.0, -0.012 * uStrength);
    vBlurTexCoords[1] = aTextureCoord + vec2(0.0, -0.008 * uStrength);
    vBlurTexCoords[2] = aTextureCoord + vec2(0.0, -0.004 * uStrength);
    vBlurTexCoords[3] = aTextureCoord + vec2(0.0,  0.004 * uStrength);
    vBlurTexCoords[4] = aTextureCoord + vec2(0.0,  0.008 * uStrength);
    vBlurTexCoords[5] = aTextureCoord + vec2(0.0,  0.012 * uStrength);
}`;

VertexShaders.primitive = `
precision mediump float;

attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uProjectionMatrix;
uniform mat4 uTransformMatrix;

varying vec4 vVertexColor;

void main() {
   gl_Position = uProjectionMatrix * uTransformMatrix * vec4(aVertexPosition.xy, 0.0, 1.0);
   vVertexColor = aVertexColor;
}`;

VertexShaders.replicate = `
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uProjectionMatrix;
uniform vec2 uOriginalSize;
uniform vec2 uFitSize;
uniform bool uFlipX;
uniform bool uFlipY;

varying vec2 vTextureCoord;

void main() {
    vec3 newVertexPostion = aVertexPosition;
   vec2 newTextureCoord = aTextureCoord;
   if (uFlipX) {
       newTextureCoord.x = 1.0 - newTextureCoord.x;
       newVertexPostion.x -= (uFitSize - uOriginalSize).x;
   }
   if (uFlipY) {
       newTextureCoord.y = 1.0 - newTextureCoord.y;
       newVertexPostion.y -= (uFitSize - uOriginalSize).y;
   }
   gl_Position = uProjectionMatrix * vec4(newVertexPostion.xyz, 1.0);
   vTextureCoord = newTextureCoord;
}`;

// For the full license, please refer to shaders/glsl/fxaa.vert
VertexShaders.fxaa = `
precision mediump float;

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uProjectionMatrix;
uniform vec2 uResolution;

varying vec2 vTextureCoord;
varying vec2 vResolution;

varying vec2 v_rgbNW;
varying vec2 v_rgbNE;
varying vec2 v_rgbSW;
varying vec2 v_rgbSE;
varying vec2 v_rgbM;

void texcoords(vec2 fragCoord, vec2 resolution,
   out vec2 v_rgbNW, out vec2 v_rgbNE,
   out vec2 v_rgbSW, out vec2 v_rgbSE,
   out vec2 v_rgbM) {
   vec2 inverseVP = 1.0 / resolution.xy;
   v_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;
   v_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;
   v_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;
   v_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;
   v_rgbM = vec2(fragCoord * inverseVP);
}

void main() {
   gl_Position = uProjectionMatrix * vec4(aVertexPosition, 1.0);
   vTextureCoord = aTextureCoord;
   vResolution = uResolution;

   texcoords(aTextureCoord * uResolution, uResolution, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);
}`;

VertexShaders.blur2 = `
precision mediump float;

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uProjectionMatrix;

varying vec2 vTextureCoord;

void main()
{
    gl_Position = uProjectionMatrix * vec4(aVertexPosition.xyz, 1.0);
    vTextureCoord = aTextureCoord;
}`;

VertexShaders.copyImage = `
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uProjectionMatrix;
uniform mat4 uTransformMatrix;
uniform vec2 uOriginalSize;
uniform vec2 uFitSize;
uniform bool uFlipX;
uniform bool uFlipY;

varying vec2 vTextureCoord;

void main() {
    vec3 newVertexPostion = aVertexPosition;
    vec2 newTextureCoord = aTextureCoord;
    if (uFlipX) {
        newTextureCoord.x = 1.0 - newTextureCoord.x;
        newVertexPostion.x -= (uFitSize - uOriginalSize).x;
    }
    if (uFlipY) {
        newTextureCoord.y = 1.0 - newTextureCoord.y;
        newVertexPostion.y -= (uFitSize - uOriginalSize).y;
    }
    gl_Position = uProjectionMatrix * uTransformMatrix * vec4(newVertexPostion.xyz, 1.0);
    vTextureCoord = newTextureCoord;
}`;

VertexShaders.primitive2 = `
precision mediump float;

attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uProjectionMatrix;
uniform mat4 uTransformMatrix;
uniform vec2 uOriginalSize;
uniform bool uFlipX;
uniform bool uFlipY;

varying vec4 vVertexColor;

void main() {
    vec3 newVertexPostion = aVertexPosition;
    if (uFlipX) {
        newVertexPostion.x = uOriginalSize.x - newVertexPostion.x;
    }
    if (uFlipY) {
        newVertexPostion.y = uOriginalSize.y - newVertexPostion.y;
    }
    gl_Position = uProjectionMatrix * uTransformMatrix * vec4(newVertexPostion.xy, 0.0, 1.0);
    vVertexColor = aVertexColor;
}`;
