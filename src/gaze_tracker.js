// /src/gaze_tracker.js

export function startGazeTracker(orbInstance, options = {}) {
  const threshold = options.threshold || 160; // pixels from center
  const intensityColor = options.color || '#aaff55';
  const idleColor = options.idle || '#6ed6ff';

  if (!window.webgazer) {
    console.warn('👁 WebGazer not loaded.');
    return;
  }

  webgazer.setGazeListener((data) => {
    if (!data) return;

    const x = data.x, y = data.y;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    const isLooking = dist < threshold;

    if (isLooking) {
      orbInstance.updateEmotionColor(intensityColor);
      orbInstance.canvas.style.boxShadow = `0 0 140px 50px ${intensityColor}`;
    } else {
      orbInstance.updateEmotionColor(idleColor);
      orbInstance.canvas.style.boxShadow = `0 0 100px 30px ${idleColor}`;
    }
  }).begin();

  console.log('👁 Gaze Tracker Activated');
}
