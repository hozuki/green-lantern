
precision lowp float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform float uResolution;
uniform float uStrength;
uniform vec2 uBlurDirection;
uniform bool uHollow;

float offset[3];
float weight[3];

void main()
{
    offset[0] = 0.0; offset[1] = 1.3846153846; offset[2] = 3.2307692308;
    weight[0] = 0.2270270270; weight[1] = 0.3162162162; weight[2] = 0.0702702703;
    vec4 finalColor = texture2D(uSampler, vec2(vTextureCoord)) * weight[0];
    float xDir = uBlurDirection.x / sqrt(uBlurDirection.x * uBlurDirection.x + uBlurDirection.y * uBlurDirection.y);
    float yDir = uBlurDirection.y / sqrt(uBlurDirection.x * uBlurDirection.x + uBlurDirection.y * uBlurDirection.y);
    for (int i = 1; i < 3; i++) {
        finalColor += texture2D(uSampler, (vec2(vTextureCoord) + vec2(offset[i] * xDir, offset[i] * yDir) * uStrength / uResolution)) * weight[i];
        finalColor += texture2D(uSampler, (vec2(vTextureCoord) - vec2(offset[i] * xDir, offset[i] * yDir) * uStrength / uResolution)) * weight[i];
    }
    if (uHollow && finalColor.a == 0.0) {
        discard;
    } else {
        gl_FragColor = finalColor;
    }
}
