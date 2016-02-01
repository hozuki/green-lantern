
precision mediump float;

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uProjectionMatrix;

varying vec2 vTextureCoord;

void main()
{
    gl_Position = uProjectionMatrix * vec4(aVertexPosition.xyz, 1.0);
    vTextureCoord = aTextureCoord;
}
