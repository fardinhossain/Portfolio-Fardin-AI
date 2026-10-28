// ==========================================================================
// FARDIN.AI — INTERACTIVE SCROLL-DRIVEN ABOUT STORYTELLING EXPERIENCE
// Section: #about
// 4 Chapters:
//   01 — Who Am I? (Identity, philosophy, photo, circular text, friendly welcome)
//   02 — What Can I Do? (AI/ML, Full-Stack, Problem Solving with connected arrows)
//   03 — Why Work With Me? (3 core principles with sequential focus)
//   04 — From Idea to Delivery (5-step connected roadmap with animated path)
// Visual Guide: Bot F-01 Interactive Mascot with 6 reactive states
// Responsiveness:
//   - Desktop: Sticky scroll stage with seamless bidirectional scrubbing
//   - Mobile: Natural vertical narrative flow (zero scroll traps)
// ==========================================================================

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROFILE_DATA, SKILL_GROUPS } from "./data.js";

const h = React.createElement;

// --------------------------------------------------------------------------
// BOT F-01 INTERACTIVE CHARACTER (6 EXPRESSIVE STATES)
// porcelain dome head, obsidian visor, reactive LED eyes, ear pods,
// antenna beacon, AI core, articulated arms, and thruster glow.
// --------------------------------------------------------------------------
export function StoryBotGuide({ state = "welcome", size = 110, className = "" }) {
  // Eye expression variants based on current chapter
  const getEyeConfig = () => {
    switch (state) {
      case "welcome": // Happy, curved friendly eyes
        return {
          left: h("path", { d: "M21 21 Q25 16 29 21", stroke: "#E11D48", strokeWidth: "3.2", strokeLinecap: "round", fill: "none" }),
          right: h("path", { d: "M35 21 Q39 16 43 21", stroke: "#E11D48", strokeWidth: "3.2", strokeLinecap: "round", fill: "none" }),
          glint: true
        };
      case "thinking": // One arched eyebrow, tilted gaze
        return {
          left: h("rect", { x: "22", y: "17", width: "6.8", height: "4.6", rx: "2.3", fill: "#E11D48" }),
          right: h("rect", { x: "36", y: "15.5", width: "7.2", height: "3.8", rx: "1.9", fill: "#E11D48" }),
          glint: true
        };
      case "explaining": // Alert, wide focused eyes
        return {
          left: h("circle", { cx: "25", cy: "19", r: "3.4", fill: "#E11D48" }),
          right: h("circle", { cx: "39", cy: "19", r: "3.4", fill: "#E11D48" }),
          glint: true
        };
      case "analyzing": // Visor scan line with narrow focused slit eyes
        return {
          left: h("line", { x1: "21", y1: "19", x2: "29", y2: "19", stroke: "#E11D48", strokeWidth: "2.8", strokeLinecap: "round" }),
          right: h("line", { x1: "35", y1: "19", x2: "43", y2: "19", stroke: "#E11D48", strokeWidth: "2.8", strokeLinecap: "round" }),
          glint: false
        };
      case "working": // Determined, focused eyes
        return {
          left: h("rect", { x: "22", y: "18", width: "7", height: "4", rx: "2", fill: "#FF4D6D" }),
          right: h("rect", { x: "35", y: "18", width: "7", height: "4", rx: "2", fill: "#FF4D6D" }),
          glint: true
        };
      case "complete": // Joyful inverted arc eyes (smiling)
        return {
          left: h("path", { d: "M21 21 Q25 15 29 21", stroke: "#10B981", strokeWidth: "3.4", strokeLinecap: "round", fill: "none" }),
          right: h("path", { d: "M35 21 Q39 15 43 21", stroke: "#10B981", strokeWidth: "3.4", strokeLinecap: "round", fill: "none" }),
          glint: false
        };
      default:
        return {
          left: h("rect", { x: "22", y: "18", width: "6.8", height: "4.6", rx: "2.3", fill: "#E11D48" }),
          right: h("rect", { x: "35", y: "18", width: "6.8", height: "4.6", rx: "2.3", fill: "#E11D48" }),
          glint: true
        };
    }
  };

  const eyes = getEyeConfig();

  // Arm positions based on state
  const leftArmTransform = state === "welcome"
    ? "rotate(-40 14 36)"
    : state === "working"
    ? "rotate(24 14 36)"
    : state === "complete"
    ? "rotate(-45 14 36)"
    : "rotate(10 14 36)";

  const rightArmTransform = state === "explaining"
    ? "rotate(-55 50 31)"
    : state === "welcome"
    ? "rotate(-25 50 31)"
    : state === "complete"
    ? "rotate(-45 50 31)"
    : state === "thinking"
    ? "rotate(-85 50 36)"
    : "rotate(-12 50 36)";

  const beaconColor = state === "complete" ? "#10B981" : state === "analyzing" ? "#F59E0B" : "#E11D48";
  const coreColor = state === "complete" ? "#10B981" : "#E11D48";

  return h(
    "div",
    { className: `story-bot-guide-wrap state-${state} ${className}` },
    h(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 64 64",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        className: "story-bot-svg",
        "aria-hidden": "true"
      },
      // Soft antigravity / thruster glow
      h("ellipse", {
        cx: "32",
        cy: "59",
        rx: "14",
        ry: "3.2",
        fill: state === "complete" ? "rgba(16, 185, 129, 0.28)" : "rgba(225, 29, 72, 0.28)",
        className: "bot-thruster-aura"
      }),
      // Thruster flame cone
      h("path", {
        d: "M28 50 L32 59 L36 50 Z",
        fill: beaconColor,
        opacity: "0.88",
        className: "bot-thruster-flame"
      }),
      // Hover boots
      h("rect", { x: "23", y: "46", width: "5.5", height: "6", rx: "2.7", fill: "#E2E8F0", stroke: "#0F172A", strokeWidth: "1.2" }),
      h("rect", { x: "35.5", y: "46", width: "5.5", height: "6", rx: "2.7", fill: "#E2E8F0", stroke: "#0F172A", strokeWidth: "1.2" }),
      // Left Arm
      h(
        "g",
        { className: "bot-arm-left", style: { transformOrigin: "14px 34px", transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)" } },
        h("rect", {
          x: "11",
          y: "31",
          width: "6",
          height: "11",
          rx: "3",
          transform: leftArmTransform,
          fill: "#FFFFFF",
          stroke: "#CBD5E1",
          strokeWidth: "1.4"
        }),
        h("circle", { cx: state === "welcome" ? "8" : "12.5", cy: state === "welcome" ? "27" : "42.5", r: "2.2", fill: beaconColor })
      ),
      // Right Arm
      h(
        "g",
        { className: "bot-arm-right", style: { transformOrigin: "50px 34px", transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)" } },
        h("rect", {
          x: "47",
          y: "31",
          width: "6",
          height: "11",
          rx: "3",
          transform: rightArmTransform,
          fill: "#FFFFFF",
          stroke: "#CBD5E1",
          strokeWidth: "1.4"
        }),
        h("circle", {
          cx: state === "explaining" ? "56" : state === "complete" ? "56" : "51.5",
          cy: state === "explaining" ? "23" : state === "complete" ? "23" : "42.5",
          r: "2.2",
          fill: beaconColor
        })
      ),
      // Torso / Chassis
      h("rect", {
        x: "18.5",
        y: "29.5",
        width: "27",
        height: "19",
        rx: "9.5",
        fill: "#FFFFFF",
        stroke: "#CBD5E1",
        strokeWidth: "1.5"
      }),
      // Collar joint
      h("rect", { x: "23", y: "28", width: "18", height: "3", rx: "1.5", fill: "#0F172A" }),
      // Chest AI Core Badge
      h("circle", { cx: "32", cy: "38.5", r: "4.6", fill: "rgba(225, 29, 72, 0.15)", stroke: coreColor, strokeWidth: "1.8" }),
      h("circle", { cx: "32", cy: "38.5", r: "2", fill: coreColor }),
      // Antenna stem & beacon
      h("line", { x1: "32", y1: "5.5", x2: "32", y2: "11.5", stroke: "#94A3B8", strokeWidth: "2.2", strokeLinecap: "round" }),
      h("circle", { cx: "32", cy: "4.8", r: "3", fill: beaconColor }),
      h("circle", { cx: "31.2", cy: "4", r: "1", fill: "#FFFFFF" }),
      // Side Ear Pods
      h("rect", { x: "9.5", y: "16", width: "4.5", height: "8.5", rx: "2.2", fill: "#E2E8F0", stroke: beaconColor, strokeWidth: "1.4" }),
      h("rect", { x: "50", y: "16", width: "4.5", height: "8.5", rx: "2.2", fill: "#E2E8F0", stroke: beaconColor, strokeWidth: "1.4" }),
      // Dome Head
      h("rect", {
        x: "13",
        y: "10",
        width: "38",
        height: "20",
        rx: "10",
        fill: "#FFFFFF",
        stroke: "#CBD5E1",
        strokeWidth: "1.6"
      }),
      // Obsidian Visor Plate
      h("rect", {
        x: "16.5",
        y: "13.2",
        width: "31",
        height: "13.5",
        rx: "6.75",
        fill: "#090D16"
      }),
      // Analyzing Laser Scan Line (visible when analyzing)
      state === "analyzing" &&
        h("line", {
          x1: "18",
          y1: "20",
          x2: "46",
          y2: "20",
          stroke: "#F59E0B",
          strokeWidth: "1.5",
          opacity: "0.85",
          className: "bot-visor-scan-laser"
        }),
      // Dynamic LED Eyes
      eyes.left,
      eyes.right,
      eyes.glint && h("circle", { cx: "23.3", cy: "18", r: "1", fill: "#FFFFFF" }),
      eyes.glint && h("circle", { cx: "37.3", cy: "18", r: "1", fill: "#FFFFFF" })
    )
  );
}

// --------------------------------------------------------------------------
// CIRCULAR DECORATIVE TEXT (SVG textPath)
// --------------------------------------------------------------------------
function CircularDecorativeText({ text = "CURIOUS BY NATURE · BUILDER BY CHOICE ·", radius = 55 }) {
  const size = radius * 2 + 24;
  return h(
    "div",
    { className: "circular-badge-wrap", "aria-hidden": "true" },
    h(
      "svg",
      { width: size, height: size, viewBox: `0 0 ${size} ${size}`, className: "circular-badge-svg" },
      h("defs", null,
        h("path", {
          id: "circleTextPath",
          d: `M ${size / 2}, ${size / 2} m -${radius}, 0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`
        })
      ),
      h("circle", { cx: size / 2, cy: size / 2, r: radius, fill: "none", stroke: "rgba(232, 93, 59, 0.22)", strokeWidth: "1", strokeDasharray: "3 3" }),
      h(
        "text",
        { className: "circular-text-svg" },
        h("textPath", { href: "#circleTextPath", startOffset: "0%" }, text)
      )
    )
  );
}

// --------------------------------------------------------------------------
// CURVED ARROW SVG (Smooth accent pointer with animated dash)
// --------------------------------------------------------------------------
function CurvedArrow({ className = "", direction = "down-right", label = "" }) {
  return h(
    "div",
    { className: `curved-arrow-container dir-${direction} ${className}`, "aria-hidden": "true" },
    h(
      "svg",
      { width: "90", height: "48", viewBox: "0 0 90 48", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
      h("path", {
        d: "M6 8 C 28 6, 68 12, 80 40",
        stroke: "#E85D3B",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeDasharray: "4 3",
        className: "curved-arrow-path"
      }),
      h("path", {
        d: "M73 34 L80 41 L85 32",
        stroke: "#E85D3B",
        strokeWidth: "2.2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      })
    ),
    label && h("span", { className: "curved-arrow-label" }, label)
  );
}

// --------------------------------------------------------------------------
// CHAPTER 01: WHO AM I?
// --------------------------------------------------------------------------
function ChapterIdentity() {
  return h(
    "div",
    { className: "story-chapter chapter-identity" },
    h(
      "div",
      { className: "chapter-header" },
      h("span", { className: "chapter-eyebrow" }, "CHAPTER 01 / 04 \u00B7 IDENTITY"),
      h("h2", { className: "chapter-title" }, "WHO AM I?"),
      h(
        "p",
        { className: "chapter-subhead" },
        "I BUILD WITH ",
        h("span", { className: "accent-highlight" }, "CODE"),
        ". I THINK WITH ",
        h("span", { className: "accent-highlight" }, "AI"),
        "."
      )
    ),
    h(
      "div",
      { className: "identity-body-grid" },
      // Left: Real portrait card with status
      h(
        "div",
        { className: "identity-photo-stage" },
        h(
          "div",
          { className: "identity-photo-card" },
          h("img", {
            src: PROFILE_DATA.aboutPortrait,
            alt: "Md. Fardin Hossain wearing a brown T-shirt",
            className: "identity-portrait-img",
            width: 280,
            height: 350,
            loading: "lazy"
          }),
          h(
            "div",
            { className: "identity-photo-badge" },
            h("span", { className: "status-dot-pulse" }),
            h("span", null, "Dhaka \u00B7 Available for ML/Full-Stack Roles")
          )
        ),
        h(CircularDecorativeText, { text: "CURIOUS BY NATURE \u00B7 BUILDER BY CHOICE \u00B7 " })
      ),
      // Right: Bio narrative + Quick highlights
      h(
        "div",
        { className: "identity-narrative-col" },
        h(
          "p",
          { className: "identity-lead-bio" },
          "I'm ",
          h("strong", null, "Md. Fardin Hossain"),
          ", a Computer Science & Engineering student at Southeast University in Dhaka, Bangladesh, dedicated to building production-ready AI systems and full-stack software. I enjoy turning complex models into clean, reliable tools that solve real problems."
        ),
        h(
          "p",
          { className: "identity-secondary-bio" },
          "My recent work spans ranking 9,961 pages over 78.8M telemetry rows with DuckDB at FlyRank AI, creating agentic tools with the Claude API and Model Context Protocol (MCP), and shipping intuitive web and mobile interfaces."
        ),
        // Stat pills
        h(
          "div",
          { className: "identity-pill-strip", role: "list" },
          h("span", { className: "id-pill" }, h("strong", null, "7"), " Certifications Earned"),
          h("span", { className: "id-pill" }, h("strong", null, "6"), " Shipped Live Projects"),
          h("span", { className: "id-pill highlight-pill" }, h("strong", null, "0.78"), " Learned Ranker P@50")
        ),
        h(CurvedArrow, { direction: "down-right", label: "explore capabilities below", className: "id-arrow" })
      )
    )
  );
}

// --------------------------------------------------------------------------
// CHAPTER 02: WHAT CAN I DO?
// --------------------------------------------------------------------------
function ChapterCapabilities() {
  const capabilities = [
    {
      num: "01",
      title: "AI & MACHINE LEARNING",
      desc: "From raw datasets to production inference pipelines and agentic tooling.",
      items: [
        "Data preparation, search telemetry & feature engineering",
        "Learning-to-Rank, classification & scikit-learn models",
        "LLM integration, Claude API & Model Context Protocol (MCP)",
        "Retrieval-Augmented Generation (RAG) & vector embeddings"
      ],
      accent: "red"
    },
    {
      num: "02",
      title: "FULL-STACK DEVELOPMENT",
      desc: "Robust backends paired with polished, highly responsive frontends.",
      items: [
        "Interactive React & Next.js modern web applications",
        "Fast REST APIs with Node.js, Express & FastAPI",
        "Database modeling: DuckDB, PostgreSQL, MongoDB, Appwrite",
        "Automated unit & integration testing (Vitest, 557 tests)"
      ],
      accent: "amber"
    },
    {
      num: "03",
      title: "ENGINEERING & PROBLEM SOLVING",
      desc: "Structured thinking, resilient architecture, and measurable outcomes.",
      items: [
        "Deconstructing complex product requirements into clean milestones",
        "Benchmarking metrics (Precision@K, latency, throughput)",
        "Enterprise security auditing & OWASP Top 10 remediation (C|PTE certified)",
        "Git workflows, CI/CD automation & production deployment"
      ],
      accent: "green"
    }
  ];

  return h(
    "div",
    { className: "story-chapter chapter-capabilities" },
    h(
      "div",
      { className: "chapter-header" },
      h("span", { className: "chapter-eyebrow" }, "CHAPTER 02 / 04 \u00B7 CAPABILITIES"),
      h("h2", { className: "chapter-title" }, "WHAT CAN I DO?"),
      h(
        "p",
        { className: "chapter-subhead" },
        "FROM ",
        h("span", { className: "accent-highlight" }, "INTELLIGENT IDEAS"),
        " TO ",
        h("span", { className: "accent-highlight" }, "WORKING PRODUCTS"),
        "."
      )
    ),
    h(
      "div",
      { className: "capabilities-cards-grid" },
      capabilities.map((cap, idx) =>
        h(
          "div",
          { key: cap.title, className: `capability-card card-accent-${cap.accent}` },
          h(
            "div",
            { className: "cap-card-head" },
            h("span", { className: "cap-num-badge" }, cap.num),
            h("h3", { className: "cap-card-title" }, cap.title)
          ),
          h("p", { className: "cap-card-desc" }, cap.desc),
          h(
            "ul",
            { className: "cap-card-list" },
            cap.items.map((it) =>
              h(
                "li",
                { key: it },
                h("span", { className: "cap-item-bullet", "aria-hidden": "true" }, "→"),
                h("span", null, it)
              )
            )
          )
        )
      )
    )
  );
}

// --------------------------------------------------------------------------
// CHAPTER 03: WHY CHOOSE ME?
// --------------------------------------------------------------------------
function ChapterValue() {
  const principles = [
    {
      step: "01",
      headline: "I THINK BEFORE I BUILD",
      tagline: "Architecture First",
      body:
        "I work to understand the core problem, user needs, and system constraints before writing code. Choosing architectures that scale avoids expensive rewrites and keeps deliverables focused."
    },
    {
      step: "02",
      headline: "I CONNECT IDEAS TO IMPLEMENTATION",
      tagline: "Full-Cycle Integration",
      body:
        "I bridge the gap between machine learning models and production web software. A good model is only as useful as the application delivering its insights to end users."
    },
    {
      step: "03",
      headline: "I ITERATE AND IMPROVE WITH DATA",
      tagline: "Evidence-Based Engineering",
      body:
        "I benchmark against baselines, test edge cases, and refine based on real data — proven by ranking 9,961 candidate pages with 0.78 precision@50 over 78.8M rows."
    }
  ];

  return h(
    "div",
    { className: "story-chapter chapter-value" },
    h(
      "div",
      { className: "chapter-header" },
      h("span", { className: "chapter-eyebrow" }, "CHAPTER 03 / 04 \u00B7 VALUE"),
      h("h2", { className: "chapter-title" }, "WHY WORK WITH ME?"),
      h(
        "p",
        { className: "chapter-subhead" },
        "THOUGHTFUL ",
        h("span", { className: "accent-highlight" }, "ENGINEERING"),
        ". PRACTICAL ",
        h("span", { className: "accent-highlight" }, "EXECUTION"),
        "."
      )
    ),
    h(
      "div",
      { className: "principles-timeline-wrap" },
      // Connecting spine line
      h("div", { className: "principles-spine-line", "aria-hidden": "true" }),
      h(
        "div",
        { className: "principles-list" },
        principles.map((pr, idx) =>
          h(
            "div",
            { key: pr.step, className: "principle-card" },
            h(
              "div",
              { className: "principle-badge-col" },
              h("span", { className: "principle-num" }, pr.step),
              h("span", { className: "principle-node-dot" })
            ),
            h(
              "div",
              { className: "principle-content-col" },
              h(
                "div",
                { className: "principle-title-row" },
                h("h3", { className: "principle-headline" }, pr.headline),
                h("span", { className: "principle-tagline" }, pr.tagline)
              ),
              h("p", { className: "principle-body" }, pr.body)
            )
          )
        )
      )
    )
  );
}

// --------------------------------------------------------------------------
// CHAPTER 04: FROM IDEA TO DELIVERY (ROADMAP)
// --------------------------------------------------------------------------
function ChapterRoadmap() {
  const steps = [
    {
      num: "01",
      name: "DISCOVER",
      summary: "Understand goals, audience, requirements, edge cases, and success metrics."
    },
    {
      num: "02",
      name: "PLAN",
      summary: "Milestone breakdown, verified tech choices, schema design, and interface prototypes."
    },
    {
      num: "03",
      name: "BUILD",
      summary: "Clean implementation in manageable sprints, pairing resilient backend with fluid UI."
    },
    {
      num: "04",
      name: "TEST & REFINE",
      summary: "Automated test suites, performance profiling, security audits, and real feedback."
    },
    {
      num: "05",
      name: "DELIVER",
      summary: "Production deployment, documented handoff, and reliable post-launch continuity."
    }
  ];

  return h(
    "div",
    { className: "story-chapter chapter-roadmap" },
    h(
      "div",
      { className: "chapter-header" },
      h("span", { className: "chapter-eyebrow" }, "CHAPTER 04 / 04 \u00B7 DELIVERY ROADMAP"),
      h("h2", { className: "chapter-title" }, "FROM IDEA TO DELIVERY"),
      h(
        "p",
        { className: "chapter-subhead" },
        "A CLEAR ",
        h("span", { className: "accent-highlight" }, "PROCESS"),
        ". A BETTER ",
        h("span", { className: "accent-highlight" }, "OUTCOME"),
        "."
      )
    ),
    h(
      "div",
      { className: "roadmap-flow-container" },
      // SVG Animated Connecting Rail
      h(
        "div",
        { className: "roadmap-rail-track", "aria-hidden": "true" },
        h(
          "svg",
          { viewBox: "0 0 1000 36", fill: "none", preserveAspectRatio: "none", className: "roadmap-rail-svg" },
          h("path", {
            d: "M 30 18 L 970 18",
            stroke: "rgba(225, 29, 72, 0.22)",
            strokeWidth: "3",
            strokeDasharray: "6 4"
          }),
          h("path", {
            d: "M 30 18 L 970 18",
            stroke: "#E85D3B",
            strokeWidth: "3",
            className: "roadmap-rail-fill"
          })
        )
      ),
      // 5 Steps Grid
      h(
        "div",
        { className: "roadmap-steps-grid" },
        steps.map((st, i) =>
          h(
            "div",
            { key: st.num, className: `roadmap-step-cell step-${i + 1}` },
            h(
              "div",
              { className: "step-indicator-ring" },
              h("span", { className: "step-node-number" }, st.num)
            ),
            h("h4", { className: "step-cell-name" }, st.name),
            h("p", { className: "step-cell-desc" }, st.summary)
          )
        )
      ),
      // Finale Completion Banner
      h(
        "div",
        { className: "roadmap-completion-banner" },
        h(
          "div",
          { className: "completion-left" },
          h("span", { className: "check-circle-icon", "aria-hidden": "true" }, "✓"),
          h(
            "div",
            null,
            h("strong", { className: "completion-title" }, "Ready to turn your idea into working software?"),
            h("p", { className: "completion-desc" }, "Let's discuss requirements, architecture, and timelines.")
          )
        ),
        h(
          "a",
          {
            href: "#contact",
            className: "btn-pill-dark",
            onClick: (e) => {
              e.preventDefault();
              const el = document.getElementById("contact");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }
          },
          h("span", null, "Start a Conversation"),
          h("span", { className: "btn-trailing-circle" }, "→")
        )
      )
    )
  );
}

// --------------------------------------------------------------------------
// MAIN ABOUT SCROLL STORY COMPONENT
// --------------------------------------------------------------------------
export function AboutScrollStory() {
  const containerRef = useRef(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check viewport width and motion preferences
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 960);
      setReducedMotion(
        window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    };

    checkViewport();
    window.addEventListener("resize", checkViewport, { passive: true });
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // Desktop Scroll-Scrubbing Listener
  useEffect(() => {
    if (isMobile || reducedMotion) return;

    let ticking = false;

    const handleScroll = () => {
      if (!containerRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = containerRef.current.getBoundingClientRect();
          const totalDist = containerRef.current.offsetHeight - window.innerHeight;
          if (totalDist <= 0) return;

          // How far into the container are we scrolled?
          const scrolled = -rect.top;
          const prog = Math.max(0, Math.min(1, scrolled / totalDist));
          setScrollProgress(prog);

          // 4 chapters mapped to [0, 0.25, 0.50, 0.75, 1.0]
          let chapterIndex = 0;
          if (prog < 0.25) chapterIndex = 0;
          else if (prog < 0.50) chapterIndex = 1;
          else if (prog < 0.75) chapterIndex = 2;
          else chapterIndex = 3;

          setActiveChapter(chapterIndex);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, reducedMotion]);

  // Jump smoothly to a specific chapter
  const scrollToChapter = (chapterIdx) => {
    if (isMobile || !containerRef.current) {
      const el = document.querySelector(`.story-chapter-wrap:nth-child(${chapterIdx + 1})`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const containerTop = containerRef.current.offsetTop;
    const totalDist = containerRef.current.offsetHeight - window.innerHeight;
    const targetScroll = containerTop + totalDist * (chapterIdx / 3.2);
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  // Bot states corresponding to chapters
  const botStates = ["welcome", "thinking", "analyzing", "working"];
  const currentBotState = activeChapter === 3 && scrollProgress > 0.9 ? "complete" : botStates[activeChapter];

  const botSpeeches = [
    "Hello! Let's get acquainted.",
    "Here's what I build with code & models.",
    "Why thoughtful engineering matters.",
    "From clear plan to deployed reality."
  ];

  const chapters = [
    { id: "identity", label: "01 WHO", comp: h(ChapterIdentity) },
    { id: "capabilities", label: "02 CAN DO", comp: h(ChapterCapabilities) },
    { id: "value", label: "03 WHY ME", comp: h(ChapterValue) },
    { id: "roadmap", label: "04 PROCESS", comp: h(ChapterRoadmap) }
  ];

  return h(
    "section",
    {
      id: "about",
      ref: containerRef,
      className: `about-scroll-story-container ${isMobile ? "is-mobile-story" : "is-desktop-story"}`,
      "aria-label": "About Md. Fardin Hossain — Interactive Story"
    },

    // ------------------------------------------------------------------------
    // SECTION TOP BAR: Section Heading + Resume Action
    // ------------------------------------------------------------------------
    h(
      "div",
      { className: "about-story-topbar" },
      h(
        "div",
        { className: "section-title-group" },
        h("span", { className: "section-red-bar" }),
        h(
          "h2",
          { className: "section-heading" },
          "About Me \u00B7 The Interactive Story",
          h("span", { className: "red-dot" })
        )
      ),
      h(
        "a",
        {
          href: PROFILE_DATA.resumeUrl,
          target: "_blank",
          rel: "noopener",
          className: "project-action-pill"
        },
        "📄 Full Resume PDF ↗"
      )
    ),

    // ------------------------------------------------------------------------
    // DESKTOP: STICKY STORYTELLING STAGE
    // ------------------------------------------------------------------------
    !isMobile
      ? h(
          "div",
          { className: "about-story-sticky-stage" },

          // Stage Mini-Navigator + Continuous Progress Rail
          h(
            "div",
            { className: "about-story-nav-strip", "aria-label": "Chapter navigation" },
            h(
              "div",
              { className: "chapter-pills-row" },
              chapters.map((ch, i) =>
                h(
                  "button",
                  {
                    key: ch.id,
                    type: "button",
                    className: `chapter-nav-btn ${activeChapter === i ? "is-active" : ""}`,
                    onClick: () => scrollToChapter(i),
                    "aria-label": `Jump to Chapter ${i + 1}: ${ch.label}`
                  },
                  h("span", { className: "pill-indicator-dot" }),
                  h("span", { className: "pill-text" }, ch.label)
                )
              )
            ),
            // Progress rail bar
            h(
              "div",
              { className: "about-scrub-rail" },
              h("div", {
                className: "about-scrub-bar",
                style: { width: `${Math.round(scrollProgress * 100)}%` }
              })
            )
          ),

          // Main Split Composition: [Left Story Content] | [Right Bot Companion Stage]
          h(
            "div",
            { className: "about-story-stage-grid" },

            // LEFT CONTENT AREA: Active Chapter View
            h(
              "div",
              { className: "stage-content-area" },
              h(
                AnimatePresence,
                { mode: "wait" },
                h(
                  motion.div,
                  {
                    key: activeChapter,
                    initial: reducedMotion ? { opacity: 1 } : { opacity: 0, y: 14 },
                    animate: { opacity: 1, y: 0 },
                    exit: reducedMotion ? { opacity: 0 } : { opacity: 0, y: -14 },
                    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
                    className: "active-chapter-view"
                  },
                  chapters[activeChapter].comp
                )
              )
            ),

            // RIGHT VISUAL GUIDE AREA: Bot F-01 & Ambient Display
            h(
              "div",
              { className: "stage-bot-area" },
              h(
                "div",
                { className: "bot-stage-pedestal" },
                // Bot Speech Balloon
                h(
                  "div",
                  { className: "bot-speech-bubble" },
                  h("span", { className: "bot-speech-unit" }, "BOT F-01 GUIDE"),
                  h("p", { className: "bot-speech-text" }, botSpeeches[activeChapter])
                ),
                // Bot F-01 Character Component
                h(StoryBotGuide, {
                  state: currentBotState,
                  size: 130
                }),
                // Bot Meta Status Box
                h(
                  "div",
                  { className: "bot-meta-tag" },
                  h("span", { className: "bot-meta-led" }),
                  h(
                    "span",
                    { className: "bot-meta-state-text" },
                    `MODE: ${currentBotState.toUpperCase()}`
                  )
                )
              )
            )
          )
        )
      : // ----------------------------------------------------------------------
        // MOBILE & TABLET: NATURAL VERTICAL DOCUMENT FLOW
        // ----------------------------------------------------------------------
        h(
          "div",
          { className: "about-mobile-story-flow" },
          // Mobile Floating Bot Companion
          h(
            "div",
            { className: "mobile-bot-banner" },
            h(StoryBotGuide, { state: currentBotState, size: 70 }),
            h(
              "div",
              { className: "mobile-bot-info" },
              h("span", { className: "mobile-bot-tag" }, "BOT F-01 STORY COMPANION"),
              h("p", { className: "mobile-bot-tip" }, "Scroll down to walk through my 4-chapter journey.")
            )
          ),
          // Stacked Chapter Cards
          chapters.map((ch, idx) =>
            h(
              "div",
              { key: ch.id, className: "story-chapter-wrap mobile-chapter-card" },
              ch.comp
            )
          )
        )
  );
}
