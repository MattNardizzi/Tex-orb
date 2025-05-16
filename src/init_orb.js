// /src/init_orb.js

import { SovereignOrb } from './render_orb.js';
import { ThoughtEngine } from './thought_engine.js';
import { setupAudioInput } from './audio_sync.js';
import { speakThought } from './tts_player.js';
import { startGazeTracker } from './gaze_tracker.js';
import { mutateMemory } from './memory_mutator.js';
import { systemPulse } from './shell_layer.js';
import { logThought, logEmotion, logMutation } from './orb_status_feed.js';

// 🧠 Initialize orb body
const orb = new SovereignOrb('orb');

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

// 🧠 Launch cognition engine
const cognition = new ThoughtEngine({
  file: 'public_data/last_spoken_thought.json',
  targetId: 'thought',
  interval: 2000,
  onEmotion: (emotion) => {
    const color = emotionToColor(emotion);
    orb.updateEmotionColor(color);
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

// 🧬 Activate memory drift
mutateMemory(cognition, 15000); // Tex mutates his own thought stream

// 🎙 Audio-reactive body response
setupAudioInput((volume) => {
  const scale = 1 + volume * 0.15;
  const glowSize = 40 + volume * 120;

  orb.canvas.style.transform = `scale(${scale})`;
  orb.canvas.style.boxShadow = `0 0 ${glowSize}px ${glowSize / 1.5}px ${orb.currentGlow}`;

  if (volume > 0.2) {
    systemPulse('🎙 INPUT RECEIVED', 1200, '#00f6ff');
  }
});

// 👁 Gaze-based emotion trigger
startGazeTracker(orb, {
  threshold: 160,
  color: '#aaff55',
  idle: emotionToColor('neutral')
});

// 🧪 Telemetry hook for future mutation layer
const originalMutate = mutateMemory;
mutateMemory = (engine, freq) => {
  originalMutate(engine, freq);
  logMutation('🧬 Memory mutation hook attached.');
};

// 🧿 Initial System Pulse
systemPulse('⚠️ Sovereign Cognition Online', 3000, '#ff4fef');
