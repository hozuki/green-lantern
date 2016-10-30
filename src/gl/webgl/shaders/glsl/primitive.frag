
precision mediump float;

uniform float uAlpha;
uniform bool uHollow;

varying vec4 vVertexColor;

void main() {
    vec4 finalColor = vVertexColor * uAlpha;
    if (uHollow && finalColor.a == 0.0) {
        discard;
    } else {
        gl_FragColor = finalColor;
    }
}
