/**
 * cast.js
 * Interactive family tabs & signature moves, Empty Lot poke cards & 3D Polaroid flips
 */

class CastController {
  constructor() {
    this.currentFamilyIndex = 0;
    this.init();
  }

  init() {
    this.initFamilyTabs();
    this.initEmptyLotPokeCards();
    this.initPolaroidFlips();
  }

  // --- A. Nobi Family Tabs & Moves ---
  initFamilyTabs() {
    const tabButtons = document.querySelectorAll(".family-tab-btn");
    tabButtons.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        tabButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.selectFamilyMember(index);
        const member = NOBI_FAMILY[index];
        if (member && window.soundEngine) {
          window.soundEngine.speakCharacter(member.id);
        }
      });
    });

    // Also support clicking directly on character hotspots on the picture
    const hotspots = document.querySelectorAll(".tatami-hotspot");
    hotspots.forEach((hs) => {
      hs.addEventListener("click", () => {
        const idx = parseInt(hs.getAttribute("data-family-idx"), 10);
        if (!isNaN(idx)) {
          tabButtons.forEach((b, i) => b.classList.toggle("active", i === idx));
          this.selectFamilyMember(idx);
          const member = NOBI_FAMILY[idx];
          if (member && window.soundEngine) {
            window.soundEngine.speakCharacter(member.id);
          }
        }
      });
    });

    const moveBtn = document.getElementById("family-move-trigger");
    if (moveBtn) {
      moveBtn.addEventListener("click", () => this.triggerSignatureMove());
    }

    this.selectFamilyMember(0);
  }

  selectFamilyMember(index) {
    this.currentFamilyIndex = index;
    const member = NOBI_FAMILY[index];
    if (!member) return;

    const kanjiEl = document.getElementById("family-bio-kanji");
    const nameEl = document.getElementById("family-bio-name");
    const roleEl = document.getElementById("family-bio-role");
    const descEl = document.getElementById("family-bio-desc");
    const favEl = document.getElementById("family-bio-fav");
    const weakEl = document.getElementById("family-bio-weak");
    const moveBtn = document.getElementById("family-move-trigger");
    const moveSpeech = document.getElementById("family-move-bubble");
    const tatamiWrapper = document.getElementById("tatami-frame-wrapper");
    const spotlightBadgeText = document.getElementById("tatami-spotlight-badge-text");

    if (kanjiEl) kanjiEl.textContent = member.kanji;
    if (nameEl) nameEl.textContent = member.name;
    if (roleEl) roleEl.textContent = member.role;
    if (descEl) descEl.textContent = member.bio;
    if (favEl) favEl.textContent = member.favorite;
    if (weakEl) weakEl.textContent = member.weakness;
    if (moveBtn) moveBtn.innerHTML = member.moveButton;

    // Apply spotlight focus and dim remaining characters
    if (tatamiWrapper && member.spotlight) {
      tatamiWrapper.style.setProperty("--spot-x", member.spotlight.x);
      tatamiWrapper.style.setProperty("--spot-y", member.spotlight.y);
      tatamiWrapper.style.setProperty("--spot-rx", member.spotlight.rx);
      tatamiWrapper.style.setProperty("--spot-ry", member.spotlight.ry);
      tatamiWrapper.classList.add("has-spotlight");
    }

    if (spotlightBadgeText && member.spotlight) {
      spotlightBadgeText.textContent = member.spotlight.badge;
    }

    if (moveSpeech) {
      moveSpeech.classList.remove("show");
    }

    // Reset overlay stage
    const overlayImg = document.getElementById("family-action-overlay-img");
    const overlayStage = document.getElementById("family-action-overlay-stage");
    if (overlayStage) overlayStage.classList.remove("active");
  }

  triggerSignatureMove() {
    const member = NOBI_FAMILY[this.currentFamilyIndex];
    if (!member) return;

    const overlayStage = document.getElementById("family-action-overlay-stage");
    const overlayImg = document.getElementById("family-action-overlay-img");
    const moveSpeech = document.getElementById("family-move-bubble");
    const tatamiWrapper = document.getElementById("tatami-frame-wrapper");

    if (overlayImg && member.moveImg) {
      overlayImg.src = window.resolveAsset(member.moveImg);
    }

    if (overlayStage) {
      overlayStage.classList.add("active");
    }

    if (moveSpeech) {
      moveSpeech.textContent = member.moveSpeech;
      moveSpeech.classList.add("show");
    }

    // Sound effect and visual reactions based on character move
    switch (member.actionType) {
      case "dorayaki":
        if (window.soundEngine) window.soundEngine.playChime();
        this.spawnDoodleParticles("🥞", tatamiWrapper);
        break;

      case "testScore":
        if (window.soundEngine) window.soundEngine.playSadTrombone();
        this.spawnDoodleParticles("💯", tatamiWrapper);
        break;

      case "scold":
        if (window.soundEngine) window.soundEngine.playRumble();
        if (tatamiWrapper) {
          tatamiWrapper.classList.add("screen-rumble");
          setTimeout(() => tatamiWrapper.classList.remove("screen-rumble"), 1000);
        }
        this.spawnDoodleParticles("💢", tatamiWrapper);
        break;

      case "golf":
        if (window.soundEngine) window.soundEngine.playGolfSwing();
        this.spawnDoodleParticles("⛳", tatamiWrapper);
        break;

      case "melonPan":
        if (window.soundEngine) window.soundEngine.playMelonPanSparkle();
        this.spawnDoodleParticles("🍈", tatamiWrapper);
        break;
    }
  }

  // --- B. Empty Lot Poke Cards & Pipe Spotlight ---
  initEmptyLotPokeCards() {
    const cards = document.querySelectorAll(".poke-kid-card");
    const featureSpeech = document.getElementById("empty-lot-feature-bubble");
    const gridContainer = document.getElementById("empty-lot-grid");
    const pipesWrapper = document.getElementById("empty-lot-pipes-wrapper");
    const spotlightBadgeText = document.getElementById("empty-lot-spotlight-badge-text");

    const selectEmptyLotCharacter = (charId) => {
      const charData = EMPTY_LOT_GANG.find(c => c.id === charId);
      if (!charData) return;

      // Update active state on cards and dim others
      if (gridContainer) gridContainer.classList.add("has-active-poke");
      cards.forEach((c) => {
        c.classList.toggle("active-poke", c.getAttribute("data-char") === charId);
      });

      // Apply spotlight and dim other kids on the concrete pipes photo
      if (pipesWrapper && charData.spotlight) {
        pipesWrapper.style.setProperty("--spot-x", charData.spotlight.x);
        pipesWrapper.style.setProperty("--spot-y", charData.spotlight.y);
        pipesWrapper.style.setProperty("--spot-rx", charData.spotlight.rx);
        pipesWrapper.style.setProperty("--spot-ry", charData.spotlight.ry);
        pipesWrapper.classList.add("has-spotlight");
      }

      if (spotlightBadgeText && charData.spotlight) {
        spotlightBadgeText.textContent = charData.spotlight.badge;
      }

      if (featureSpeech) {
        featureSpeech.innerHTML = `<strong>${charData.name}:</strong> "${charData.popText}"`;
        featureSpeech.classList.add("show");
      }

      const activeCard = Array.from(cards).find(c => c.getAttribute("data-char") === charId);
      if (activeCard) {
        activeCard.classList.remove("poked");
        void activeCard.offsetWidth; // trigger reflow
        activeCard.classList.add("poked");
        this.spawnDoodleParticles(charData.doodle, activeCard);
      }

      if (charId === "gian") {
        if (window.soundEngine) {
          window.soundEngine.speakCharacter("gian");
          setTimeout(() => {
            if (window.soundEngine) window.soundEngine.playGianSinging();
          }, 650);
        }
        if (gridContainer) {
          gridContainer.classList.add("gian-earthquake");
          setTimeout(() => gridContainer.classList.remove("gian-earthquake"), 1200);
        }
      } else {
        if (window.soundEngine) {
          window.soundEngine.speakCharacter(charId);
        }
      }
    };

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        selectEmptyLotCharacter(card.getAttribute("data-char"));
      });
    });

    const hotspots = document.querySelectorAll(".empty-lot-hotspot");
    hotspots.forEach((hs) => {
      hs.addEventListener("click", () => {
        selectEmptyLotCharacter(hs.getAttribute("data-char"));
      });
    });

    // Default spotlight on Shizuka
    selectEmptyLotCharacter("shizuka");
  }

  // --- C. Neighborhood 3D Flip Polaroids ---
  initPolaroidFlips() {
    const polaroids = document.querySelectorAll(".polaroid-card");
    polaroids.forEach((card) => {
      card.addEventListener("click", () => {
        card.classList.toggle("flipped");
        if (window.soundEngine) window.soundEngine.playPolaroidFlip();
      });
    });
  }

  // Floating emoji/doodle particle spawner
  spawnDoodleParticles(emoji, targetEl) {
    if (!targetEl) return;
    const rect = targetEl.getBoundingClientRect();

    for (let i = 0; i < 6; i++) {
      const p = document.createElement("span");
      p.className = "floating-doodle-particle";
      p.textContent = emoji;

      const startX = rect.left + rect.width / 2 + (Math.random() * 80 - 40);
      const startY = rect.top + rect.height / 2 + (Math.random() * 40 - 20);

      p.style.left = `${startX}px`;
      p.style.top = `${startY}px`;
      p.style.setProperty("--fly-x", `${(Math.random() * 120 - 60)}px`);
      p.style.setProperty("--fly-y", `${-(60 + Math.random() * 90)}px`);

      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1200);
    }
  }
}

window.CastController = CastController;
