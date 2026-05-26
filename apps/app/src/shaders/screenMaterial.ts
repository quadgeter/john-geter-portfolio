import { ShaderMaterial, Color, AdditiveBlending, FrontSide } from 'three'

const vertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const screenFragment = /* glsl */ `
uniform float uIntensity;
uniform vec3 uColor;
uniform float uTime;

varying vec2 vUv;

void main() {
  // Off: dark LCD surface
  vec3 offColor = vec3(0.005, 0.005, 0.012);

  // On: lit screen with soft vignette
  vec2 centered = vUv - 0.5;
  float dist = length(centered);
  float vignette = smoothstep(0.55, 0.1, dist);
  float pulse = 1.0 + sin(uTime * 2.0) * 0.008;
  vec3 onColor = uColor * vignette * pulse;

  vec3 color = mix(offColor, onColor, uIntensity);
  gl_FragColor = vec4(color, 1.0);
}
`

const bloomFragment = /* glsl */ `
uniform float uIntensity;
uniform vec3 uColor;
uniform float uTime;

varying vec2 vUv;

void main() {
  vec2 uv = vUv - 0.5;

  // Box SDF — screen boundary in bloom mesh UV space (1 / bloomScale ≈ 0.385)
  vec2 halfSize = vec2(0.385);
  vec2 d = abs(uv) - halfSize;
  float boxDist = length(max(d, 0.0));

  // Exponential falloff from screen edge outward
  float glow = exp(-boxDist * 14.0) * 0.55;

  // Soft inner-edge highlight
  float innerDist = -min(max(d.x, d.y), 0.0);
  float edgeGlow = exp(-innerDist * 10.0) * 0.15;

  float totalGlow = (glow + edgeGlow) * uIntensity;

  vec3 color = uColor * totalGlow;
  gl_FragColor = vec4(color, totalGlow * 0.7);
}
`

export function createScreenMaterial(
  color: [number, number, number] = [0.4, 0.6, 1.0],
) {
  return new ShaderMaterial({
    uniforms: {
      uIntensity: { value: 0.0 },
      uColor: { value: new Color(...color) },
      uTime: { value: 0.0 },
    },
    vertexShader,
    fragmentShader: screenFragment,
    side: FrontSide,
  })
}

export function createBloomMaterial(
  color: [number, number, number] = [0.4, 0.6, 1.0],
) {
  return new ShaderMaterial({
    uniforms: {
      uIntensity: { value: 0.0 },
      uColor: { value: new Color(...color) },
      uTime: { value: 0.0 },
    },
    vertexShader,
    fragmentShader: bloomFragment,
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
    side: FrontSide,
  })
}
