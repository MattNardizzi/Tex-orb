// /src/init_orb.js

import { SovereignOrb } from './render_orb.js';
import { ThoughtEngine } from './thought_engine.js';
import { setupAudioInput } from './audio_sync.js';
import { speakThought } from './tts_player.js';
import { startGazeTracker } from './gaze_tracker.js';
import { mutateMemory } from './memory_mutator.js';
import { startEmotionEngine } from './emotion_engine.js';
import { systemPulse } from './shell_layer.js';
import { logThought, logEmotion, logMutation } from './orb_status_feed.js';
import { createSovereignSkin } from './synthetic_depth_shader.js'; // ✅ New neural skin shader

// 🧠 Initialize orb body with depth shader
const orb = new SovereignOrb('orb');
const shaderMaterial = createSovereignSkin();
orb.orb.material = shaderMaterial;

// 🧬 Emotion mapping
const emotionColors = {
  neutral: '#6ed6ff',
  focused: '#00bfff',
  happy: '#a3ffab',
  anxious: '#ffd966',
  angry: '#ff4d4d',
  sad: '#8899ff',
  mutated: '#ff00ff'
};

function emotionToColor(emotion) {
  return emotionColors[emotion] || emotionColors.neutral;
}

// 🧠 Launch cognitive engine
const cognition = new ThoughtEngine({
  file: 'public_data/last_spoken_thought.json',
  targetId: 'thought',
  interval: 2000,
  onEmotion: (emotion) => {
    const color = emotionToColor(emotion);
    orb.updateEmotionColor(color);
    shaderMaterial.uniforms.u_color.value.set(color);
    logEmotion(emotion);
    systemPulse(`EMOTION: ${emotion.toUpperCase()}`, 2000, color);
  },
  onThought: (text) => {
    speakThought(text);
    logThought(text);
    systemPulse('🧠 NEW THOUGHT', 1800, '#ffffff');
  }
});

cognition.start();

// 🧬 Self-mutation loop
mutateMemory(cognition, 15000);

// 🧠 Internal emotion drift
startEmotionEngine((emotion) => {
  const color = emotionToColor(emotion);
  orb.updateEmotionColor(color);
  shaderMaterial.uniforms.u_color.value.set(color);
  systemPulse(`AUTONOMOUS EMOTION: ${emotion.toUpperCase()}`, 1800, color);
  logEmotion(`[internal] ${emotion}`);
}, 14000);

// 🎙 Mic → embodiment
setupAudioInput((volume) => {
  const scale = 1 + volume * 0.15;
  const glowSize = 40 + volume * 120;

  orb.canvas.style.transform = `scale(${scale})`;
  orb.canvas.style.boxShadow = `0 0 ${glowSize}px ${glowSize / 1.5}px ${orb.currentGlow}`;

  // Slight color shimmer on loud input
  shaderMaterial.uniforms.u_color.value.offsetHSL(0.01 * volume, 0, 0);

  if (volume > 0.2) {
    systemPulse('🎙 INPUT RECEIVED', 1200, '#00f6ff');
  }
});

// 👁 Visual response to attention
startGazeTracker(orb, {
  threshold: 160,
  color: '#aaff55',
  idle: emotionToColor('neutral')
});

// 🔁 Shader time tick
function updateShaderClock() {
  if (shaderMaterial?.uniforms?.u_time) {
    shaderMaterial.uniforms.u_time.value = performance.now() * 0.001;
  }
  requestAnimationFrame(updateShaderClock);
}
updateShaderClock();

// 🧪 Mutation telemetry
const originalMutate = mutateMemory;
mutateMemory = (engine, freq) => {
  originalMutate(engine, freq);
  logMutation('🧬 Memory mutation hook attached.');
};

// 🧿 Launch beacon
systemPulse('⚠️ Sovereign Cognition Online', 3000, '#ff4fef');
