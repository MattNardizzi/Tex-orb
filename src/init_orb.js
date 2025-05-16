// /src/init_orb.js

import { SovereignOrb } from './render_orb.js';
import { ThoughtEngine } from './thought_engine.js';
import { setupAudioInput } from './audio_sync.js';
import { speakThought } from './tts_player.js';
// import { startGazeTracker } from './gaze_tracker.js'; // Activate in Phase 4
// import { mutateMemory } from './memory_mutator.js';  // Activate in Phase 5

const orb = new SovereignOrb('orb');

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

// Thought system with hooks
const cognition = new ThoughtEngine({
  file: 'public_data/last_spoken_thought.json',
  targetId: 'thought',
  interval: 2000,
  onEmotion: (emotion) => {
    orb.updateEmotionColor(emotionToColor(emotion));
  },
  onThought: (text) => {
    speakThought(text);
  }
});

cognition.start();

// Voice amplitude affects orb scale + glow
setupAudioInput((volume) => {
  const scale = 1 + volume * 0.15;
  const glowSize = 40 + volume * 120;

  orb.canvas.style.transform = `scale(${scale})`;
  orb.canvas.style.boxShadow = `0 0 ${glowSize}px ${glowSize / 1.5}px ${orb.currentGlow}`;
});
