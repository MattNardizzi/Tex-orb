// /src/synthetic_depth_shader.js

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';

export function createSovereignSkin() {
  const uniforms = {
    u_time: { value: 0 },
    u_color: { value: new THREE.Color(0x6ed6ff) },
    u_distortSpeed: { value: 0.6 },
    u_breath: { value: 1.0 }
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
      uniform float u_distortSpeed;
      uniform float u_breath;
      varying vec3 vNormal;
      varying vec3 vPosition;

      // 2D noise function based on IQ's GLSL noise
      float noise(vec2 p) {
        return fract(sin(dot(p ,vec2(127.1,311.7))) * 43758.5453);
      }

      float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = noise(i);
        float b = noise(i + vec2(1.0, 0.0));
        float c = noise(i + vec2(0.0, 1.0));
        float d = noise(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        vec3 viewDir = normalize(vPosition);
        float fresnel = pow(1.0 - dot(vNormal, viewDir), 3.0);

        vec2 pos = vPosition.xy * 2.0 + u_time * u_distortSpeed;
        float flicker = smoothNoise(pos * 1.2);
        float pulse = 0.5 + 0.25 * sin(u_time * 2.3 + length(vPosition.xy) * 5.0);

        vec3 base = mix(u_color, vec3(1.0), fresnel);
        vec3 final = base * (pulse + flicker * u_breath);
        
        gl_FragColor = vec4(final, 1.0);
      }
    `,
    transparent: true
  });
}
