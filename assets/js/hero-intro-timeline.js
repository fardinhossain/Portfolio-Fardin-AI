// ==========================================================================
// FARDIN.AI — CINEMATIC HERO OPENING SEQUENCE TIMELINE
// Coordinates Phase A (Quiet Hero) -> Phase B (Name writes itself) ->
// Phase C (Portrait emerges through dots) -> Phase D (Robot flight) ->
// Phase E (Tagline & Actions reveal).
// Supports instant Skip Intro and passive scroll interruption.
// ==========================================================================

import gsap from "gsap";

export function createHeroIntroTimeline({
  elements,
  shaderRef,
  robotRef,
  onComplete,
  isReducedMotion = false
}) {
  const {
    bgLayer,
    telemetryBadge,
    nameStroke,
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
    // Instant static resolution for users who prefer reduced motion
    if (shaderRef && shaderRef.current) {
      shaderRef.current.setIntroProgress(1.0);
    }
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
  gsap.set(telemetryBadge, { opacity: 0, y: -8 });
  gsap.set(nameContainer, { opacity: 1 });
  gsap.set(nameFill, { clipPath: "polygon(0 0, 0% 0, 0% 100%, 0 100%)", opacity: 0 });
  gsap.set(nameTracer, { opacity: 0, x: 0 });
  gsap.set(labelBadge, { opacity: 0, y: 14 });
  gsap.set(taglineText, { opacity: 0, y: 14 });
  gsap.set(ctaRow, { opacity: 0, y: 16 });
  gsap.set(scrollHint, { opacity: 0 });
  if (skipBtn) gsap.set(skipBtn, { opacity: 0 });

  if (shaderRef && shaderRef.current) {
    shaderRef.current.setIntroProgress(0.0);
  }

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: "power2.out" },
    onComplete: () => {
      if (skipBtn) gsap.to(skipBtn, { opacity: 0, duration: 0.3, onComplete: () => gsap.set(skipBtn, { display: "none" }) });
      if (onComplete) onComplete();
    }
  });

  // --- Phase A: Clean quiet hero, subtle background geometry & indicator fade in ---
  tl.to(bgLayer, { opacity: 1, duration: 0.65 }, 0.05);
  tl.to(telemetryBadge, { opacity: 1, y: 0, duration: 0.5 }, 0.2);
  if (skipBtn) tl.to(skipBtn, { opacity: 1, duration: 0.4 }, 0.3);

  // --- Phase B: Name writes itself onto the screen ---
  // A glowing red tracer dot leads the reveal as the name glyphs draw across
  tl.set(nameFill, { opacity: 1 }, 0.45);
  tl.to(nameTracer, { opacity: 1, duration: 0.2 }, 0.45);

  const tracerProxy = { p: 0 };
  tl.to(
    tracerProxy,
    {
      p: 100,
      duration: 1.25,
      ease: "power2.inOut",
      onUpdate: () => {
        const val = tracerProxy.p;
        if (nameFill) {
          nameFill.style.clipPath = `polygon(0 0, ${val}% 0, ${val}% 100%, 0 100%)`;
        }
        if (nameTracer && nameContainer) {
          const width = nameContainer.clientWidth || 600;
          nameTracer.style.transform = `translate3d(${(val / 100) * width}px, 0, 0)`;
        }
      }
    },
    0.5
  );

  tl.to(nameTracer, { opacity: 0, scale: 0.5, duration: 0.35 }, 1.7);

  // --- Phase C: Portrait emerges through halftone particles into clarity ---
  const shaderProxy = { intro: 0.0 };
  tl.to(
    shaderProxy,
    {
      intro: 1.0,
      duration: 1.35,
      ease: "power2.inOut",
      onUpdate: () => {
        if (shaderRef && shaderRef.current) {
          shaderRef.current.setIntroProgress(shaderProxy.intro);
        }
      }
    },
    1.4
  );

  // --- Phase D: Tiny White 3D Robot flies around portrait ---
  tl.call(
    () => {
      if (robotRef && robotRef.current) {
        robotRef.current.startFlight();
      }
    },
    null,
    2.1
  );

  // --- Phase E: Tagline, professional label, and CTAs fade in ---
  tl.to(labelBadge, { opacity: 1, y: 0, duration: 0.55 }, 2.5);
  tl.to(taglineText, { opacity: 1, y: 0, duration: 0.55 }, 2.7);
  tl.to(ctaRow, { opacity: 1, y: 0, duration: 0.6 }, 2.9);
  tl.to(scrollHint, { opacity: 1, duration: 0.6 }, 3.2);

  // Skip function
  function skip() {
    tl.pause();
    if (shaderRef && shaderRef.current) {
      shaderRef.current.setIntroProgress(1.0);
    }
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
      { opacity: 1, y: 0 }
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
