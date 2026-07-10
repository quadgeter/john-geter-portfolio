import * as THREE from "three";
import {
  FOG_CLEAR_CENTER,
  FOG_CLEAR_INNER_RADIUS,
  FOG_CLEAR_OUTER_RADIUS,
} from "../constants/scene";

const cx = FOG_CLEAR_CENTER[0].toFixed(2);
const cy = FOG_CLEAR_CENTER[1].toFixed(2);
const cz = FOG_CLEAR_CENTER[2].toFixed(2);
const inner = FOG_CLEAR_INNER_RADIUS.toFixed(2);
const outer = FOG_CLEAR_OUTER_RADIUS.toFixed(2);

THREE.ShaderChunk.fog_pars_vertex = /* glsl */ `
#ifdef USE_FOG
  varying float vFogDepth;
  varying vec3 vFogWorldPos;
#endif
`;

THREE.ShaderChunk.fog_vertex = /* glsl */ `
#ifdef USE_FOG
  vFogDepth = -mvPosition.z;
  vFogWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
#endif
`;

THREE.ShaderChunk.fog_pars_fragment = /* glsl */ `
#ifdef USE_FOG
  uniform vec3 fogColor;
  varying float vFogDepth;
  varying vec3 vFogWorldPos;
  #ifdef FOG_EXP2
    uniform float fogDensity;
  #else
    uniform float fogNear;
    uniform float fogFar;
  #endif
#endif
`;

THREE.ShaderChunk.fog_fragment = /* glsl */ `
#ifdef USE_FOG
  #ifdef FOG_EXP2
    float fogFactor = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #else
    float fogFactor = smoothstep(fogNear, fogFar, vFogDepth);
  #endif

  float fogDist = distance(vFogWorldPos, vec3(${cx}, ${cy}, ${cz}));
  float clearZone = smoothstep(${inner}, ${outer}, fogDist);
  fogFactor *= clearZone;

  gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogFactor);
#endif
`;
