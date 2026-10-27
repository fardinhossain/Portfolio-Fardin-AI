// ==========================================================================
// FARDIN.AI — CINEMATIC FULL-SCREEN HERO SECTION ORCHESTRATOR
// Full-screen 100svh layout, coordinated opening sequence:
// 1. Name writes itself first
// 2. Portrait emerges through halftone particles into clarity
// 3. Tiny white 3D robot flies around & behind portrait, resting beside it
// 4. Scroll-driven dot-vanishing & edge particle dissolve
// 5. Absolute user scroll priority (never hijacked)
// ==========================================================================

import React, { useEffect, useRef, useState, useCallback } from "react";
import { PortraitLayer } from "./hero-portrait-layer.js";
import { createFlyingRobot3D } from "./hero-flying-robot.js";
import { createHeroIntroTimeline } from "./hero-intro-timeline.js";
import { HeroNeuralScene } from "./three-scenes.js";
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

  // DOM element refs for intro sequence
  const bgLayerRef = useRef(null);
  const telemetryRef = useRef(null);
  const nameContainerRef = useRef(null);
  const nameFillRef = useRef(null);
  const nameTracerRef = useRef(null);
  const portraitStageRef = useRef(null);
  const labelBadgeRef = useRef(null);
  const taglineRef = useRef(null);
  const ctaRowRef = useRef(null);
  const skipBtnRef = useRef(null);
  const scrollHintRef = useRef(null);

  const [theme, setTheme] = useState(() => getCurrentTheme());
  const [introFinished, setIntroFinished] = useState(false);

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

    const robot = createFlyingRobot3D(canvas);
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
      telemetryBadge: telemetryRef.current,
      nameContainer: nameContainerRef.current,
      nameFill: nameFillRef.current,
      nameTracer: nameTracerRef.current,
      portraitContainer: portraitStageRef.current,
      labelBadge: labelBadgeRef.current,
      taglineText: taglineRef.current,
      ctaRow: ctaRowRef.current,
      skipBtn: skipBtnRef.current,
      scrollHint: scrollHintRef.current
    };

    const tl = createHeroIntroTimeline({
      elements,
      shaderRef: shaderInstanceRef,
      robotRef: robotInstanceRef,
      isReducedMotion: isReduced,
      onComplete: () => {
        setIntroFinished(true);
      }
    });

    introTimelineRef.current = tl;

    // Small timeout to allow shader & robot canvases to mount cleanly
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

  // --- SCROLL-DRIVEN DOT-VANISHING & PARALLAX DYNAMICS ---
  // Absolute user priority: manual scrolling is NEVER hijacked or locked
  useEffect(() => {
    let animFrame = null;
    const isReduced = checkPrefersReducedMotion();

    const updateScrollDynamics = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;

      // If user scrolls during the intro sequence, auto-complete intro safely
      if (!introFinished && scrollY > 25) {
        handleSkipIntro();
      }

      // Map scroll progress: 0px -> 380px (full hero scroll exit range)
      const scrollRange = Math.max(280, (window.innerHeight || 800) * 0.55);
      const progress = Math.min(1, Math.max(0, scrollY / scrollRange));

      // 1. Update Shader Scroll Progress (photo -> halftone dots -> silhouette particle dissolve)
      if (shaderInstanceRef.current) {
        shaderInstanceRef.current.setScrollProgress(progress);
      }

      // 2. Subtle Parallax & Spatial Scaling
      if (!isReduced) {
        const isMobile = window.innerWidth < 768;

        // Portrait floats upward and slightly scales down
        const portraitY = -progress * (isMobile ? 22 : 44);
        const portraitScale = 1.0 - progress * (isMobile ? 0.03 : 0.05);

        if (portraitStageRef.current) {
          portraitStageRef.current.style.transform = `translate3d(0, ${portraitY.toFixed(1)}px, 0) scale(${portraitScale.toFixed(4)})`;
        }

        // Foreground Name shifts with differential depth
        const nameY = -progress * (isMobile ? 32 : 62);
        if (nameContainerRef.current) {
          nameContainerRef.current.style.transform = `translate3d(0, ${nameY.toFixed(1)}px, 0)`;
        }

        // Action row fades out gently as user leaves hero
        const contentOpacity = Math.max(0, 1.0 - progress * 1.8);
        if (ctaRowRef.current) {
          ctaRowRef.current.style.opacity = contentOpacity.toFixed(2);
        }
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
      className: "cinematic-hero-section",
      "aria-label": "Md. Fardin Hossain — Cinematic Introduction"
    },

    // ------------------------------------------------------------------------
    // LAYER 1: BACKGROUND GRID, ORBITAL RINGS & TELEMETRY
    // ------------------------------------------------------------------------
    h(
      "div",
      { ref: bgLayerRef, className: "cinematic-hero-bg", "aria-hidden": "true" },
      // Interactive 3D Neural Nodes & Orbital Rings Scene
      h(HeroNeuralScene, null),

      // Architectural Technical Grid Overlay
      h("div", { className: "cinematic-grid-pattern" }),

      // Radial Ambient Vignette
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
    // LAYER 2: 3D FLYING ROBOT CANVAS (Behind Portrait Layer)
    // ------------------------------------------------------------------------
    h("canvas", {
      ref: robotCanvasRef,
      className: "cinematic-hero-robot-canvas",
      "aria-hidden": "true"
    }),

    // ------------------------------------------------------------------------
    // LAYER 3 & 4: CENTRAL STAGE (Portrait + Foreground Content Stack)
    // ------------------------------------------------------------------------
    h(
      "div",
      { className: "cinematic-hero-stage" },

      // Central Cutout Portrait & Halftone Shader
      h(
        "div",
        { ref: portraitStageRef, className: "cinematic-portrait-wrapper" },
        h(PortraitLayer, {
          src: "assets/images/fardin_portrait_cutout.png",
          alt: "Md. Fardin Hossain — AI Engineer & Full-Stack Developer",
          onShaderReady: handleShaderReady
        })
      ),

      // Foreground Editorial Content (Overlapping Portrait Lower Torso)
      h(
        "div",
        { className: "cinematic-foreground-stage" },

        // Oversized Editorial Name with Write-In Tracer
        h(
          "div",
          {
            ref: nameContainerRef,
            className: "cinematic-name-wrap",
            "aria-label": "Md. Fardin Hossain"
          },
          h(
            "h1",
            {
              ref: nameFillRef,
              className: "cinematic-hero-name"
            },
            h("span", { className: "name-first" }, "Md. Fardin "),
            h("em", { className: "name-last" }, "Hossain")
          ),
          // Glowing tracer dot following the lead edge as the name writes itself
          h("div", {
            ref: nameTracerRef,
            className: "cinematic-name-tracer",
            "aria-hidden": "true"
          })
        ),

        // Professional Label Badge
        h(
          "div",
          { ref: labelBadgeRef, className: "cinematic-role-badge" },
          h("span", { className: "role-bullet" }),
          h(
            "span",
            { className: "role-text" },
            "AI ENGINEER · MACHINE LEARNING · FULL-STACK DEVELOPER"
          )
        ),

        // Compact Tagline
        h(
          "p",
          { ref: taglineRef, className: "cinematic-tagline" },
          "“Building intelligent systems. Turning ideas into real-world impact.”"
        ),

        // Primary Actions & Interactive 4-Month Journey Shortcut
        h(
          "div",
          { ref: ctaRowRef, className: "cinematic-actions-row" },
          h(
            "button",
            {
              type: "button",
              className: "btn-pill-dark cinematic-cta-primary",
              onClick: onNavigateProjects
            },
            h("span", null, "Explore My Work"),
            h("span", { className: "btn-trailing-circle", "aria-hidden": "true" }, "→")
          ),
          h(
            "a",
            {
              href: resumeUrl,
              download: "Fardin_Hossain_Resume.pdf",
              target: "_blank",
              rel: "noopener",
              className: "btn-pill-light cinematic-cta-secondary"
            },
            h("span", { "aria-hidden": "true" }, "↓"),
            h("span", null, "Download Resume")
          ),
          h(
            "button",
            {
              type: "button",
              className: "hero-journey-shortcut cinematic-journey-pill",
              onClick: onOpenJourney
            },
            h("span", { className: "yellow-dot" }),
            h("span", null, "4-Month FlyRank AI Journey →")
          )
        ),

        // Bottom Scroll Indicator Hint
        h(
          "div",
          { ref: scrollHintRef, className: "cinematic-scroll-hint", "aria-hidden": "true" },
          h("span", { className: "scroll-hint-text" }, "SCROLL TO EXPLORE"),
          h("div", { className: "scroll-hint-bar" })
        )
      )
    )
  );
}
