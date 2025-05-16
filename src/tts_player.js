// /src/tts_player.js

export function speakThought(text, voiceName = 'Google UK English Male') {
  if (!window.speechSynthesis) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.volume = 0.9;
  utterance.rate = 0.92;
  utterance.pitch = 1.0;

  const voices = speechSynthesis.getVoices();
  const voice = voices.find(v => v.name === voiceName);
  if (voice) utterance.voice = voice;

  // Cancel current speech and start new
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}
