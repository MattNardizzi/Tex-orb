// /src/synthetic_depth_shader.js

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';

export function createSovereignSkin() {
  const uniforms = {
    u_time: { value: 0 },
    u_color: { value: new THREE.Color(0x6ed6ff) },
    u_pressure: { value: 0.0 },
    u_mutation: { value: 0.0 }
  };

  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float u_time;
      uniform vec3 u_color;
      uniform float u_pressure;
      uniform float u_mutation;

      varying vec3 vNormal;
      varying vec3 vViewPosition;

      float fresnel(vec3 normal, vec3 viewDir) {
        return pow(1.0 - dot(normal, viewDir), 2.8);
      }

      float corePulse(vec3 pos) {
        float base = 0.45 + 0.25 * sin(u_time * 2.0 + length(pos.xy) * 6.0);
        float breath = 0.1 + 0.15 * sin(u_time * 0.7 + pos.x * 3.0);
        return base + breath;
      }

      float mutationFlicker(vec3 pos) {
        return 0.2 + 0.15 * sin(u_time * 6.0 + dot(pos.xy, vec2(4.0, 2.0)));
      }

      void main() {
        vec3 viewDir = normalize(vViewPosition);
        float fresnelEdge = fresnel(vNormal, viewDir);

        float core = corePulse(vViewPosition);
        float flicker = mutationFlicker(vViewPosition) * u_mutation;
        float breathPressure = u_pressure * 0.6;

        vec3 base = u_color * (core + flicker + breathPressure);
        vec3 final = mix(base, vec3(1.0), fresnelEdge);

        gl_FragColor = vec4(final, 1.0);
      }
    `,
    transparent: true
  });
}
