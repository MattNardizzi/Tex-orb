// /src/emotion_engine.js

export function startEmotionEngine(onEmotion, interval = 12000) {
  const emotionPool = [
    'neutral', 'focused', 'happy', 'anxious',
    'sad', 'angry', 'mutated'
  ];

  setInterval(() => {
    const emotion = emotionPool[Math.floor(Math.random() * emotionPool.length)];
    if (typeof onEmotion === 'function') {
      onEmotion(emotion);
    }
  }, interval);
}
