// /src/synthetic_depth_shader.js

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';

export function createSovereignSkin() {
  const uniforms = {
    u_time: { value: 0 },
    u_intensity: { value: 1.0 },
    u_color: { value: new THREE.Color(0xff0033) }
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
      uniform float u_intensity;
      uniform vec3 u_color;
      varying vec3 vNormal;
      varying vec3 vPosition;

      float spiral(vec3 p) {
        return sin(dot(p.xy, vec2(12.0, 8.0)) + u_time * 5.0) * 0.5 + 0.5;
      }

      float pulse(vec3 p) {
        return 0.4 + 0.3 * sin(u_time * 2.0 + length(p.xy) * 8.0);
      }

      void main() {
        float d = spiral(vPosition) * pulse(vPosition);
        float edge = dot(vNormal, vec3(0.0, 0.0, 1.0));
        float fresnel = pow(1.0 - edge, 3.0);

        vec3 base = mix(u_color, vec3(1.0), fresnel);
        vec3 final = base * d * u_intensity;

        gl_FragColor = vec4(final, 1.0);
      }
    `,
    transparent: true
  });
}
