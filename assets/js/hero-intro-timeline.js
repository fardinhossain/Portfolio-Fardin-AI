// ==========================================================================
// FARDIN.AI — CINEMATIC HERO OPENING SEQUENCE TIMELINE
// 5-Phase Choreography inspired by PORTIX & Robot Interaction:
// Phase A: Prepare Scene — ambient grid, circular halo aura, subtle entry
// Phase B: Robot Flight across headline (Right -> Left) revealing:
//          1. Hossain -> 2. Fardin -> 3. Md.
// Phase C: Portrait Focus & Halftone emergence into photographic clarity
// Phase D: Robot sweeps up left side, dives behind head (depth), orbits upper halo
// Phase E: Hero Settles — label, tagline, action buttons settle; fully interactive
// ==========================================================================

import gsap from "gsap";

export function createHeroIntroTimeline({
  elements,
  robotRef,
  onComplete,
  isReducedMotion = false
}) {
  const {
    bgLayer,
    haloAura,
    telemetryBadge,
    portraitContainer,
    wordMd,
    wordFardin,
    wordHossain,
    labelBadge,
    taglineText,
    ctaRow,
    skipBtn,
    scrollHint
  } = elements;

  const words = [wordHossain, wordFardin, wordMd].filter(Boolean);

  if (isReducedMotion) {
    if (robotRef && robotRef.current) {
      robotRef.current.skipFlight();
    }
    gsap.set(
      [
        bgLayer,
        haloAura,
        telemetryBadge,
        portraitContainer,
        labelBadge,
        taglineText,
        ctaRow,
        scrollHint,
        ...words
      ],
      { opacity: 1, y: 0, clipPath: "none", clearProps: "all" }
    );
    if (skipBtn) gsap.set(skipBtn, { display: "none" });
    if (onComplete) onComplete();
    return {
      play: () => {},
      skip: () => {},
      kill: () => {},
      revealWord: () => {}
    };
  }

  // Initial State Setup
  gsap.set(bgLayer, { opacity: 0 });
  if (haloAura) gsap.set(haloAura, { opacity: 0, scale: 0.88 });
  gsap.set(telemetryBadge, { opacity: 0, y: -6 });
  // Portrait starts subdued (Phase A)
  gsap.set(portraitContainer, { opacity: 0.35, scale: 0.97 });

  // Each word starts hidden from right to left
  words.forEach((w) => {
    gsap.set(w, {
      clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
      opacity: 0,
      y: 4
    });
  });

  gsap.set(labelBadge, { opacity: 0, y: 12 });
  gsap.set(taglineText, { opacity: 0, y: 12 });
  gsap.set(ctaRow, { opacity: 0, y: 14 });
  gsap.set(scrollHint, { opacity: 0 });
  if (skipBtn) gsap.set(skipBtn, { opacity: 0 });

  // Function to smoothly unmask a specific word right-to-left
  function revealWord(wordKey) {
    let target = null;
    if (wordKey === "hossain") target = wordHossain;
    else if (wordKey === "fardin") target = wordFardin;
    else if (wordKey === "md") target = wordMd;

    if (target) {
      gsap.to(target, {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        opacity: 1,
        y: 0,
        duration: 0.42,
        ease: "power2.out"
      });
    }
  }

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: "power2.out" },
    onComplete: () => {
      if (skipBtn) {
        gsap.to(skipBtn, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => gsap.set(skipBtn, { display: "none" })
        });
      }
      if (onComplete) onComplete();
    }
  });

  // --- Phase A: Prepare Scene (0.0s - 0.4s) ---
  tl.to(bgLayer, { opacity: 1, duration: 0.5 }, 0.05);
  if (haloAura) tl.to(haloAura, { opacity: 0.85, scale: 1.0, duration: 0.6 }, 0.1);
  tl.to(telemetryBadge, { opacity: 1, y: 0, duration: 0.45 }, 0.15);
  if (skipBtn) tl.to(skipBtn, { opacity: 1, duration: 0.35 }, 0.25);

  // --- Phase B: Launch 3D Flying Robot from Right across Headline (0.4s) ---
  tl.call(
    () => {
      if (robotRef && robotRef.current) {
        robotRef.current.startFlight();
      }
    },
    null,
    0.4
  );

  // Fallback programmatic reveal triggers in case WebGL triggers don't fire
  // (Ensures guaranteed progression across all environments)
  tl.call(() => revealWord("hossain"), null, 1.15);
  tl.call(() => revealWord("fardin"), null, 1.85);
  tl.call(() => revealWord("md"), null, 2.55);

  // --- Phase C: Portrait Emerges into Full Clarity (2.8s) ---
  tl.to(
    portraitContainer,
    {
      opacity: 1,
      scale: 1,
      duration: 0.75,
      ease: "power2.out"
    },
    2.8
  );

  // --- Phase E: Supporting Text, Professional Label, & CTAs (3.2s - 3.8s) ---
  tl.to(labelBadge, { opacity: 1, y: 0, duration: 0.45 }, 3.2);
  tl.to(taglineText, { opacity: 1, y: 0, duration: 0.45 }, 3.4);
  tl.to(ctaRow, { opacity: 1, y: 0, duration: 0.45 }, 3.6);
  tl.to(scrollHint, { opacity: 1, duration: 0.45 }, 3.8);

  // Skip Function — Immediate graceful settle
  function skip() {
    tl.pause();
    if (robotRef && robotRef.current) {
      robotRef.current.skipFlight();
    }
    words.forEach((w) => {
      if (w) gsap.set(w, { clipPath: "none", opacity: 1, y: 0 });
    });
    gsap.set(
      [
        bgLayer,
        haloAura,
        telemetryBadge,
        portraitContainer,
        labelBadge,
        taglineText,
        ctaRow,
        scrollHint
      ],
      { opacity: 1, y: 0, scale: 1 }
    );
    if (skipBtn) gsap.set(skipBtn, { display: "none" });
    if (onComplete) onComplete();
  }

  return {
    play: () => tl.play(),
    skip,
    kill: () => tl.kill(),
    revealWord
  };
}
