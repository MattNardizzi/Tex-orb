// /src/eye_trace.js

export function startEyeTrace({ onLock, onRelease, threshold = 140, lockDelay = 1200 }) {
  if (!window.webgazer) {
    console.warn('👁 WebGazer not loaded.');
    return;
  }

  let isLocked = false;
  let gazeTimer = null;

  webgazer.setGazeListener((data) => {
    if (!data) return;

    const x = data.x;
    const y = data.y;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);

    if (dist < threshold && !isLocked) {
      if (!gazeTimer) {
        gazeTimer = setTimeout(() => {
          isLocked = true;
          if (typeof onLock === 'function') onLock();
        }, lockDelay);
      }
    } else {
      clearTimeout(gazeTimer);
      gazeTimer = null;
      if (isLocked) {
        isLocked = false;
        if (typeof onRelease === 'function') onRelease();
      }
    }
  }).begin();

  console.log('👁 Eye Trace activated.');
}
