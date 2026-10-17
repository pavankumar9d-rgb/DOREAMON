# Doraemon-lite: Interactive Childhood Tribute

A 60fps interactive fan-tribute to Fujiko F. Fujio's iconic robot cat **Doraemon (ドラえもん)**.

---

## ⚡ Zero External Dependencies & Open-Source Legal Safety
- **No Google Fonts / No External CDNs**: Zero `<link>` or `@import` font tags. 100% native system rounded/comic font stacks (`ui-rounded, "Hiragino Maru Gothic ProN", "Quicksand", system-ui, sans-serif`).
- **100% Procedural Web Audio API**: Custom audio synthesizer (`js/sound-engine.js`) creating paper tears, golden collar bell chimes, Air Cannon turbine charge and DOKAN explosions, sad trombone, Gian boe vocals, and Mini-Dora squeaks in real time.
- **60fps Vanilla ES6 Physics**: Spring-inertia cursor tracking, pendulum physics, and canvas shockwave animation without GSAP or Howler.
- **Smart Path Resolver & Chroma-Keying**: Resolves assets across `./assets/`, `./Assests/`, and `./` while performing canvas-level chroma-keying for sprite compositing.

---

## 🌟 Interactive Features
1. **Hero Paper-Tear Rig**: 4-stage intro sequence leading to a multi-layer interactive rig with eye pupil cursor-tracking, waving arm, pendulum swinging collar bell, and replayable sequence.
2. **Diagonal Collar-Red Ribbon**: Infinite marquee with retro anime typography.
3. **The Nobi Residence**: Interactive tatami family portrait with 5 character tabs and signature moves:
   - Doraemon: Summon Giant Dorayaki
   - Nobita: Reveal 0-Point Test Score
   - Tamako (Mom): 60-Minute Scolding with Screen Rumble
   - Nobisuke (Dad): Practice Golf Swing
   - Dorami: Offer Sweet Melon Bread
4. **The Empty Lot Gang (Akichi)**: 4 poke cards with comic badge bounces, doodle particles, and Gian's reciting earthquake shake.
5. **Air Cannon Gadget Simulator**: Hold to pressurize atmospheric air, spin golden sunburst, pitch up turbine hum, and release to blast shockwave rings with "DOKAN!" comic badge.
6. **Neighborhood Legends**: 3D flip Polaroids with authentic handwritten cursive/chalk notes on the back.
7. **Anywhere Door Express Delivery**: Video player synchronized with time-coded anime dialogue personalized with custom recipient name and shareable URL query generator.
8. **22nd Century Club & Twilight Footer**: Polka-dot club signup card with peeking Doraemon, "Mata ne!" comic sign-off, and interactive hopping Mini-Dora mascot.

---

## 🚀 Running Locally
Simply open `index.html` in any modern web browser or serve via a lightweight HTTP server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```
Visit `http://localhost:8000`.
