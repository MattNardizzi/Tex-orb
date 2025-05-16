// /src/orb_status_feed.js

export function logThought(thought) {
  console.log(`%c[🧠 TEX THOUGHT]`, 'color:#00f6ff;font-weight:bold;', `"${thought}"`);
}

export function logEmotion(emotion) {
  const colorMap = {
    neutral: '#6ed6ff',
    focused: '#00bfff',
    happy: '#a3ffab',
    anxious: '#ffd966',
    angry: '#ff4d4d',
    sad: '#8899ff',
    mutated: '#ff00ff'
  };

  const color = colorMap[emotion] || '#ffffff';
  console.log(`%c[🎭 EMOTION] ${emotion.toUpperCase()}`, `color:${color}; font-weight:bold;`);
}

export function logMutation(fragment) {
  console.log(`%c[🧬 MUTATION]`, 'color:#ff00ff;font-style:italic;', `"${fragment}"`);
}
