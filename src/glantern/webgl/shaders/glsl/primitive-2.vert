
precision mediump float;

attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uProjectionMatrix;
uniform mat4 uTransformMatrix;
uniform vec2 uOriginalSize;
uniform vec2 uFitSize;
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
    gl_Position = uProjectionMatrix * uTransformMatrix * vec4(newVertexPostion.xyz, 1.0);
    vVertexColor = aVertexColor;
}
