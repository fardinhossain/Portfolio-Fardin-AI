// ==========================================================================
// FARDIN.AI — EDITORIAL FULL-WIDTH HERO SECTION
// Exactly matching the reference design (media_1793296971840_ea1a1391.png):
// 1. Left column:
//    - Role kicker: "| ASPIRING AI ENGINEER · FULL-STACK DEVELOPER"
//    - Headline: "BUILDING THAT CREATES INTELLIGENT IMPACT" (BUILDING white, rest muted)
//    - Orange horizontal accent line below IMPACT
//    - Prominent name: "MD. FARDIN HOSSAIN" (FARDIN in coral orange #FF6E4A)
//    - Actions: "LET'S TALK →" (orange pill) + "View Résumé (PDF)"
//    - 4 Strengths in a single row with stacked 2-line text & orange icons:
//      [ ◫ ] Full-Stack Developer | [ ✢ ] AI & ML Enthusiast |
//      [ ⌖ ] Problem Solver       | [ 🎓 ] Continuous Learner
// 2. Right column:
//    - Circular glowing orange halo behind Fardin
//    - Tilted dashed orange orbital track
//    - Fardin's real portrait photo
//    - Cute 3D white robot mascot with orange ear pods, black visor, glowing eyes & thruster
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
// Gleaming white body, dark glossy visor, glowing orange LED eyes,
// orange ear pods & thruster flame plume (matches Image 1 & Image 5)
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
          width: 66,
          height: 66,
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          className: "robot-mascot-svg"
        },
        // Antenna beacon & rod
        h("line", { x1: "32", y1: "5", x2: "32", y2: "13", stroke: "#E2E8F0", strokeWidth: "2", strokeLinecap: "round" }),
        h("circle", { cx: "32", cy: "5", r: "3", fill: "#FF6E4A", className: "robot-antenna-beacon" }),
        // Thruster flame plume
        h("path", { d: "M28 46 Q32 62 36 46 Z", fill: "url(#heroRobotThruster)", className: "robot-thruster-flame" }),
        // Body / Dome Head (Crisp White)
        h("rect", { x: "15", y: "13", width: "34", height: "32", rx: "13", fill: "#FFFFFF", stroke: "#E2E8F0", strokeWidth: "1.5" }),
        // Visor Screen (Glossy Dark)
        h("rect", { x: "20", y: "20", width: "24", height: "14", rx: "6", fill: "#0A0D14" }),
        // Glowing Eyes
        h("circle", { cx: "27", cy: "27", r: "2.4", fill: "#FF6E4A", className: "robot-eye" }),
        h("circle", { cx: "37", cy: "27", r: "2.4", fill: "#FF6E4A", className: "robot-eye" }),
        // Ear Pods / Micro Thrusters
        h("rect", { x: "11", y: "23", width: "4", height: "11", rx: "2", fill: "#FF6E4A" }),
        h("rect", { x: "49", y: "23", width: "4", height: "11", rx: "2", fill: "#FF6E4A" }),
        // Core LED
        h("circle", { cx: "32", cy: "39", r: "1.8", fill: "#FF6E4A" }),
        // Gradient definition
        h(
          "defs",
          null,
          h(
            "linearGradient",
            { id: "heroRobotThruster", x1: "32", y1: "46", x2: "32", y2: "62", gradientUnits: "userSpaceOnUse" },
            h("stop", { offset: "0%", stopColor: "#FF6E4A", stopOpacity: "0.95" }),
            h("stop", { offset: "60%", stopColor: "#FACC15", stopOpacity: "0.8" }),
            h("stop", { offset: "100%", stopColor: "#FACC15", stopOpacity: "0" })
          )
        )
      )
    )
  );
}

export function CinematicHeroSection({ resumeUrl }) {
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

  const handleContactClick = (e) => {
    e.preventDefault();
    const contactEl = document.getElementById("contact");
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const finalResumeUrl = resumeUrl || PROFILE_DATA.resumeUrl || "/Fardin_Hossain_Resume.pdf";

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

      // === LEFT COLUMN: ROLE LABEL, HEADLINE, NAME, ACTIONS, STRENGTHS ===
      h(
        "div",
        { ref: leftColRef, className: "portix-left-col" },

        // Small role label with coral-orange vertical bar
        h(
          "div",
          { ref: labelBadgeRef, className: "portix-kicker-badge" },
          h("span", { className: "kicker-bar", "aria-hidden": "true" }),
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
          h("span", { className: "hl-line hl-muted" }, "IMPACT"),
          // Orange horizontal accent line below IMPACT (matches Image 1 & Image 5)
          h("span", { className: "hl-accent-bar", "aria-hidden": "true" })
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
        ),

        // Action Buttons Row directly below name
        h(
          "div",
          { className: "portix-hero-actions" },
          h(
            "a",
            {
              href: "#contact",
              className: "portix-btn-talk",
              onClick: handleContactClick
            },
            "LET'S TALK ",
            h("span", { className: "btn-arrow", "aria-hidden": "true" }, "\u2192")
          ),
          h(
            "a",
            {
              href: finalResumeUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "portix-btn-resume",
              title: "View Md. Fardin Hossain's Résumé (PDF)"
            },
            h(
              "svg",
              {
                className: "btn-download-icon",
                width: "15",
                height: "15",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2.2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                "aria-hidden": "true"
              },
              h("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
              h("polyline", { points: "7 10 12 15 17 10" }),
              h("line", { x1: "12", y1: "15", x2: "12", y2: "3" })
            ),
            "View R\u00E9sum\u00E9 (PDF)"
          )
        ),

        // Core Strengths Row: 4 Badges with 2-line stacked text & orange icons (Image 1)
        h(
          "div",
          { className: "portix-strengths-row", "aria-label": "Core strengths" },
          // 1. Full-Stack Developer
          h(
            "div",
            { className: "portix-strength-chip" },
            h(
              "div",
              { className: "chip-icon-box" },
              h(
                "svg",
                {
                  width: "18",
                  height: "18",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: "strength-chip-icon",
                  "aria-hidden": "true"
                },
                h("rect", { x: "3", y: "3", width: "18", height: "18", rx: "3" }),
                h("path", { d: "M3 9h18M9 21V9" })
              )
            ),
            h(
              "div",
              { className: "chip-text-lines" },
              h("span", { className: "chip-line-1" }, "Full-Stack"),
              h("span", { className: "chip-line-2" }, "Developer")
            )
          ),
          // 2. AI & ML Enthusiast
          h(
            "div",
            { className: "portix-strength-chip" },
            h(
              "div",
              { className: "chip-icon-box" },
              h(
                "svg",
                {
                  width: "18",
                  height: "18",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: "strength-chip-icon",
                  "aria-hidden": "true"
                },
                h("path", { d: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" }),
                h("circle", { cx: "12", cy: "12", r: "3" })
              )
            ),
            h(
              "div",
              { className: "chip-text-lines" },
              h("span", { className: "chip-line-1" }, "AI & ML"),
              h("span", { className: "chip-line-2" }, "Enthusiast")
            )
          ),
          // 3. Problem Solver
          h(
            "div",
            { className: "portix-strength-chip" },
            h(
              "div",
              { className: "chip-icon-box" },
              h(
                "svg",
                {
                  width: "18",
                  height: "18",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: "strength-chip-icon",
                  "aria-hidden": "true"
                },
                h("circle", { cx: "12", cy: "12", r: "9" }),
                h("path", { d: "M12 7v5l3 3" }),
                h("circle", { cx: "12", cy: "12", r: "1.5", fill: "currentColor" })
              )
            ),
            h(
              "div",
              { className: "chip-text-lines" },
              h("span", { className: "chip-line-1" }, "Problem"),
              h("span", { className: "chip-line-2" }, "Solver")
            )
          ),
          // 4. Continuous Learner
          h(
            "div",
            { className: "portix-strength-chip" },
            h(
              "div",
              { className: "chip-icon-box" },
              h(
                "svg",
                {
                  width: "18",
                  height: "18",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: "strength-chip-icon",
                  "aria-hidden": "true"
                },
                h("path", { d: "M22 10v6M2 10l10-5 10 5-10 5z" }),
                h("path", { d: "M6 12v5c3 3 9 3 12 0v-5" })
              )
            ),
            h(
              "div",
              { className: "chip-text-lines" },
              h("span", { className: "chip-line-1" }, "Continuous"),
              h("span", { className: "chip-line-2" }, "Learner")
            )
          )
        )
      ),

      // === RIGHT COLUMN: CIRCULAR HALO, ORBIT TRACK, REAL PORTRAIT & ROBOT ===
      h(
        "div",
        { className: "portix-right-col" },

        // Large circular orange-red-to-dark gradient behind portrait
        h("div", {
          ref: haloAuraRef,
          className: "portix-halo-circle",
          "aria-hidden": "true"
        }),

        // Tilted dashed orange orbital track
        h(
          "svg",
          {
            className: "portix-orbit-track",
            viewBox: "0 0 600 600",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            "aria-hidden": "true"
          },
          h("ellipse", {
            cx: "300",
            cy: "300",
            rx: "260",
            ry: "160",
            transform: "rotate(-24 300 300)",
            stroke: "#FF6E4A",
            strokeWidth: "1.5",
            strokeDasharray: "6 8",
            strokeOpacity: "0.55"
          })
        ),

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
