// /src/thought_engine.js

export class ThoughtEngine {
  constructor(options = {}) {
    this.file = options.file || 'public_data/last_spoken_thought.json';
    this.targetId = options.targetId || 'thought';
    this.interval = options.interval || 2000;
    this.onEmotion = options.onEmotion || (() => {});
    this.onThought = options.onThought || (() => {});
    this.targetElement = document.getElementById(this.targetId);
    this.lastThought = '';
    this._loop = null;
  }

  start() {
    this._fetch();
    this._loop = setInterval(() => this._fetch(), this.interval);
  }

  stop() {
    clearInterval(this._loop);
  }

  async _fetch() {
    try {
      const response = await fetch(`${this.file}?_t=${Date.now()}`);
      const data = await response.json();

      const newThought = data.thought?.trim() || '...';
      const emotion = data.emotion?.trim() || 'neutral';

      if (newThought !== this.lastThought) {
        this.lastThought = newThought;
        this._type(newThought);
        this.onThought(newThought);
      }

      this.onEmotion(emotion);
    } catch (err) {
      console.warn('[ThoughtEngine] Thought fetch failed:', err);
    }
  }

  _type(text) {
    this.targetElement.textContent = '';
    let i = 0;

    const interval = setInterval(() => {
      this.targetElement.textContent += text[i++];
      if (i >= text.length) clearInterval(interval);
    }, 26 + Math.random() * 16);
  }
}
