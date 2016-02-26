
precision mediump float;

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform float uStrength;
uniform mat4 uProjectionMatrix;
uniform float uImageHeight;

varying vec2 vTextureCoord;
varying vec2 vBlurTexCoords[6];

void main()
{
    gl_Position = uProjectionMatrix * vec4(aVertexPosition.xyz, 1.0);
    vTextureCoord = aTextureCoord;

    vBlurTexCoords[0] = aTextureCoord + vec2(0.0, -0.012 * uStrength) / uImageHeight;
    vBlurTexCoords[1] = aTextureCoord + vec2(0.0, -0.008 * uStrength) / uImageHeight;
    vBlurTexCoords[2] = aTextureCoord + vec2(0.0, -0.004 * uStrength) / uImageHeight;
    vBlurTexCoords[3] = aTextureCoord + vec2(0.0,  0.004 * uStrength) / uImageHeight;
    vBlurTexCoords[4] = aTextureCoord + vec2(0.0,  0.008 * uStrength) / uImageHeight;
    vBlurTexCoords[5] = aTextureCoord + vec2(0.0,  0.012 * uStrength) / uImageHeight;
}
