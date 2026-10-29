// ==========================================================================
// FARDIN.AI — REDESIGNED SCROLL-DRIVEN ABOUT SECTION (#about)
// Rich Editorial Storytelling for CSE Student & Full-Stack Developer
// 4 Clear Chapters:
//   01 — Who I Am
//   02 — What I Build
//   03 — Why Me (replaces CS Foundation)
//   04 — How I Work
// - Bulletproof word-by-word sequential text reveal with natural word spacing
// - Bot F-01 Interactive Companion Card in left sticky progress sidebar
// - Rich visual capability cards, value pillars, and 4-step delivery roadmap
// - Responsive desktop & mobile layouts with zero scroll traps
// ==========================================================================

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { PROFILE_DATA } from "./data.js";

const h = React.createElement;

function prefersReducedMotion() {
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
  const [isRevealed, setIsRevealed] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (prefersReducedMotion()) {
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
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
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
        { key: `word-${idx}` },
        h(
          "span",
          {
            className: "word-reveal-token",
            "aria-hidden": "true",
            style: {
              transitionDelay: isRevealed ? `${delay + idx * 24}ms` : "0ms"
            }
          },
          word
        ),
        // Render explicit whitespace text node between adjacent inline tokens
        idx < words.length - 1 ? " " : null
      )
    )
  );
}

// --------------------------------------------------------------------------
// BOT F-01 INTERACTIVE COMPANION (About Guide)
// --------------------------------------------------------------------------
export function AboutBotGuide({ activeChapter = 0 }) {
  const botSpeeches = [
    "Meet Fardin — crafting reliable software from Southeast University, Dhaka.",
    "Responsive React/Next.js frontends, scalable Node APIs, and robust databases.",
    "Strong CS fundamentals combined with clean code and disciplined problem-solving.",
    "Understand the requirements, architect thoughtfully, test early, and iterate."
  ];

  const eyeConfigs = [
    { leftD: "M21 21 Q25 16 29 21", rightD: "M35 21 Q39 16 43 21", color: "#E85D3B" },
    { leftD: "M21 20 L29 20", rightD: "M35 20 L43 20", color: "#FF6E4A" },
    { leftD: "M21 21 Q25 15 29 21", rightD: "M35 21 Q39 15 43 21", color: "#10B981" },
    { leftD: "M21 20 L29 20", rightD: "M35 20 L43 20", color: "#E85D3B" }
  ];

  const currentEye = eyeConfigs[activeChapter] || eyeConfigs[0];

  return h(
    "div",
    { className: "about-bot-companion-card" },
    h(
      "div",
      { className: "bot-card-topbar" },
      h("span", { className: "bot-unit-tag" }, "UNIT F-01 \u00B7 GUIDE"),
      h("span", { className: "bot-live-pulse", "aria-hidden": "true" })
    ),
    h(
      "div",
      { className: "bot-speech-bubble" },
      h("p", { className: "bot-speech-text" }, botSpeeches[activeChapter])
    ),
    h(
      "div",
      { className: "bot-avatar-wrap" },
      h(
        "svg",
        {
          viewBox: "0 0 64 64",
          width: 76,
          height: 76,
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          className: "bot-avatar-svg"
        },
        // Antenna
        h("line", { x1: "32", y1: "6", x2: "32", y2: "14", stroke: "#94A3B8", strokeWidth: "2", strokeLinecap: "round" }),
        h("circle", { cx: "32", cy: "6", r: "3", fill: "#E85D3B", className: "bot-antenna-beacon" }),
        // Body / Dome Head
        h("rect", { x: "14", y: "14", width: "36", height: "32", rx: "14", fill: "var(--bg-surface)", stroke: "var(--border-light)", strokeWidth: "1.8" }),
        // Visor
        h("rect", { x: "19", y: "21", width: "26", height: "15", rx: "6", fill: "#0B0D12" }),
        // Eyes
        h("path", { d: currentEye.leftD, stroke: currentEye.color, strokeWidth: "2.6", strokeLinecap: "round", fill: "none" }),
        h("path", { d: currentEye.rightD, stroke: currentEye.color, strokeWidth: "2.6", strokeLinecap: "round", fill: "none" }),
        // Ear Pods
        h("rect", { x: "10", y: "24", width: "4", height: "12", rx: "2", fill: "#E85D3B" }),
        h("rect", { x: "50", y: "24", width: "4", height: "12", rx: "2", fill: "#E85D3B" }),
        // Core indicator
        h("circle", { cx: "32", cy: "40", r: "2.5", fill: "#E85D3B" }),
        // Thruster flame
        h("path", { d: "M28 48 Q32 58 36 48 Z", fill: "#FF6E4A", opacity: "0.85" })
      )
    ),
    h(
      "div",
      { className: "bot-status-footer" },
      h("span", { className: "bot-status-dot", "aria-hidden": "true" }),
      h("span", { className: "bot-status-label" }, `CHAPTER 0${activeChapter + 1} ACTIVE`)
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
  const sectionRef = useRef(null);
  const chapterRefs = useRef([]);

  const setChapterRef = useCallback((el, idx) => {
    if (el) {
      chapterRefs.current[idx] = el;
    }
  }, []);

  // Track active chapter as user scrolls naturally
  useEffect(() => {
    const els = chapterRefs.current.filter(Boolean);
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = els.indexOf(entry.target);
            if (idx !== -1) {
              setActiveChapter(idx);
            }
          }
        });
      },
      {
        threshold: 0.25,
        rootMargin: "-10% 0px -35% 0px"
      }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToChapter = (idx) => {
    const targetEl = chapterRefs.current[idx];
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
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

    // 1. Section Header Bar (Title + Understated Resume Link)
    h(
      "div",
      { className: "about-section-topbar" },
      h(
        "div",
        { className: "about-title-block" },
        h("span", { className: "topic-eyebrow" }, "01 / BACKGROUND & FOCUS"),
        h("h2", { className: "about-main-heading" }, "About Me")
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

    // 2. Animated Introductory Slogan (Word-by-Word Reveal)
    h(
      "div",
      { className: "about-intro-hero-block" },
      h(ScrollWordReveal, {
        text: "“I turn complex problems into practical digital experiences.”",
        className: "about-slogan-statement",
        as: "h3",
        delay: 60
      })
    ),

    // 3. Two-Column Editorial Layout: Left Sticky Progress Tracker + Right Narrative Stream
    h(
      "div",
      { className: "about-nav-and-content-layout" },

      // LEFT: Non-boxed Sticky Progress Sidebar with Bot Companion
      h(
        "aside",
        { className: "about-nav-sidebar", "aria-label": "About Chapter Navigation" },
        h(
          "div",
          { className: "about-sticky-sidebar-inner" },
          h(
            "div",
            { className: "about-chapter-tracker-nav" },
            // Animated vertical progress line
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
                h("span", { className: "chip-indicator-dot", "aria-hidden": "true" }),
                h("span", { className: "chip-number" }, chap.num),
                h("span", { className: "chip-text" }, chap.label)
              )
            )
          ),

          // Bot F-01 Interactive Companion Card
          h(AboutBotGuide, { activeChapter })
        )
      ),

      // RIGHT: The 4 Progressive Scroll Chapters (Rich Editorial Presentation)
      h(
        "div",
        { className: "about-topics-stream" },

        // ====================================================================
        // CHAPTER 01 — WHO I AM
        // ====================================================================
        h(
          "article",
          {
            id: "who-i-am",
            ref: (el) => setChapterRef(el, 0),
            className: "about-chapter-section chapter-who",
            "aria-label": "Chapter 01: Who I Am"
          },
          h(
            "div",
            { className: "chapter-header" },
            h("span", { className: "chapter-badge-number" }, "CHAPTER 01 / IDENTITY"),
            h("h3", { className: "chapter-heading" }, "Who I Am")
          ),
          h(
            "div",
            { className: "chapter-content-body" },
            h(
              "div",
              { className: "chapter-editorial-split" },
              h(
                "div",
                { className: "editorial-text-col" },
                h(ScrollWordReveal, {
                  text: "I’m a Computer Science and Engineering student and full-stack developer who enjoys turning ideas into reliable, user-friendly software.",
                  className: "chapter-lead-text",
                  as: "p",
                  delay: 40
                }),
                h(ScrollWordReveal, {
                  text: "I build web applications, connect frontend experiences with backend services and databases, and focus on writing maintainable code.",
                  className: "chapter-body-text",
                  as: "p",
                  delay: 90
                }),
                // Focus & Location Tags
                h(
                  "div",
                  { className: "about-tag-cluster" },
                  h("span", { className: "about-tag-pill" }, "\uD83C\uDF93 Southeast University"),
                  h("span", { className: "about-tag-pill" }, "\uD83D\uDCCD Dhaka, Bangladesh"),
                  h("span", { className: "about-tag-pill" }, "\u26A1 Full-Stack Engineering"),
                  h("span", { className: "about-tag-pill" }, "\uD83E\uDDE0 Applied AI & ML")
                )
              ),
              // Profile Portrait Card
              h(
                "div",
                { className: "editorial-photo-card" },
                h(
                  "div",
                  { className: "photo-card-frame" },
                  h("img", {
                    src: PROFILE_DATA.heroPortrait,
                    alt: "Md. Fardin Hossain — Software Engineer",
                    className: "photo-card-img",
                    loading: "lazy"
                  })
                ),
                h(
                  "div",
                  { className: "photo-card-caption" },
                  h("span", { className: "status-dot-active", "aria-hidden": "true" }),
                  h("span", { className: "caption-label" }, "Available for Full-Stack Roles")
                )
              )
            )
          )
        ),

        // ====================================================================
        // CHAPTER 02 — WHAT I BUILD
        // ====================================================================
        h(
          "article",
          {
            id: "what-i-build",
            ref: (el) => setChapterRef(el, 1),
            className: "about-chapter-section chapter-build",
            "aria-label": "Chapter 02: What I Build"
          },
          h(
            "div",
            { className: "chapter-header" },
            h("span", { className: "chapter-badge-number" }, "CHAPTER 02 / CAPABILITIES"),
            h("h3", { className: "chapter-heading" }, "What I Build")
          ),
          h(
            "div",
            { className: "chapter-content-body" },
            h(ScrollWordReveal, {
              text: "I build responsive web applications, interactive user interfaces, backend APIs, database-driven systems, and practical full-stack products.",
              className: "chapter-lead-text",
              as: "p",
              delay: 40
            }),
            h(ScrollWordReveal, {
              text: "I enjoy connecting different technologies to create applications that are useful, intuitive, and maintainable.",
              className: "chapter-body-text",
              as: "p",
              delay: 90
            }),
            // 4 Capability Cards Grid
            h(
              "div",
              { className: "capabilities-quad-grid" },
              // 1. Frontend
              h(
                "div",
                { className: "capability-card-cell" },
                h("div", { className: "cell-icon-badge" }, "\uD83D\uDCBB"),
                h("h4", { className: "cell-title" }, "Frontend & Interactive UIs"),
                h("p", { className: "cell-desc" }, "Modern component systems with clean responsive layouts, fluid animations, and strict accessibility standards."),
                h(
                  "div",
                  { className: "cell-tags-row" },
                  ["React 18", "Next.js", "Tailwind CSS", "Three.js", "GSAP"].map((t) =>
                    h("span", { key: t, className: "cell-tech-chip" }, t)
                  )
                )
              ),
              // 2. Backend & APIs
              h(
                "div",
                { className: "capability-card-cell" },
                h("div", { className: "cell-icon-badge" }, "\u2699\uFE0F"),
                h("h4", { className: "cell-title" }, "Backend Services & APIs"),
                h("p", { className: "cell-desc" }, "RESTful endpoints, modular controllers, authentication middleware, and resilient server-side architectures."),
                h(
                  "div",
                  { className: "cell-tags-row" },
                  ["Node.js", "Express", "REST APIs", "JWT Auth", "Postman"].map((t) =>
                    h("span", { key: t, className: "cell-tech-chip" }, t)
                  )
                )
              ),
              // 3. Databases
              h(
                "div",
                { className: "capability-card-cell" },
                h("div", { className: "cell-icon-badge" }, "\uD83D\uDDC4\uFE0F"),
                h("h4", { className: "cell-title" }, "Database Systems & Data"),
                h("p", { className: "cell-desc" }, "Schema modeling, query optimization, indexing, and data pipelines connecting services with persistent stores."),
                h(
                  "div",
                  { className: "cell-tags-row" },
                  ["MongoDB", "PostgreSQL", "DuckDB", "Mongoose", "SQL"].map((t) =>
                    h("span", { key: t, className: "cell-tech-chip" }, t)
                  )
                )
              ),
              // 4. Core & AI
              h(
                "div",
                { className: "capability-card-cell" },
                h("div", { className: "cell-icon-badge" }, "\uD83E\uDDE0"),
                h("h4", { className: "cell-title" }, "Core Languages & AI Systems"),
                h("p", { className: "cell-desc" }, "Algorithmic problem-solving, ranking pipelines, model evaluation, and software engineering practices."),
                h(
                  "div",
                  { className: "cell-tags-row" },
                  ["Python", "C / C++", "DSA", "ML Pipelines", "Git / CI-CD"].map((t) =>
                    h("span", { key: t, className: "cell-tech-chip" }, t)
                  )
                )
              )
            )
          )
        ),

        // ====================================================================
        // CHAPTER 03 — WHY ME (Replaces CS Foundation)
        // ====================================================================
        h(
          "article",
          {
            id: "why-me",
            ref: (el) => setChapterRef(el, 2),
            className: "about-chapter-section chapter-why",
            "aria-label": "Chapter 03: Why Me"
          },
          h(
            "div",
            { className: "chapter-header" },
            h("span", { className: "chapter-badge-number" }, "CHAPTER 03 / VALUE & STRENGTHS"),
            h("h3", { className: "chapter-heading" }, "Why Me")
          ),
          h(
            "div",
            { className: "chapter-content-body" },
            h(ScrollWordReveal, {
              text: "I combine a solid computer science foundation with a practical, hands-on approach to software development. I enjoy understanding a problem before choosing a solution, breaking complex tasks into manageable steps, and turning ideas into working applications.",
              className: "chapter-lead-text",
              as: "p",
              delay: 40
            }),
            h(ScrollWordReveal, {
              text: "My approach emphasizes problem-solving, clean code, thoughtful architecture, debugging, and continuous learning. I am comfortable learning new technologies, working across frontend and backend systems, and improving my implementations through testing and feedback.",
              className: "chapter-body-text",
              as: "p",
              delay: 80
            }),
            h(ScrollWordReveal, {
              text: "As a CSE student and aspiring software engineer, I value both the fundamentals behind a system and the experience of the people using it. I aim to build solutions that are reliable, maintainable, and genuinely useful.",
              className: "chapter-body-text",
              as: "p",
              delay: 120
            }),
            // 3 Value Pillars
            h(
              "div",
              { className: "why-value-pillars-row" },
              h(
                "div",
                { className: "why-pillar-card" },
                h("span", { className: "pillar-number-badge" }, "01"),
                h("h4", { className: "pillar-heading" }, "Fundamentals + Real Execution"),
                h("p", { className: "pillar-text" }, "Rooted in strong computer science principles (DSA, OOP, databases) while shipping working, deployed applications.")
              ),
              h(
                "div",
                { className: "why-pillar-card" },
                h("span", { className: "pillar-number-badge" }, "02"),
                h("h4", { className: "pillar-heading" }, "End-to-End Problem Solver"),
                h("p", { className: "pillar-text" }, "Comfortable navigating from client interfaces down to server APIs and database schemas to eliminate friction.")
              ),
              h(
                "div",
                { className: "why-pillar-card" },
                h("span", { className: "pillar-number-badge" }, "03"),
                h("h4", { className: "pillar-heading" }, "Tested, Maintainable Code"),
                h("p", { className: "pillar-text" }, "Emphasis on thoughtful architecture, careful debugging, continuous refinement, and user-centered design.")
              )
            )
          )
        ),

        // ====================================================================
        // CHAPTER 04 — HOW I WORK
        // ====================================================================
        h(
          "article",
          {
            id: "how-i-work",
            ref: (el) => setChapterRef(el, 3),
            className: "about-chapter-section chapter-work",
            "aria-label": "Chapter 04: How I Work"
          },
          h(
            "div",
            { className: "chapter-header" },
            h("span", { className: "chapter-badge-number" }, "CHAPTER 04 / PROCESS"),
            h("h3", { className: "chapter-heading" }, "How I Work")
          ),
          h(
            "div",
            { className: "chapter-content-body" },
            h(ScrollWordReveal, {
              text: "I begin by understanding the problem, the requirements, and the people who will use the product.",
              className: "chapter-lead-text",
              as: "p",
              delay: 40
            }),
            h(ScrollWordReveal, {
              text: "I plan a practical solution, implement it with attention to structure and maintainability, and test it to identify problems early. I continuously refine my work, learn from feedback, and look for better ways to build reliable software.",
              className: "chapter-body-text",
              as: "p",
              delay: 90
            }),
            // 4-Step Engineering Sequence
            h(
              "div",
              { className: "process-steps-sequence" },
              [
                {
                  step: "STEP 01",
                  title: "Understand & Define",
                  desc: "Dig deep into user requirements, problem constraints, and system specifications before writing code."
                },
                {
                  step: "STEP 02",
                  title: "Architect & Structure",
                  desc: "Select the right tools, design data models and schemas, and establish clean component boundaries."
                },
                {
                  step: "STEP 03",
                  title: "Implement & Test Early",
                  desc: "Write modular, readable code; test edge cases continuously; and catch bugs before they grow."
                },
                {
                  step: "STEP 04",
                  title: "Refine & Deliver",
                  desc: "Iterate from feedback, optimize performance and accessibility, and ship reliable software."
                }
              ].map((s) =>
                h(
                  "div",
                  { key: s.step, className: "process-step-item" },
                  h("span", { className: "step-indicator-pill" }, s.step),
                  h("h4", { className: "step-title" }, s.title),
                  h("p", { className: "step-desc" }, s.desc)
                )
              )
            )
          )
        ),

        // Bottom Contact Callout Row
        h(
          "div",
          { className: "about-footer-cta-row" },
          h(
            "p",
            { className: "footer-cta-text" },
            "Interested in collaborating or exploring practical software solutions?"
          ),
          h(
            "a",
            {
              href: "#contact",
              className: "about-contact-btn",
              onClick: (e) => {
                e.preventDefault();
                const contactEl = document.querySelector("#contact");
                if (contactEl) {
                  contactEl.scrollIntoView({ behavior: "smooth" });
                }
              }
            },
            "Get In Touch \u2192"
          )
        )
      )
    )
  );
}
