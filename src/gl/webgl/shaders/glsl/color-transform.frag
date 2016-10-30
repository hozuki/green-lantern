
precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float uColorMatrix[25];
uniform bool uHollow;

void main(void)
{

    vec4 c = texture2D(uSampler, vTextureCoord);
    vec4 finalColor = vec4(0.0);

    finalColor.r = (uColorMatrix[0] * c.r);
    finalColor.r += (uColorMatrix[1] * c.g);
    finalColor.r += (uColorMatrix[2] * c.b);
    finalColor.r += (uColorMatrix[3] * c.a);
    finalColor.r += uColorMatrix[4];

    finalColor.g = (uColorMatrix[5] * c.r);
    finalColor.g += (uColorMatrix[6] * c.g);
    finalColor.g += (uColorMatrix[7] * c.b);
    finalColor.g += (uColorMatrix[8] * c.a);
    finalColor.g += uColorMatrix[9];

    finalColor.b = (uColorMatrix[10] * c.r);
    finalColor.b += (uColorMatrix[11] * c.g);
    finalColor.b += (uColorMatrix[12] * c.b);
    finalColor.b += (uColorMatrix[13] * c.a);
    finalColor.b += uColorMatrix[14];

    finalColor.a = (uColorMatrix[15] * c.r);
    finalColor.a += (uColorMatrix[16] * c.g);
    finalColor.a += (uColorMatrix[17] * c.b);
    finalColor.a += (uColorMatrix[18] * c.a);
    finalColor.a += uColorMatrix[19];

    if (uHollow && finalColor.a == 0.0) {
        discard;
    } else {
        gl_FragColor = finalColor;
    }
}
