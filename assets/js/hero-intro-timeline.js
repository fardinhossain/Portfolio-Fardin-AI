// ==========================================================================
// FARDIN.AI — HERO ENTRANCE ANIMATION TIMELINE
// Runs once on initial page load:
// - Navbar: gentle fade-in
// - Role label, headline, and description: short staggered fade-up (8px-14px)
// - Portrait & circular gradient: single smooth fade-in
// - Large bottom name: smooth left-to-right word reveal (MD. -> FARDIN -> HOSSAIN)
// - Respects prefers-reduced-motion: reduce
// ==========================================================================

import gsap from "gsap";

export function createHeroIntroTimeline({
  elements,
  onComplete,
  isReducedMotion = false
}) {
  const {
    navbar,
    bgLayer,
    haloAura,
    portraitContainer,
    labelBadge,
    headlineRef,
    taglineText,
    wordMd,
    wordFardin,
    wordHossain
  } = elements;

  const words = [wordMd, wordFardin, wordHossain].filter(Boolean);
  const allTargets = [
    navbar,
    bgLayer,
    haloAura,
    portraitContainer,
    labelBadge,
    headlineRef,
    taglineText,
    ...words
  ].filter(Boolean);

  if (isReducedMotion) {
    gsap.set(allTargets, {
      opacity: 1,
      y: 0,
      clipPath: "none",
      clearProps: "all"
    });
    if (onComplete) onComplete();
    return {
      play: () => {},
      skip: () => {},
      kill: () => {}
    };
  }

  // Initial state before entrance animation
  if (navbar) gsap.set(navbar, { opacity: 0 });
  if (bgLayer) gsap.set(bgLayer, { opacity: 0 });
  if (haloAura) gsap.set(haloAura, { opacity: 0 });
  if (portraitContainer) gsap.set(portraitContainer, { opacity: 0 });
  if (labelBadge) gsap.set(labelBadge, { opacity: 0, y: 10 });
  if (headlineRef) gsap.set(headlineRef, { opacity: 0, y: 12 });
  if (taglineText) gsap.set(taglineText, { opacity: 0, y: 10 });

  words.forEach((w) => {
    gsap.set(w, {
      clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
      opacity: 0,
      y: 8
    });
  });

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: "power2.out" },
    onComplete: () => {
      if (onComplete) onComplete();
    }
  });

  // 1. Navbar & Background gentle fade-in
  if (navbar) tl.to(navbar, { opacity: 1, duration: 0.45 }, 0.0);
  if (bgLayer) tl.to(bgLayer, { opacity: 1, duration: 0.5 }, 0.0);

  // 2. Portrait & circular halo single smooth fade-in
  if (haloAura) tl.to(haloAura, { opacity: 1, duration: 0.65 }, 0.08);
  if (portraitContainer) tl.to(portraitContainer, { opacity: 1, duration: 0.7 }, 0.12);

  // 3. Left column staggered fade-up (role label -> headline -> description)
  if (labelBadge) tl.to(labelBadge, { opacity: 1, y: 0, duration: 0.45 }, 0.14);
  if (headlineRef) tl.to(headlineRef, { opacity: 1, y: 0, duration: 0.52 }, 0.24);
  if (taglineText) tl.to(taglineText, { opacity: 1, y: 0, duration: 0.45 }, 0.36);

  // 4. Bottom oversized name smooth left-to-right reveal (MD. -> FARDIN -> HOSSAIN)
  words.forEach((w, idx) => {
    tl.to(
      w,
      {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        opacity: 1,
        y: 0,
        duration: 0.48,
        ease: "power2.out"
      },
      0.28 + idx * 0.12
    );
  });

  return {
    play: () => tl.play(),
    skip: () => {
      tl.progress(1);
    },
    kill: () => tl.kill()
  };
}
