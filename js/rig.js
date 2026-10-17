/**
 * rig.js
 * 4-Stage Paper-Tear Intro + 60fps Cursor-Tracking Doraemon Multi-Layer Rig
 */

class DoraemonRig {
  constructor() {
    this.container = document.getElementById("hero-rig-container");
    this.stage = 0;
    this.mouse = { x: 0, y: 0, normX: 0, normY: 0 };
    this.eyeTarget = { x: 0, y: 0 };
    this.eyeCurrent = { x: 0, y: 0 };
    this.eyeVelocity = { x: 0, y: 0 };
    this.bellAngle = 0;
    this.bellVelocity = 0;
    this.armTime = 0;
    this.animFrameId = null;
    this.isReplaying = false;

    this.init();
  }

  init() {
    if (!this.container) return;

    // Track mouse coordinates relative to the rig container
    window.addEventListener("mousemove", (e) => this.onMouseMove(e));
    window.addEventListener("touchmove", (e) => this.onTouchMove(e), { passive: true });

    // Setup Replay button
    const replayBtn = document.getElementById("replay-tear-btn");
    if (replayBtn) {
      replayBtn.addEventListener("click", () => this.replaySequence());
    }

    // Auto-advance sequence from stage 0
    this.startSequence();
    this.startPhysicsLoop();
  }

  onMouseMove(e) {
    const rect = this.container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    // Normalized coordinates (-1 to +1)
    const normX = Math.max(-1, Math.min(1, dx / (window.innerWidth * 0.4)));
    const normY = Math.max(-1, Math.min(1, dy / (window.innerHeight * 0.4)));

    this.mouse.normX = normX;
    this.mouse.normY = normY;

    this.eyeTarget.x = normX * RIG_CONFIG.physics.maxEyeOffsetX;
    this.eyeTarget.y = normY * RIG_CONFIG.physics.maxEyeOffsetY;

    // Bell swing impulse from mouse velocity
    this.bellVelocity += normX * 1.5;
  }

  onTouchMove(e) {
    if (e.touches && e.touches[0]) {
      this.onMouseMove(e.touches[0]);
    }
  }

  startSequence() {
    this.setStage(0);

    setTimeout(() => {
      this.setStage(1);
      if (window.soundEngine) window.soundEngine.playPaperTear();
    }, 900);

    setTimeout(() => {
      this.setStage(2);
      if (window.soundEngine) window.soundEngine.playPaperTear();
    }, 2200);

    setTimeout(() => {
      this.setStage(3);
      if (window.soundEngine) {
        window.soundEngine.playChime();
        window.soundEngine.playCollarBell();
      }
    }, 3600);
  }

  replaySequence() {
    if (this.isReplaying) return;
    this.isReplaying = true;
    this.startSequence();
    setTimeout(() => {
      this.isReplaying = false;
    }, 4000);
  }

  setStage(stageNum) {
    this.stage = stageNum;
    if (!this.container) return;

    this.container.setAttribute("data-stage", stageNum);

    // Update prompt or narrator hint
    const stagePrompt = document.getElementById("stage-prompt-text");
    if (stagePrompt && RIG_CONFIG.stages[stageNum]) {
      stagePrompt.textContent = RIG_CONFIG.stages[stageNum].promptText;
    }

    // Trigger chroma-keying for the multi-layer rig once in stage 3
    if (stageNum === 3) {
      this.processChromaLayers();
    }
  }

  processChromaLayers() {
    const torsoImg = document.getElementById("rig-torso-img");
    const eyesImg = document.getElementById("rig-eyes-img");
    const armImg = document.getElementById("rig-arm-img");
    const bellImg = document.getElementById("rig-bell-img");

    [torsoImg, eyesImg, armImg, bellImg].forEach((img) => {
      if (!img) return;
      if (img.complete && img.naturalWidth) {
        this.applyChromaToImg(img);
      } else {
        img.onload = () => this.applyChromaToImg(img);
      }
    });
  }

  applyChromaToImg(img) {
    try {
      if (img.dataset.chromaProcessed === "true") return;
      const strippedCanvas = window.stripBackgroundToCanvas(img, "white", 28);
      if (strippedCanvas) {
        img.src = strippedCanvas.toDataURL("image/png");
        img.dataset.chromaProcessed = "true";
      }
    } catch (err) {
      // If cross-origin or security restriction, keep fallback CSS masking
      console.warn("Chroma-key canvas fallback active", err);
    }
  }

  startPhysicsLoop() {
    const loop = () => {
      this.updatePhysics();
      this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  updatePhysics() {
    // 1. Spring physics for eye tracking
    const spring = RIG_CONFIG.physics.eyeSpring;
    const damping = RIG_CONFIG.physics.eyeDamping;

    const forceX = (this.eyeTarget.x - this.eyeCurrent.x) * spring;
    const forceY = (this.eyeTarget.y - this.eyeCurrent.y) * spring;

    this.eyeVelocity.x = (this.eyeVelocity.x + forceX) * damping;
    this.eyeVelocity.y = (this.eyeVelocity.y + forceY) * damping;

    this.eyeCurrent.x += this.eyeVelocity.x;
    this.eyeCurrent.y += this.eyeVelocity.y;

    const eyesEl = document.getElementById("rig-layer-eyes");
    if (eyesEl) {
      eyesEl.style.transform = `translate(${this.eyeCurrent.x.toFixed(1)}px, ${this.eyeCurrent.y.toFixed(1)}px)`;
    }

    // 2. Pendulum physics for golden collar bell
    const bellEl = document.getElementById("rig-layer-bell");
    if (bellEl) {
      // Restoring gravity force towards 0 degrees
      const gravity = -RIG_CONFIG.physics.bellGravity * Math.sin((this.bellAngle * Math.PI) / 180);
      this.bellVelocity += gravity;
      this.bellVelocity *= RIG_CONFIG.physics.bellDamping;
      this.bellAngle += this.bellVelocity;

      // Clamp bell swing
      const maxSwing = RIG_CONFIG.physics.bellMaxSwing;
      if (this.bellAngle > maxSwing) {
        this.bellAngle = maxSwing;
        this.bellVelocity = -this.bellVelocity * 0.5;
      } else if (this.bellAngle < -maxSwing) {
        this.bellAngle = -maxSwing;
        this.bellVelocity = -this.bellVelocity * 0.5;
      }

      bellEl.style.transform = `rotate(${this.bellAngle.toFixed(2)}deg)`;
    }

    // 3. Waving arm periodic swing
    const armEl = document.getElementById("rig-layer-arm");
    if (armEl) {
      this.armTime += RIG_CONFIG.physics.armIdleSpeed;
      const waveDeg = Math.sin(this.armTime) * RIG_CONFIG.physics.armIdleAmplitude - 5;
      armEl.style.transform = `rotate(${waveDeg.toFixed(2)}deg)`;
    }
  }

  ringBell() {
    this.bellVelocity = 18; // Give an immediate swing kick
    if (window.soundEngine) {
      window.soundEngine.playCollarBell();
    }
  }
}

window.DoraemonRig = DoraemonRig;
