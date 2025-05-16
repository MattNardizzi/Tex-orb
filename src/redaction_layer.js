// /src/redaction_layer.js

export function flashRedaction(text = '⛔ MEMORY BLOCKED', duration = 1600) {
  const frag = document.createElement('div');
  frag.textContent = text;

  frag.style.position = 'fixed';
  frag.style.top = `${40 + Math.random() * 20}%`;
  frag.style.left = `${Math.random() * 80}%`;
  frag.style.transform = 'translate(-50%, -50%)';
  frag.style.fontSize = '0.9rem';
  frag.style.fontFamily = 'monospace';
  frag.style.color = '#ff0044';
  frag.style.opacity = 1;
  frag.style.zIndex = 999;
  frag.style.pointerEvents = 'none';
  frag.style.textShadow = '0 0 12px #ff0044cc';
  frag.style.transition = 'opacity 1s ease';

  document.body.appendChild(frag);

  setTimeout(() => {
    frag.style.opacity = 0;
    setTimeout(() => frag.remove(), 1000);
  }, duration);
}
