// ==========================================================================
// FARDIN.AI — EDITORIAL ASYMMETRICAL CINEMATIC HERO SECTION
// Designed to match the exact PORTIX reference composition:
// 1. Asymmetrical 2-column layout: Left headline stack (~45%), Right portrait (~55%)
// 2. Pure cutout portrait (fardin_portrait_cutout.png) over independent warm circular halo
// 3. Oversized 'MD. FARDIN HOSSAIN' across bottom width overlapping lower torso
// 4. Subtle, secondary 3D robot flight looping behind head/halo, resting on outer shoulder
// 5. Dense neural network background removed for clean photographic & typographic impact
// 6. 100% natural scroll priority (never locked or hijacked)
// ==========================================================================

import React, { useEffect, useRef, useState, useCallback } from "react";
import { PortraitLayer } from "./hero-portrait-layer.js";
import { createFlyingRobot3D } from "./hero-flying-robot.js";
import { createHeroIntroTimeline } from "./hero-intro-timeline.js";
import { getCurrentTheme, subscribeTheme } from "./theme-manager.js";
import { PROFILE_DATA } from "./data.js";

const h = React.createElement;

function checkPrefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function CinematicHeroSection({
  onNavigateProjects,
  onOpenJourney,
  resumeUrl = PROFILE_DATA.resumeUrl
}) {
  const containerRef = useRef(null);
  const robotCanvasRef = useRef(null);
  const robotInstanceRef = useRef(null);
  const shaderInstanceRef = useRef(null);
  const introTimelineRef = useRef(null);

  // DOM element refs for intro sequence & scroll dynamics
  const bgLayerRef = useRef(null);
  const haloAuraRef = useRef(null);
  const telemetryRef = useRef(null);
  const leftColRef = useRef(null);
  const labelBadgeRef = useRef(null);
  const headlineRef = useRef(null);
  const taglineRef = useRef(null);
  const ctaRowRef = useRef(null);
  const portraitStageRef = useRef(null);
  const nameContainerRef = useRef(null);
  const wordMdRef = useRef(null);
  const wordFardinRef = useRef(null);
  const wordHossainRef = useRef(null);
  const skipBtnRef = useRef(null);
  const scrollHintRef = useRef(null);

  const [theme, setTheme] = useState(() => getCurrentTheme());
  const [introFinished, setIntroFinished] = useState(false);

  // Clean transparent cutout portrait
  const portraitCutoutSrc = "assets/images/fardin_portrait_cutout.png";

  // Subscribe to theme changes
  useEffect(() => {
    return subscribeTheme((newTheme) => {
      setTheme(newTheme);
    });
  }, []);

  // Initialize 3D Flying Robot Canvas
  useEffect(() => {
    const canvas = robotCanvasRef.current;
    if (!canvas) return;

    const robot = createFlyingRobot3D(canvas, {
      onWordPass: (word) => {
        if (introTimelineRef.current) {
          introTimelineRef.current.revealWord(word);
        }
      },
      onNameComplete: () => {
        // Name reveal complete
      },
      onFlightComplete: () => {
        setIntroFinished(true);
      }
    });

    if (robot) {
      robotInstanceRef.current = robot;
    }

    return () => {
      if (robotInstanceRef.current) {
        robotInstanceRef.current.dispose();
        robotInstanceRef.current = null;
      }
    };
  }, []);

  // Handler when portrait shader is ready
  const handleShaderReady = useCallback((shader) => {
    shaderInstanceRef.current = shader;
  }, []);

  // Coordinated Opening Sequence
  useEffect(() => {
    const isReduced = checkPrefersReducedMotion();

    const elements = {
      bgLayer: bgLayerRef.current,
      haloAura: haloAuraRef.current,
      telemetryBadge: telemetryRef.current,
      portraitContainer: portraitStageRef.current,
      headlineRef: headlineRef.current,
      wordMd: wordMdRef.current,
      wordFardin: wordFardinRef.current,
      wordHossain: wordHossainRef.current,
      labelBadge: labelBadgeRef.current,
      taglineText: taglineRef.current,
      ctaRow: ctaRowRef.current,
      skipBtn: skipBtnRef.current,
      scrollHint: scrollHintRef.current
    };

    const tl = createHeroIntroTimeline({
      elements,
      robotRef: robotInstanceRef,
      isReducedMotion: isReduced,
      onComplete: () => {
        setIntroFinished(true);
      }
    });

    introTimelineRef.current = tl;

    const startTimer = setTimeout(() => {
      tl.play();
    }, 120);

    return () => {
      clearTimeout(startTimer);
      tl.kill();
    };
  }, []);

  // Handle Skip Intro
  const handleSkipIntro = () => {
    if (introTimelineRef.current) {
      introTimelineRef.current.skip();
      setIntroFinished(true);
    }
  };

  // --- SCROLL-DRIVEN DYNAMICS ---
  // Absolute user priority: manual scrolling is NEVER hijacked or locked
  useEffect(() => {
    let animFrame = null;
    const isReduced = checkPrefersReducedMotion();

    const updateScrollDynamics = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;

      // If user scrolls during opening sequence, auto-complete intro safely
      if (!introFinished && scrollY > 25) {
        handleSkipIntro();
      }

      // Map scroll progress: 0px -> 380px (full hero scroll exit range)
      const scrollRange = Math.max(280, (window.innerHeight || 800) * 0.55);
      const progress = Math.min(1, Math.max(0, scrollY / scrollRange));

      // 1. Update Shader Scroll Progress (photo -> fine micro-stipple)
      if (shaderInstanceRef.current) {
        shaderInstanceRef.current.setScrollProgress(progress);
      }

      // 2. Subtle Parallax & Spatial Scaling
      if (!isReduced) {
        const isMobile = window.innerWidth < 768;

        // Portrait floats upward and slightly scales down
        const portraitY = -progress * (isMobile ? 22 : 44);
        const portraitScale = 1.0 - progress * (isMobile ? 0.02 : 0.04);
        if (portraitStageRef.current) {
          portraitStageRef.current.style.transform = `translate3d(0, ${portraitY.toFixed(1)}px, 0) scale(${portraitScale.toFixed(4)})`;
        }

        // Halo floats with gentle differential parallax
        const haloY = -progress * (isMobile ? 14 : 28);
        if (haloAuraRef.current) {
          haloAuraRef.current.style.transform = `translate(-50%, calc(-50% + ${haloY.toFixed(1)}px))`;
        }

        // Left column content fades out gently as visitor leaves hero
        const contentOpacity = Math.max(0, 1.0 - progress * 1.6);
        if (leftColRef.current) {
          leftColRef.current.style.opacity = contentOpacity.toFixed(2);
        }

        // Bottom name shifts slightly
        const nameY = -progress * (isMobile ? 18 : 36);
        if (nameContainerRef.current) {
          nameContainerRef.current.style.transform = `translate3d(0, ${nameY.toFixed(1)}px, 0)`;
        }

        // Scroll hint fades out
        if (scrollHintRef.current) {
          scrollHintRef.current.style.opacity = Math.max(0, 1.0 - progress * 3.5).toFixed(2);
        }
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        animFrame = requestAnimationFrame(() => {
          updateScrollDynamics();
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateScrollDynamics);

    // Initial check
    updateScrollDynamics();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateScrollDynamics);
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, [introFinished]);

  return h(
    "section",
    {
      id: "hero",
      ref: containerRef,
      className: "cinematic-hero-section portix-hero-section",
      "aria-label": "Md. Fardin Hossain — Aspiring AI Engineer & Full-Stack Developer"
    },

    // ------------------------------------------------------------------------
    // LAYER 1: FRAME BORDER & TECHNICAL BACKGROUND GRID
    // ------------------------------------------------------------------------
    h("div", { className: "portix-hero-frame-border", "aria-hidden": "true" }),

    h(
      "div",
      { ref: bgLayerRef, className: "cinematic-hero-bg", "aria-hidden": "true" },
      // Clean architectural technical grid
      h("div", { className: "cinematic-grid-pattern" }),
      // Radial ambient vignette
      h("div", { className: "cinematic-vignette-layer" })
    ),

    // Top Telemetry Header Bar
    h(
      "div",
      { className: "cinematic-telemetry-bar" },
      h(
        "div",
        { ref: telemetryRef, className: "cinematic-telemetry-badge" },
        h("span", { className: "telemetry-live-dot" }),
        h("span", { className: "telemetry-label" }, "SYSTEM READY"),
        h("span", { className: "telemetry-sep" }, "//"),
        h("span", { className: "telemetry-coords" }, "DHAKA [23.8103° N, 90.4125° E]")
      ),

      // Skip Intro Button
      h(
        "button",
        {
          ref: skipBtnRef,
          type: "button",
          className: "cinematic-skip-intro-btn",
          onClick: handleSkipIntro,
          "aria-label": "Skip Opening Sequence"
        },
        h("span", null, "Skip Intro"),
        h("span", { className: "skip-icon", "aria-hidden": "true" }, "⏭")
      )
    ),

    // ------------------------------------------------------------------------
    // LAYER 2: 3D FLYING ROBOT CANVAS (Behind Portrait & Across Screen)
    // ------------------------------------------------------------------------
    h("canvas", {
      ref: robotCanvasRef,
      className: "cinematic-hero-robot-canvas",
      "aria-hidden": "true"
    }),

    // ------------------------------------------------------------------------
    // LAYER 3: ASYMMETRICAL EDITORIAL GRID (Left Headline + Right Portrait)
    // ------------------------------------------------------------------------
    h(
      "div",
      { className: "portix-hero-grid" },

      // === LEFT COLUMN (~40-45% width): BOLD EDITORIAL HEADLINE STACK ===
      h(
        "div",
        { ref: leftColRef, className: "portix-left-col" },

        // Kicker Pill / Role Badge
        h(
          "div",
          { ref: labelBadgeRef, className: "portix-kicker-badge" },
          h("span", { className: "kicker-square", "aria-hidden": "true" }, "■"),
          h("span", { className: "kicker-text" }, "AI ENGINEER & FULL-STACK DEVELOPER")
        ),

        // Large Condensed Bold Headline inspired by PORTIX reference
        h(
          "h1",
          { ref: headlineRef, className: "portix-headline" },
          h("span", { className: "hl-line hl-line-white" }, "BUILDING"),
          h("span", { className: "hl-line hl-line-muted" }, "INTELLIGENT SYSTEMS"),
          h("span", { className: "hl-line hl-line-white" }, "THAT CREATE IMPACT")
        ),

        // Concise Editorial Description
        h(
          "p",
          { ref: taglineRef, className: "portix-description" },
          "Engineering intelligent systems and full-stack products for real-world impact."
        ),

        // Primary Action Buttons
        h(
          "div",
          { ref: ctaRowRef, className: "portix-cta-row" },
          h(
            "button",
            {
              type: "button",
              className: "portix-btn-primary",
              onClick: onNavigateProjects
            },
            h("span", null, "Explore My Work"),
            h("span", { className: "btn-arrow", "aria-hidden": "true" }, "→")
          ),
          h(
            "a",
            {
              href: resumeUrl,
              download: "Fardin_Hossain_Resume.pdf",
              target: "_blank",
              rel: "noopener",
              className: "portix-btn-secondary"
            },
            h("span", { className: "btn-arrow", "aria-hidden": "true" }, "↓"),
            h("span", null, "Download Resume")
          ),
          h(
            "button",
            {
              type: "button",
              className: "portix-btn-journey",
              onClick: onOpenJourney
            },
            h("span", { className: "journey-yellow-dot", "aria-hidden": "true" }),
            h("span", null, "4-Month FlyRank AI Journey →")
          )
        )
      ),

      // === RIGHT COLUMN (~55% width): INDEPENDENT HALO & PORTRAIT CUTOUT ===
      h(
        "div",
        { className: "portix-right-col" },

        // Independent Warm Orange-to-Maroon Circular Halo
        h("div", { ref: haloAuraRef, className: "portix-halo-circle", "aria-hidden": "true" }),

        // Subtle Concentric Orbital Ring
        h("div", { className: "portix-halo-ring", "aria-hidden": "true" }),

        // Portrait Cutout Container (Transparent background, chocolate-brown shirt, crisp clarity)
        h(
          "div",
          { ref: portraitStageRef, className: "portix-portrait-container" },
          h(PortraitLayer, {
            src: portraitCutoutSrc,
            alt: "Md. Fardin Hossain — Aspiring AI Engineer & Full-Stack Developer",
            onShaderReady: handleShaderReady
          })
        )
      )
    ),

    // ------------------------------------------------------------------------
    // LAYER 4: OVERSIZED BOTTOM NAME (Overlapping Lower Torso Across Width)
    // ------------------------------------------------------------------------
    h(
      "div",
      { ref: nameContainerRef, className: "portix-bottom-name-wrap" },
      h(
        "h2",
        { className: "portix-bottom-name", "aria-label": "Md. Fardin Hossain" },
        h(
          "span",
          {
            ref: wordMdRef,
            className: "hero-name-word word-md",
            "data-word": "md"
          },
          "MD."
        ),
        h("span", { className: "hero-name-space" }, " "),
        h(
          "span",
          {
            ref: wordFardinRef,
            className: "hero-name-word word-fardin",
            "data-word": "fardin"
          },
          "FARDIN"
        ),
        h("span", { className: "hero-name-space" }, " "),
        h(
          "span",
          {
            ref: wordHossainRef,
            className: "hero-name-word word-hossain",
            "data-word": "hossain"
          },
          "HOSSAIN"
        )
      )
    ),

    // Scroll Down Indicator Hint
    h(
      "div",
      { ref: scrollHintRef, className: "cinematic-scroll-hint", "aria-hidden": "true" },
      h("span", { className: "scroll-hint-text" }, "SCROLL TO EXPLORE"),
      h("div", { className: "scroll-hint-bar" })
    )
  );
}
