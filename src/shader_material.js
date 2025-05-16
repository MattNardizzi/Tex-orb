// /src/shader_material.js

import * as THREE from 'three';

export function createShaderMaterial() {
  const uniforms = {
    u_time: { value: 0 },
    u_color: { value: new THREE.Color(0x6ed6ff) }
  };

  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float u_time;
      uniform vec3 u_color;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        float pulse = 0.4 + 0.3 * sin(u_time * 2.0 + vPosition.y * 4.0);
        float flicker = 0.15 * sin(u_time * 7.0 + vPosition.x * 3.0);
        float glow = dot(vNormal, vec3(0.0, 0.0, 1.0));
        glow = smoothstep(0.0, 1.0, glow);

        vec3 base = mix(u_color, vec3(1.0, 1.0, 1.0), 0.15);
        vec3 color = base * (pulse + flicker + glow);
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    transparent: true
  });
}
