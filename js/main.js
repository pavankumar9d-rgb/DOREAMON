/**
 * main.js
 * Master orchestrator:
 * - Scroll narrator pill updating with sections & interaction
 * - Air Cannon hold-to-charge engine with Canvas compression sphere & shockwave blast
 * - Navbar sound toggle & 22nd Century club form
 * - Interactive Mini-Dora footer mascot
 */

document.addEventListener("DOMContentLoaded", () => {
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

  if (!triggerBtn) return;

  const startCharge = (e) => {
    e.preventDefault();
    if (isCharging) return;
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

    if (chargeProgress >= 0.92) {
      // FIRE BLAST!
      fireAirCannon();
    } else {
      // Cancelled early
      if (window.soundEngine) window.soundEngine.stopAirCannonCharge();
    }

    // Reset bar
    chargeProgress = 0;
    if (chargeFill) {
      chargeFill.style.width = "0%";
    }
    triggerBtn.classList.remove("fully-charged");
  };

  const fireAirCannon = () => {
    blastsFired++;
    if (blastCountEl) blastCountEl.textContent = blastsFired.toString();

    if (window.soundEngine) {
      window.soundEngine.playAirCannonBlast();
    }

    // Screen flash
    if (blastFlash) {
      blastFlash.classList.add("fire");
      setTimeout(() => blastFlash.classList.remove("fire"), 400);
    }

    // Dokan comic explosion burst
    if (dokanBadge) {
      dokanBadge.classList.remove("show");
      void dokanBadge.offsetWidth;
      dokanBadge.classList.add("show");
      setTimeout(() => dokanBadge.classList.remove("show"), 1400);
    }

    // Canvas shockwave rings
    renderShockwaveRings();
  };

  triggerBtn.addEventListener("mousedown", startCharge);
  window.addEventListener("mouseup", endCharge);
  triggerBtn.addEventListener("touchstart", startCharge, { passive: false });
  window.addEventListener("touchend", endCharge);

  // Muzzle energy sphere loop
  const renderEnergyCanvas = () => {
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (chargeProgress > 0) {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = 10 + chargeProgress * 32;

        energyAngle += 0.15 + chargeProgress * 0.2;

        // Glowing core
        const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, radius);
        grad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        grad.addColorStop(0.5, "rgba(0, 200, 255, 0.7)");
        grad.addColorStop(1, "rgba(0, 119, 182, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        // Energy arcs
        ctx.strokeStyle = "rgba(255, 220, 0, 0.85)";
        ctx.lineWidth = 2.5;
        for (let i = 0; i < 4; i++) {
          const a = energyAngle + (i * Math.PI) / 2;
          ctx.beginPath();
          ctx.arc(cx, cy, radius * 0.75, a, a + 0.8);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(renderEnergyCanvas);
  };
  requestAnimationFrame(renderEnergyCanvas);

  function renderShockwaveRings() {
    if (!ctx || !canvas) return;
    let r = 20;
    const maxR = 240;
    const animShock = () => {
      r += 12;
      ctx.save();
      ctx.strokeStyle = `rgba(255, 255, 255, ${1 - r / maxR})`;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      if (r < maxR) {
        requestAnimationFrame(animShock);
      }
    };
    animShock();
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
