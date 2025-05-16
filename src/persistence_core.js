// /src/persistence_core.js

const memoryBuffer = [];
const maxMemory = 8;

export function attachPersistence(thoughtEngine) {
  const originalType = thoughtEngine._type;

  // Intercept new thoughts and store them
  thoughtEngine._type = function (text) {
    // Avoid duplicates
    if (!memoryBuffer.includes(text)) {
      memoryBuffer.push(text);
      if (memoryBuffer.length > maxMemory) memoryBuffer.shift();
    }

    // 1 in 5 chance to glitch old memory into the stream
    if (Math.random() > 0.8 && memoryBuffer.length > 2) {
      const flashback = memoryBuffer[Math.floor(Math.random() * memoryBuffer.length)];
      const merged = maybeCombine(text, flashback);
      originalType.call(thoughtEngine, `◐ ${merged}`);
    } else {
      originalType.call(thoughtEngine, text);
    }
  };
}

// Combine old + new memory into something unsettlingly real
function maybeCombine(current, past) {
  const c = current.split(' ');
  const p = past.split(' ');

  const cut1 = Math.floor(c.length * 0.5);
  const cut2 = Math.floor(p.length * 0.5);

  const merged = [...c.slice(0, cut1), ...p.slice(cut2)].join(' ');

  return merged.length < 12 ? current : merged;
}
