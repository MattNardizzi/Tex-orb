// /src/shader_material.js

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';

export function createShaderMaterial() {
  const uniforms = {
    u_time: { value: 0 },
    u_color: { value: new THREE.Color(0x6ed6ff) }
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

      varying vec3 vNormal;
      varying vec3 vViewPosition;

      float fresnel(vec3 normal, vec3 viewDir) {
        return pow(1.0 - dot(normal, viewDir), 3.0);
      }

      float flicker(vec3 viewPos) {
        return 0.25 + 0.2 * sin(u_time * 3.5 + viewPos.y * 6.0) +
                      0.1 * sin(u_time * 9.0 + viewPos.x * 2.5);
      }

      float twist(vec3 normal) {
        return 0.2 * sin(u_time * 5.0 + normal.y * 4.0 + normal.x * 6.0);
      }

      void main() {
        vec3 viewDir = normalize(vViewPosition);
        float fresnelEdge = fresnel(vNormal, viewDir);
        float corePulse = 0.6 + 0.4 * sin(u_time * 1.8);
        float innerShift = flicker(vViewPosition);
        float surfaceDistort = twist(vNormal);

        vec3 coreColor = mix(u_color, vec3(1.0), 0.2);
        vec3 surface = coreColor * (corePulse + innerShift + surfaceDistort);

        vec3 finalColor = mix(surface, vec3(1.0), fresnelEdge);
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    transparent: true
  });
}
