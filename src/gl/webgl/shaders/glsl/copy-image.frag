
precision mediump float;

uniform sampler2D uSampler;
uniform float uAlpha;
uniform bool uHollow;

varying vec2 vTextureCoord;

void main() {
    vec4 finalColor = texture2D(uSampler, vTextureCoord) * uAlpha;
    if (uHollow && finalColor.a == 0.0) {
        discard;
    } else {
        gl_FragColor = finalColor;
    }
}
