
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
}
