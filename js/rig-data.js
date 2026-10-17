/**
 * rig-data.js
 * Configuration data, spring constants, layer offsets, and stage definitions for the paper-tear rig
 */

const RIG_CONFIG = {
  stages: [
    {
      id: 0,
      name: "rattle",
      promptText: "psst... something is rattling inside Nobita's desk drawer...",
      duration: 1200
    },
    {
      id: 1,
      name: "slit",
      promptText: "The blue construction paper is tearing open...",
      duration: 1400,
      sfx: "tear"
    },
    {
      id: 2,
      name: "peek",
      promptText: "Two big curious eyes peek out from the 22nd century!",
      duration: 1500,
      sfx: "tear"
    },
    {
      id: 3,
      name: "reveal",
      promptText: "Boku Doraemon! (He broke straight through the page!)",
      duration: 0,
      sfx: "chime"
    }
  ],

  // Physics constants for cursor tracking and spring dampening
  physics: {
    eyeSpring: 0.12,
    eyeDamping: 0.82,
    maxEyeOffsetX: 14, // pixels
    maxEyeOffsetY: 10, // pixels
    armIdleSpeed: 0.05,
    armIdleAmplitude: 14, // degrees
    bellDamping: 0.96,
    bellGravity: 0.18,
    bellMaxSwing: 38 // degrees
  },

  // Layers specification
  layers: {
    frame: {
      zIndex: 10,
      blendMode: "normal"
    },
    torso: {
      zIndex: 3,
      scale: 1.0,
      position: { x: 0, y: 0 }
    },
    eyes: {
      zIndex: 5,
      scale: 0.95,
      trackCursor: true
    },
    arm: {
      zIndex: 6,
      pivot: { x: "15%", y: "80%" },
      wave: true
    },
    bell: {
      zIndex: 7,
      pendulum: true,
      pivot: { x: "50%", y: "15%" }
    }
  }
};

window.RIG_CONFIG = RIG_CONFIG;
