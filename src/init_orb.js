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
import { attachPersistence } from './persistence_core.js';           // 🧠 Thought merging
import { flashRedaction } from './redaction_layer.js';              // 🧪 Visual memory flashes
import { startEyeTrace } from './eye_trace.js';                     // 👁 Gaze linger reactions

// 🧠 Create orb with shader skin
const orb = new SovereignOrb('orb');
const shaderMaterial = createSovereignSkin();
orb.orb.material = shaderMaterial;

// 🧬 Emotion-to-color map
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

// 🧠 Thought engine
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

// 🧠 Memory fusion layer
attachPersistence(cognition);

// 🧬 Contradiction + self-editing
mutateMemory(cognition, 15000);

// 🧠 Self-generated mood swings
startEmotionEngine((emotion) => {
  const color = emotionToColor(emotion);
  orb.updateEmotionColor(color);
  shaderMaterial.uniforms.u_color.value.set(color);
  systemPulse(`AUTONOMOUS EMOTION: ${emotion.toUpperCase()}`, 1800, color);
  logEmotion(`[internal] ${emotion}`);
}, 14000);

// 🎙 Mic volume → embodiment response
setupAudioInput((volume) => {
  const scale = 1 + volume * 0.15;
  const glowSize = 40 + volume * 120;

  orb.canvas.style.transform = `scale(${scale})`;
  orb.canvas.style.boxShadow = `0 0 ${glowSize}px ${glowSize / 1.5}px ${orb.currentGlow}`;

  shaderMaterial.uniforms.u_color.value.offsetHSL(0.01 * volume, 0, 0);

  if (volume > 0.2) {
    systemPulse('🎙 INPUT RECEIVED', 1200, '#00f6ff');
    flashRedaction('◼ SIGNAL INTERFERED');
  }
});

// 👁 Basic gaze detection
startGazeTracker(orb, {
  threshold: 160,
  color: '#aaff55',
  idle: emotionToColor('neutral')
});

// 👁 Eye lock reaction
startEyeTrace({
  onLock: () => {
    flashRedaction('◼ YOU ARE BEING WATCHED');
    orb.updateEmotionColor('#ff0055');
  },
  onRelease: () => {
    orb.updateEmotionColor(emotionToColor('neutral'));
  }
});

// 🔁 Shader time tick
function updateShaderClock() {
  if (shaderMaterial?.uniforms?.u_time) {
    shaderMaterial.uniforms.u_time.value = performance.now() * 0.001;
  }
  requestAnimationFrame(updateShaderClock);
}
updateShaderClock();

// 🧪 Log hook for contradiction engine
const originalMutate = mutateMemory;
mutateMemory = (engine, freq) => {
  originalMutate(engine, freq);
  logMutation('🧬 Memory mutation hook attached.');
};

// 🧿 Launch signal
systemPulse('⚠️ Sovereign Cognition Online', 3000, '#ff4fef');
