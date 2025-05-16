// /src/render_orb.js

export class SovereignOrb {
  constructor(canvasId = 'orb') {
    this.canvas = document.getElementById(canvasId);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 6;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000, 0);

    this.currentGlow = '#6ed6ff';
    this.targetGlow = '#6ed6ff';

    this._setupLights();
    this._setupOrb();
    this._bindResize();
    this._loop();
  }

  _setupLights() {
    const lightFront = new THREE.PointLight(0xffffff, 1.2);
    lightFront.position.set(4, 2.5, 5);
    this.scene.add(lightFront);

    const lightBack = new THREE.PointLight(0x111144, 0.5);
    lightBack.position.set(-3, -3, -4);
    this.scene.add(lightBack);
  }

  _setupOrb() {
    const geometry = new THREE.SphereGeometry(2, 128, 128);
    const material = new THREE.MeshStandardMaterial({
      color: 0x6ed6ff,
      metalness: 0.6,
      roughness: 0.25,
      emissive: 0x001122,
      emissiveIntensity: 0.4
    });

    this.material = material;
    this.orb = new THREE.Mesh(geometry, material);
    this.scene.add(this.orb);
  }

  _bindResize() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  _loop() {
    const t = performance.now() * 0.001;

    this.orb.rotation.y += 0.01;
    this.orb.rotation.x += 0.006;

    // Inner breath
    const breath = 0.33 + Math.sin(t * 2.1 + Math.cos(t * 0.5)) * 0.25;
    this.material.emissiveIntensity = breath;

    // Surface color glow
    this.currentGlow = this._lerpColor(this.currentGlow, this.targetGlow, 0.08);
    this.canvas.style.boxShadow = `0 0 120px 38px ${this.currentGlow}`;
    this.canvas.style.filter = `drop-shadow(0 0 30px ${this.currentGlow})`;

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this._loop());
  }

  _lerpColor(a, b, t) {
    const ca = parseInt(a.slice(1), 16);
    const cb = parseInt(b.slice(1), 16);
    const r = (ca >> 16) + ((cb >> 16) - (ca >> 16)) * t;
    const g = ((ca >> 8 & 255) + ((cb >> 8 & 255) - (ca >> 8 & 255)) * t);
    const bl = (ca & 255) + ((cb & 255) - (ca & 255)) * t;
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(bl)})`;
  }

  updateEmotionColor(hex) {
    this.targetGlow = hex;
  }
}
