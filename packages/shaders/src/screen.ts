export const vertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const screenFragmentShader = /* glsl */ `
uniform float uIntensity;
uniform vec3 uColor;
uniform float uTime;

varying vec2 vUv;

void main() {
  vec3 offColor = vec3(0.005, 0.005, 0.012);

  vec2 centered = vUv - 0.5;
  float dist = length(centered);
  float vignette = smoothstep(0.55, 0.1, dist);
  float pulse = 1.0 + sin(uTime * 2.0) * 0.008;
  vec3 onColor = uColor * vignette * pulse;

  vec3 color = mix(offColor, onColor, uIntensity);
  gl_FragColor = vec4(color, 1.0);
}
`

export const bloomFragmentShader = /* glsl */ `
uniform float uIntensity;
uniform vec3 uColor;
uniform float uTime;

varying vec2 vUv;

void main() {
  vec2 uv = vUv - 0.5;

  vec2 halfSize = vec2(0.385);
  vec2 d = abs(uv) - halfSize;
  float boxDist = length(max(d, 0.0));

  float glow = exp(-boxDist * 14.0) * 0.55;

  float innerDist = -min(max(d.x, d.y), 0.0);
  float edgeGlow = exp(-innerDist * 10.0) * 0.15;

  float totalGlow = (glow + edgeGlow) * uIntensity;

  vec3 color = uColor * totalGlow;
  gl_FragColor = vec4(color, totalGlow * 0.7);
}
`
