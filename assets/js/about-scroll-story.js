// ==========================================================================
// FARDIN.AI — REDESIGNED SCROLL-DRIVEN ABOUT SECTION (#about)
// Clean Editorial Storytelling for CSE Student & Full-Stack Developer
// 4 Clear Chapters:
//   01 — Who I Am
//   02 — What I Build
//   03 — Why Me
//   04 — How I Work
// - Word-by-word sequential text reveals on scroll
// - Left non-boxed sticky progress sidebar on desktop
// - Compact progress rail and natural vertical flow on mobile
// - Zero scroll traps, zero forced pinning, 100% accessible
// ==========================================================================

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { PROFILE_DATA } from "./data.js";

const h = React.createElement;

function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// --------------------------------------------------------------------------
// ACCESSIBLE WORD-BY-WORD SCROLL REVEAL COMPONENT
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
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const words = useMemo(() => text.split(/\s+/), [text]);

  return h(
    as,
    {
      ref: containerRef,
      className: `scroll-word-reveal-wrap ${className} ${isRevealed ? "is-revealed" : ""}`,
      "aria-label": text
    },
    words.map((word, idx) =>
      h(
        "span",
        {
          key: idx,
          className: "word-reveal-token",
          "aria-hidden": "true",
          style: {
            transitionDelay: isRevealed ? `${delay + idx * 30}ms` : "0ms"
          }
        },
        word,
        idx < words.length - 1 ? " " : ""
      )
    )
  );
}

// --------------------------------------------------------------------------
// 4 EXACT CHAPTER DEFINITIONS
// --------------------------------------------------------------------------
const CHAPTERS = [
  {
    id: "who-i-am",
    num: "01",
    label: "Who I Am",
    lead: "I’m a Computer Science and Engineering student and full-stack developer who enjoys turning ideas into reliable, user-friendly software.",
    body: "I build web applications, connect frontend experiences with backend services and databases, and focus on writing maintainable code."
  },
  {
    id: "what-i-build",
    num: "02",
    label: "What I Build",
    lead: "I build responsive web applications, interactive user interfaces, backend APIs, database-driven systems, and practical full-stack products.",
    body: "I enjoy connecting different technologies to create applications that are useful, intuitive, and maintainable."
  },
  {
    id: "why-me",
    num: "03",
    label: "Why Me",
    lead: "I combine a solid computer science foundation with a practical, hands-on approach to software development. I enjoy understanding a problem before choosing a solution, breaking complex tasks into manageable steps, and turning ideas into working applications.",
    bodyParagraphs: [
      "My approach emphasizes problem-solving, clean code, thoughtful architecture, debugging, and continuous learning. I am comfortable learning new technologies, working across frontend and backend systems, and improving my implementations through testing and feedback.",
      "As a CSE student and aspiring software engineer, I value both the fundamentals behind a system and the experience of the people using it. I aim to build solutions that are reliable, maintainable, and genuinely useful."
    ]
  },
  {
    id: "how-i-work",
    num: "04",
    label: "How I Work",
    lead: "I begin by understanding the problem, the requirements, and the people who will use the product.",
    body: "I plan a practical solution, implement it with attention to structure and maintainability, and test it to identify problems early. I continuously refine my work, learn from feedback, and look for better ways to build reliable software."
  }
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

  // Track active chapter on scroll
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
        threshold: 0.3,
        rootMargin: "-10% 0px -40% 0px"
      }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToChapter = (idx) => {
    const targetEl = chapterRefs.current[idx];
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
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

    // 3. Main Narrative Layout: Left Sticky Progress Tracker + Right Narrative Stream
    h(
      "div",
      { className: "about-nav-and-content-layout" },

      // LEFT: Non-boxed Sticky Progress Sidebar (Desktop) / Compact Top Rail (Mobile)
      h(
        "aside",
        { className: "about-nav-sidebar", "aria-label": "About Chapter Navigation" },
        h(
          "div",
          { className: "about-sticky-sidebar-inner" },
          h(
            "div",
            { className: "about-chapter-tracker-nav" },
            // Vertical animated progress line
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
            // Chapter Buttons
            CHAPTERS.map((chap, idx) =>
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
          )
        )
      ),

      // RIGHT: The 4 Progressive Scroll Chapters
      h(
        "div",
        { className: "about-topics-stream" },

        // Chapter 1 — Who I Am
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
            h("span", { className: "chapter-badge-number" }, "CHAPTER 01"),
            h("h3", { className: "chapter-heading" }, "Who I Am")
          ),
          h(
            "div",
            { className: "chapter-content-body" },
            h(ScrollWordReveal, {
              text: CHAPTERS[0].lead,
              className: "chapter-lead-text",
              as: "p",
              delay: 40
            }),
            h(ScrollWordReveal, {
              text: CHAPTERS[0].body,
              className: "chapter-body-text",
              as: "p",
              delay: 100
            })
          )
        ),

        // Chapter 2 — What I Build
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
            h("span", { className: "chapter-badge-number" }, "CHAPTER 02"),
            h("h3", { className: "chapter-heading" }, "What I Build")
          ),
          h(
            "div",
            { className: "chapter-content-body" },
            h(ScrollWordReveal, {
              text: CHAPTERS[1].lead,
              className: "chapter-lead-text",
              as: "p",
              delay: 40
            }),
            h(ScrollWordReveal, {
              text: CHAPTERS[1].body,
              className: "chapter-body-text",
              as: "p",
              delay: 100
            })
          )
        ),

        // Chapter 3 — Why Me (Replaces CS Foundation)
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
            h("span", { className: "chapter-badge-number" }, "CHAPTER 03"),
            h("h3", { className: "chapter-heading" }, "Why Me")
          ),
          h(
            "div",
            { className: "chapter-content-body" },
            h(ScrollWordReveal, {
              text: CHAPTERS[2].lead,
              className: "chapter-lead-text",
              as: "p",
              delay: 40
            }),
            h(ScrollWordReveal, {
              text: CHAPTERS[2].bodyParagraphs[0],
              className: "chapter-body-text",
              as: "p",
              delay: 80
            }),
            h(ScrollWordReveal, {
              text: CHAPTERS[2].bodyParagraphs[1],
              className: "chapter-body-text",
              as: "p",
              delay: 120
            })
          )
        ),

        // Chapter 4 — How I Work
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
            h("span", { className: "chapter-badge-number" }, "CHAPTER 04"),
            h("h3", { className: "chapter-heading" }, "How I Work")
          ),
          h(
            "div",
            { className: "chapter-content-body" },
            h(ScrollWordReveal, {
              text: CHAPTERS[3].lead,
              className: "chapter-lead-text",
              as: "p",
              delay: 40
            }),
            h(ScrollWordReveal, {
              text: CHAPTERS[3].body,
              className: "chapter-body-text",
              as: "p",
              delay: 100
            })
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
