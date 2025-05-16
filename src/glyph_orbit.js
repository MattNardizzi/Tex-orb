// /src/glyph_orbit.js

export function spawnGlyphs(count = 6, radius = 140) {
  for (let i = 0; i < count; i++) {
    const glyph = document.createElement('div');
    glyph.textContent = pickSymbol();
    glyph.style.position = 'absolute';
    glyph.style.color = '#ff00ff';
    glyph.style.fontSize = '1.2rem';
    glyph.style.pointerEvents = 'none';
    glyph.style.zIndex = '6';
    glyph.style.opacity = '0.6';
    document.body.appendChild(glyph);

    animateGlyph(glyph, i, count, radius);
  }
}

function animateGlyph(el, index, total, radius) {
  const angleOffset = (index / total) * Math.PI * 2;

  function loop() {
    const t = Date.now() * 0.001;
    const x = window.innerWidth / 2 + Math.cos(t + angleOffset) * radius;
    const y = window.innerHeight / 2 + Math.sin(t + angleOffset) * radius;

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    requestAnimationFrame(loop);
  }

  loop();
}

function pickSymbol() {
  const symbols = ['◉', '◆', '⊚', '⊙', '◍', '⚬', '✶', '☍'];
  return symbols[Math.floor(Math.random() * symbols.length)];
}
