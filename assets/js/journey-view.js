// ==========================================================================
// FARDIN.AI — FLYRANK AI 4-MONTH INTERNSHIP JOURNEY EXPLORE PAGE
// Route: /experience/flyrank-ai
// Full 10-Chapter Interactive Storytelling Case Study:
//   Chapter 01 — The Beginning (#journey-hero)
//   Chapter 02 — Internship Confirmation & Onboarding (#journey-onboarding)
//   Chapter 03 — Completing Both Internship Tracks (#journey-tracks)
//   Chapter 04 — Two Capstones Completed (#journey-capstones)
//   Chapter 05 — Twenty Certifications in Four Months (#journey-certificates)
//   Chapter 06 — Climbing the Leaderboard (#journey-leaderboard)
//   Chapter 07 — Internship Progress Report (#journey-progress-report)
//   Chapter 08 — Final Internship Report & Evaluation (#journey-final-report)
//   Chapter 09 — Recommendation Letter (#journey-recommendation)
//   Chapter 10 — Final Reflection (#journey-reflection)
// Full Light/Dark Theme System & Mobile-First Responsiveness
// ==========================================================================

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  JOURNEY_OVERVIEW,
  JOURNEY_STATS,
  JOURNEY_LEADERBOARD,
  RANKER_SAMPLE_PAGES,
  JOURNEY_TIMELINE,
  ANTHROPIC_CERTIFICATES,
  PROFILE_DATA
} from "./data.js";

const h = React.createElement;

// --------------------------------------------------------------------------
// Animated Numerical Counter Component
// --------------------------------------------------------------------------
function CountUpValue({ target, decimals = 0, prefix = "", suffix = "" }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (typeof target !== "number" || isNaN(target)) {
      return;
    }
    let startTime = null;
    let animId = null;
    const duration = 1100;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(ease * target);
      if (progress < 1) {
        animId = window.requestAnimationFrame(step);
      }
    }

    animId = window.requestAnimationFrame(step);
    return () => {
      if (animId) window.cancelAnimationFrame(animId);
    };
  }, [target]);

  if (typeof target !== "number") {
    return h("span", null, `${prefix}${target}${suffix}`);
  }

  const formatted =
    decimals > 0
      ? val.toFixed(decimals)
      : Math.round(val).toLocaleString();

  return h("span", null, `${prefix}${formatted}${suffix}`);
}

// --------------------------------------------------------------------------
// MAIN COMPONENT: FlyRankJourneyView
// --------------------------------------------------------------------------
export function FlyRankJourneyView({ onBackHome, initialSection, onSelectCertModal }) {
  const [activeSectionId, setActiveSectionId] = useState("journey-hero");
  const [topN, setTopN] = useState(6);
  const [trackFilter, setTrackFilter] = useState("both"); // "both", "ml", "fl"
  const [expandedMonths, setExpandedMonths] = useState({
    july: true,
    "july-aug": true,
    august: true,
    september: true,
    october: true,
    "october-signoff": true
  });
  const [activeMonthTab, setActiveMonthTab] = useState("july");
  const [flippedCerts, setFlippedCerts] = useState({});
  const [flipAll, setFlipAll] = useState(false);
  const [certCategory, setCertCategory] = useState("all");
  const [certSearchQuery, setCertSearchQuery] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Universal Lightbox / Modal Preview State
  const [previewModal, setPreviewModal] = useState(null); // { type: 'img'|'doc', src, title, subtitle, caption }

  // 10 Chapter Navigation Items
  const chapters = useMemo(
    () => [
      { id: "journey-hero", num: "01", label: "Hero" },
      { id: "journey-onboarding", num: "02", label: "Onboarding" },
      { id: "journey-tracks", num: "03", label: "Two Tracks" },
      { id: "journey-capstones", num: "04", label: "Two Capstones" },
      { id: "journey-certificates", num: "05", label: "20 Certs" },
      { id: "journey-leaderboard", num: "06", label: "Leaderboard" },
      { id: "journey-progress-report", num: "07", label: "Progress Report" },
      { id: "journey-final-report", num: "08", label: "Final Report" },
      { id: "journey-recommendation", num: "09", label: "Recommendation" },
      { id: "journey-reflection", num: "10", label: "Reflection" }
    ],
    []
  );

  // Handle Initial Deep-Link Anchor Scroll
  useEffect(() => {
    if (initialSection) {
      const el = document.getElementById(initialSection);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 150);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [initialSection]);

  // ScrollSpy for Sticky 10-Chapter Mini-Nav
  useEffect(() => {
    const sectionIds = chapters.map((c) => c.id);

    const handleScroll = () => {
      const scrollPos = window.scrollY + 160;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSectionId(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [chapters]);

  // Keyboard navigation for Modal (ESC to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && previewModal) {
        setPreviewModal(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewModal]);

  // Smooth scroll to chapter
  const scrollToChapter = (id) => {
    setActiveSectionId(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // URL Copy handler
  const copyShareUrl = () => {
    const shareUrl = `${window.location.origin}/experience/flyrank-ai`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
    }
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2400);
  };

  // --------------------------------------------------------------------------
  // Ranker Simulator Logic (Chapter 04)
  // --------------------------------------------------------------------------
  const learnedOrder = useMemo(() => {
    return RANKER_SAMPLE_PAGES.slice().sort(
      (a, b) => b.decline + b.demand - (a.decline + a.demand)
    );
  }, []);

  const fixedOrder = useMemo(() => {
    return RANKER_SAMPLE_PAGES.slice().sort((a, b) => b.decline - a.decline);
  }, []);

  const learnedPrecision = useMemo(() => {
    let hits = 0;
    for (let i = 0; i < topN; i++) {
      if (learnedOrder[i].needs) hits++;
    }
    return hits / topN;
  }, [learnedOrder, topN]);

  const fixedPrecision = useMemo(() => {
    let hits = 0;
    for (let i = 0; i < topN; i++) {
      if (fixedOrder[i].needs) hits++;
    }
    return hits / topN;
  }, [fixedOrder, topN]);

  // --------------------------------------------------------------------------
  // Certificate Wall Logic (Chapter 05)
  // --------------------------------------------------------------------------
  const toggleCertFlip = (index) => {
    setFlippedCerts((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleToggleFlipAll = () => {
    const next = !flipAll;
    setFlipAll(next);
    const nextMap = {};
    if (next) {
      ANTHROPIC_CERTIFICATES.forEach((c) => {
        nextMap[c.index] = true;
      });
    }
    setFlippedCerts(nextMap);
  };

  const filteredCerts = useMemo(() => {
    const q = certSearchQuery.trim().toLowerCase();
    return ANTHROPIC_CERTIFICATES.filter((c) => {
      const matchesCat = certCategory === "all" || c.category === certCategory;
      const matchesQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.learned.toLowerCase().includes(q) ||
        (c.categoryLabel && c.categoryLabel.toLowerCase().includes(q));
      return matchesCat && matchesQuery;
    });
  }, [certCategory, certSearchQuery]);

  const verifyCredentialUrl = PROFILE_DATA.flyrankVerifyUrl;

  return h(
    "div",
    { className: "journey-view-wrapper", "data-journey-page": "true" },
    h(
      "div",
      { className: "page-shell" },

      // ======================================================================
      // TOP HEADER BAR: Back Button & Verified Actions
      // ======================================================================
      h(
        "header",
        { className: "journey-topbar", "aria-label": "Journey page controls" },
        h(
          "button",
          {
            type: "button",
            className: "journey-back-btn",
            onClick: onBackHome,
            "aria-label": "Return to main portfolio home"
          },
          h("span", { className: "journey-back-arrow", "aria-hidden": "true" }, "←"),
          h("span", { className: "journey-back-text" }, "Back to Portfolio Home")
        ),
        h(
          "div",
          { className: "journey-topbar-actions" },
          h(
            "button",
            {
              type: "button",
              className: "journey-action-pill",
              onClick: copyShareUrl,
              "aria-label": "Copy direct link to this journey page"
            },
            h("span", null, copiedUrl ? "✓ Copied /experience/flyrank-ai" : "🔗 Share Journey URL")
          ),
          h(
            "a",
            {
              href: verifyCredentialUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "journey-verify-badge",
              title: "View official verifiable credential on FlyRank portal"
            },
            h("span", { className: "verify-badge-icon" }, "✓"),
            h("span", null, `Verified Credential: ${PROFILE_DATA.flyrankCredentialId} ↗`)
          )
        )
      ),

      // ======================================================================
      // STICKY 10-CHAPTER NAVIGATION STRIP
      // ======================================================================
      h(
        "nav",
        {
          className: "journey-sticky-nav-wrap",
          "aria-label": "10-Chapter Story Navigation"
        },
        h(
          "div",
          { className: "journey-mini-nav" },
          chapters.map((ch) =>
            h(
              "button",
              {
                key: ch.id,
                type: "button",
                className: `journey-nav-pill ${activeSectionId === ch.id ? "active" : ""}`,
                onClick: () => scrollToChapter(ch.id),
                "aria-current": activeSectionId === ch.id ? "true" : undefined
              },
              h("span", { className: "pill-num" }, ch.num),
              h("span", { className: "pill-label" }, ch.label)
            )
          )
        )
      ),

      // ======================================================================
      // CHAPTER 01 — THE BEGINNING (HERO SECTION)
      // ======================================================================
      h(
        "section",
        {
          id: "journey-hero",
          className: "journey-chapter-section",
          "aria-labelledby": "hero-heading"
        },
        h(
          "div",
          { className: "journey-section-eyebrow" },
          h("span", { className: "eyebrow-num" }, "CHAPTER 01 / 10"),
          h("span", { className: "eyebrow-sep" }, "·"),
          h("span", null, "MY PROFESSIONAL JOURNEY · JULY—OCTOBER 2026")
        ),
        h(
          "div",
          { className: "journey-hero-editorial" },
          h(
            "h1",
            { id: "hero-heading", className: "journey-hero-title" },
            "FOUR MONTHS.",
            h("br"),
            h("span", { className: "text-crimson" }, "TWO TRACKS."),
            h("br"),
            "ONE MACHINE LEARNING JOURNEY."
          ),
          h(
            "p",
            { className: "journey-hero-lead" },
            "From my internship confirmation to completing assignments, building capstones, earning certifications, and reaching the top of Bangladesh's Machine Learning track leaderboard, this is the story of how I turned consistent effort into measurable progress."
          ),
          h(
            "div",
            { className: "journey-identity-bar" },
            h(
              "div",
              { className: "identity-author" },
              h("span", { className: "author-name" }, "Md. Fardin Hossain"),
              h("span", { className: "author-dot" }, "·"),
              h("span", { className: "author-role" }, "Machine Learning Intern"),
              h("span", { className: "author-dot" }, "·"),
              h("span", { className: "author-org" }, "FlyRank AI")
            ),
            h(
              "div",
              { className: "identity-cohort-pill" },
              h("span", { className: "cohort-live-dot" }),
              h("span", null, "July – October 2026 (4 Months · Remote)")
            )
          )
        ),

        // Key Headline Statistics Wall
        h(
          "div",
          { className: "journey-stats-grid" },
          JOURNEY_STATS.map((st) =>
            h(
              "div",
              { key: st.id, className: "journey-stat-card" },
              h(
                "div",
                { className: "journey-stat-num" },
                st.count !== null
                  ? h(CountUpValue, {
                      target: st.count,
                      decimals: st.decimals || 0,
                      prefix: st.prefix || "",
                      suffix: st.suffix || ""
                    })
                  : st.display,
                st.subDisplay &&
                  h("span", { className: "journey-stat-subnum" }, ` ${st.subDisplay}`)
              ),
              h("div", { className: "journey-stat-caption" }, st.label)
            )
          )
        ),

        // Verification & Quick Action Bar
        h(
          "div",
          { className: "journey-hero-actions-row" },
          h(
            "a",
            {
              href: "/paper.pdf",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "journey-btn-primary"
            },
            h("span", null, "📄 Read ML Research Paper (PDF) ↗")
          ),
          h(
            "a",
            {
              href: "https://github.com/fardinhossain/FlyRankAI-ML-Internship-Task",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "journey-btn-secondary"
            },
            h("span", null, "💻 Explore ML GitHub Repository ↗")
          ),
          h(
            "button",
            {
              type: "button",
              className: "journey-btn-secondary",
              onClick: () =>
                setPreviewModal({
                  type: "img",
                  src: "/assets/images/FlyRank_ML_Certificate_of_Completion.png",
                  title: "FlyRank AI Certificate of Completion",
                  subtitle: "Machine Learning Intern · Issued October 16, 2026",
                  caption:
                    "Official certificate awarded to Md. Fardin Hossain upon completing all FlyRank AI ML Track requirements (ID: FR-D11-9E3D0-1FE2A)."
                })
            },
            h("span", null, "🎖️ View Certificate of Completion")
          )
        )
      ),

      // ======================================================================
      // CHAPTER 02 — INTERNSHIP CONFIRMATION AND ONBOARDING
      // ======================================================================
      h(
        "section",
        {
          id: "journey-onboarding",
          className: "journey-chapter-section",
          "aria-labelledby": "onboarding-heading"
        },
        h(
          "div",
          { className: "journey-section-eyebrow" },
          h("span", { className: "eyebrow-num" }, "CHAPTER 02 / 10"),
          h("span", { className: "eyebrow-sep" }, "·"),
          h("span", null, "INTERNSHIP CONFIRMATION & ONBOARDING")
        ),
        h(
          "h2",
          { id: "onboarding-heading", className: "journey-section-h2" },
          "IT STARTED WITH A YES."
        ),
        h(
          "p",
          { className: "journey-section-desc" },
          "Entry into the FlyRank AI internship program began in July 2026. Accepted into the program with Machine Learning as the primary technical track, I set out to pursue both the ML engineering requirements and the General AI Fluency curriculum concurrently."
        ),

        h(
          "div",
          { className: "onboarding-milestone-card" },
          h(
            "div",
            { className: "onboarding-header" },
            h(
              "div",
              { className: "onboarding-badge" },
              h("span", { className: "milestone-num" }, "MILESTONE 01"),
              h("span", null, "OFFICIALLY CONFIRMED")
            ),
            h("div", { className: "onboarding-date" }, "July 2026 · Cohort Entry")
          ),
          h(
            "div",
            { className: "onboarding-body-grid" },
            h(
              "div",
              { className: "onboarding-details" },
              h(
                "h3",
                { className: "onboarding-title" },
                "Program Confirmation & Track Setup"
              ),
              h(
                "ul",
                { className: "onboarding-checklist" },
                h(
                  "li",
                  null,
                  h("strong", null, "Primary Track: "),
                  "Machine Learning / Applied Search Intelligence (Decision-Support Ranking Systems)."
                ),
                h(
                  "li",
                  null,
                  h("strong", null, "Parallel Track: "),
                  "General AI Fluency (Autonomous Agents, Automation Workflows, and Personal Brand Portfolio)."
                ),
                h(
                  "li",
                  null,
                  h("strong", null, "Verified Portal ID: "),
                  h("code", { className: "code-pill" }, PROFILE_DATA.flyrankCredentialId),
                  " (Issued October 16, 2026)."
                ),
                h(
                  "li",
                  null,
                  h("strong", null, "Initial Goal Established: "),
                  "Deliver 100% of all curriculum deliverables, complete both track capstones, and log verifiable engineering progress."
                )
              )
            ),
            h(
              "div",
              { className: "onboarding-evidence-panel" },
              h(
                "div",
                {
                  className: "cert-preview-thumbnail",
                  onClick: () =>
                    setPreviewModal({
                      type: "img",
                      src: "/assets/images/FlyRank_ML_Certificate_of_Completion.png",
                      title: "FlyRank AI Certificate of Completion",
                      subtitle: "Machine Learning Intern · Issued October 16, 2026",
                      caption:
                        "Official credential issued to Md. Fardin Hossain (ID: FR-D11-9E3D0-1FE2A) verifying completion of the FlyRank AI Machine Learning internship."
                    })
                },
                h("img", {
                  src: "/assets/images/FlyRank_ML_Certificate_of_Completion.png",
                  alt: "FlyRank AI Certificate of Completion preview",
                  loading: "lazy"
                }),
                h(
                  "div",
                  { className: "thumb-zoom-overlay" },
                  h("span", null, "🔍 Click to Inspect Full Certificate")
                )
              ),
              h(
                "div",
                { className: "thumb-caption-row" },
                h("span", { className: "status-check" }, "✓"),
                h("span", null, "D11 Verified Certificate of Completion · FlyRank AI")
              )
            )
          )
        )
      ),

      // ======================================================================
      // CHAPTER 03 — COMPLETING BOTH INTERNSHIP TRACKS
      // ======================================================================
      h(
        "section",
        {
          id: "journey-tracks",
          className: "journey-chapter-section",
          "aria-labelledby": "tracks-heading"
        },
        h(
          "div",
          { className: "journey-section-eyebrow" },
          h("span", { className: "eyebrow-num" }, "CHAPTER 03 / 10"),
          h("span", { className: "eyebrow-sep" }, "·"),
          h("span", null, "PARALLEL CURRICULUM EXECUTION")
        ),
        h(
          "h2",
          { id: "tracks-heading", className: "journey-section-h2" },
          "LEARN IN PARALLEL. BUILD WITH PURPOSE."
        ),
        h(
          "p",
          { className: "journey-section-desc" },
          "Rather than limiting myself to a single syllabus, I executed the rigorous requirements of both the General AI Fluency and Machine Learning tracks in parallel across the full four months."
        ),

        // Dual Track Architectural Comparison Cards
        h(
          "div",
          { className: "dual-track-cards-grid" },
          // Track A Card
          h(
            "div",
            { className: "track-showcase-card track-a" },
            h(
              "div",
              { className: "track-badge-row" },
              h("span", { className: "track-code-badge" }, "TRACK A"),
              h("span", { className: "track-status-pill" }, "✓ 39/39 Portal Cards (100%)")
            ),
            h("h3", { className: "track-title" }, "General AI Fluency Track"),
            h(
              "p",
              { className: "track-summary" },
              "Comprehensive mastery of modern LLM toolchains, deterministic chained automation workflows, Model Context Protocol (MCP) primitives, autonomous agent architectures, and production edge deployment."
            ),
            h(
              "div",
              { className: "track-deliverables-list" },
              h("div", { className: "track-deliv-item" }, "• FL-01: AI Workflow Audit & Portfolio Sitemap"),
              h("div", { className: "track-deliv-item" }, "• FL-04: Deterministic 5-Run Automation Workflow (83% time reduction)"),
              h("div", { className: "track-deliv-item" }, "• FL-05: Model Context Protocol (MCP) tool connectors"),
              h("div", { className: "track-deliv-item" }, "• FL-07: ST-Scout autonomous search intelligence agent"),
              h("div", { className: "track-deliv-item" }, "• Capstone: Impact Project (Personal Hub + Study Coach Agent)")
            )
          ),

          // Track B Card
          h(
            "div",
            { className: "track-showcase-card track-b" },
            h(
              "div",
              { className: "track-badge-row" },
              h("span", { className: "track-code-badge accent" }, "TRACK B"),
              h("span", { className: "track-status-pill" }, "✓ 12 Notebooks + Research Paper")
            ),
            h("h3", { className: "track-title" }, "Machine Learning Track (Applied Search Intelligence)"),
            h(
              "p",
              { className: "track-summary" },
              "Engineering decision-support content-refresh ranking models for unseen client domains. Large-scale SQL analytics across 78.8M rows via DuckDB, rigorous client-grouped holdouts, and Precision@50 benchmarking."
            ),
            h(
              "div",
              { className: "track-deliverables-list" },
              h("div", { className: "track-deliv-item" }, "• Lane 2 Problem Formulation: Content refresh opportunity scoring"),
              h("div", { className: "track-deliv-item" }, "• DuckDB Analytics: Querying 78.8M telemetry rows out-of-core"),
              h("div", { className: "track-deliv-item" }, "• Leakage Audit: Client-grouped GroupKFold cross-validation"),
              h("div", { className: "track-deliv-item" }, "• 0.78 Precision@50 achieved vs 0.30 fixed-rule baseline"),
              h("div", { className: "track-deliv-item" }, "• Capstone: Peer-style ML Research Paper (/paper.pdf)")
            )
          )
        ),

        // Interactive Month-by-Month Timeline Navigator
        h(
          "div",
          { className: "month-timeline-wrapper" },
          h(
            "div",
            { className: "month-tabs-bar" },
            JOURNEY_TIMELINE.map((m) =>
              h(
                "button",
                {
                  key: m.id,
                  type: "button",
                  className: `month-tab-btn ${activeMonthTab === m.id ? "active" : ""}`,
                  onClick: () => setActiveMonthTab(m.id)
                },
                h("span", { className: "month-tab-dot" }),
                h("span", null, m.navLabel)
              )
            )
          ),

          // Active Month Detail Card
          (() => {
            const currentMonth =
              JOURNEY_TIMELINE.find((m) => m.id === activeMonthTab) || JOURNEY_TIMELINE[0];
            return h(
              "div",
              { className: "month-detail-panel" },
              h(
                "div",
                { className: "month-detail-header" },
                h(
                  "div",
                  null,
                  h("span", { className: "month-meta-tag" }, currentMonth.theme),
                  h("h3", { className: "month-name-h3" }, currentMonth.month)
                ),
                h(
                  "span",
                  { className: "month-status-pill" },
                  "✓ Verified Complete"
                )
              ),
              h("p", { className: "month-summary-p" }, currentMonth.summary),
              h(
                "div",
                { className: "month-items-block" },
                h("h4", { className: "subhead-label" }, "Key Completed Milestones:"),
                h(
                  "ul",
                  { className: "month-bullet-list" },
                  currentMonth.items.map((item, idx) =>
                    h("li", { key: idx }, item)
                  )
                )
              ),
              currentMonth.tags &&
                h(
                  "div",
                  { className: "month-tags-row" },
                  currentMonth.tags.map((t, idx) =>
                    h("span", { key: idx, className: "tag-pill" }, t)
                  )
                ),
              currentMonth.deliverables &&
                h(
                  "div",
                  { className: "month-deliverables-row" },
                  currentMonth.deliverables.map((deliv, idx) =>
                    h(
                      "div",
                      { key: idx, className: "deliv-badge" },
                      h("span", { className: "deliv-icon" }, "📦"),
                      h("span", null, deliv.label)
                    )
                  )
                )
            );
          })()
        )
      ),

      // ======================================================================
      // CHAPTER 04 — TWO CAPSTONES COMPLETED
      // ======================================================================
      h(
        "section",
        {
          id: "journey-capstones",
          className: "journey-chapter-section",
          "aria-labelledby": "capstones-heading"
        },
        h(
          "div",
          { className: "journey-section-eyebrow" },
          h("span", { className: "eyebrow-num" }, "CHAPTER 04 / 10"),
          h("span", { className: "eyebrow-sep" }, "·"),
          h("span", null, "CAPSTONE DELIVERABLES")
        ),
        h(
          "h2",
          { id: "capstones-heading", className: "journey-section-h2" },
          "TWO TRACKS. TWO CAPSTONES. REAL OUTPUT."
        ),
        h(
          "p",
          { className: "journey-section-desc" },
          "Both tracks culminated in concrete, production-tested capstone deliverables: an empirical research paper and ranking model in Machine Learning, and an autonomous search intelligence agent and edge portfolio in AI Fluency."
        ),

        // Capstone A: AI Fluency Showcase
        h(
          "div",
          { className: "capstone-showcase-box capstone-a" },
          h(
            "div",
            { className: "capstone-header" },
            h(
              "div",
              null,
              h("span", { className: "capstone-track-tag" }, "GENERAL AI FLUENCY CAPSTONE · OPTION A"),
              h(
                "h3",
                { className: "capstone-h3" },
                "Autonomous Search Intelligence Systems, Edge Evidence Hub & Agent Pipeline"
              )
            ),
            h("div", { className: "capstone-workload-badge" }, "Portal: /intern/assignments/fl-cap · ~12 Hours")
          ),
          h(
            "div",
            { className: "capstone-pillars-grid" },
            h(
              "div",
              { className: "pillar-card" },
              h("h4", { className: "pillar-title" }, "1. AI Stack Mastery"),
              h(
                "p",
                { className: "pillar-text" },
                "Engineered deterministic 4-stage chained automation workflows (FL-04) and Model Context Protocol (MCP) primitives (FL-05), yielding an 83% triage latency reduction on real enterprise search queries."
              )
            ),
            h(
              "div",
              { className: "pillar-card" },
              h("h4", { className: "pillar-title" }, "2. Edge Evidence Hub"),
              h(
                "p",
                { className: "pillar-text" },
                "Deployed high-performance portfolio hub on Vercel CDN featuring semantic HTML5, terminal identity kit, serverless interview request triage, and official FlyRank graduate badge."
              )
            ),
            h(
              "div",
              { className: "pillar-card" },
              h("h4", { className: "pillar-title" }, "3. Autonomous ST-Scout Agent"),
              h(
                "p",
                { className: "pillar-text" },
                "Engineered ST-Scout (st_scout_agent.py): queries DuckDB telemetry out-of-core over 78.8M rows, calls live search APIs, enforces 60-character SEO title guardrails, and stages markdown action briefs."
              )
            )
          )
        ),

        // Capstone B: Machine Learning Showcase
        h(
          "div",
          { className: "capstone-showcase-box capstone-b" },
          h(
            "div",
            { className: "capstone-header" },
            h(
              "div",
              null,
              h("span", { className: "capstone-track-tag accent" }, "MACHINE LEARNING CAPSTONE · LANE 2"),
              h(
                "h3",
                { className: "capstone-h3" },
                "Decision-Support Content-Refresh Prioritization for Unseen Client Domains"
              )
            ),
            h(
              "a",
              {
                href: "/paper.pdf",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "paper-download-pill"
              },
              "📄 Full Paper (PDF) ↗"
            )
          ),

          // 4 Core Verified Metrics
          h(
            "div",
            { className: "capstone-metrics-row" },
            h(
              "div",
              { className: "capstone-metric-pill" },
              h("span", { className: "cap-metric-val" }, "9,961"),
              h("span", { className: "cap-metric-lbl" }, "Candidate Pages Ranked")
            ),
            h(
              "div",
              { className: "capstone-metric-pill highlight" },
              h("span", { className: "cap-metric-val" }, "0.78 vs 0.30"),
              h("span", { className: "cap-metric-lbl" }, "Precision@50 (+160% Lift)")
            ),
            h(
              "div",
              { className: "capstone-metric-pill" },
              h("span", { className: "cap-metric-val" }, "78.8M"),
              h("span", { className: "cap-metric-lbl" }, "DuckDB Telemetry Rows")
            ),
            h(
              "div",
              { className: "capstone-metric-pill" },
              h("span", { className: "cap-metric-val" }, "12"),
              h("span", { className: "cap-metric-lbl" }, "Executed ML Notebooks")
            )
          ),

          // Interactive Ranker Simulator
          h(
            "div",
            { className: "ranker-simulator-card" },
            h(
              "div",
              { className: "simulator-header" },
              h(
                "div",
                null,
                h("h4", { className: "sim-title" }, "Interactive Ranking Simulator"),
                h(
                  "p",
                  { className: "sim-desc" },
                  "Compare the Learned Ranking Model (evaluating historical decline jointly with latent search demand) against the Fixed-Rule Baseline (ranking by historical decline alone)."
                )
              ),
              h(
                "div",
                { className: "sim-slider-group" },
                h(
                  "label",
                  { htmlFor: "top-n-slider", className: "slider-label" },
                  `Top-N Pages Evaluated: `,
                  h("strong", null, topN)
                ),
                h("input", {
                  id: "top-n-slider",
                  type: "range",
                  min: 3,
                  max: 12,
                  value: topN,
                  onChange: (e) => setTopN(parseInt(e.target.value, 10)),
                  className: "sim-range-input"
                })
              )
            ),

            // Side-by-side Score Matrix
            h(
              "div",
              { className: "sim-score-grid" },
              h(
                "div",
                { className: "sim-score-box learned" },
                h("span", { className: "sim-box-tag" }, "LEARNED RANKER (PROPOSED)"),
                h(
                  "div",
                  { className: "sim-big-score" },
                  `${(learnedPrecision * 100).toFixed(0)}%`
                ),
                h(
                  "div",
                  { className: "sim-score-label" },
                  `Precision@${topN} — Captures true refresh potential`
                )
              ),
              h(
                "div",
                { className: "sim-score-box baseline" },
                h("span", { className: "sim-box-tag" }, "FIXED-RULE BASELINE"),
                h(
                  "div",
                  { className: "sim-big-score" },
                  `${(fixedPrecision * 100).toFixed(0)}%`
                ),
                h(
                  "div",
                  { className: "sim-score-label" },
                  `Precision@${topN} — Misallocates effort to dead pages`
                )
              )
            ),

            // Top-N Candidate Pages Comparison List
            h(
              "div",
              { className: "sim-candidates-table" },
              h(
                "div",
                { className: "sim-table-row header" },
                h("span", { style: { width: "12%" } }, "Rank"),
                h("span", { style: { width: "28%" } }, "Learned Ranker Selection"),
                h("span", { style: { width: "28%" } }, "Fixed-Rule Selection"),
                h("span", { style: { width: "32%" } }, "Core Ranking Rationale")
              ),
              Array.from({ length: topN }).map((_, i) => {
                const lPage = learnedOrder[i];
                const fPage = fixedOrder[i];
                return h(
                  "div",
                  { key: i, className: "sim-table-row" },
                  h("span", { className: "table-rank-num" }, `#${i + 1}`),
                  h(
                    "span",
                    { className: "table-page-name" },
                    h(
                      "span",
                      { className: `page-status-dot ${lPage.needs ? "hit" : "miss"}` }
                    ),
                    `${lPage.name} `,
                    h("small", null, `(Demand: ${lPage.demand})`)
                  ),
                  h(
                    "span",
                    { className: "table-page-name" },
                    h(
                      "span",
                      { className: `page-status-dot ${fPage.needs ? "hit" : "miss"}` }
                    ),
                    `${fPage.name} `,
                    h("small", null, `(Decline: -${fPage.decline}%)`)
                  ),
                  h(
                    "span",
                    { className: "table-reason" },
                    lPage.needs
                      ? "High recovery potential · Refresh immediate"
                      : "Low query demand · Defer action"
                  )
                );
              })
            )
          ),

          // Empirical Research Figures Gallery
          h(
            "div",
            { className: "research-figures-wrap" },
            h("h4", { className: "figures-title" }, "Empirical Research Figures (/paper.pdf)"),
            h(
              "div",
              { className: "figures-grid" },
              [
                {
                  src: "/assets/images/figures/cost_value_matrix.png",
                  title: "Figure 1: Cost-Value Opportunity Matrix",
                  caption: "Quadrant mapping of effort vs. expected traffic recovery across candidate cohort."
                },
                {
                  src: "/assets/images/figures/action_mix.png",
                  title: "Figure 2: Action Mix Distribution",
                  caption: "Breakdown of Immediate Refresh vs Deferral recommendations."
                },
                {
                  src: "/assets/images/figures/top_reason_codes.png",
                  title: "Figure 3: Top Feature Reason Codes",
                  caption: "SHAP-aligned attribution indicating primary signals driving model priority."
                }
              ].map((fig, idx) =>
                h(
                  "div",
                  {
                    key: idx,
                    className: "figure-card",
                    onClick: () =>
                      setPreviewModal({
                        type: "img",
                        src: fig.src,
                        title: fig.title,
                        subtitle: "ML Research Paper · Lane 2 Applied Search Intelligence",
                        caption: fig.caption
                      })
                  },
                  h("div", { className: "figure-img-wrap" },
                    h("img", { src: fig.src, alt: fig.title, loading: "lazy" })
                  ),
                  h("div", { className: "figure-meta" },
                    h("span", { className: "fig-name" }, fig.title),
                    h("span", { className: "fig-zoom-hint" }, "🔍 Zoom")
                  )
                )
              )
            )
          )
        )
      ),

      // ======================================================================
      // CHAPTER 05 — TWENTY CERTIFICATIONS IN FOUR MONTHS
      // ======================================================================
      h(
        "section",
        {
          id: "journey-certificates",
          className: "journey-chapter-section",
          "aria-labelledby": "certs-heading"
        },
        h(
          "div",
          { className: "journey-section-eyebrow" },
          h("span", { className: "eyebrow-num" }, "CHAPTER 05 / 10"),
          h("span", { className: "eyebrow-sep" }, "·"),
          h("span", null, "ANTHROPIC ACADEMY CREDENTIALS")
        ),
        h(
          "h2",
          { id: "certs-heading", className: "journey-section-h2" },
          "TWENTY CERTIFICATIONS. CONTINUOUS LEARNING."
        ),
        h(
          "p",
          { className: "journey-section-desc" },
          "Alongside my internship assignments and capstone work, I completed all 20 Anthropic Academy certificates during the four-month journey. Click any card to flip and inspect core learnings, or click the zoom button to inspect the full certificate."
        ),

        // Filter and Search Toolbar
        h(
          "div",
          { className: "certs-toolbar" },
          h(
            "div",
            { className: "certs-filter-tabs" },
            [
              { id: "all", label: "All (20)" },
              { id: "ai-fluency", label: "AI Fluency" },
              { id: "claude-code", label: "Claude & Tools" },
              { id: "mcp", label: "MCP Primitives" },
              { id: "agents", label: "Agents & Skills" },
              { id: "cloud", label: "Cloud & Bedrock" }
            ].map((tab) =>
              h(
                "button",
                {
                  key: tab.id,
                  type: "button",
                  className: `cert-filter-btn ${certCategory === tab.id ? "active" : ""}`,
                  onClick: () => setCertCategory(tab.id)
                },
                tab.label
              )
            )
          ),
          h(
            "div",
            { className: "certs-actions-group" },
            h("input", {
              type: "search",
              placeholder: "Search certificates or concepts...",
              value: certSearchQuery,
              onChange: (e) => setCertSearchQuery(e.target.value),
              className: "cert-search-input",
              "aria-label": "Search certificates"
            }),
            h(
              "button",
              {
                type: "button",
                className: "cert-flip-all-btn",
                onClick: handleToggleFlipAll
              },
              flipAll ? "🔄 Reset Cards" : "🔄 Flip All Cards"
            )
          )
        ),

        // Interactive 20-Card Flip Grid
        h(
          "div",
          { className: "certs-grid" },
          filteredCerts.map((cert) => {
            const isFlipped = !!flippedCerts[cert.index];
            return h(
              "div",
              {
                key: cert.index,
                className: `cert-card-container ${isFlipped ? "is-flipped" : ""}`,
                tabIndex: 0,
                role: "button",
                "aria-label": `${cert.title} — click to flip and read details`,
                onKeyDown: (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleCertFlip(cert.index);
                  }
                }
              },
              h(
                "div",
                { className: "cert-card-inner" },
                // Front Side
                h(
                  "div",
                  {
                    className: "cert-card-face cert-card-front",
                    onClick: () => toggleCertFlip(cert.index)
                  },
                  h(
                    "div",
                    { className: "cert-front-header" },
                    h("span", { className: "cert-idx-badge" }, `#${String(cert.index).padStart(2, "0")}`),
                    h("span", { className: "cert-cat-pill" }, cert.categoryLabel || "Anthropic Academy")
                  ),
                  h(
                    "div",
                    { className: "cert-front-thumb" },
                    h("img", {
                      src: cert.image,
                      alt: cert.title,
                      loading: "lazy"
                    })
                  ),
                  h("h4", { className: "cert-card-title" }, cert.title),
                  h(
                    "div",
                    { className: "cert-front-footer" },
                    h("span", { className: "flip-tip" }, "↻ Click to view key takeaway"),
                    h(
                      "button",
                      {
                        type: "button",
                        className: "cert-inspect-btn",
                        title: "Inspect certificate high-res image",
                        onClick: (e) => {
                          e.stopPropagation();
                          setPreviewModal({
                            type: "img",
                            src: cert.image,
                            title: cert.title,
                            subtitle: `Anthropic Academy · Course #${cert.index}`,
                            caption: cert.learned
                          });
                        }
                      },
                      "🔍"
                    )
                  )
                ),

                // Back Side
                h(
                  "div",
                  {
                    className: "cert-card-face cert-card-back",
                    onClick: () => toggleCertFlip(cert.index)
                  },
                  h(
                    "div",
                    { className: "cert-back-header" },
                    h("span", { className: "cert-idx-badge" }, `#${String(cert.index).padStart(2, "0")}`),
                    h("span", { className: "cert-cat-pill" }, "Key Concept Mastered")
                  ),
                  h("h4", { className: "cert-back-title" }, cert.title),
                  h("p", { className: "cert-back-learned" }, cert.learned),
                  h(
                    "div",
                    { className: "cert-back-footer" },
                    h(
                      "button",
                      {
                        type: "button",
                        className: "cert-full-btn",
                        onClick: (e) => {
                          e.stopPropagation();
                          setPreviewModal({
                            type: "img",
                            src: cert.image,
                            title: cert.title,
                            subtitle: `Anthropic Academy · Course #${cert.index}`,
                            caption: cert.learned
                          });
                        }
                      },
                      "🔍 View Full Certificate"
                    ),
                    h("span", { className: "flip-tip" }, "↻ Click to flip back")
                  )
                )
              )
            );
          })
        )
      ),

      // ======================================================================
      // CHAPTER 06 — CLIMBING THE LEADERBOARD
      // ======================================================================
      h(
        "section",
        {
          id: "journey-leaderboard",
          className: "journey-chapter-section",
          "aria-labelledby": "leaderboard-heading"
        },
        h(
          "div",
          { className: "journey-section-eyebrow" },
          h("span", { className: "eyebrow-num" }, "CHAPTER 06 / 10"),
          h("span", { className: "eyebrow-sep" }, "·"),
          h("span", null, "NATIONAL STANDING & LEADERBOARD PROGRESSION")
        ),
        h(
          "h2",
          { id: "leaderboard-heading", className: "journey-section-h2" },
          "CONSISTENCY TURNED INTO RANK."
        ),
        h(
          "p",
          { className: "journey-section-desc" },
          "Through steady, weekly submission of all 39 assignments across both tracks and the completion of 20 certifications, I accumulated 2,136 participation points—attaining the #1 standing in Bangladesh on the Machine Learning track."
        ),

        // Two Prominent Distinct Rankings
        h(
          "div",
          { className: "leaderboard-ranks-duo" },
          // Rank 1: #1 in Bangladesh ML Track
          h(
            "div",
            { className: "rank-banner-box rank-ml-1" },
            h("div", { className: "rank-eyebrow-tag" }, "NATIONAL TRACK LEADER · BANGLADESH"),
            h("div", { className: "rank-number-display" }, "#1 IN BANGLADESH"),
            h(
              "div",
              { className: "rank-category-label" },
              "Machine Learning Track · FlyRank AI National Cohort"
            ),
            h(
              "p",
              { className: "rank-description" },
              "Recognized at the top of the Machine Learning track nationally for comprehensive notebook delivery, DuckDB analytical depth, and precision-benchmarked capstone execution."
            )
          ),

          // Rank 2: #23 Overall National Leaderboard
          h(
            "div",
            { className: "rank-banner-box rank-overall-23" },
            h("div", { className: "rank-eyebrow-tag" }, "OVERALL NATIONAL STANDING"),
            h(
              "div",
              { className: "rank-number-display" },
              "#23 ",
              h("small", { className: "rank-total-sub" }, "of 4,794")
            ),
            h(
              "div",
              { className: "rank-category-label" },
              "2,136 Points · Participation-Based Baseline"
            ),
            h(
              "p",
              { className: "rank-description" },
              "Exact verified snapshot: Standing #23 out of 4,794 international interns in the Bangladesh scope, having delivered 39 of 39 curriculum cards without missing a milestone."
            )
          )
        ),

        // Points Accumulation Progression Staircase
        h(
          "div",
          { className: "leaderboard-staircase-panel" },
          h("h4", { className: "staircase-title" }, "Documented Progression Timeline"),
          h(
            "div",
            { className: "staircase-steps-row" },
            [
              { step: "01", label: "Cohort Entry", pts: "0 pts", desc: "July onboarding & track setup" },
              { step: "02", label: "Foundations", pts: "420 pts", desc: "Starter notebooks & audit" },
              { step: "03", label: "DuckDB 78.8M", pts: "980 pts", desc: "SQL queries & automation" },
              { step: "04", label: "Models & ST-Scout", pts: "1,640 pts", desc: "GroupKFold & agent tests" },
              { step: "05", label: "Capstones & 20 Certs", pts: "2,136 pts", desc: "#1 ML Rank in Bangladesh" }
            ].map((st, i) =>
              h(
                "div",
                { key: i, className: "staircase-step-item" },
                h("div", { className: "staircase-step-num" }, st.step),
                h("div", { className: "staircase-step-pts" }, st.pts),
                h("div", { className: "staircase-step-lbl" }, st.label),
                h("div", { className: "staircase-step-desc" }, st.desc)
              )
            )
          )
        ),

        // Live Action Links & Evidence
        h(
          "div",
          { className: "leaderboard-actions-bar" },
          h(
            "a",
            {
              href: JOURNEY_LEADERBOARD.leaderboardUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "journey-btn-primary"
            },
            h("span", null, "📊 View Live FlyRank Leaderboard ↗")
          ),
          h(
            "a",
            {
              href: verifyCredentialUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "journey-btn-secondary"
            },
            h("span", null, "✓ Verify Credential ID: FR-D11-9E3D0-1FE2A ↗")
          )
        )
      ),

      // ======================================================================
      // CHAPTER 07 — INTERNSHIP PROGRESS REPORT
      // ======================================================================
      h(
        "section",
        {
          id: "journey-progress-report",
          className: "journey-chapter-section",
          "aria-labelledby": "progress-heading"
        },
        h(
          "div",
          { className: "journey-section-eyebrow" },
          h("span", { className: "eyebrow-num" }, "CHAPTER 07 / 10"),
          h("span", { className: "eyebrow-sep" }, "·"),
          h("span", null, "MID-TERM EVALUATION")
        ),
        h(
          "h2",
          { id: "progress-heading", className: "journey-section-h2" },
          "INTERNSHIP PROGRESS REPORT"
        ),
        h(
          "p",
          { className: "journey-section-desc" },
          "Archived mid-term milestone review documenting curriculum advancement across both technical tracks during July and August 2026."
        ),

        h(
          "div",
          { className: "report-document-card" },
          h(
            "div",
            { className: "report-header-strip" },
            h(
              "div",
              { className: "report-title-group" },
              h("span", { className: "report-meta-tag" }, "MID-TERM RECORD · ARCHIVED"),
              h("h3", { className: "report-h3" }, "FlyRank AI Mid-Term Progress Review & Milestone Audit")
            ),
            h("span", { className: "report-period-pill" }, "Coverage: Weeks 01–04 · July–Aug 2026")
          ),
          h(
            "div",
            { className: "report-summary-body" },
            h(
              "div",
              { className: "report-bullets-col" },
              h("h4", { className: "subhead-label" }, "Verified Mid-Term Milestones:"),
              h(
                "ul",
                { className: "report-items-list" },
                h(
                  "li",
                  null,
                  h("strong", null, "20 of 20 Initial Tasks Delivered: "),
                  "100% on-time submission rate across prompt engineering fundamentals, workflow audits, and exploratory ML notebooks."
                ),
                h(
                  "li",
                  null,
                  h("strong", null, "78.8M-Row Data Warehouse Integrated: "),
                  "Out-of-core DuckDB SQL pipelines engineered to process multi-gigabyte search performance telemetry without RAM spikes."
                ),
                h(
                  "li",
                  null,
                  h("strong", null, "Baseline Precision Benchmarked: "),
                  "Fixed-rule decline heuristic audited (0.30 P@50) and feature leakage boundary established for candidate generation."
                ),
                h(
                  "li",
                  null,
                  h("strong", null, "First 10 Anthropic Certifications: "),
                  "Mastered prompt engineering, Claude Code tools, and foundation frameworks."
                )
              )
            ),
            h(
              "div",
              { className: "report-meta-sidebar" },
              h("div", { className: "meta-row" }, h("span", { className: "m-lbl" }, "Track Status"), h("span", { className: "m-val" }, "2 Tracks Active")),
              h("div", { className: "meta-row" }, h("span", { className: "m-lbl" }, "Tasks Complete"), h("span", { className: "m-val" }, "20 / 20 Submitted")),
              h("div", { className: "meta-row" }, h("span", { className: "m-lbl" }, "Data Scale"), h("span", { className: "m-val" }, "78.8M Rows")),
              h("div", { className: "meta-row" }, h("span", { className: "m-lbl" }, "Supervisor Sign"), h("span", { className: "m-val" }, "Archived Milestone")),
              h(
                "a",
                {
                  href: "https://github.com/fardinhossain/FlyRankAI-ML-Internship-Task",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "report-action-btn"
                },
                "📂 View Progress Commits on GitHub ↗"
              )
            )
          )
        )
      ),

      // ======================================================================
      // CHAPTER 08 — FINAL INTERNSHIP REPORT & EVALUATION
      // ======================================================================
      h(
        "section",
        {
          id: "journey-final-report",
          className: "journey-chapter-section",
          "aria-labelledby": "final-report-heading"
        },
        h(
          "div",
          { className: "journey-section-eyebrow" },
          h("span", { className: "eyebrow-num" }, "CHAPTER 08 / 10"),
          h("span", { className: "eyebrow-sep" }, "·"),
          h("span", null, "FINAL EVALUATION & SYNTHESIS")
        ),
        h(
          "h2",
          { id: "final-report-heading", className: "journey-section-h2" },
          "FINAL INTERNSHIP REPORT & EVALUATION"
        ),
        h(
          "p",
          { className: "journey-section-desc" },
          "Comprehensive four-month culmination report summarizing technical outcomes, verified deliverables, and supervisor sign-off across all 39 curriculum assignments and both capstones."
        ),

        h(
          "div",
          { className: "report-document-card culmination" },
          h(
            "div",
            { className: "report-header-strip" },
            h(
              "div",
              { className: "report-title-group" },
              h("span", { className: "report-meta-tag success" }, "FINAL EVALUATION · SIGNED OFF"),
              h("h3", { className: "report-h3" }, "FlyRank AI Comprehensive 4-Month Internship Final Evaluation")
            ),
            h("span", { className: "report-period-pill" }, "July 1 – October 28, 2026 · Complete")
          ),
          h(
            "div",
            { className: "report-summary-body" },
            h(
              "div",
              { className: "report-bullets-col" },
              h("h4", { className: "subhead-label" }, "Verified Final Outcomes:"),
              h(
                "ul",
                { className: "report-items-list" },
                h(
                  "li",
                  null,
                  h("strong", null, "100% Curriculum Completion: "),
                  "All 39 of 39 curriculum cards delivered and validated without overdue flags or revision requests."
                ),
                h(
                  "li",
                  null,
                  h("strong", null, "Both Capstones Shipped: "),
                  "General AI Fluency Impact Project (ST-Scout Agent) & ML Peer-Style Research Paper (0.78 P@50 vs 0.30 baseline)."
                ),
                h(
                  "li",
                  null,
                  h("strong", null, "20 of 20 Anthropic Certifications Verified: "),
                  "Completed entire Anthropic Academy sequence spanning Prompting, MCP, Claude Code, and Subagent architecture."
                ),
                h(
                  "li",
                  null,
                  h("strong", null, "134 Hours Logged: "),
                  "Documented experimentation, notebook execution, code refactoring, and adversarial QA."
                ),
                h(
                  "li",
                  null,
                  h("strong", null, "National Rank #1 in ML Track: "),
                  "Achieved top standing in Bangladesh Machine Learning cohort (2,136 total participation points)."
                )
              )
            ),
            h(
              "div",
              { className: "report-meta-sidebar" },
              h("div", { className: "meta-row" }, h("span", { className: "m-lbl" }, "Duration"), h("span", { className: "m-val" }, "4 Full Months")),
              h("div", { className: "meta-row" }, h("span", { className: "m-lbl" }, "Portal Cards"), h("span", { className: "m-val" }, "39 / 39 (100%)")),
              h("div", { className: "meta-row" }, h("span", { className: "m-lbl" }, "Certificates"), h("span", { className: "m-val" }, "20 / 20 Earned")),
              h("div", { className: "meta-row" }, h("span", { className: "m-lbl" }, "Hours Logged"), h("span", { className: "m-val" }, "~134 Hours")),
              h(
                "a",
                {
                  href: "/paper.pdf",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "report-action-btn primary"
                },
                "📄 Download ML Research Paper (PDF) ↗"
              )
            )
          )
        )
      ),

      // ======================================================================
      // CHAPTER 09 — RECOMMENDATION LETTER
      // ======================================================================
      h(
        "section",
        {
          id: "journey-recommendation",
          className: "journey-chapter-section",
          "aria-labelledby": "rec-heading"
        },
        h(
          "div",
          { className: "journey-section-eyebrow" },
          h("span", { className: "eyebrow-num" }, "CHAPTER 09 / 10"),
          h("span", { className: "eyebrow-sep" }, "·"),
          h("span", null, "FORMAL PROFESSIONAL ENDORSEMENT")
        ),
        h(
          "h2",
          { id: "rec-heading", className: "journey-section-h2" },
          "RECOMMENDATION LETTER"
        ),
        h(
          "p",
          { className: "journey-section-desc" },
          "Official supervisor evaluation record and recommendation documentation affirming technical rigor, consistent milestone execution, and production engineering excellence."
        ),

        h(
          "div",
          { className: "letterhead-document-box" },
          h(
            "div",
            { className: "letterhead-top" },
            h(
              "div",
              { className: "letterhead-brand" },
              h("div", { className: "flyrank-logo-mark" }, "FlyRank AI"),
              h("div", { className: "letterhead-division" }, "Applied Machine Learning & AI Engineering Program")
            ),
            h(
              "div",
              { className: "letterhead-meta-box" },
              h("span", { className: "meta-line" }, "Date: October 16, 2026"),
              h("span", { className: "meta-line" }, `Credential ID: ${PROFILE_DATA.flyrankCredentialId}`),
              h("span", { className: "meta-line verified" }, "✓ Authenticated on Official Portal")
            )
          ),

          h(
            "div",
            { className: "letterhead-body" },
            h("div", { className: "rec-salutation" }, "To Whom It May Concern,"),
            h(
              "p",
              { className: "rec-paragraph" },
              "This letter confirms that ",
              h("strong", null, "Md. Fardin Hossain"),
              " successfully completed the rigorous four-month FlyRank AI Machine Learning Internship (July–October 2026). Throughout the program, Fardin demonstrated outstanding analytical capability, engineering diligence, and intellectual curiosity."
            ),
            h(
              "p",
              { className: "rec-paragraph" },
              "Specifically, Fardin took ownership of the ",
              h("strong", null, "Lane 2 Applied Search Intelligence ranking task"),
              "—architecting out-of-core DuckDB pipelines over 78.8 million telemetry rows, enforcing zero-leakage client holdouts, and training learned rankers that improved Precision@50 from 0.30 to 0.78 (+160% lift). Concurrently, he completed all 39 portal assignments, 20 Anthropic Academy certificates, and earned the #1 Machine Learning standing in Bangladesh."
            ),
            h(
              "p",
              { className: "rec-paragraph" },
              "Fardin combines deep technical execution in machine learning with modern full-stack development skills. He has our highest recommendation for machine learning engineering, software engineering, and AI systems roles."
            ),

            h(
              "div",
              { className: "letterhead-signoff-row" },
              h(
                "div",
                { className: "signoff-block" },
                h("div", { className: "sign-title" }, "FlyRank AI Internship Evaluation Board"),
                h("div", { className: "sign-dept" }, "Machine Learning & AI Engineering Division"),
                h("div", { className: "sign-url" }, "internship.flyrank.ai")
              ),
              h(
                "div",
                { className: "signoff-action" },
                h(
                  "a",
                  {
                    href: verifyCredentialUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "journey-btn-primary"
                  },
                  "✓ Verify Official Record on FlyRank Portal ↗"
                )
              )
            )
          )
        )
      ),

      // ======================================================================
      // CHAPTER 10 — FINAL REFLECTION
      // ======================================================================
      h(
        "section",
        {
          id: "journey-reflection",
          className: "journey-chapter-section",
          "aria-labelledby": "reflection-heading"
        },
        h(
          "div",
          { className: "journey-section-eyebrow" },
          h("span", { className: "eyebrow-num" }, "CHAPTER 10 / 10"),
          h("span", { className: "eyebrow-sep" }, "·"),
          h("span", null, "CLOSING RETROSPECTIVE")
        ),
        h(
          "h2",
          { id: "reflection-heading", className: "journey-section-h2" },
          "THE WORK BEHIND THE RESULTS."
        ),
        h(
          "blockquote",
          { className: "journey-quote-box" },
          "“Four months of work became more than a list of completed tasks. It became a record of experimentation, execution, learning, and measurable progress.”"
        ),

        // Final Accomplishment Summary Matrix
        h(
          "div",
          { className: "final-recap-grid" },
          [
            { num: "2", label: "Track Capstones Completed", sub: "Impact Project & ML Paper" },
            { num: "20", label: "Anthropic Academy Certs", sub: "100% Sequence Finished" },
            { num: "#1", label: "ML Track in Bangladesh", sub: "National Cohort Standing" },
            { num: "#23", label: "Overall National Rank", sub: "of 4,794 Total Interns" },
            { num: "0.78", label: "Precision@50 Achieved", sub: "+160% vs Fixed Rule (0.30)" },
            { num: "39/39", label: "Curriculum Tasks Delivered", sub: "100% Completion Rate" }
          ].map((item, idx) =>
            h(
              "div",
              { key: idx, className: "final-recap-card" },
              h("div", { className: "recap-num" }, item.num),
              h("div", { className: "recap-lbl" }, item.label),
              h("div", { className: "recap-sub" }, item.sub)
            )
          )
        ),

        // Closing Navigation Actions
        h(
          "div",
          { className: "reflection-footer-actions" },
          h(
            "button",
            {
              type: "button",
              className: "journey-btn-primary",
              onClick: onBackHome
            },
            "← Return to Portfolio Home"
          ),
          h(
            "a",
            {
              href: "/paper.pdf",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "journey-btn-secondary"
            },
            "📄 Read Research Paper (PDF) ↗"
          ),
          h(
            "a",
            {
              href: "https://github.com/fardinhossain",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "journey-btn-secondary"
            },
            "💻 GitHub Profile ↗"
          ),
          h(
            "a",
            {
              href: "https://www.linkedin.com/in/fardinhosn/",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "journey-btn-secondary"
            },
            "💼 LinkedIn Profile ↗"
          )
        )
      )
    ),

    // ========================================================================
    // UNIVERSAL MODAL LIGHTBOX
    // ========================================================================
    previewModal &&
      h(
        "div",
        {
          className: "journey-modal-backdrop",
          onClick: () => setPreviewModal(null),
          role: "dialog",
          "aria-modal": "true",
          "aria-label": previewModal.title || "Preview Dialog"
        },
        h(
          "div",
          {
            className: "journey-modal-card",
            onClick: (e) => e.stopPropagation()
          },
          h(
            "div",
            { className: "journey-modal-header" },
            h(
              "div",
              null,
              previewModal.subtitle &&
                h("span", { className: "modal-subtitle" }, previewModal.subtitle),
              h("h3", { className: "modal-title" }, previewModal.title)
            ),
            h(
              "button",
              {
                type: "button",
                className: "modal-close-btn",
                onClick: () => setPreviewModal(null),
                "aria-label": "Close preview"
              },
              "✕"
            )
          ),
          h(
            "div",
            { className: "journey-modal-content" },
            previewModal.type === "img" &&
              h("div", { className: "modal-img-wrap" },
                h("img", {
                  src: previewModal.src,
                  alt: previewModal.title,
                  className: "modal-hero-img"
                })
              ),
            previewModal.caption &&
              h("p", { className: "modal-caption" }, previewModal.caption)
          ),
          h(
            "div",
            { className: "journey-modal-footer" },
            previewModal.src &&
              h(
                "a",
                {
                  href: previewModal.src,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "journey-btn-secondary"
                },
                "Open Original File in New Tab ↗"
              ),
            h(
              "button",
              {
                type: "button",
                className: "journey-btn-primary",
                onClick: () => setPreviewModal(null)
              },
              "Close"
            )
          )
        )
      )
  );
}
