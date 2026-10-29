// ==========================================================================
// FARDIN.AI — REDESIGNED ABOUT SECTION (#about)
// Exactly matching the reference designs:
// (media_1793299782076_ed2d3379.png & media_1793299782087_64043c6d.jpg)
//
// 1. Visible Mountain Background Artwork across the whole About section:
//    - Real topographic mountain wallpaper with orange contour lines,
//      summit path, red flag, cosmic sun arc, and dark sky
//    - Sticky viewport layer so the mountain never zooms off-screen
//    - Contrast gradient preserving 100% text readability
// 2. Interactive Scroll-to-Appear for Each Chapter:
//    - Real-time focal scroll-spy for accurate active chapter tracking
//    - Smooth entrance transitions as each chapter scrolls into view
//    - Staggered animations for capabilities, feature badges, and workflow steps
// 3. Mobile Navigation & Responsiveness:
//    - Horizontal progress rail: [01] ━━━━ 02 ━━━━ 03 ━━━━ 04 with active label
//    - Tap any chapter to smoothly glide directly to it
// ==========================================================================

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { PROFILE_DATA } from "./data.js";

const h = React.createElement;

function checkPrefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// --------------------------------------------------------------------------
// ACCESSIBLE WORD-BY-WORD SCROLL REVEAL COMPONENT (Guaranteed Proper Word Spacing)
// --------------------------------------------------------------------------
export function ScrollWordReveal({
  text,
  className = "",
  delay = 0,
  as = "p"
}) {
  const containerRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(() => checkPrefersReducedMotion());

  useEffect(() => {
    if (checkPrefersReducedMotion()) {
      setIsRevealed(true);
      return;
    }
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -20px 0px" }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const words = useMemo(() => {
    if (!text) return [];
    return text.trim().split(/\s+/);
  }, [text]);

  return h(
    as,
    {
      ref: containerRef,
      className: `scroll-word-reveal-wrap ${className} ${isRevealed ? "is-revealed" : ""}`,
      "aria-label": text
    },
    words.map((word, idx) =>
      h(
        React.Fragment,
        { key: `token-${idx}` },
        h(
          "span",
          {
            className: "word-reveal-token",
            "aria-hidden": "true",
            style: {
              transitionDelay: isRevealed ? `${delay + idx * 20}ms` : "0ms"
            }
          },
          word
        ),
        idx < words.length - 1 ? " " : null
      )
    )
  );
}

// --------------------------------------------------------------------------
// HOVERING SUMMIT ROBOT MASCOT (Over Chapter 01 Mountain Peak)
// --------------------------------------------------------------------------
export function AboutSummitRobot() {
  return h(
    "div",
    { className: "about-summit-robot-wrap", "aria-hidden": "true" },
    h(
      "div",
      { className: "about-summit-robot-mascot" },
      h(
        "svg",
        {
          viewBox: "0 0 64 64",
          width: 54,
          height: 54,
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg"
        },
        // Antenna
        h("line", { x1: "32", y1: "5", x2: "32", y2: "13", stroke: "#E2E8F0", strokeWidth: "2", strokeLinecap: "round" }),
        h("circle", { cx: "32", cy: "5", r: "3", fill: "#FF6E4A" }),
        // Thruster flame
        h("path", { d: "M28 46 Q32 60 36 46 Z", fill: "#FF6E4A", opacity: "0.95" }),
        // Body / Dome
        h("rect", { x: "15", y: "13", width: "34", height: "32", rx: "13", fill: "#FFFFFF", stroke: "#E2E8F0", strokeWidth: "1.5" }),
        // Visor
        h("rect", { x: "20", y: "20", width: "24", height: "14", rx: "6", fill: "#0A0D14" }),
        // Glowing Eyes
        h("circle", { cx: "27", cy: "27", r: "2.4", fill: "#FF6E4A" }),
        h("circle", { cx: "37", cy: "27", r: "2.4", fill: "#FF6E4A" }),
        // Ear Pods
        h("rect", { x: "11", y: "23", width: "4", height: "11", rx: "2", fill: "#FF6E4A" }),
        h("rect", { x: "49", y: "23", width: "4", height: "11", rx: "2", fill: "#FF6E4A" })
      )
    )
  );
}

// --------------------------------------------------------------------------
// 4 CHAPTER CONFIGURATIONS
// --------------------------------------------------------------------------
const CHAPTER_CONFIG = [
  { id: "who-i-am", num: "01", label: "Who I Am" },
  { id: "what-i-build", num: "02", label: "What I Build" },
  { id: "why-me", num: "03", label: "Why Me" },
  { id: "how-i-work", num: "04", label: "How I Work" }
];

// --------------------------------------------------------------------------
// MAIN ABOUT SCROLL STORY COMPONENT
// --------------------------------------------------------------------------
export function AboutScrollStory() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [revealedSet, setRevealedSet] = useState(() => new Set([0]));
  const sectionRef = useRef(null);
  const chapterRefs = useRef([]);

  const setChapterRef = useCallback((el, idx) => {
    if (el) {
      chapterRefs.current[idx] = el;
    }
  }, []);

  // Precise focal-center scroll calculation to track active chapter and reveal parts
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;
        const els = chapterRefs.current.filter(Boolean);
        if (!els.length) return;

        const viewportHeight = window.innerHeight;
        const focalCenter = viewportHeight * 0.42;

        let closestIdx = 0;
        let minDistance = Infinity;

        els.forEach((el, idx) => {
          const rect = el.getBoundingClientRect();
          // Distance from chapter center to focal center
          const chapterCenter = rect.top + rect.height * 0.35;
          const dist = Math.abs(chapterCenter - focalCenter);

          // If chapter is within comfortable viewport visibility
          if (rect.top <= viewportHeight * 0.75 && rect.bottom >= viewportHeight * 0.15) {
            if (dist < minDistance) {
              minDistance = dist;
              closestIdx = idx;
            }
          }

          // Mark as revealed when scrolled into view
          if (rect.top < viewportHeight * 0.85) {
            setRevealedSet((prev) => {
              if (prev.has(idx)) return prev;
              const next = new Set(prev);
              next.add(idx);
              return next;
            });
          }
        });

        setActiveChapter((prev) => (prev !== closestIdx ? closestIdx : prev));
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Run once on mount to establish initial active chapter
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Smooth scroll to selected chapter
  const scrollToChapter = (idx) => {
    const targetEl = chapterRefs.current[idx];
    if (targetEl) {
      const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
      const offset = isMobile ? -100 : -80;

      if (window.__lenis) {
        window.__lenis.scrollTo(targetEl, { duration: 1.0, offset });
      } else {
        const top = targetEl.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
      setActiveChapter(idx);
    }
  };

  return h(
    "section",
    {
      id: "about",
      ref: sectionRef,
      className: "about-editorial-section",
      "aria-label": "About Md. Fardin Hossain — Background & Engineering Philosophy"
    },

    // 1. FULL-SECTION VISIBLE MOUNTAIN BACKGROUND ARTWORK LAYER
    h(
      "div",
      { className: "about-full-mountain-bg", "aria-hidden": "true" },
      h(
        "div",
        { className: "about-full-mountain-sticky-layer" },
        h("img", {
          src: "/assets/images/about-mountain-bg.png",
          alt: "Topographic mountain landscape with glowing orange contour lines, sun arc, and summit flag",
          className: "about-full-mountain-img"
        }),
        h("div", { className: "about-full-mountain-gradient-overlay" })
      )
    ),

    // Content Wrapper (Z-index 2 above background layer)
    h(
      "div",
      { className: "about-content-inner" },

      // 2. Section Header: "About Me" (Me in coral-orange)
      h(
        "div",
        { className: "about-section-topbar" },
        h(
          "h2",
          { className: "about-main-heading" },
          "About ",
          h("span", { className: "about-heading-accent" }, "Me")
        ),
        h(
          "a",
          {
            href: PROFILE_DATA.resumeUrl || "/Fardin_Hossain_Resume.pdf",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "about-resume-text-link",
            title: "Download Md. Fardin Hossain's Résumé (PDF)"
          },
          "View Résumé (PDF) \u2197"
        )
      ),

      // 3. Introductory Slogan Quote ("complex problems" & "digital experiences" in coral-orange)
      h(
        "div",
        { className: "about-intro-hero-block" },
        h(
          "h3",
          { className: "about-slogan-statement" },
          "\u201C I turn ",
          h("span", { className: "slogan-accent" }, "complex problems"),
          " into practical ",
          h("span", { className: "slogan-accent" }, "digital experiences."),
          "\u201D"
        )
      ),

      // 4. Two-Column Layout: Left Sticky Progress Tracker + Right Narrative Stream
      h(
        "div",
        { className: "about-nav-and-content-layout" },

        // LEFT: Vertical Sticky Progress Tracker (Desktop) / Horizontal Progress Rail (Mobile)
        h(
          "aside",
          { className: "about-nav-sidebar", "aria-label": "About Chapter Navigation" },
          h(
            "div",
            { className: "about-sticky-sidebar-inner" },
            // Mobile active chapter title label (matches crop_mobile_reference.png)
            h(
              "div",
              { className: "mobile-active-chapter-pill-label", "aria-hidden": "true" },
              CHAPTER_CONFIG[activeChapter]?.label || "Who I Am"
            ),
            h(
              "div",
              { className: "about-chapter-tracker-nav" },
              // Vertical connecting rail for desktop
              h(
                "div",
                { className: "tracker-track-rail", "aria-hidden": "true" },
                h("div", {
                  className: "tracker-fill-line",
                  style: {
                    height: `${(activeChapter / 3) * 100}%`
                  }
                })
              ),
              // Mobile connecting line behind numbers
              h("div", { className: "mobile-tracker-line", "aria-hidden": "true" }),
              // Chapter Selection Buttons
              CHAPTER_CONFIG.map((chap, idx) =>
                h(
                  "button",
                  {
                    key: chap.id,
                    type: "button",
                    className: `about-chapter-chip ${activeChapter === idx ? "is-active" : ""}`,
                    onClick: () => scrollToChapter(idx),
                    "aria-label": `Scroll to chapter ${chap.num}: ${chap.label}`,
                    "aria-current": activeChapter === idx ? "true" : undefined
                  },
                  h(
                    "span",
                    { className: "chip-indicator-wrap", "aria-hidden": "true" },
                    h("span", { className: "chip-indicator-dot" })
                  ),
                  h("span", { className: "chip-number" }, chap.num),
                  h("span", { className: "chip-text" }, chap.label)
                )
              )
            )
          )
        ),

        // RIGHT: The 4 Progressive Scroll Chapters
        h(
          "div",
          { className: "about-topics-stream" },

          // ====================================================================
          // CHAPTER 01 — WHO I AM (Matches Image 2 & Mobile Mockup)
          // ====================================================================
          h(
            "article",
            {
              id: "who-i-am",
              ref: (el) => setChapterRef(el, 0),
              className: `about-chapter-section chapter-who ${activeChapter === 0 ? "is-focused" : "is-unfocused"} ${revealedSet.has(0) ? "is-revealed" : ""}`,
              "aria-label": "Chapter 01: Who I Am"
            },
            h(
              "div",
              { className: "chapter-header" },
              h("span", { className: "chapter-badge-number" }, "CHAPTER 01"),
              h("h3", { className: "chapter-heading" }, "Who I Am")
            ),
            h(
              "div",
              { className: "chapter-content-body" },
              h(
                "div",
                { className: "chapter-who-grid" },
                // Left text & badges
                h(
                  "div",
                  { className: "chapter-who-text-col" },
                  h(ScrollWordReveal, {
                    text: "I’m a Computer Science and Engineering student and full-stack developer who enjoys turning ideas into reliable, user-friendly software.",
                    className: "chapter-lead-text",
                    as: "p",
                    delay: 20
                  }),
                  h(ScrollWordReveal, {
                    text: "I build web applications, connect frontend experiences with backend services and databases, and focus on writing maintainable code.",
                    className: "chapter-body-text",
                    as: "p",
                    delay: 60
                  }),
                  // 4 Understated Label Pills in single horizontal row
                  h(
                    "div",
                    { className: "who-pills-row" },
                    h("span", { className: "who-pill-chip" }, "🎓 CSE Student"),
                    h("span", { className: "who-pill-chip pill-highlighted" }, "</> Full-Stack Developer"),
                    h("span", { className: "who-pill-chip" }, "💡 Problem Solver"),
                    h("span", { className: "who-pill-chip" }, "📈 Lifelong Learner")
                  )
                ),
                // Right summit stage with hovering robot mascot over the mountain peak
                h(
                  "div",
                  { className: "chapter-summit-stage", "aria-hidden": "true" },
                  h(AboutSummitRobot, null)
                )
              )
            )
          ),

          // ====================================================================
          // CHAPTER 02 — WHAT I BUILD (Matches Image 3)
          // ====================================================================
          h(
            "article",
            {
              id: "what-i-build",
              ref: (el) => setChapterRef(el, 1),
              className: `about-chapter-section chapter-build ${activeChapter === 1 ? "is-focused" : "is-unfocused"} ${revealedSet.has(1) ? "is-revealed" : ""}`,
              "aria-label": "Chapter 02: What I Build"
            },
            h(
              "div",
              { className: "chapter-header" },
              h("span", { className: "chapter-badge-number" }, "CHAPTER 02"),
              h("h3", { className: "chapter-heading" }, "What I Build")
            ),
            h(
              "div",
              { className: "chapter-content-body" },
              h(ScrollWordReveal, {
                text: "I build responsive web applications, interactive user interfaces, backend APIs, database-driven systems, and practical full-stack products.",
                className: "chapter-lead-text",
                as: "p",
                delay: 20
              }),
              // 4 Distinct Colored Compact Cards (Image 3)
              h(
                "div",
                { className: "capabilities-quad-grid" },
                // 1. Frontend (Blue)
                h(
                  "div",
                  { className: "capability-card-cell card-theme-blue", style: { transitionDelay: "60ms" } },
                  h(
                    "div",
                    { className: "cell-icon-box box-blue" },
                    h(
                      "svg",
                      { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
                      h("circle", { cx: "12", cy: "12", r: "10" }),
                      h("line", { x1: "2", y1: "12", x2: "22", y2: "12" }),
                      h("path", { d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" })
                    )
                  ),
                  h("h4", { className: "cell-title" }, "Frontend"),
                  h("p", { className: "cell-subtext" }, "React, Tailwind, Zustand")
                ),
                // 2. Backend (Green)
                h(
                  "div",
                  { className: "capability-card-cell card-theme-green", style: { transitionDelay: "140ms" } },
                  h(
                    "div",
                    { className: "cell-icon-box box-green" },
                    h(
                      "svg",
                      { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
                      h("polygon", { points: "12 2 2 8.5 12 15 22 8.5 12 2" }),
                      h("polyline", { points: "2 15.5 12 22 22 15.5" })
                    )
                  ),
                  h("h4", { className: "cell-title" }, "Backend"),
                  h("p", { className: "cell-subtext" }, "Node.js, Express.js, Python")
                ),
                // 3. Database (Purple)
                h(
                  "div",
                  { className: "capability-card-cell card-theme-purple", style: { transitionDelay: "220ms" } },
                  h(
                    "div",
                    { className: "cell-icon-box box-purple" },
                    h(
                      "svg",
                      { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
                      h("ellipse", { cx: "12", cy: "5", rx: "9", ry: "3" }),
                      h("path", { d: "M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" }),
                      h("path", { d: "M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" })
                    )
                  ),
                  h("h4", { className: "cell-title" }, "Database"),
                  h("p", { className: "cell-subtext" }, "MongoDB, Firebase, MySQL")
                ),
                // 4. Full-Stack Apps (Orange)
                h(
                  "div",
                  { className: "capability-card-cell card-theme-orange", style: { transitionDelay: "300ms" } },
                  h(
                    "div",
                    { className: "cell-icon-box box-orange" },
                    h(
                      "svg",
                      { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
                      h("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" })
                    )
                  ),
                  h("h4", { className: "cell-title" }, "Full-Stack Apps"),
                  h("p", { className: "cell-subtext" }, "End-to-end solutions")
                )
              )
            )
          ),

          // ====================================================================
          // CHAPTER 03 — WHY ME (Matches Image 3)
          // ====================================================================
          h(
            "article",
            {
              id: "why-me",
              ref: (el) => setChapterRef(el, 2),
              className: `about-chapter-section chapter-why ${activeChapter === 2 ? "is-focused" : "is-unfocused"} ${revealedSet.has(2) ? "is-revealed" : ""}`,
              "aria-label": "Chapter 03: Why Me"
            },
            h(
              "div",
              { className: "chapter-header" },
              h("span", { className: "chapter-badge-number" }, "CHAPTER 03"),
              h("h3", { className: "chapter-heading" }, "Why Me")
            ),
            h(
              "div",
              { className: "chapter-content-body" },
              h(ScrollWordReveal, {
                text: "I combine a solid computer science foundation with a practical, hands-on approach to software development. I enjoy understanding problems, writing maintainable code, debugging complex issues, and improving through feedback.",
                className: "chapter-lead-text",
                as: "p",
                delay: 20
              }),
              // 4 Distinct Visual Feature Badges in a Row (Image 3)
              h(
                "div",
                { className: "why-feature-badges-row" },
                // 1. Problem Solving (Amber)
                h(
                  "div",
                  { className: "why-feature-badge badge-amber", style: { transitionDelay: "60ms" } },
                  h(
                    "div",
                    { className: "badge-icon" },
                    h(
                      "svg",
                      { width: "19", height: "19", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
                      h("path", { d: "M9 18h6" }),
                      h("path", { d: "M10 22h4" }),
                      h("path", { d: "M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" })
                    )
                  ),
                  h("span", { className: "badge-text" }, "Problem Solving")
                ),
                // 2. Clean Code (Green)
                h(
                  "div",
                  { className: "why-feature-badge badge-green", style: { transitionDelay: "140ms" } },
                  h(
                    "div",
                    { className: "badge-icon" },
                    h(
                      "svg",
                      { width: "19", height: "19", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
                      h("polyline", { points: "16 18 22 12 16 6" }),
                      h("polyline", { points: "8 6 2 12 8 18" })
                    )
                  ),
                  h("span", { className: "badge-text" }, "Clean Code")
                ),
                // 3. Thoughtful Architecture (Purple)
                h(
                  "div",
                  { className: "why-feature-badge badge-purple", style: { transitionDelay: "220ms" } },
                  h(
                    "div",
                    { className: "badge-icon" },
                    h(
                      "svg",
                      { width: "19", height: "19", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
                      h("rect", { x: "4", y: "4", width: "16", height: "16", rx: "2" }),
                      h("line", { x1: "9", y1: "9", x2: "15", y2: "15" }),
                      h("line", { x1: "15", y1: "9", x2: "9", y2: "15" })
                    )
                  ),
                  h("span", { className: "badge-text" }, "Thoughtful Architecture")
                ),
                // 4. Continuous Learning (Coral)
                h(
                  "div",
                  { className: "why-feature-badge badge-coral", style: { transitionDelay: "300ms" } },
                  h(
                    "div",
                    { className: "badge-icon" },
                    h(
                      "svg",
                      { width: "19", height: "19", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
                      h("polyline", { points: "23 6 13.5 15.5 8.5 10.5 1 18" }),
                      h("polyline", { points: "17 6 23 6 23 12" })
                    )
                  ),
                  h("span", { className: "badge-text" }, "Continuous Learning")
                )
              )
            )
          ),

          // ====================================================================
          // CHAPTER 04 — HOW I WORK (Matches Image 4)
          // ====================================================================
          h(
            "article",
            {
              id: "how-i-work",
              ref: (el) => setChapterRef(el, 3),
              className: `about-chapter-section chapter-work ${activeChapter === 3 ? "is-focused" : "is-unfocused"} ${revealedSet.has(3) ? "is-revealed" : ""}`,
              "aria-label": "Chapter 04: How I Work"
            },
            h(
              "div",
              { className: "chapter-header" },
              h("span", { className: "chapter-badge-number" }, "CHAPTER 04"),
              h("h3", { className: "chapter-heading" }, "How I Work")
            ),
            h(
              "div",
              { className: "chapter-content-body" },
              // 5-Step Connected Workflow Sequence with Dashed Arrow Connectors (Image 4)
              h(
                "div",
                { className: "work-sequence-container" },

                // Step 1: Understand
                h(
                  "div",
                  { className: "work-step-node", style: { transitionDelay: "60ms" } },
                  h(
                    "div",
                    { className: "step-node-icon-circle" },
                    h(
                      "svg",
                      { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
                      h("circle", { cx: "11", cy: "11", r: "8" }),
                      h("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
                    )
                  ),
                  h("h4", { className: "step-node-title" }, "Understand"),
                  h("p", { className: "step-node-desc" }, "Define the problem and requirements")
                ),

                // Dashed Arrow Connector 1 -> 2
                h(
                  "div",
                  { className: "step-connector-arrow", "aria-hidden": "true" },
                  h(
                    "svg",
                    { width: "42", height: "16", viewBox: "0 0 42 16", fill: "none" },
                    h("path", { d: "M2 8H36", stroke: "#FF6E4A", strokeWidth: "1.6", strokeDasharray: "3 3" }),
                    h("path", { d: "M32 4L37 8L32 12", stroke: "#FF6E4A", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" })
                  )
                ),

                // Step 2: Plan
                h(
                  "div",
                  { className: "work-step-node", style: { transitionDelay: "140ms" } },
                  h(
                    "div",
                    { className: "step-node-icon-circle" },
                    h(
                      "svg",
                      { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
                      h("polygon", { points: "12 2 2 7 12 12 22 7 12 2" }),
                      h("polyline", { points: "2 17 12 22 22 17" }),
                      h("polyline", { points: "2 12 12 17 22 12" })
                    )
                  ),
                  h("h4", { className: "step-node-title" }, "Plan"),
                  h("p", { className: "step-node-desc" }, "Design a practical solution")
                ),

                // Dashed Arrow Connector 2 -> 3
                h(
                  "div",
                  { className: "step-connector-arrow", "aria-hidden": "true" },
                  h(
                    "svg",
                    { width: "42", height: "16", viewBox: "0 0 42 16", fill: "none" },
                    h("path", { d: "M2 8H36", stroke: "#FF6E4A", strokeWidth: "1.6", strokeDasharray: "3 3" }),
                    h("path", { d: "M32 4L37 8L32 12", stroke: "#FF6E4A", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" })
                  )
                ),

                // Step 3: Build
                h(
                  "div",
                  { className: "work-step-node", style: { transitionDelay: "220ms" } },
                  h(
                    "div",
                    { className: "step-node-icon-circle" },
                    h(
                      "svg",
                      { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
                      h("polyline", { points: "16 18 22 12 16 6" }),
                      h("polyline", { points: "8 6 2 12 8 18" })
                    )
                  ),
                  h("h4", { className: "step-node-title" }, "Build"),
                  h("p", { className: "step-node-desc" }, "Implement with clean structure")
                ),

                // Dashed Arrow Connector 3 -> 4
                h(
                  "div",
                  { className: "step-connector-arrow", "aria-hidden": "true" },
                  h(
                    "svg",
                    { width: "42", height: "16", viewBox: "0 0 42 16", fill: "none" },
                    h("path", { d: "M2 8H36", stroke: "#FF6E4A", strokeWidth: "1.6", strokeDasharray: "3 3" }),
                    h("path", { d: "M32 4L37 8L32 12", stroke: "#FF6E4A", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" })
                  )
                ),

                // Step 4: Test
                h(
                  "div",
                  { className: "work-step-node", style: { transitionDelay: "300ms" } },
                  h(
                    "div",
                    { className: "step-node-icon-circle" },
                    h(
                      "svg",
                      { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
                      h("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" })
                    )
                  ),
                  h("h4", { className: "step-node-title" }, "Test"),
                  h("p", { className: "step-node-desc" }, "Identify and fix issues early")
                ),

                // Dashed Arrow Connector 4 -> 5
                h(
                  "div",
                  { className: "step-connector-arrow", "aria-hidden": "true" },
                  h(
                    "svg",
                    { width: "42", height: "16", viewBox: "0 0 42 16", fill: "none" },
                    h("path", { d: "M2 8H36", stroke: "#FF6E4A", strokeWidth: "1.6", strokeDasharray: "3 3" }),
                    h("path", { d: "M32 4L37 8L32 12", stroke: "#FF6E4A", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" })
                  )
                ),

                // Step 5: Improve
                h(
                  "div",
                  { className: "work-step-node", style: { transitionDelay: "380ms" } },
                  h(
                    "div",
                    { className: "step-node-icon-circle" },
                    h(
                      "svg",
                      { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
                      h("polyline", { points: "23 4 23 10 17 10" }),
                      h("polyline", { points: "1 20 1 14 7 14" }),
                      h("path", { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" })
                    )
                  ),
                  h("h4", { className: "step-node-title" }, "Improve"),
                  h("p", { className: "step-node-desc" }, "Learn from feedback and keep iterating")
                )
              )
            )
          )
        )
      )
    )
  );
}
