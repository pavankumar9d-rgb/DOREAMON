/**
 * assets-manifest.js
 * Central manifest of all media assets + smart path resolver + offscreen canvas background stripping
 */

const ASSET_MANIFEST = {
  // 1. Hero & Rig
  tearSlit: "Paper_tear_with_glowing_slit_20261017095845.jpg",
  peekingEyes: "Character_peeking_through_torn_p._20261017095845.jpg",
  tornFrame: "Torn_paper_opening_frame_20261017095845.jpg",
  doraemonTorso: "Anime_character_sprite_layer_design_20261017095845.jpg",
  doraemonEyes: "Anime_eyes_for_animation_20261017095845.jpg",
  wavingArm: "Character_waving_arm_sprite_layer_20261017095845.jpg",
  collarBell: "Doraemon_golden_collar_bell_sprite_20261017095845.jpg",

  // 2. Nobi Residence
  familyTatami: "Family_posing_together_on_tatami_20261017095845.jpg",
  nobitaScore: "Boy_holding_failed_test_paper_20261017095845.jpg",
  tamakoScold: "Woman_scolding_with_hands_on_20261017095845.jpg",
  nobisukeGolf: "Man_practicing_golf_swing_20261017095845.jpg",
  doraemonDorayaki: "Doraemon_holding_giant_golden_pa._20261017095845.jpg",
  doramiMelonPan: "Robot_cat_holding_melon-pan_20261017095845.jpg",

  // 3. Empty Lot Gang
  emptyLotGroup: "Doraemon_characters_laughing_tog._20261017095845.jpg",
  shizukaPotato: "Girl_holding_sweet_potato_20261017095845.jpg",
  gianConcert: "Character_singing_into_microphone_20261017095845.jpg",
  suneoAirplane: "Suneo_holding_toy_airplane_20261017095845.jpg",
  dekisugiBook: "Boy_holding_encyclopedia_pointin._20261017095845.jpg",

  // 4. Air Cannon
  airCannonPose: "Doraemon_and_Nobita_posing_heroi._20261017095845.jpg",

  // 5. Polaroids
  senseiPolaroid: "Teacher_holding_chalk_and_roster_20261017095845.jpg",
  jaikoPolaroid: "Character_holding_pen_and_manusc._20261017095845.jpg",
  kaminariPolaroid: "Man_holding_bonsai_tree_20261017095845.jpg",

  // 6. Anywhere Door Delivery
  omniVideo: "Animated_character_offering_food._20261017095845.mp4",

  // 7. Footer
  miniDora: "Mini-Dora_waving_paw_20261017095845.jpg"
};

/**
 * Smart Path Resolver
 * Resolves filename across ./assets/, ./Assests/, and ./
 * Automatically handles dot/space variants and URI encoding
 */
function resolveAsset(filename) {
  if (!filename) return "";
  // Check if filename is a key in ASSET_MANIFEST
  if (ASSET_MANIFEST[filename]) {
    filename = ASSET_MANIFEST[filename];
  }

  // Pre-generate path candidates
  const cleanName = filename.trim();
  const spaceVariant = cleanName.replace(/\._20261017095845/, " _20261017095845");
  const dotVariant = cleanName.replace(/ _20261017095845/, "._20261017095845");

  // Primary candidate: assets directory with encoded URI
  return `assets/${encodeURIComponent(dotVariant)}`;
}

/**
 * Fallback image error handler that tries alternative path prefixes & variants
 */
function handleAssetError(imgElement, originalFilename) {
  if (!imgElement || imgElement.dataset.triedFallback === "3") return;
  const stage = parseInt(imgElement.dataset.triedFallback || "0", 10);
  imgElement.dataset.triedFallback = (stage + 1).toString();

  const base = originalFilename || imgElement.getAttribute("src") || "";
  const dotVar = base.replace(/ _20261017095845/, "._20261017095845");
  const spaceVar = base.replace(/\._20261017095845/, " _20261017095845");

  if (stage === 0) {
    imgElement.src = `assets/${encodeURIComponent(spaceVar.split("/").pop())}`;
  } else if (stage === 1) {
    imgElement.src = `Assests/${encodeURIComponent(dotVar.split("/").pop())}`;
  } else if (stage === 2) {
    imgElement.src = `./${encodeURIComponent(dotVar.split("/").pop())}`;
  }
}

/**
 * Canvas background chroma / alpha stripper
 * Removes solid white/light-grey or checkerboard borders from JPG sprite layers
 * with soft edge anti-aliasing
 */
const _chromaCache = new Map();

function stripBackgroundToCanvas(img, mode = "white", tolerance = 25) {
  if (!img || !img.naturalWidth) return null;
  const cacheKey = `${img.src}_${mode}_${tolerance}`;
  if (_chromaCache.has(cacheKey)) {
    return _chromaCache.get(cacheKey);
  }

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const len = data.length;

  for (let i = 0; i < len; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (mode === "white") {
      // White/near-white detection
      const minVal = Math.min(r, g, b);
      const maxVal = Math.max(r, g, b);
      const isNeutral = (maxVal - minVal) < 18;

      if (isNeutral && minVal > 230) {
        // High opacity falloff
        const diff = minVal - 230;
        const alpha = Math.max(0, 1 - (diff / tolerance));
        data[i + 3] = Math.floor(data[i + 3] * alpha);
      }
    } else if (mode === "corner") {
      // Color sample from top-left pixel
      const targetR = data[0];
      const targetG = data[1];
      const targetB = data[2];
      const dist = Math.hypot(r - targetR, g - targetG, b - targetB);
      if (dist < tolerance) {
        data[i + 3] = 0;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  _chromaCache.set(cacheKey, canvas);
  return canvas;
}

window.ASSET_MANIFEST = ASSET_MANIFEST;
window.resolveAsset = resolveAsset;
window.handleAssetError = handleAssetError;
window.stripBackgroundToCanvas = stripBackgroundToCanvas;
