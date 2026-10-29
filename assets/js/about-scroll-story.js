// ==========================================================================
// FARDIN.AI — REDESIGNED ABOUT ME SECTION (#about)
// Clean Editorial Narrative for CSE Student & Full-Stack Developer
// Integrated directly with unified page background (No giant enclosing box)
// 4 Clear Topics:
//   01 — Who I Am: CSE Student & Software Builder (Southeast University, Dhaka)
//   02 — What I Build: Responsive Web Applications & Full-Stack Systems
//   03 — My CS Foundation: Core Computer Science Theory & Practice
//   04 — How I Work: Disciplined, Thoughtful Engineering Process
// Guided by Bot F-01 Interactive Companion
// Smooth bidirectional scroll interaction on desktop & natural flow on mobile
// ==========================================================================

import React, { useState, useEffect, useRef, useCallback } from "react";
import { PROFILE_DATA } from "./data.js";

const h = React.createElement;

// --------------------------------------------------------------------------
// BOT F-01 INTERACTIVE CHARACTER COMPANION
// Porcelain dome head, obsidian visor, reactive LED eyes, ear pods,
// antenna beacon, AI core, articulated arms, and thruster glow.
// --------------------------------------------------------------------------
export function StoryBotGuide({ state = "welcome", size = 110, className = "" }) {
  const getEyeConfig = () => {
    switch (state) {
      case "welcome":
        return {
          left: h("path", { d: "M21 21 Q25 16 29 21", stroke: "#E11D48", strokeWidth: "3.2", strokeLinecap: "round", fill: "none" }),
          right: h("path", { d: "M35 21 Q39 16 43 21", stroke: "#E11D48", strokeWidth: "3.2", strokeLinecap: "round", fill: "none" }),
          glint: true
        };
      case "thinking":
        return {
          left: h("rect", { x: "22", y: "17", width: "6.8", height: "4.6", rx: "2.3", fill: "#E11D48" }),
          right: h("rect", { x: "36", y: "15.5", width: "7.2", height: "3.8", rx: "1.9", fill: "#E11D48" }),
          glint: true
        };
      case "analyzing":
        return {
          left: h("line", { x1: "21", y1: "19", x2: "29", y2: "19", stroke: "#E11D48", strokeWidth: "2.8", strokeLinecap: "round" }),
          right: h("line", { x1: "35", y1: "19", x2: "43", y2: "19", stroke: "#E11D48", strokeWidth: "2.8", strokeLinecap: "round" }),
          glint: false
        };
      case "working":
        return {
          left: h("rect", { x: "22", y: "18", width: "7", height: "4", rx: "2", fill: "#FF4D6D" }),
          right: h("rect", { x: "35", y: "18", width: "7", height: "4", rx: "2", fill: "#FF4D6D" }),
          glint: true
        };
      case "complete":
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

  const leftArmTransform = state === "welcome"
    ? "rotate(-40 14 36)"
    : state === "working"
    ? "rotate(24 14 36)"
    : state === "complete"
    ? "rotate(-45 14 36)"
    : "rotate(10 14 36)";

  const rightArmTransform = state === "welcome"
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
      h("ellipse", {
        cx: "32",
        cy: "59",
        rx: "14",
        ry: "3.2",
        fill: state === "complete" ? "rgba(16, 185, 129, 0.28)" : "rgba(225, 29, 72, 0.28)",
        className: "bot-thruster-aura"
      }),
      h("path", {
        d: "M28 50 L32 59 L36 50 Z",
        fill: beaconColor,
        opacity: "0.88",
        className: "bot-thruster-flame"
      }),
      h("rect", { x: "23", y: "46", width: "5.5", height: "6", rx: "2.7", fill: "#E2E8F0", stroke: "#0F172A", strokeWidth: "1.2" }),
      h("rect", { x: "35.5", y: "46", width: "5.5", height: "6", rx: "2.7", fill: "#E2E8F0", stroke: "#0F172A", strokeWidth: "1.2" }),
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
          cx: state === "complete" ? "56" : "51.5",
          cy: state === "complete" ? "23" : "42.5",
          r: "2.2",
          fill: beaconColor
        })
      ),
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
      h("rect", { x: "23", y: "28", width: "18", height: "3", rx: "1.5", fill: "#0F172A" }),
      h("circle", { cx: "32", cy: "38.5", r: "4.6", fill: "rgba(225, 29, 72, 0.15)", stroke: coreColor, strokeWidth: "1.8" }),
      h("circle", { cx: "32", cy: "38.5", r: "2", fill: coreColor }),
      h("line", { x1: "32", y1: "5.5", x2: "32", y2: "11.5", stroke: "#94A3B8", strokeWidth: "2.2", strokeLinecap: "round" }),
      h("circle", { cx: "32", cy: "4.8", r: "3", fill: beaconColor }),
      h("circle", { cx: "31.2", cy: "4", r: "1", fill: "#FFFFFF" }),
      h("rect", { x: "9.5", y: "16", width: "4.5", height: "8.5", rx: "2.2", fill: "#E2E8F0", stroke: beaconColor, strokeWidth: "1.4" }),
      h("rect", { x: "50", y: "16", width: "4.5", height: "8.5", rx: "2.2", fill: "#E2E8F0", stroke: beaconColor, strokeWidth: "1.4" }),
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
      h("rect", {
        x: "16.5",
        y: "13.2",
        width: "31",
        height: "13.5",
        rx: "6.75",
        fill: "#090D16"
      }),
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
      eyes.left,
      eyes.right,
      eyes.glint && h("circle", { cx: "23.3", cy: "18", r: "1", fill: "#FFFFFF" }),
      eyes.glint && h("circle", { cx: "37.3", cy: "18", r: "1", fill: "#FFFFFF" })
    )
  );
}

// --------------------------------------------------------------------------
// 1. TOPIC 01: WHO I AM
// --------------------------------------------------------------------------
function TopicWhoIAm() {
  return h(
    "article",
    { className: "about-topic-card topic-who", id: "about-topic-who" },
    h(
      "div",
      { className: "topic-header" },
      h("span", { className: "topic-eyebrow" }, "01 / WHO I AM"),
      h("h3", { className: "topic-title" }, "CSE Student & Practical Software Engineer")
    ),
    h(
      "div",
      { className: "topic-who-layout" },
      h(
        "div",
        { className: "topic-photo-wrap" },
        h("img", {
          src: PROFILE_DATA.aboutPortrait,
          alt: "Md. Fardin Hossain",
          className: "topic-portrait-img",
          width: 240,
          height: 300,
          loading: "lazy"
        }),
        h(
          "div",
          { className: "topic-photo-badge" },
          h("span", { className: "status-dot-pulse", "aria-hidden": "true" }),
          h("span", null, "Dhaka, Bangladesh · CSE Undergrad")
        )
      ),
      h(
        "div",
        { className: "topic-narrative-wrap" },
        h(
          "p",
          { className: "topic-lead-p" },
          "I’m a Computer Science and Engineering student at Southeast University in Dhaka, Bangladesh, with a strong interest in software engineering, applied AI, and building useful digital products."
        ),
        h(
          "p",
          { className: "topic-sub-p" },
          "I enjoy exploring how underlying systems operate, solving concrete engineering problems, and designing clean interfaces that make software approachable and dependable for real people."
        ),
        h(
          "div",
          { className: "topic-focus-pills", role: "list" },
          h("span", { className: "focus-pill" }, "🎓 Computer Science & Engineering"),
          h("span", { className: "focus-pill" }, "💻 Full-Stack Web"),
          h("span", { className: "focus-pill" }, "🤖 Applied AI Integration")
        )
      )
    )
  );
}

// --------------------------------------------------------------------------
// 2. TOPIC 02: WHAT I BUILD
// --------------------------------------------------------------------------
function TopicWhatIBuild() {
  const stack = [
    { cat: "Frontend", items: ["React", "JavaScript (ES6+)", "TypeScript", "Next.js", "Tailwind CSS", "HTML5/CSS3"] },
    { cat: "Backend & APIs", items: ["Node.js", "Express.js", "Python", "RESTful APIs", "FastAPI"] },
    { cat: "Databases", items: ["MongoDB", "PostgreSQL", "DuckDB", "SQL Schema Design"] },
    { cat: "Tools & Core", items: ["Git", "GitHub", "Linux/Bash", "C / C++", "Automated Testing"] }
  ];

  return h(
    "article",
    { className: "about-topic-card topic-build", id: "about-topic-build" },
    h(
      "div",
      { className: "topic-header" },
      h("span", { className: "topic-eyebrow" }, "02 / WHAT I BUILD"),
      h("h3", { className: "topic-title" }, "Responsive Web Applications & Full-Stack Systems")
    ),
    h(
      "p",
      { className: "topic-lead-p" },
      "I develop end-to-end applications where frontend interactions connect seamlessly with backend services, databases, and external APIs. My focus is always on usability, responsive rendering, and clear state management."
    ),
    h(
      "div",
      { className: "topic-stack-grid" },
      stack.map((group) =>
        h(
          "div",
          { key: group.cat, className: "stack-group-box" },
          h("h4", { className: "stack-group-title" }, group.cat),
          h(
            "div",
            { className: "stack-tag-list" },
            group.items.map((tech) =>
              h("span", { key: tech, className: "stack-tech-tag" }, tech)
            )
          )
        )
      )
    )
  );
}

// --------------------------------------------------------------------------
// 3. TOPIC 03: MY CS FOUNDATION
// --------------------------------------------------------------------------
function TopicCSFoundation() {
  const pillars = [
    {
      code: "DSA",
      name: "Data Structures & Algorithms",
      desc: "Asymptotic complexity (Big-O), recursion, search and sorting techniques, hash tables, trees, and algorithmic problem-solving."
    },
    {
      code: "OOP",
      name: "Object-Oriented Programming",
      desc: "Modularity, encapsulation, inheritance, polymorphism, interface segregation, and design patterns for maintainable codebases."
    },
    {
      code: "DBMS",
      name: "Database Management Systems",
      desc: "Relational data modeling, SQL queries, normalization, ACID properties, indexing, transactions, and document-based NoSQL storage."
    },
    {
      code: "SYS",
      name: "Operating Systems & Networks",
      desc: "Process scheduling, concurrency, memory management, client-server models, HTTP/HTTPS, TCP/IP, and network communications."
    }
  ];

  return h(
    "article",
    { className: "about-topic-card topic-foundation", id: "about-topic-foundation" },
    h(
      "div",
      { className: "topic-header" },
      h("span", { className: "topic-eyebrow" }, "03 / CS FOUNDATION"),
      h("h3", { className: "topic-title" }, "Core Computer Science Competencies")
    ),
    h(
      "p",
      { className: "topic-lead-p" },
      "My university coursework and personal projects are grounded in fundamental computer science principles that enable me to learn new frameworks quickly and build software with architectural integrity."
    ),
    h(
      "div",
      { className: "foundation-pillars-grid" },
      pillars.map((pil) =>
        h(
          "div",
          { key: pil.code, className: "foundation-pillar-card" },
          h("div", { className: "pillar-code-pill" }, pil.code),
          h("h4", { className: "pillar-title" }, pil.name),
          h("p", { className: "pillar-summary" }, pil.desc)
        )
      )
    )
  );
}

// --------------------------------------------------------------------------
// 4. TOPIC 04: HOW I WORK
// --------------------------------------------------------------------------
function TopicHowIWork() {
  const principles = [
    {
      step: "01",
      title: "Understand the Core Problem",
      body: "Before writing code, I clarify the requirements, identify the user's actual goal, and map constraints. Understanding the problem thoroughly prevents unnecessary complexity."
    },
    {
      step: "02",
      title: "Thoughtful System Architecture",
      body: "I plan data schemas, component boundaries, and API contracts early. Clean structure makes applications easier to reason about, maintain, and expand."
    },
    {
      step: "03",
      title: "Disciplined Debugging & Testing",
      body: "I reproduce issues methodically, inspect edge cases, and test across device viewports. Code should be verifiable and performant under realistic conditions."
    },
    {
      step: "04",
      title: "Continuous Learning & Iteration",
      body: "Technology evolves continuously. I stay curious, review documentation carefully, refine based on feedback, and strive to write cleaner code with every project."
    }
  ];

  return h(
    "article",
    { className: "about-topic-card topic-work", id: "about-topic-work" },
    h(
      "div",
      { className: "topic-header" },
      h("span", { className: "topic-eyebrow" }, "04 / HOW I WORK"),
      h("h3", { className: "topic-title" }, "Engineering Approach & Work Ethics")
    ),
    h(
      "div",
      { className: "work-principles-list" },
      principles.map((pr) =>
        h(
          "div",
          { key: pr.step, className: "work-principle-item" },
          h("div", { className: "principle-step-number" }, pr.step),
          h(
            "div",
            { className: "principle-text-content" },
            h("h4", { className: "principle-heading" }, pr.title),
            h("p", { className: "principle-description" }, pr.body)
          )
        )
      )
    ),
    h(
      "div",
      { className: "about-footer-cta-row" },
      h(
        "div",
        { className: "footer-cta-text" },
        h("strong", null, "Interested in collaborating or discussing an opportunity?"),
        h("span", null, "I’m always open to talking about software engineering and new projects.")
      ),
      h(
        "a",
        {
          href: "#contact",
          className: "about-contact-btn",
          onClick: (e) => {
            e.preventDefault();
            const el = document.getElementById("contact");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }
        },
        "Get in Touch →"
      )
    )
  );
}

// --------------------------------------------------------------------------
// MAIN ABOUT SECTION COMPONENT
// --------------------------------------------------------------------------
export function AboutScrollStory() {
  const sectionRef = useRef(null);
  const [activeTopic, setActiveTopic] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  // IntersectionObserver to highlight currently active topic on scroll
  useEffect(() => {
    const topicElements = [
      document.getElementById("about-topic-who"),
      document.getElementById("about-topic-build"),
      document.getElementById("about-topic-foundation"),
      document.getElementById("about-topic-work")
    ].filter(Boolean);

    if (topicElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id === "about-topic-who") setActiveTopic(0);
            else if (id === "about-topic-build") setActiveTopic(1);
            else if (id === "about-topic-foundation") setActiveTopic(2);
            else if (id === "about-topic-work") setActiveTopic(3);
          }
        });
      },
      { threshold: 0.28, rootMargin: "-10% 0px -40% 0px" }
    );

    topicElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToTopic = useCallback((index) => {
    const ids = [
      "about-topic-who",
      "about-topic-build",
      "about-topic-foundation",
      "about-topic-work"
    ];
    const target = document.getElementById(ids[index]);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const botStates = ["welcome", "thinking", "analyzing", "working"];
  const botSpeeches = [
    "Hello! Welcome to my background & profile.",
    "Web applications, APIs, and modern stacks.",
    "Data structures, OOP, DBMS, OS, & networks.",
    "Thoughtful architecture, testing, & clean code."
  ];

  const topics = [
    { id: "who", label: "01 Who I Am" },
    { id: "build", label: "02 What I Build" },
    { id: "foundation", label: "03 CS Foundation" },
    { id: "work", label: "04 How I Work" }
  ];

  return h(
    "section",
    {
      id: "about",
      ref: sectionRef,
      className: "about-editorial-section",
      "aria-labelledby": "about-main-heading"
    },

    // ------------------------------------------------------------------------
    // SECTION TOP BAR: Section Heading + Understated Resume Text Link
    // ------------------------------------------------------------------------
    h(
      "div",
      { className: "about-section-topbar" },
      h(
        "div",
        { className: "about-title-block" },
        h("h2", { id: "about-main-heading", className: "about-main-heading" }, "About Me")
      ),
      h(
        "a",
        {
          href: PROFILE_DATA.resumeUrl,
          target: "_blank",
          rel: "noopener",
          className: "about-resume-text-link",
          "aria-label": "View Md. Fardin Hossain's Résumé PDF in new tab"
        },
        "View Résumé (PDF) ↗"
      )
    ),

    // ------------------------------------------------------------------------
    // MEANINGFUL INTRO SLOGAN & INTRODUCTORY COPY
    // ------------------------------------------------------------------------
    h(
      "div",
      { className: "about-intro-hero-block" },
      h(
        "p",
        { className: "about-slogan-statement" },
        "“I turn complex problems into practical digital experiences.”"
      ),
      h(
        "div",
        { className: "about-intro-prose" },
        h(
          "p",
          null,
          "I’m a Computer Science and Engineering student and full-stack developer who enjoys turning ideas into reliable, user-friendly software. I build responsive web applications, connect frontend experiences with backend services and databases, and focus on writing maintainable code."
        ),
        h(
          "p",
          null,
          "My computer science foundation includes data structures and algorithms, object-oriented programming, database management systems, operating systems, computer networks, and software engineering. I enjoy solving technical problems, understanding how systems work, and building practical applications that people can use."
        )
      )
    ),

    // ------------------------------------------------------------------------
    // TOPIC NAVIGATION BAR & BOT COMPANION (Sticky on Desktop, Natural on Mobile)
    // ------------------------------------------------------------------------
    h(
      "div",
      { className: "about-nav-and-content-layout" },

      // LEFT: Sticky Topic Navigation Sidebar with Bot Guide
      h(
        "aside",
        { className: "about-nav-sidebar", "aria-label": "About section topic navigation" },
        h(
          "div",
          { className: "about-sticky-sidebar-inner" },
          // Topic navigation buttons
          h(
            "nav",
            { className: "about-topic-nav-menu", "aria-label": "Topic chapters" },
            topics.map((t, idx) =>
              h(
                "button",
                {
                  key: t.id,
                  type: "button",
                  className: `about-nav-chip ${activeTopic === idx ? "is-active" : ""}`,
                  onClick: () => scrollToTopic(idx),
                  "aria-label": `Scroll to ${t.label}`,
                  "aria-current": activeTopic === idx ? "true" : undefined
                },
                h("span", { className: "chip-indicator-dot", "aria-hidden": "true" }),
                h("span", { className: "chip-text" }, t.label)
              )
            )
          ),

          // Bot F-01 Interactive Companion Card
          h(
            "div",
            { className: "about-bot-companion-card" },
            h(
              "div",
              { className: "bot-speech-bubble" },
              h("span", { className: "bot-unit-tag" }, "BOT F-01 GUIDE"),
              h("p", { className: "bot-speech-line" }, botSpeeches[activeTopic])
            ),
            h(StoryBotGuide, {
              state: botStates[activeTopic],
              size: 96
            }),
            h(
              "div",
              { className: "bot-status-footer" },
              h("span", { className: "bot-led-indicator", "aria-hidden": "true" }),
              h("span", { className: "bot-status-text" }, `TOPIC 0${activeTopic + 1} OF 04`)
            )
          )
        )
      ),

      // RIGHT: The 4 Open Narrative Topics
      h(
        "div",
        { className: "about-topics-stream" },
        h(TopicWhoIAm, null),
        h(TopicWhatIBuild, null),
        h(TopicCSFoundation, null),
        h(TopicHowIWork, null)
      )
    )
  );
}
