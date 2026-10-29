// ==========================================================================
// FARDIN.AI — EDITORIAL FULL-WIDTH HERO SECTION
// 1. Two-column composition within a full-viewport hero section
// 2. Left column: Role label, condensed display headline, and repositioned
//    bold modern condensed name "MD. FARDIN HOSSAIN" directly below headline
// 3. Right column: Large stationary circular orange-to-dark gradient behind
//    Fardin's portrait photo + HeroAuraFlyingRobot mascot looping gracefully
// 4. Stable scroll behavior & seamless background unification
// ==========================================================================

import React, { useEffect, useRef } from "react";
import { createHeroIntroTimeline } from "./hero-intro-timeline.js";
import { PROFILE_DATA } from "./data.js";

const h = React.createElement;

function checkPrefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// --------------------------------------------------------------------------
// FLYING ROBOT MASCOT (Aura Flight Orbit)
// Smoothly loops around the glowing halo and portrait with subtle banking
// --------------------------------------------------------------------------
export function HeroAuraFlyingRobot() {
  return h(
    "div",
    {
      className: "hero-flying-robot-stage",
      "aria-hidden": "true"
    },
    h(
      "div",
      { className: "hero-flying-robot-mascot" },
      h(
        "svg",
        {
          viewBox: "0 0 64 64",
          width: 56,
          height: 56,
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          className: "robot-mascot-svg"
        },
        // Antenna beacon & rod
        h("line", { x1: "32", y1: "6", x2: "32", y2: "14", stroke: "#E2E8F0", strokeWidth: "2", strokeLinecap: "round" }),
        h("circle", { cx: "32", cy: "6", r: "3", fill: "#E85D3B", className: "robot-antenna-beacon" }),
        // Thruster flame plume
        h("path", { d: "M28 46 Q32 58 36 46 Z", fill: "url(#heroRobotThruster)", className: "robot-thruster-flame" }),
        // Body / Dome
        h("rect", { x: "16", y: "14", width: "32", height: "30", rx: "12", fill: "#FFFFFF", stroke: "#E2E8F0", strokeWidth: "1.5" }),
        // Visor
        h("rect", { x: "21", y: "21", width: "22", height: "13", rx: "5", fill: "#0B0D12" }),
        // Scanner Eye (LED visor light)
        h("ellipse", { cx: "32", cy: "27.5", rx: "6", ry: "2.5", fill: "#FF6E4A", className: "robot-scanner-eye" }),
        // Ear Pods / Side Thrusters
        h("rect", { x: "12", y: "24", width: "4", height: "10", rx: "2", fill: "#E85D3B" }),
        h("rect", { x: "48", y: "24", width: "4", height: "10", rx: "2", fill: "#E85D3B" }),
        // Gradient definition
        h(
          "defs",
          null,
          h(
            "linearGradient",
            { id: "heroRobotThruster", x1: "32", y1: "46", x2: "32", y2: "58", gradientUnits: "userSpaceOnUse" },
            h("stop", { offset: "0%", stopColor: "#FF6E4A", stopOpacity: "0.95" }),
            h("stop", { offset: "60%", stopColor: "#FACC15", stopOpacity: "0.7" }),
            h("stop", { offset: "100%", stopColor: "#FACC15", stopOpacity: "0" })
          )
        )
      )
    )
  );
}

export function CinematicHeroSection() {
  const containerRef = useRef(null);
  const bgLayerRef = useRef(null);
  const haloAuraRef = useRef(null);
  const leftColRef = useRef(null);
  const labelBadgeRef = useRef(null);
  const headlineRef = useRef(null);
  const nameContainerRef = useRef(null);
  const portraitStageRef = useRef(null);

  // References for staggered word reveal
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

      // === LEFT COLUMN: ROLE LABEL, CONDENSED HEADLINE & PROMINENT REPOSITIONED NAME ===
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
        ),

        // Repositioned Name Directly Below Headline
        h(
          "div",
          { ref: nameContainerRef, className: "portix-hero-name-block" },
          h(
            "h2",
            { className: "portix-hero-name", "aria-label": "Md. Fardin Hossain" },
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
      ),

      // === RIGHT COLUMN: STATIONARY CIRCULAR GRADIENT, FLYING ROBOT & REAL PORTRAIT ===
      h(
        "div",
        { className: "portix-right-col" },

        // Large circular orange-red-to-dark gradient behind portrait
        h("div", {
          ref: haloAuraRef,
          className: "portix-halo-circle",
          "aria-hidden": "true"
        }),

        // Real Portrait
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
        ),

        // Flying Robot Mascot Orbiting Aura in Front of Portrait
        h(HeroAuraFlyingRobot, null)
      )
    )
  );
}
