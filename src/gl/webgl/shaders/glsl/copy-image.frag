
precision mediump float;

uniform sampler2D uSampler;
uniform sampler2D uAlpha;

varying vec2 vTextureCoord;

void main() {
    gl_FragColor = texture2D(uSampler, vTextureCoord) * uAlpha;
}
