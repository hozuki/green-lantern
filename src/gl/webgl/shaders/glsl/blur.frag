
precision lowp float;

varying vec2 vTextureCoord;
varying vec2 vBlurTexCoords[6];

uniform sampler2D uSampler;
uniform bool uHollow;

void main()
{
    vec4 finalColor = vec4(0.0);
    finalColor += texture2D(uSampler, vBlurTexCoords[ 0]) * 0.004431848411938341;
    finalColor += texture2D(uSampler, vBlurTexCoords[ 1]) * 0.05399096651318985;
    finalColor += texture2D(uSampler, vBlurTexCoords[ 2]) * 0.2419707245191454;
    finalColor += texture2D(uSampler, vTextureCoord     ) * 0.3989422804014327;
    finalColor += texture2D(uSampler, vBlurTexCoords[ 3]) * 0.2419707245191454;
    finalColor += texture2D(uSampler, vBlurTexCoords[ 4]) * 0.05399096651318985;
    finalColor += texture2D(uSampler, vBlurTexCoords[ 5]) * 0.004431848411938341;
    if (uHollow && finalColor.a == 0.0) {
        discard;
    } else {
        gl_FragColor = finalColor;
    }
}
