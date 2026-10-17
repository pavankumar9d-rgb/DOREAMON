/**
 * delivery.js
 * Anywhere Door Dorayaki & Memory Delivery Controller
 * Video synchronization with time-coded anime dialogue + interactive canvas doodle particles
 */

class AnywhereDoorDelivery {
  constructor() {
    this.video = document.getElementById("anywhere-door-video");
    this.videoWrapper = document.getElementById("delivery-video-wrapper");
    this.playOverlayBtn = document.getElementById("video-play-overlay-btn");
    this.soundToggleBtn = document.getElementById("video-sound-toggle-btn");
    this.nameInput = document.getElementById("delivery-recipient-input");
    this.badgeName = document.getElementById("delivery-badge-name");
    this.dialogueBubble = document.getElementById("delivery-dialogue-bubble");
    this.statusText = document.getElementById("delivery-status-text");
    this.deliverBtn = document.getElementById("delivery-start-btn");
    this.copyLinkBtn = document.getElementById("delivery-copy-link-btn");
    this.canvas = document.getElementById("delivery-doodle-canvas");
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;

    this.recipientName = "Mom";
    this.doodles = [];
    this.animId = null;

    this.init();
  }

  init() {
    // Mobile-safe initial video properties
    if (this.video) {
      this.video.muted = true;
      this.video.defaultMuted = true;
      this.video.playsInline = true;
      this.video.setAttribute("playsinline", "");
      this.video.setAttribute("webkit-playsinline", "");

      this.video.addEventListener("timeupdate", () => this.onTimeUpdate());
      this.video.addEventListener("ended", () => this.onVideoEnded());
      this.video.addEventListener("play", () => this.updatePlayState(true));
      this.video.addEventListener("pause", () => this.updatePlayState(false));

      // Attempt preload without blocking
      try {
        this.video.load();
      } catch (e) {}
    }

    // Check URL parameters for ?to=Name
    const params = new URLSearchParams(window.location.search);
    const toParam = params.get("to");
    if (toParam) {
      this.setRecipient(decodeURIComponent(toParam));
      if (this.nameInput) this.nameInput.value = this.recipientName;
    }

    if (this.nameInput) {
      this.nameInput.addEventListener("input", (e) => {
        this.setRecipient(e.target.value || "Friend");
      });
    }

    // Quick recipient pills
    const pills = document.querySelectorAll(".recipient-pill");
    pills.forEach((pill) => {
      pill.addEventListener("click", () => {
        pills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        const val = pill.getAttribute("data-name");
        this.setRecipient(val);
        if (this.nameInput) this.nameInput.value = val;
        if (window.soundEngine) window.soundEngine.playPoke();
      });
    });

    if (this.deliverBtn) {
      this.deliverBtn.addEventListener("click", () => this.deliverNow());
    }

    if (this.playOverlayBtn) {
      this.playOverlayBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.deliverNow();
      });
    }

    if (this.videoWrapper) {
      this.videoWrapper.addEventListener("click", () => {
        if (!this.video) return;
        if (this.video.paused) {
          this.deliverNow();
        } else {
          this.video.pause();
        }
      });
    }

    if (this.soundToggleBtn && this.video) {
      this.soundToggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.video.muted = !this.video.muted;
        this.soundToggleBtn.textContent = this.video.muted ? "🔇 Sound: OFF" : "🔊 Sound: ON";
        this.soundToggleBtn.classList.toggle("unmuted", !this.video.muted);
      });
    }

    if (this.copyLinkBtn) {
      this.copyLinkBtn.addEventListener("click", () => this.copyShareableLink());
    }

    this.initCanvas();
  }

  updatePlayState(isPlaying) {
    if (this.videoWrapper) {
      this.videoWrapper.classList.toggle("is-playing", isPlaying);
    }
    if (this.playOverlayBtn) {
      if (isPlaying) {
        this.playOverlayBtn.classList.add("hidden");
      } else {
        this.playOverlayBtn.classList.remove("hidden");
        const isEnded = this.video && (this.video.ended || this.video.currentTime >= 9.5);
        this.playOverlayBtn.innerHTML = isEnded 
          ? `<span class="play-overlay-icon">🔄</span><span class="play-overlay-text">Deliver Again</span>`
          : `<span class="play-overlay-icon">▶</span><span class="play-overlay-text">Play Delivery</span>`;
      }
    }
  }

  setRecipient(name) {
    this.recipientName = name.trim() || "Someone Special";
    if (this.badgeName) {
      this.badgeName.textContent = this.recipientName;
    }
  }

  deliverNow() {
    if (!this.video) return;

    if (window.soundEngine) {
      window.soundEngine.ensureContext();
      window.soundEngine.playChime();
    }

    // If ended or near end, restart
    if (this.video.ended || this.video.currentTime >= 9.5) {
      this.video.currentTime = 0;
    }

    this.video.muted = this.soundToggleBtn && this.soundToggleBtn.classList.contains("unmuted") ? false : true;
    this.video.defaultMuted = true;
    this.video.playsInline = true;

    const playPromise = this.video.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.updatePlayState(true);
      }).catch((err) => {
        console.warn("Video play interrupted, retrying muted...", err);
        this.video.muted = true;
        this.video.play().then(() => this.updatePlayState(true)).catch(e => console.error("Playback fallback error:", e));
      });
    }

    if (this.statusText) {
      this.statusText.textContent = `🚪 Stepping through the Anywhere Door to reach ${this.recipientName}...`;
    }

    this.burstDoodles();
  }

  onTimeUpdate() {
    if (!this.video || !this.dialogueBubble) return;
    const t = this.video.currentTime;

    if (t >= 0.2 && t < 2.8) {
      this.dialogueBubble.innerHTML = `🌸 <em>"I saved my warmest Dorayaki and fresh flowers for you, <strong>${this.recipientName}</strong>..."</em>`;
      this.dialogueBubble.classList.add("show");
    } else if (t >= 2.8 && t < 5.8) {
      this.dialogueBubble.innerHTML = `🥞 <em>"Hehe... thank you for always being part of our childhood, <strong>${this.recipientName}</strong>!"</em>`;
      this.dialogueBubble.classList.add("show");
    } else if (t >= 5.8 && t < 9.5) {
      this.dialogueBubble.innerHTML = `✨ <em>"Eat it while it's still warm! Mata ne, <strong>${this.recipientName}</strong>!"</em>`;
      this.dialogueBubble.classList.add("show");
      if (Math.random() > 0.6) {
        this.addDoodle();
      }
    } else {
      this.dialogueBubble.classList.remove("show");
    }
  }

  onVideoEnded() {
    this.updatePlayState(false);
    if (this.statusText) {
      this.statusText.textContent = `🥞 ${this.recipientName} received the warm Dorayaki and smiled!`;
    }
    if (window.soundEngine) window.soundEngine.playCollarBell();
    this.burstDoodles();
  }

  copyShareableLink() {
    const url = new URL(window.location.href);
    url.searchParams.set("to", this.recipientName);
    navigator.clipboard.writeText(url.toString()).then(() => {
      const orig = this.copyLinkBtn.textContent;
      this.copyLinkBtn.textContent = "✓ Link Copied to Clipboard!";
      if (window.soundEngine) window.soundEngine.playChime();
      setTimeout(() => {
        this.copyLinkBtn.textContent = orig;
      }, 2500);
    }).catch(() => {
      // Fallback
      prompt("Share this personalized link:", url.toString());
    });
  }

  // --- Canvas Floating Doodles ---
  initCanvas() {
    if (!this.canvas) return;
    const resize = () => {
      this.canvas.width = this.canvas.offsetWidth || 500;
      this.canvas.height = this.canvas.offsetHeight || 380;
    };
    resize();
    window.addEventListener("resize", resize);
    this.renderCanvasLoop();
  }

  addDoodle() {
    if (!this.canvas) return;
    const types = ["🥞", "🔔", "🚁", "🌸", "✨"];
    const type = types[Math.floor(Math.random() * types.length)];
    this.doodles.push({
      x: Math.random() * this.canvas.width,
      y: this.canvas.height + 20,
      char: type,
      vx: (Math.random() - 0.5) * 1.2,
      vy: -(1.5 + Math.random() * 2),
      size: 18 + Math.random() * 16,
      rot: (Math.random() - 0.5) * 0.4,
      alpha: 1
    });
  }

  burstDoodles() {
    for (let i = 0; i < 18; i++) {
      setTimeout(() => this.addDoodle(), i * 60);
    }
  }

  renderCanvasLoop() {
    const render = () => {
      if (this.ctx && this.canvas) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.doodles.length - 1; i >= 0; i--) {
          const d = this.doodles[i];
          d.x += d.vx;
          d.y += d.vy;
          d.alpha -= 0.007;

          if (d.alpha <= 0 || d.y < -30) {
            this.doodles.splice(i, 1);
            continue;
          }

          this.ctx.save();
          this.ctx.globalAlpha = Math.max(0, d.alpha);
          this.ctx.font = `${d.size}px ui-rounded, sans-serif`;
          this.ctx.translate(d.x, d.y);
          this.ctx.rotate(d.rot);
          this.ctx.fillText(d.char, 0, 0);
          this.ctx.restore();
        }
      }
      this.animId = requestAnimationFrame(render);
    };
    this.animId = requestAnimationFrame(render);
  }
}

window.AnywhereDoorDelivery = AnywhereDoorDelivery;
