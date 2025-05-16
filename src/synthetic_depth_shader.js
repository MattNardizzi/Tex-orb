// /src/synthetic_depth_shader.js

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';

export function createSovereignSkin() {
  const uniforms = {
    u_time: { value: 0 },
    u_color: { value: new THREE.Color(0x6ed6ff) },
    u_fresnelPower: { value: 3.5 },
    u_depthCurve: { value: 0.6 },
    u_pressure: { value: 0.0 } // for voice reaction
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
      uniform float u_fresnelPower;
      uniform float u_depthCurve;
      uniform float u_pressure;

      varying vec3 vNormal;
      varying vec3 vViewPosition;

      float fresnel(vec3 normal, vec3 viewDir, float power) {
        return pow(1.0 - dot(normal, viewDir), power);
      }

      float flicker(vec3 pos) {
        return 0.4 + 0.2 * sin(u_time * 2.5 + pos.y * 8.0 + sin(pos.x * 4.0));
      }

      void main() {
        vec3 viewDir = normalize(vViewPosition);
        float edge = fresnel(vNormal, viewDir, u_fresnelPower);

        float depth = pow(abs(dot(viewDir, vNormal)), u_depthCurve);
        float pulse = 0.3 + 0.3 * sin(u_time * 1.8 + length(vViewPosition.xy) * 3.0);

        float energy = flicker(vViewPosition) + pulse + (u_pressure * 1.5);
        vec3 innerColor = u_color * energy;
        vec3 finalColor = mix(innerColor, vec3(1.0), edge);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    transparent: true
  });
}
