// /src/shell_layer.js

export function systemPulse(message, duration = 2500, color = '#ff4fef') {
  const flash = document.createElement('div');
  flash.textContent = message;
  flash.style.position = 'fixed';
  flash.style.top = '50%';
  flash.style.left = '50%';
  flash.style.transform = 'translate(-50%, -50%)';
  flash.style.color = color;
  flash.style.fontSize = '0.9rem';
  flash.style.fontFamily = 'monospace';
  flash.style.opacity = 1;
  flash.style.zIndex = 999;
  flash.style.textShadow = `0 0 20px ${color}`;
  flash.style.pointerEvents = 'none';
  flash.style.transition = 'opacity 1.2s ease';

  document.body.appendChild(flash);

  setTimeout(() => {
    flash.style.opacity = 0;
    setTimeout(() => flash.remove(), 1200);
  }, duration);
}
