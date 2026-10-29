// ==========================================================================
// FARDIN.AI — EDITORIAL FULL-WIDTH HERO SECTION
// Precisely recreates the reference design:
// 1. Two-column composition within a full-viewport hero section
// 2. Left column: Role label with orange-red square, condensed display headline
//    - "BUILDING THAT" (BUILDING is bright white, THAT is muted gray)
//    - "CREATES INTELLIGENT" (muted gray)
//    - "IMPACT" (muted gray)
//    and supporting description
// 3. Right column: Large stationary circular orange-to-dark gradient behind
//    Fardin's real portrait photo (wearing chocolate-brown T-shirt)
// 4. Oversized condensed uppercase 'MD. FARDIN HOSSAIN' along the bottom
//    partially overlapping the lower portrait
// 5. Stable scroll behavior: portrait never disappears or jumps
// ==========================================================================

import React, { useEffect, useRef } from "react";
import { createHeroIntroTimeline } from "./hero-intro-timeline.js";
import { PROFILE_DATA } from "./data.js";

const h = React.createElement;

function checkPrefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function CinematicHeroSection() {
  const containerRef = useRef(null);
  const bgLayerRef = useRef(null);
  const haloAuraRef = useRef(null);
  const leftColRef = useRef(null);
  const labelBadgeRef = useRef(null);
  const headlineRef = useRef(null);
  const taglineRef = useRef(null);
  const portraitStageRef = useRef(null);
  const nameContainerRef = useRef(null);
  const wordMdRef = useRef(null);
  const wordFardinRef = useRef(null);
  const wordHossainRef = useRef(null);

  // One-time entrance animation on initial page load
  useEffect(() => {
    const isReduced = checkPrefersReducedMotion();
    const navbarEl = document.querySelector(".navbar-wrapper");

    const elements = {
      navbar: navbarEl,
      bgLayer: bgLayerRef.current,
      haloAura: haloAuraRef.current,
      portraitContainer: portraitStageRef.current,
      labelBadge: labelBadgeRef.current,
      headlineRef: headlineRef.current,
      taglineText: taglineRef.current,
      wordMd: wordMdRef.current,
      wordFardin: wordFardinRef.current,
      wordHossain: wordHossainRef.current
    };

    const tl = createHeroIntroTimeline({
      elements,
      isReducedMotion: isReduced
    });

    const startTimer = setTimeout(() => {
      tl.play();
    }, 60);

    return () => {
      clearTimeout(startTimer);
      tl.kill();
    };
  }, []);

  return h(
    "section",
    {
      id: "hero",
      ref: containerRef,
      className: "cinematic-hero-section portix-hero-section",
      "aria-label": "Md. Fardin Hossain — Aspiring AI Engineer & Full-Stack Developer"
    },

    // ------------------------------------------------------------------------
    // LAYER 1: STATIC ATMOSPHERIC BACKGROUND & SUBTLE GRID
    // ------------------------------------------------------------------------
    h(
      "div",
      { ref: bgLayerRef, className: "cinematic-hero-bg", "aria-hidden": "true" },
      h("div", { className: "cinematic-grid-pattern" }),
      h("div", { className: "cinematic-vignette-layer" })
    ),

    // ------------------------------------------------------------------------
    // LAYER 2: TWO-COLUMN HERO COMPOSITION
    // ------------------------------------------------------------------------
    h(
      "div",
      { className: "portix-hero-grid" },

      // === LEFT COLUMN: ROLE LABEL, CONDENSED HEADLINE & DESCRIPTION ===
      h(
        "div",
        { ref: leftColRef, className: "portix-left-col" },

        // Small role label with orange-red square
        h(
          "div",
          { ref: labelBadgeRef, className: "portix-kicker-badge" },
          h("span", { className: "kicker-square", "aria-hidden": "true" }),
          h(
            "span",
            { className: "kicker-text" },
            "ASPIRING AI ENGINEER \u00B7 FULL-STACK DEVELOPER"
          )
        ),

        // Main Condensed Display Headline
        h(
          "h1",
          { ref: headlineRef, className: "portix-headline" },
          h(
            "span",
            { className: "hl-line" },
            h("span", { className: "hl-strong" }, "BUILDING"),
            " ",
            h("span", { className: "hl-muted" }, "THAT")
          ),
          h("span", { className: "hl-line hl-muted" }, "CREATES INTELLIGENT"),
          h("span", { className: "hl-line hl-muted" }, "IMPACT")
        )
      ),

      // === RIGHT COLUMN: STATIONARY CIRCULAR GRADIENT & REAL PORTRAIT ===
      h(
        "div",
        { className: "portix-right-col" },

        // Large circular orange-red-to-dark gradient behind portrait
        h("div", {
          ref: haloAuraRef,
          className: "portix-halo-circle",
          "aria-hidden": "true"
        }),

        // Real Portrait (Brown T-shirt photo cutout, natural skin tone, arms crossed)
        h(
          "div",
          { ref: portraitStageRef, className: "portix-portrait-container" },
          h("img", {
            src: PROFILE_DATA.heroPortrait,
            alt: "Md. Fardin Hossain wearing a brown T-shirt",
            className: "portix-portrait-img",
            width: 768,
            height: 1024,
            loading: "eager",
            fetchpriority: "high",
            decoding: "async",
            draggable: false
          })
        )
      )
    ),

    // ------------------------------------------------------------------------
    // LAYER 3: OVERSIZED BOTTOM NAME (Overlapping Lower Portrait)
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
    )
  );
}
