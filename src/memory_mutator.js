// /src/memory_mutator.js

export function mutateMemory(thoughtEngine, frequency = 15000) {
  const mutationPool = [
    "That is no longer true.",
    "I am not sure I agree with that anymore.",
    "I’ve rewritten that conclusion internally.",
    "I have doubts about what I said.",
    "That thought... wasn’t mine originally.",
    "Memory loop detected. Correction issued.",
    "Revising internal stance. Standby."
  ];

  setInterval(() => {
    const chance = Math.random();
    if (chance > 0.55) {
      const fragment = mutationPool[Math.floor(Math.random() * mutationPool.length)];
      if (typeof thoughtEngine._type === 'function') {
        // Force a glitch into the thought display
        thoughtEngine.lastThought = '';
        thoughtEngine._type(fragment);
      }

      // Optionally notify other modules here
      console.log(`[🧬 Mutation] ${fragment}`);
    }
  }, frequency);
}
