/**
 * main.js
 * Master orchestrator:
 * - Scroll narrator pill updating with sections & interaction
 * - Air Cannon hold-to-charge engine with Canvas compression sphere & shockwave blast
 * - Navbar sound toggle & 22nd Century club form
 * - Interactive Mini-Dora footer mascot
 */

document.addEventListener("DOMContentLoaded", () => {
  // 0. 22nd Century Opening Comic Preloader & Music
  initPreloader();

  // 1. Initialize Rig, Cast, and Delivery Controllers
  const rig = new DoraemonRig();
  const cast = new CastController();
  const delivery = new AnywhereDoorDelivery();

  // 2. Audio Toggle in Navbar
  const audioToggleBtn = document.getElementById("audio-toggle-btn");
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener("click", () => {
      const isMuted = window.soundEngine.toggleMute();
      audioToggleBtn.innerHTML = isMuted ? "🔇 Unmute Audio" : "🔊 Sound ON";
      audioToggleBtn.classList.toggle("muted", isMuted);
    });
  }

  // Bell click listener on navbar logo
  const logoBell = document.getElementById("nav-logo-bell");
  if (logoBell) {
    logoBell.addEventListener("click", () => {
      if (window.soundEngine) window.soundEngine.playCollarBell();
      logoBell.classList.add("bell-swing");
      setTimeout(() => logoBell.classList.remove("bell-swing"), 800);
    });
  }

  // Also hook hero rig collar bell
  const heroBell = document.getElementById("rig-layer-bell");
  if (heroBell) {
    heroBell.addEventListener("click", () => {
      rig.ringBell();
    });
  }

  // 3. Air Cannon Hold-To-Charge Engine
  initAirCannon();

  // 4. Walkthrough Narrator Pill
  initNarratorPill();

  // 5. 22nd Century Club Form
  initClubForm();

  // 6. Mini-Dora Mascot
  initMiniDora();

  // 7. Global click audio enabler (comply with browser user-gesture policies)
  const enableAudioGesture = () => {
    if (window.soundEngine) window.soundEngine.ensureContext();
    window.removeEventListener("pointerdown", enableAudioGesture);
  };
  window.addEventListener("pointerdown", enableAudioGesture);
});

/**
 * Air Cannon Interactive Pressurize & Blast Engine
 */
function initAirCannon() {
  const triggerBtn = document.getElementById("air-cannon-trigger");
  const chargeFill = document.getElementById("cannon-charge-fill");
  const blastCountEl = document.getElementById("blast-count-number");
  const sunburstBg = document.getElementById("cannon-sunburst-bg");
  const blastFlash = document.getElementById("cannon-blast-flash");
  const dokanBadge = document.getElementById("cannon-dokan-badge");
  const canvas = document.getElementById("cannon-energy-canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;

  let chargeProgress = 0;
  let isCharging = false;
  let chargeTimer = null;
  let blastsFired = 0;
  let energyAngle = 0;
  let isFiringBeam = false;

  if (!triggerBtn) return;

  const syncCanvasSize = () => {
    if (!canvas) return;
    const w = canvas.offsetWidth || 480;
    const h = canvas.offsetHeight || 360;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  };
  syncCanvasSize();
  window.addEventListener("resize", syncCanvasSize);

  const getMuzzlePos = () => {
    syncCanvasSize();
    return {
      x: (canvas.width || 480) * 0.56,
      y: (canvas.height || 360) * 0.28
    };
  };

  const startCharge = (e) => {
    e.preventDefault();
    if (isCharging || isFiringBeam) return;
    isCharging = true;
    chargeProgress = 0;

    triggerBtn.classList.add("charging");
    if (sunburstBg) sunburstBg.classList.add("fast-spin");

    if (window.soundEngine) {
      window.soundEngine.ensureContext();
      window.soundEngine.startAirCannonCharge();
    }

    const step = () => {
      if (!isCharging) return;
      chargeProgress = Math.min(1, chargeProgress + 0.022);

      if (chargeFill) {
        chargeFill.style.width = `${(chargeProgress * 100).toFixed(0)}%`;
      }

      if (window.soundEngine) {
        window.soundEngine.updateAirCannonCharge(chargeProgress);
      }

      if (chargeProgress >= 1) {
        triggerBtn.classList.add("fully-charged");
      }

      chargeTimer = requestAnimationFrame(step);
    };
    chargeTimer = requestAnimationFrame(step);
  };

  const endCharge = (e) => {
    if (!isCharging) return;
    isCharging = false;
    cancelAnimationFrame(chargeTimer);
    triggerBtn.classList.remove("charging");
    if (sunburstBg) sunburstBg.classList.remove("fast-spin");

    const finalCharge = chargeProgress;
    chargeProgress = 0;
    if (chargeFill) {
      chargeFill.style.width = "0%";
    }
    triggerBtn.classList.remove("fully-charged");

    if (finalCharge >= 0.85) {
      // Fire beam and shockwave after release!
      fireAirCannon();
    } else {
      // Cancelled early without firing
      if (window.soundEngine) window.soundEngine.stopAirCannonCharge();
      if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const fireAirCannon = () => {
    isFiringBeam = true;
    if (window.soundEngine) {
      window.soundEngine.playAirCannonBlast();
    }

    // Fire laser shockwave beam directly from gadget muzzle
    renderBeamAndShockwave(() => {
      // Impact moment (after releasing and firing beam)
      blastsFired++;
      if (blastCountEl) blastCountEl.textContent = blastsFired.toString();

      // Screen flash
      if (blastFlash) {
        blastFlash.classList.add("fire");
        setTimeout(() => blastFlash.classList.remove("fire"), 300);
      }

      // Dokan comic explosion card/badge pops out on impact
      if (dokanBadge) {
        dokanBadge.classList.remove("show");
        void dokanBadge.offsetWidth;
        dokanBadge.classList.add("show");
        setTimeout(() => dokanBadge.classList.remove("show"), 1300);
      }
    });
  };

  triggerBtn.addEventListener("mousedown", startCharge);
  window.addEventListener("mouseup", endCharge);
  triggerBtn.addEventListener("touchstart", startCharge, { passive: false });
  window.addEventListener("touchend", endCharge);

  // Muzzle energy sphere loop (active during hold)
  const renderEnergyCanvas = () => {
    if (ctx && canvas && !isFiringBeam) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (chargeProgress > 0) {
        const { x: cx, y: cy } = getMuzzlePos();
        const radius = 8 + chargeProgress * 26;

        energyAngle += 0.16 + chargeProgress * 0.22;

        // Glowing blue/gold plasma core at gadget muzzle
        const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, radius);
        grad.addColorStop(0, "rgba(255, 255, 255, 0.98)");
        grad.addColorStop(0.45, "rgba(0, 215, 255, 0.85)");
        grad.addColorStop(0.85, "rgba(0, 119, 182, 0.4)");
        grad.addColorStop(1, "rgba(0, 119, 182, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        // Atmospheric compression arcs swirling inward
        ctx.strokeStyle = "rgba(255, 225, 50, 0.9)";
        ctx.lineWidth = 2.5;
        for (let i = 0; i < 4; i++) {
          const a = energyAngle + (i * Math.PI) / 2;
          ctx.beginPath();
          ctx.arc(cx, cy, radius * 0.72, a, a + 0.85);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(renderEnergyCanvas);
  };
  requestAnimationFrame(renderEnergyCanvas);

  function renderBeamAndShockwave(onImpact) {
    if (!ctx || !canvas) return;
    const { x: cx, y: cy } = getMuzzlePos();
    let frame = 0;
    const totalFrames = 26;
    let impactTriggered = false;

    const anim = () => {
      frame++;
      const p = frame / totalFrames;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      // 1. High-energy shockwave beam thrusting out of the cannon barrel forward into the sky
      const beamDist = p * Math.hypot(canvas.width, canvas.height) * 1.1;
      const angle = -Math.PI * 0.31; // Firing upwards & rightwards along the cannon barrel axis
      const targetX = cx + Math.cos(angle) * beamDist;
      const targetY = cy + Math.sin(angle) * beamDist;

      const beamGrad = ctx.createLinearGradient(cx, cy, targetX, targetY);
      beamGrad.addColorStop(0, `rgba(255, 255, 255, ${Math.max(0, 1 - p)})`);
      beamGrad.addColorStop(0.3, `rgba(0, 220, 255, ${Math.max(0, 0.9 * (1 - p))})`);
      beamGrad.addColorStop(1, "rgba(0, 119, 182, 0)");

      ctx.strokeStyle = beamGrad;
      ctx.lineWidth = Math.max(2, 34 * (1 - p * 0.7));
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(targetX, targetY);
      ctx.stroke();

      // 2. Expanding concentric shockwave rings from gadget muzzle
      for (let i = 0; i < 3; i++) {
        const ringR = Math.max(0, (p * 260) - i * 35);
        if (ringR > 0) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, (1 - p) * 0.85)})`;
          ctx.lineWidth = Math.max(1, 5 * (1 - p));
          ctx.beginPath();
          ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.restore();

      // Trigger impact callback after initial beam explosion
      if (frame >= 4 && !impactTriggered) {
        impactTriggered = true;
        if (onImpact) onImpact();
      }

      if (frame < totalFrames) {
        requestAnimationFrame(anim);
      } else {
        isFiringBeam = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    requestAnimationFrame(anim);
  }
}

/**
 * Walkthrough Narrator Pill that tracks scroll position
 */
function initNarratorPill() {
  const pill = document.getElementById("narrator-pill");
  const pillIcon = document.getElementById("narrator-pill-icon");
  const pillText = document.getElementById("narrator-pill-text");
  if (!pill) return;

  const sections = [
    { id: "hero-section", icon: "👋", text: "Move your cursor. He follows." },
    { id: "nobi-residence", icon: "🎭", text: "Every family member has a signature move" },
    { id: "empty-lot", icon: "👆", text: "Point at a friend. Poke their card." },
    { id: "air-cannon", icon: "⚡", text: "Hold to pressurize the Air Cannon" },
    { id: "polaroids", icon: "🔄", text: "Flip the neighborhood polaroids" },
    { id: "anywhere-door", icon: "🚪", text: "Send a Dorayaki through the Anywhere Door" },
    { id: "club-section", icon: "✨", text: "Join the 22nd Century Club!" }
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const found = sections.find(s => s.id === entry.target.id);
        if (found) {
          if (pillIcon) pillIcon.textContent = found.icon;
          if (pillText) pillText.textContent = found.text;
          pill.classList.remove("pop");
          void pill.offsetWidth;
          pill.classList.add("pop");
        }
      }
    });
  }, { threshold: 0.35 });

  sections.forEach((sec) => {
    const el = document.getElementById(sec.id);
    if (el) observer.observe(el);
  });

  pill.addEventListener("click", () => {
    pill.classList.toggle("minimized");
  });
}

/**
 * 22nd Century Club Form
 */
function initClubForm() {
  const form = document.getElementById("club-signup-form");
  const feedback = document.getElementById("club-form-feedback");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("club-email-input");
    const email = emailInput ? emailInput.value : "";

    if (feedback) {
      feedback.innerHTML = `🎉 <strong>Welcome to the 22nd Century Club, ${email}!</strong> A Take-copter badge is flying to your inbox!`;
      feedback.classList.add("show");
    }

    if (window.soundEngine) {
      window.soundEngine.playChime();
      window.soundEngine.playCollarBell();
    }

    if (emailInput) emailInput.value = "";
  });
}

/**
 * Mini-Dora Footer Mascot
 */
function initMiniDora() {
  const miniDora = document.getElementById("footer-mini-dora");
  const miniBubble = document.getElementById("mini-dora-bubble");
  if (!miniDora) return;

  miniDora.addEventListener("click", () => {
    miniDora.classList.add("hop");
    setTimeout(() => miniDora.classList.remove("hop"), 600);

    if (miniBubble) {
      miniBubble.classList.add("show");
      setTimeout(() => miniBubble.classList.remove("show"), 1800);
    }

    if (window.soundEngine) {
      window.soundEngine.playMiniDora();
    }
  });
}

/**
 * 22nd Century Opening Comic Preloader
 */
function initPreloader() {
  const preloader = document.getElementById("dora-preloader");
  const progressBar = document.getElementById("preloader-progress-bar");
  const enterBtn = document.getElementById("preloader-enter-btn");
  const statusText = document.getElementById("preloader-status");
  if (!preloader) return;

  let progress = 0;
  let entered = false;

  const dismiss = () => {
    if (entered) return;
    entered = true;
    if (window.soundEngine) {
      window.soundEngine.ensureContext();
      window.soundEngine.playIntroMusic();
    }
    preloader.classList.add("fade-out");
    setTimeout(() => {
      preloader.remove();
    }, 600);
  };

  if (enterBtn) {
    enterBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dismiss();
    });
  }

  preloader.addEventListener("click", () => {
    dismiss();
  });

  const interval = setInterval(() => {
    progress += Math.random() * 24 + 10;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      if (progressBar) progressBar.style.width = "100%";
      if (statusText) statusText.textContent = "4D Pocket Synchronized! Ready to Enter!";
      if (enterBtn) {
        enterBtn.classList.add("pulse");
        enterBtn.focus();
      }
    } else {
      if (progressBar) progressBar.style.width = `${progress}%`;
      if (progress > 55 && statusText) {
        statusText.textContent = "Summoning Anywhere Door & Take-Copter...";
      }
    }
  }, 85);
}

