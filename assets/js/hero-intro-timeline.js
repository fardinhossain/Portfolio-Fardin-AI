// ==========================================================================
// FARDIN.AI — CINEMATIC HERO OPENING SEQUENCE TIMELINE
// Coordinates: NAME REVEAL -> PORTRAIT EMERGES -> ROBOT FLIGHT -> READY FOR SCROLL
// Clean, predictable architecture with zero viewport hijacking.
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
    telemetryBadge,
    nameFill,
    nameTracer,
    nameContainer,
    portraitContainer,
    labelBadge,
    taglineText,
    ctaRow,
    skipBtn,
    scrollHint
  } = elements;

  if (isReducedMotion) {
    if (robotRef && robotRef.current) {
      robotRef.current.skipFlight();
    }
    gsap.set(
      [
        bgLayer,
        telemetryBadge,
        nameFill,
        nameContainer,
        portraitContainer,
        labelBadge,
        taglineText,
        ctaRow,
        scrollHint
      ],
      { opacity: 1, y: 0, clearProps: "all" }
    );
    if (skipBtn) gsap.set(skipBtn, { display: "none" });
    if (onComplete) onComplete();
    return {
      play: () => {},
      skip: () => {},
      kill: () => {}
    };
  }

  // Initial State Setup
  gsap.set(bgLayer, { opacity: 0 });
  gsap.set(telemetryBadge, { opacity: 0, y: -6 });
  gsap.set(portraitContainer, { opacity: 0, scale: 0.98 });
  gsap.set(nameContainer, { opacity: 1 });
  gsap.set(nameFill, { clipPath: "polygon(0 0, 0% 0, 0% 100%, 0 100%)", opacity: 0 });
  gsap.set(nameTracer, { opacity: 0, x: 0 });
  gsap.set(labelBadge, { opacity: 0, y: 12 });
  gsap.set(taglineText, { opacity: 0, y: 12 });
  gsap.set(ctaRow, { opacity: 0, y: 14 });
  gsap.set(scrollHint, { opacity: 0 });
  if (skipBtn) gsap.set(skipBtn, { opacity: 0 });

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

  // --- Phase A: Clean quiet hero, subtle background geometry fades in ---
  tl.to(bgLayer, { opacity: 1, duration: 0.5 }, 0.05);
  tl.to(telemetryBadge, { opacity: 1, y: 0, duration: 0.45 }, 0.15);
  if (skipBtn) tl.to(skipBtn, { opacity: 1, duration: 0.35 }, 0.25);

  // --- Phase B: Name writes itself onto the screen in front of portrait ---
  tl.set(nameFill, { opacity: 1 }, 0.35);
  tl.to(nameTracer, { opacity: 1, duration: 0.15 }, 0.35);

  const tracerProxy = { p: 0 };
  tl.to(
    tracerProxy,
    {
      p: 100,
      duration: 1.15,
      ease: "power2.inOut",
      onUpdate: () => {
        const val = tracerProxy.p;
        if (nameFill) {
          nameFill.style.clipPath = `polygon(0 0, ${val}% 0, ${val}% 100%, 0 100%)`;
        }
        if (nameTracer && nameContainer) {
          const width = nameContainer.clientWidth || 550;
          nameTracer.style.transform = `translate3d(${(val / 100) * width}px, 0, 0)`;
        }
      }
    },
    0.4
  );

  tl.to(nameTracer, { opacity: 0, scale: 0.5, duration: 0.25 }, 1.55);

  // --- Phase C: Portrait emerges smoothly into full focus and clarity ---
  tl.to(
    portraitContainer,
    {
      opacity: 1,
      scale: 1,
      duration: 0.85,
      ease: "power2.out"
    },
    0.95
  );

  // --- Phase D: Tiny White 3D Robot flies along curved path behind portrait ---
  tl.call(
    () => {
      if (robotRef && robotRef.current) {
        robotRef.current.startFlight();
      }
    },
    null,
    1.7
  );

  // --- Phase E: Supporting text, professional label, and CTAs fade in ---
  tl.to(labelBadge, { opacity: 1, y: 0, duration: 0.45 }, 2.0);
  tl.to(taglineText, { opacity: 1, y: 0, duration: 0.45 }, 2.15);
  tl.to(ctaRow, { opacity: 1, y: 0, duration: 0.5 }, 2.3);
  tl.to(scrollHint, { opacity: 1, duration: 0.5 }, 2.5);

  // Skip function
  function skip() {
    tl.pause();
    if (robotRef && robotRef.current) {
      robotRef.current.skipFlight();
    }
    if (nameFill) nameFill.style.clipPath = "none";
    if (nameTracer) gsap.set(nameTracer, { opacity: 0 });
    gsap.set(
      [
        bgLayer,
        telemetryBadge,
        nameFill,
        nameContainer,
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
    kill: () => tl.kill()
  };
}
