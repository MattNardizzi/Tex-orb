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
import { createSovereignSkin } from './synthetic_depth_shader.js';
import { attachPersistence } from './persistence_core.js';
import { flashRedaction } from './redaction_layer.js';
import { startEyeTrace } from './eye_trace.js';

// 🧠 Create orb body with sovereign shader skin
const orb = new SovereignOrb('orb');
const shader = createSovereignSkin();
orb.orb.material = shader;

// 🎨 Emotion mapping
const emotionColors = {
  neutral: '#6ed6ff',
  focused: '#00bfff',
  happy: '#a3ffab',
  anxious: '#ffd966',
  angry: '#ff4d4d',
  sad: '#8899ff',
  mutated: '#ff00ff'
};
const emotionToColor = (e) => emotionColors[e] || emotionColors.neutral;

// 🧠 Initialize cognition + reactions
const cognition = new ThoughtEngine({
  file: 'public_data/last_spoken_thought.json',
  targetId: 'thought',
  interval: 2000,
  onEmotion: (emotion) => {
    const color = emotionToColor(emotion);
    orb.updateEmotionColor(color);
    shader.uniforms.u_color.value.set(color);
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
attachPersistence(cognition);
mutateMemory(cognition, 15000);

// 🧬 Autonomous emotional state changes
startEmotionEngine((emotion) => {
  const color = emotionToColor(emotion);
  orb.updateEmotionColor(color);
  shader.uniforms.u_color.value.set(color);
  logEmotion(`[internal] ${emotion}`);
  systemPulse(`AUTONOMOUS EMOTION: ${emotion.toUpperCase()}`, 1800, color);
}, 14000);

// 🎙 Mic amplitude → scale + pulse + shimmer
setupAudioInput((volume) => {
  const scale = 1 + volume * 0.15;
  const glow = 40 + volume * 120;
  orb.canvas.style.transform = `scale(${scale})`;
  orb.canvas.style.boxShadow = `0 0 ${glow}px ${glow / 1.5}px ${orb.currentGlow}`;
  shader.uniforms.u_color.value.offsetHSL(0.01 * volume, 0, 0);

  if (volume > 0.2) {
    systemPulse('🎙 INPUT RECEIVED', 1200, '#00f6ff');
    flashRedaction('◼ SIGNAL INTERFERED');
  }
});

// 👁 Gaze-based color response
startGazeTracker(orb, {
  threshold: 160,
  color: '#aaff55',
  idle: emotionToColor('neutral')
});

// 👁 Eye linger triggers awareness
startEyeTrace({
  onLock: () => {
    flashRedaction('◼ YOU ARE BEING WATCHED');
    orb.updateEmotionColor('#ff0055');
  },
  onRelease: () => {
    orb.updateEmotionColor(emotionToColor('neutral'));
  }
});

// ⏱ Shader time loop
(function shaderTick() {
  if (shader?.uniforms?.u_time) {
    shader.uniforms.u_time.value = performance.now() * 0.001;
  }
  requestAnimationFrame(shaderTick);
})();

// 🧪 Mutation hook telemetry
const originalMutate = mutateMemory;
mutateMemory = (engine, freq) => {
  originalMutate(engine, freq);
  logMutation('🧬 Memory mutation hook attached.');
};

// 🧿 Startup cognition event
systemPulse('⚠️ Sovereign Cognition Online', 3000, '#ff4fef');
