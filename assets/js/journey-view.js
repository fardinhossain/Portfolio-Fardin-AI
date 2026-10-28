// ==========================================================================
// FARDIN.AI — FLYRANK AI 4-MONTH INTERNSHIP JOURNEY EXPLORE PAGE
// Route: /experience/flyrank-ai
// Preserves Editorial/Document Theme:
//   - Cream off-white background (#FAF8F5)
//   - Crisp white cards with soft ambient shadows
//   - Bold dark typography & crimson-red (#E11D48) accents
//   - Sections in exact order 01–07 with sticky mini-nav
//   - 100% verified facts: #23 of 4794, 2,136 points, 39/39 cards complete
//   - Robust mobile-first responsive layout (down to 360px without overflow)
// ==========================================================================

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { JourneyPipelineScene } from "./three-scenes.js";
import { GithubIcon, ExternalArrowIcon } from "./visual-previews.js";
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

function CountUpValue({ target, decimals = 0, prefix = "", suffix = "" }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animId = null;
    const duration = 1200;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(ease * target);
      if (progress < 1) {
        animId = requestAnimationFrame(step);
      }
    }

    animId = requestAnimationFrame(step);
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [target]);

  const formatted =
    decimals > 0
      ? val.toFixed(decimals)
      : Math.round(val).toLocaleString();

  return h("span", null, `${prefix}${formatted}${suffix}`);
}

export function FlyRankJourneyView({ onBackHome, initialSection, onSelectCertModal }) {
  const [topN, setTopN] = useState(6);
  const [activeSectionId, setActiveSectionId] = useState("journey-hero");
  const [activeMonthId, setActiveMonthId] = useState("july");
  const [expandedMonths, setExpandedMonths] = useState({
    july: true,
    "july-aug": true,
    august: true,
    september: true,
    october: true,
    "october-signoff": true
  });
  const [flippedCerts, setFlippedCerts] = useState({});
  const [flipAll, setFlipAll] = useState(false);
  const [certWallFilter, setCertWallFilter] = useState("all");
  const [certQuery, setCertQuery] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Handle Initial Deep-Link Anchor Scroll
  useEffect(() => {
    if (initialSection) {
      const el = document.getElementById(initialSection);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 140);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [initialSection]);

  // ScrollSpy for Sticky Mini-Nav
  useEffect(() => {
    const sectionIds = [
      "journey-hero",
      "journey-standing",
      "journey-ranker",
      "journey-timeline",
      "journey-certificates",
      "journey-deliverables"
    ];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
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
  }, []);

  // Sorting logic for 12-page illustrative ranker demo
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

  const toggleMonthExpand = (id) => {
    setExpandedMonths((prev) => ({ ...prev, [id]: !prev[id] }));
    setActiveMonthId(id);
  };

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
    const q = certQuery.trim().toLowerCase();
    return ANTHROPIC_CERTIFICATES.filter((c) => {
      const matchesCat = certWallFilter === "all" || c.category === certWallFilter;
      const matchesQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.learned.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [certWallFilter, certQuery]);

  const copyShareUrl = () => {
    const shareUrl = `${window.location.origin}/experience/flyrank-ai`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
    }
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2400);
  };

  const scrollToAnchor = (id) => {
    setActiveSectionId(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const verifyCredentialUrl = PROFILE_DATA.flyrankVerifyUrl;

  return h(
    "div",
    { className: "journey-view-wrapper" },
    h(
      "div",
      { className: "page-shell", style: { paddingTop: "1.25rem" } },

      // ======================================================================
      // TOP BAR: Breadcrumbs & Actions
      // ======================================================================
      h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginBottom: "1rem"
          }
        },
        h(
          "button",
          {
            type: "button",
            className: "btn-pill-light",
            onClick: onBackHome
          },
          h("span", { "aria-hidden": "true" }, "←"),
          h("span", null, "Back to Portfolio Home")
        ),
        h(
          "div",
          { style: { display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" } },
          h(
            "button",
            {
              type: "button",
              className: "project-action-pill",
              onClick: copyShareUrl
            },
            h("span", null, copiedUrl ? "✓ Copied /experience/flyrank-ai" : "🔗 Share Journey URL")
          ),
          h(
            "a",
            {
              href: verifyCredentialUrl,
              target: "_blank",
              rel: "noopener",
              className: "verified-pill",
              style: { padding: "0.42rem 0.85rem", fontSize: "0.76rem", textDecoration: "none" }
            },
            h("span", null, `✓ Verified Credential: ${PROFILE_DATA.flyrankCredentialId} ↗`)
          )
        )
      ),

      // ======================================================================
      // STICKY MINI-NAV STRIP (01 Overview · 02 Standing · 03 Ranker · 04 Journey · 05 Certificates · 06 Deliverables)
      // ======================================================================
      h(
        "nav",
        {
          className: "journey-sticky-nav-wrap",
          "aria-label": "Explore page section navigator"
        },
        h(
          "div",
          { className: "journey-mini-nav" },
          [
            { id: "journey-hero", num: "01", label: "Overview" },
            { id: "journey-standing", num: "02", label: "Standing" },
            { id: "journey-ranker", num: "03", label: "Ranker" },
            { id: "journey-timeline", num: "04", label: "Journey" },
            { id: "journey-certificates", num: "05", label: "Certificates" },
            { id: "journey-deliverables", num: "06", label: "Deliverables" }
          ].map((item) =>
            h(
              "button",
              {
                key: item.id,
                type: "button",
                className: `journey-nav-pill ${activeSectionId === item.id ? "active" : ""}`,
                onClick: () => scrollToAnchor(item.id)
              },
              h("span", { className: "pill-num" }, item.num),
              h("span", null, item.label)
            )
          )
        )
      ),

      // ======================================================================
      // SECTION 01 — HERO BANNER
      // ======================================================================
      h(
        motion.section,
        {
          id: "journey-hero",
          className: "journey-hero-banner",
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45 }
        },
        h(
          "div",
          { className: "journey-section-eyebrow" },
          h("span", { className: "eyebrow-num" }, "01"),
          h("span", null, "INTERACTIVE TECHNICAL DOCUMENTARY · FLYRANK AI INTERNSHIP (JULY – OCTOBER 2026 · REMOTE)")
        ),
        h(
          "div",
          { className: "journey-h1-row" },
          h("h1", null, "My 4-Month FlyRank AI Internship Journey"),
          h(
            "span",
            { className: "journey-complete-pill" },
            h("span", { "aria-hidden": "true" }, "✓"),
            h("span", null, "39/39 Complete")
          )
        ),
        h(
          "p",
          {
            style: {
              fontSize: "1.02rem",
              color: "#334155",
              maxWidth: "820px",
              lineHeight: 1.6,
              marginBottom: "0.5rem"
            }
          },
          "Two tracks, one production story: the Machine Learning track (ranking 9,961 pages by content-refresh opportunity over 78.8M DuckDB rows) and the AI Fluency track (agentic workflows, MCP connectors, personal brand site, Study Coach agent, and 20/20 Anthropic Academy certificates)."
        ),
        h(
          "p",
          {
            style: {
              fontSize: "0.88rem",
              color: "#64748B",
              fontWeight: 600
            }
          },
          JOURNEY_OVERVIEW.promptLine
        ),

        // Two Track Overview Cards
        h(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "0.85rem",
              marginTop: "1.35rem"
            }
          },
          h(
            "div",
            {
              style: {
                background: "#FFFFFF",
                border: "1px solid var(--border-light)",
                borderRadius: "14px",
                padding: "1rem 1.25rem",
                boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)"
              }
            },
            h(
              "div",
              { style: { fontSize: "0.74rem", fontWeight: 800, color: "var(--accent-red)", textTransform: "uppercase", letterSpacing: "0.06em" } },
              "Track 1 · Machine Learning (Main Track)"
            ),
            h(
              "div",
              { style: { fontSize: "0.86rem", color: "#334155", marginTop: "0.35rem", lineHeight: 1.5 } },
              "Content-Refresh Opportunity Scoring: 78.8M daily-performance rows queried in DuckDB, 9,961 candidate pages, leak-free client-grouped holdout, 0.78 Precision@50 vs 0.30 fixed-rule baseline, 12 executed notebooks + IEEE format research paper."
            )
          ),
          h(
            "div",
            {
              style: {
                background: "#FFFFFF",
                border: "1px solid var(--border-light)",
                borderRadius: "14px",
                padding: "1rem 1.25rem",
                boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)"
              }
            },
            h(
              "div",
              { style: { fontSize: "0.74rem", fontWeight: 800, color: "#B45309", textTransform: "uppercase", letterSpacing: "0.06em" } },
              "Track 2 · General AI Fluency"
            ),
            h(
              "div",
              { style: { fontSize: "0.86rem", color: "#334155", marginTop: "0.35rem", lineHeight: 1.5 } },
              "Applied Agentic Engineering: 5-run automation pipelines (FL-04), Model Context Protocol connectors (FL-05), Study Coach personal agent (FL-07/FL-09), 20/20 Anthropic Academy certificates, and personal-brand portfolio."
            )
          )
        ),

        // Progress Bar (100% Complete)
        h(
          "div",
          { className: "journey-progress-track", role: "progressbar", "aria-valuenow": 100, "aria-valuemin": 0, "aria-valuemax": 100 },
          h("div", { className: "journey-progress-fill", style: { width: "100%" } })
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginTop: "0.55rem",
              fontSize: "0.84rem",
              color: "#334155",
              fontWeight: 600
            }
          },
          h("span", null, "All FlyRank assignments and both capstones complete (July–October 2026)"),
          h(
            "span",
            { style: { fontFamily: "var(--font-mono)", fontWeight: 800, color: "#047857" } },
            "39 / 39 Cards Complete (100%)"
          )
        )
      ),

      // ======================================================================
      // SECTION 02 — "AT A GLANCE" STAT STRIP
      // ======================================================================
      h(
        "section",
        {
          className: "section-block",
          style: { marginTop: "2rem" }
        },
        h(
          "div",
          { className: "journey-section-eyebrow" },
          h("span", { className: "eyebrow-num" }, "02"),
          h("span", null, "AT A GLANCE")
        ),
        h("h2", { className: "section-heading", style: { fontSize: "1.45rem", marginBottom: "0.2rem" } }, "At a Glance"),
        h("p", { className: "journey-section-sub" }, "Key quantifiable milestones delivered across the 4-month program without duplicates."),
        h(
          "div",
          { className: "journey-stats-grid" },
          JOURNEY_STATS.map((stat) =>
            h(
              "div",
              { key: stat.id, className: "journey-stat-card" },
              stat.count !== null
                ? h(
                    "b",
                    { className: "journey-stat-num" },
                    h(CountUpValue, {
                      target: stat.count,
                      decimals: stat.decimals || 0,
                      prefix: stat.prefix || "",
                      suffix: stat.suffix || ""
                    })
                  )
                : h(
                    "b",
                    { className: "journey-stat-num" },
                    stat.display,
                    " ",
                    h(
                      "span",
                      { style: { fontSize: "0.95rem", color: "#64748B", fontWeight: 700 } },
                      stat.subDisplay
                    )
                  ),
              h("span", { className: "journey-stat-caption" }, stat.label)
            )
          )
        )
      ),

      // ======================================================================
      // SECTION 03 — LEADERBOARD STANDING
      // ======================================================================
      h(
        "section",
        {
          className: "section-block",
          id: "journey-standing",
          style: { marginTop: "2rem" }
        },
        h(
          "div",
          { className: "journey-section-eyebrow" },
          h("span", { className: "eyebrow-num" }, "03"),
          h("span", null, "LEADERBOARD STANDING")
        ),
        h("h2", { className: "section-heading", style: { fontSize: "1.45rem", marginBottom: "0.2rem" } }, "Leaderboard Standing"),
        h("p", { className: "journey-section-sub" }, "Official verified standing on the FlyRank intern leaderboard."),
        h(
          "div",
          { className: "journey-standing-card" },
          h(
            "div",
            { className: "standing-header-row" },
            h(
              "div",
              { className: "standing-header-left" },
              h("span", { className: "standing-trophy-icon", "aria-hidden": "true" }, "🏆"),
              h(
                "span",
                { className: "standing-title-text" },
                JOURNEY_LEADERBOARD.standingHeader
              )
            ),
            h(
              "a",
              {
                href: JOURNEY_LEADERBOARD.leaderboardUrl,
                target: "_blank",
                rel: "noopener",
                className: "btn-pill-dark",
                style: { textDecoration: "none", fontSize: "0.78rem", padding: "0.4rem 0.95rem" }
              },
              h("span", null, "View live leaderboard"),
              h("span", { className: "btn-trailing-circle" }, "↗")
            )
          ),

          // 4 Standalone Metric Cells
          h(
            "div",
            { className: "standing-cells-grid" },
            h(
              "div",
              { className: "standing-cell highlight-cell" },
              h("span", { className: "standing-cell-label" }, "Rank"),
              h("span", { className: "standing-cell-value" }, JOURNEY_LEADERBOARD.rank),
              h("span", { className: "standing-cell-sub" }, "Country & track standing")
            ),
            h(
              "div",
              { className: "standing-cell" },
              h("span", { className: "standing-cell-label" }, "Points"),
              h("span", { className: "standing-cell-value" }, JOURNEY_LEADERBOARD.points),
              h("span", { className: "standing-cell-sub" }, JOURNEY_LEADERBOARD.pointsType)
            ),
            h(
              "div",
              { className: "standing-cell" },
              h("span", { className: "standing-cell-label" }, "Movement"),
              h("span", { className: "standing-cell-value" }, JOURNEY_LEADERBOARD.movement),
              h("span", { className: "standing-cell-sub" }, JOURNEY_LEADERBOARD.movementLabel)
            ),
            h(
              "div",
              { className: "standing-cell" },
              h("span", { className: "standing-cell-label" }, "Next Milestone"),
              h("span", { className: "standing-cell-value", style: { fontSize: "1.2rem" } }, JOURNEY_LEADERBOARD.nextMilestone),
              h("span", { className: "standing-cell-sub" }, "To Rank #22 milestone")
            )
          ),

          h(
            "div",
            { className: "standing-footer-row" },
            h(
              "span",
              {
                style: {
                  fontSize: "0.82rem",
                  fontFamily: "var(--font-mono)",
                  color: "#047857",
                  fontWeight: 700
                }
              },
              JOURNEY_LEADERBOARD.verifiedBadge
            ),
            h(
              "a",
              {
                href: verifyCredentialUrl,
                target: "_blank",
                rel: "noopener",
                style: {
                  fontSize: "0.82rem",
                  color: "var(--accent-red)",
                  fontWeight: 700,
                  textDecoration: "none"
                }
              },
              "Verify Credential ID: FR-D11-9E3D0-1FE2A ↗"
            )
          )
        )
      ),

      // ======================================================================
      // SECTION 04 — "PLAY WITH THE RANKER"
      // ======================================================================
      h(
        "section",
        { className: "section-block", id: "journey-ranker", style: { marginTop: "2.5rem" } },
        h(
          "div",
          { className: "journey-section-eyebrow" },
          h("span", { className: "eyebrow-num" }, "04"),
          h("span", null, "PLAY WITH THE RANKER")
        ),
        h(
          "div",
          { className: "section-header-bar" },
          h(
            "div",
            { className: "section-title-group" },
            h("span", { className: "section-red-bar" }),
            h("h2", { className: "section-heading", style: { fontSize: "1.45rem" } }, "Play with the Ranker")
          ),
          h(
            "span",
            { className: "tech-chip ranker-demo-badge", style: { fontWeight: 700 } },
            "Illustrative 12-Page Interactive Demo"
          )
        ),
        h(
          "p",
          { className: "journey-section-sub" },
          "Drag the slider to see how a learned ranker beats a fixed rule."
        ),
        h(
          "div",
          { className: "bezel-outer" },
          h(
            "div",
            { className: "bezel-inner", style: { padding: "1.75rem", background: "#FFFFFF" } },
            h(
              "p",
              { style: { color: "#334155", fontSize: "0.95rem", marginBottom: "1rem", lineHeight: 1.5 } },
              "The capstone question: which pages should be refreshed first? Drag the slider to choose how many pages make the cut, and watch the learned ranker (combining traffic decline + search demand) beat the naive fixed rule (biggest decline only)."
            ),

            // Top-N Slider Controls
            h(
              "div",
              {
                style: {
                  background: "#FAF8F5",
                  border: "1px solid var(--border-light)",
                  borderRadius: "14px",
                  padding: "1rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1.25rem"
                }
              },
              h(
                "label",
                {
                  htmlFor: "topn-slider",
                  style: { fontWeight: 800, fontSize: "0.95rem", minWidth: "155px" }
                },
                "Top-N cut: ",
                h(
                  "span",
                  {
                    style: {
                      fontFamily: "var(--font-mono)",
                      color: "var(--accent-red)",
                      fontSize: "1.1rem"
                    }
                  },
                  topN
                ),
                ` ${topN === 1 ? "page" : "pages"}`
              ),
              h("input", {
                id: "topn-slider",
                type: "range",
                min: 1,
                max: 12,
                value: topN,
                onChange: (e) => setTopN(parseInt(e.target.value, 10)),
                // Bug fix: blur slider on release so PageDown/PageUp scroll page again
                onMouseUp: (e) => e.target.blur(),
                onTouchEnd: (e) => e.target.blur(),
                onKeyUp: (e) => {
                  if (e.key === "Enter") e.target.blur();
                },
                style: { flex: 1, minWidth: "200px", accentColor: "#E11D48", cursor: "pointer" },
                "aria-label": "Select Top-N pages cut"
              }),
              h(
                "span",
                { style: { fontSize: "0.82rem", color: "#64748B", fontWeight: 600 } },
                "12 sample pages · 6 truly need a refresh"
              )
            ),

            // 3D Ranking Pipeline Scene
            h(JourneyPipelineScene, { topN }),

            // Scoreboard Comparison
            h(
              "div",
              { className: "ranker-scoreboard-grid" },
              h(
                "div",
                { className: "ranker-score-box learned" },
                h(
                  "span",
                  { className: "ranker-score-title", style: { fontSize: "0.84rem", fontWeight: 700 } },
                  "Learned ranker (decline + demand)"
                ),
                h(
                  "b",
                  { className: "ranker-big-score" },
                  learnedPrecision.toFixed(2)
                ),
                h(
                  "span",
                  { className: "ranker-score-sub", style: { fontSize: "0.8rem", fontFamily: "var(--font-mono)" } },
                  `precision@${topN}`
                ),
                h(
                  "div",
                  { className: "ranker-bar-track" },
                  h("div", {
                    className: "ranker-bar-fill",
                    style: { width: `${learnedPrecision * 100}%`, background: "#10B981" }
                  })
                )
              ),
              h(
                "div",
                { className: "ranker-score-box fixed" },
                h(
                  "span",
                  { className: "ranker-score-title", style: { fontSize: "0.84rem", fontWeight: 700 } },
                  "Fixed rule (biggest decline only)"
                ),
                h(
                  "b",
                  { className: "ranker-big-score" },
                  fixedPrecision.toFixed(2)
                ),
                h(
                  "span",
                  { className: "ranker-score-sub", style: { fontSize: "0.8rem", fontFamily: "var(--font-mono)" } },
                  `precision@${topN}`
                ),
                h(
                  "div",
                  { className: "ranker-bar-track" },
                  h("div", {
                    className: "ranker-bar-fill",
                    style: { width: `${fixedPrecision * 100}%`, background: "#E11D48" }
                  })
                )
              )
            ),

            // Ranked Chip Lists
            h(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr", gap: "1.1rem", marginTop: "1.25rem" } },
              h(
                "div",
                null,
                h(
                  "h3",
                  { style: { fontSize: "0.92rem", fontWeight: 800, marginBottom: "0.45rem" } },
                  `Learned ranking order (Top ${topN} selected)`
                ),
                h(
                  "div",
                  { className: "ranker-chips-wrap" },
                  learnedOrder.slice(0, topN).map((p) =>
                    h(
                      "span",
                      {
                        key: p.name,
                        className: `page-rank-chip ${p.needs ? "hit" : "miss"}`
                      },
                      h("strong", null, p.name),
                      h(
                        "span",
                        { style: { fontSize: "0.75rem", opacity: 0.88 } },
                        `↓${p.decline}% · demand ${p.demand}${p.needs ? " · truly needs refresh" : ""}`
                      )
                    )
                  )
                )
              ),
              h(
                "div",
                null,
                h(
                  "h3",
                  { style: { fontSize: "0.92rem", fontWeight: 800, marginBottom: "0.45rem" } },
                  `Fixed-rule order (Top ${topN} selected)`
                ),
                h(
                  "div",
                  { className: "ranker-chips-wrap" },
                  fixedOrder.slice(0, topN).map((p) =>
                    h(
                      "span",
                      {
                        key: p.name,
                        className: `page-rank-chip ${p.needs ? "hit" : "miss"}`
                      },
                      h("strong", null, p.name),
                      h(
                        "span",
                        { style: { fontSize: "0.75rem", opacity: 0.88 } },
                        `↓${p.decline}% · demand ${p.demand}${p.needs ? " · truly needs refresh" : ""}`
                      )
                    )
                  )
                )
              )
            ),

            // Disclaimer Kept
            h(
              "div",
              {
                style: {
                  marginTop: "1.5rem",
                  background: "#FAF8F5",
                  borderLeft: "4px solid var(--accent-red)",
                  borderRadius: "0 12px 12px 0",
                  padding: "0.95rem 1.15rem",
                  fontSize: "0.85rem",
                  color: "#475569",
                  lineHeight: 1.5
                }
              },
              h("strong", { style: { color: "#0F172A" } }, "Honest label (Illustrative Demo vs. Actual Evaluation Dataset): "),
              "This interactive widget uses an illustrative 12-page sample so you can feel how ranking trade-offs work. The actual measured ML capstone — evaluated on a ",
              h("strong", null, "client-grouped holdout across 9,961 candidate pages"),
              " drawn from 78.8M daily-performance rows — achieved ",
              h("strong", { style: { color: "#047857" } }, "0.78 Precision@50"),
              " for the learned ranker vs ",
              h("strong", { style: { color: "#BE123C" } }, "0.30"),
              " for the fixed-rule baseline. Green chips indicate pages that truly needed a refresh."
            )
          )
        )
      ),

      // ======================================================================
      // SECTION 05 — "THE JOURNEY, MONTH BY MONTH"
      // ======================================================================
      h(
        "section",
        { className: "section-block", id: "journey-timeline", style: { marginTop: "2.5rem" } },
        h(
          "div",
          { className: "journey-section-eyebrow" },
          h("span", { className: "eyebrow-num" }, "05"),
          h("span", null, "THE JOURNEY, MONTH BY MONTH")
        ),
        h(
          "div",
          { className: "section-header-bar" },
          h(
            "div",
            { className: "section-title-group" },
            h("span", { className: "section-red-bar" }),
            h("h2", { className: "section-heading", style: { fontSize: "1.45rem" } }, "The Journey, Month by Month")
          ),
          h(
            "span",
            { style: { fontSize: "0.84rem", color: "#64748B", fontWeight: 600 } },
            "6 milestones complete · Click any card to expand or collapse details"
          )
        ),
        h(
          "p",
          { className: "journey-section-sub" },
          "Chronological execution across all 6 milestones from July through October 2026."
        ),

        h(
          "div",
          { className: "journey-timeline-layout" },
          // Sticky Month Navigator
          h(
            "aside",
            { className: "month-nav-sticky", "aria-label": "Internship timeline month navigator" },
            h(
              "div",
              {
                style: {
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#64748B",
                  marginBottom: "0.6rem"
                }
              },
              "Timeline Navigator"
            ),
            JOURNEY_TIMELINE.map((m) =>
              h(
                "button",
                {
                  key: m.id,
                  type: "button",
                  onClick: () => {
                    setActiveMonthId(m.id);
                    setExpandedMonths((prev) => ({ ...prev, [m.id]: true }));
                    const el = document.getElementById(`timeline-${m.id}`);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                  },
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    textAlign: "left",
                    padding: "0.55rem 0.75rem",
                    borderRadius: "10px",
                    border: "none",
                    background:
                      activeMonthId === m.id ? "#0F172A" : "transparent",
                    color:
                      activeMonthId === m.id ? "#FFFFFF" : "#334155",
                    fontWeight: activeMonthId === m.id ? 700 : 600,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    marginBottom: "0.25rem",
                    whiteSpace: "nowrap"
                  }
                },
                h("span", null, m.navLabel),
                h("span", {
                  style: {
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#10B981",
                    marginLeft: "0.5rem",
                    flexShrink: 0
                  }
                })
              )
            )
          ),

          // Timeline Cards Column
          h(
            "div",
            null,
            JOURNEY_TIMELINE.map((m) => {
              const isExpanded = !!expandedMonths[m.id];
              return h(
                "article",
                {
                  key: m.id,
                  id: `timeline-${m.id}`,
                  className: "month-step-card"
                },
                h(
                  "div",
                  {
                    onClick: () => toggleMonthExpand(m.id),
                    role: "button",
                    tabIndex: 0,
                    "aria-expanded": isExpanded,
                    onKeyDown: (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleMonthExpand(m.id);
                      }
                    },
                    style: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "0.75rem",
                      cursor: "pointer"
                    }
                  },
                  h(
                    "div",
                    { style: { display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" } },
                    h(
                      "span",
                      {
                        style: {
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          background: "#10B981",
                          display: "inline-block"
                        }
                      }
                    ),
                    h(
                      "h3",
                      { style: { fontSize: "1.12rem", fontWeight: 800, color: "#0F172A" } },
                      m.month,
                      h(
                        "span",
                        { style: { fontWeight: 500, color: "#64748B", fontSize: "0.95rem" } },
                        ` · ${m.theme}`
                      )
                    ),
                    h(
                      "span",
                      { className: "verified-pill" },
                      "✓ complete"
                    )
                  ),
                  h(
                    "span",
                    {
                      style: {
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: "#64748B"
                      }
                    },
                    isExpanded ? "Hide Details ▲" : "Expand Details ▼"
                  )
                ),

                h(
                  "p",
                  { style: { fontSize: "0.88rem", color: "#334155", marginTop: "0.55rem", lineHeight: 1.5 } },
                  m.summary
                ),

                isExpanded &&
                  h(
                    "div",
                    { style: { marginTop: "0.9rem", paddingTop: "0.9rem", borderTop: "1px solid var(--border-subtle)" } },
                    h(
                      "ul",
                      { className: "exp-bullets", style: { margin: "0 0 0.9rem 0" } },
                      m.items.map((item, idx) => h("li", { key: idx }, item))
                    ),

                    // Technology Tags
                    m.tags &&
                      h(
                        "div",
                        { className: "project-tags-row", style: { marginBottom: "0.75rem" } },
                        m.tags.map((tag) => h("span", { key: tag, className: "tech-chip" }, tag))
                      ),

                    // Links (Real links only, no placeholders!)
                    m.links &&
                      h(
                        "div",
                        { style: { display: "flex", flexWrap: "wrap", gap: "0.55rem", marginTop: "0.75rem" } },
                        m.links.map((lnk) =>
                          h(
                            "a",
                            {
                              key: lnk.url,
                              href: lnk.url,
                              target: "_blank",
                              rel: "noopener",
                              className: "project-action-pill"
                            },
                            h("span", null, lnk.label),
                            h(ExternalArrowIcon, { size: 13 })
                          )
                        )
                      )
                  )
              );
            })
          )
        )
      ),

      // ======================================================================
      // SECTION 06 — 20/20 CERTIFICATE WALL
      // ======================================================================
      h(
        "section",
        { className: "section-block", id: "journey-certificates", style: { marginTop: "2.5rem" } },
        h(
          "div",
          { className: "journey-section-eyebrow" },
          h("span", { className: "eyebrow-num" }, "06"),
          h("span", null, "20/20 CERTIFICATE WALL")
        ),
        h(
          "div",
          { id: "anthropic-cert-wall", className: "bezel-outer" },
          h(
            "div",
            { className: "bezel-inner cert-wall-stage-inner", style: { background: "#FFFFFF", padding: "1.75rem" } },
            // Wall Header & Filter Chips
            h(
              "div",
              { className: "cert-wall-header-bar" },
              h(
                "div",
                null,
                h(
                  "div",
                  { className: "credentials-strip-eyebrow" },
                  h("span", { className: "red-dot", style: { width: 6, height: 6 } }),
                  "ANTHROPIC ACADEMY · 20/20 VERIFIED CERTIFICATES WALL"
                ),
                h(
                  "h3",
                  { className: "cert-wall-heading", style: { fontSize: "1.45rem" } },
                  "20/20 Certificate Wall — Real Scans & Key Takeaways"
                ),
                h(
                  "p",
                  { style: { fontSize: "0.85rem", color: "var(--accent-red)", fontWeight: 700, margin: "0.2rem 0" } },
                  "7 credential tracks on the main portfolio · 20 Anthropic Academy course certificates below."
                ),
                h(
                  "p",
                  { className: "cert-wall-subtext" },
                  "Hover or tap any certificate card to flip between the official certificate scan and what I learned in that course."
                )
              ),
              h(
                "div",
                {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "0.55rem",
                    flexWrap: "wrap"
                  }
                },
                // Filter Chips
                h(
                  "div",
                  {
                    className: "filter-pills-row",
                    role: "tablist",
                    "aria-label": "Filter Anthropic Academy certificates"
                  },
                  [
                    { id: "all", label: "All (20)" },
                    { id: "ai-fluency", label: "AI Fluency (10)" },
                    { id: "ml-backend", label: "ML & Backend (10)" }
                  ].map((tab) =>
                    h(
                      "button",
                      {
                        key: tab.id,
                        type: "button",
                        role: "tab",
                        "aria-selected": certWallFilter === tab.id,
                        className: `filter-pill-btn ${certWallFilter === tab.id ? "active" : ""}`,
                        onClick: () => setCertWallFilter(tab.id)
                      },
                      tab.label
                    )
                  )
                ),
                // Search & Flip All Controls
                h(
                  "div",
                  { style: { display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" } },
                  h("input", {
                    type: "search",
                    placeholder: "Search courses (e.g. MCP, Claude Code)...",
                    value: certQuery,
                    onChange: (e) => setCertQuery(e.target.value),
                    "aria-label": "Search Anthropic Academy certificates",
                    style: {
                      padding: "0.4rem 0.85rem",
                      borderRadius: "999px",
                      border: "1px solid var(--border-strong)",
                      fontSize: "0.78rem",
                      fontFamily: "var(--font-sans)",
                      minWidth: "215px",
                      background: "#FFFFFF",
                      color: "#0F172A"
                    }
                  }),
                  h(
                    "button",
                    {
                      type: "button",
                      className: "project-action-pill",
                      onClick: handleToggleFlipAll
                    },
                    flipAll ? "Show Scans (20)" : "Flip All 20 ↻"
                  )
                )
              )
            ),

            // 20-Card Animated Real-Image Flip Grid
            h(
              "div",
              { className: "cert-wall-real-grid" },
              filteredCerts.map((cert) => {
                const isFlipped = !!flippedCerts[cert.index];
                const paddedNum = String(cert.index).padStart(2, "0");
                return h(
                  motion.div,
                  {
                    key: `journey-wall-cert-${certWallFilter}-${cert.index}`,
                    initial: { opacity: 0, scale: 0.94, y: 10 },
                    animate: { opacity: 1, scale: 1, y: 0 },
                    transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
                    className: `flip-card-container real-cert-flip-card ${
                      isFlipped ? "is-flipped" : ""
                    }`,
                    onClick: () => toggleCertFlip(cert.index),
                    role: "button",
                    tabIndex: 0,
                    "aria-pressed": isFlipped,
                    "aria-label": `Certificate ${paddedNum}: ${cert.title}. Click to flip for takeaway notes.`,
                    onKeyDown: (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleCertFlip(cert.index);
                      }
                    }
                  },
                  h(
                    "div",
                    { className: "flip-card-inner" },
                    // FRONT FACE
                    h(
                      "div",
                      { className: "flip-card-face real-cert-front" },
                      h(
                        "div",
                        { className: "real-cert-img-wrap" },
                        h("img", {
                          src: cert.image,
                          alt: `${cert.title} — Anthropic Academy Certificate #${paddedNum}`,
                          loading: "lazy",
                          className: "real-cert-img",
                          onError: (e) => {
                            if (cert.fallbackImage && !e.currentTarget.dataset.fallbackUsed) {
                              e.currentTarget.dataset.fallbackUsed = "true";
                              e.currentTarget.src = cert.fallbackImage;
                            }
                          }
                        }),
                        h(
                          "span",
                          { className: "real-cert-badge-num" },
                          `#${paddedNum}`
                        ),
                        h(
                          "span",
                          { className: "real-cert-badge-cat" },
                          cert.categoryLabel
                        )
                      ),
                      h(
                        "div",
                        { className: "real-cert-front-bar" },
                        h(
                          "div",
                          { className: "real-cert-front-title", title: cert.title },
                          cert.title
                        ),
                        h(
                          "span",
                          { className: "real-cert-flip-hint" },
                          "Flip ↻"
                        )
                      )
                    ),

                    // BACK FACE
                    h(
                      "div",
                      { className: "flip-card-face flip-back real-cert-back" },
                      h(
                        "div",
                        { className: "real-cert-back-top" },
                        h(
                          "span",
                          { className: "real-cert-back-issuer" },
                          `#${paddedNum} · ANTHROPIC ACADEMY`
                        ),
                        h(
                          "span",
                          { className: "real-cert-back-track" },
                          cert.categoryLabel
                        )
                      ),
                      h(
                        "h4",
                        { className: "real-cert-back-title" },
                        cert.title
                      ),
                      h(
                        "p",
                        { className: "real-cert-back-learned" },
                        cert.learned
                      ),
                      onSelectCertModal &&
                        h(
                          "div",
                          { className: "real-cert-back-actions" },
                          h(
                            "button",
                            {
                              type: "button",
                              className: "real-cert-zoom-btn",
                              onClick: (e) => {
                                e.stopPropagation();
                                onSelectCertModal({
                                  issuer: "Anthropic Academy",
                                  title: `${cert.title} (#${paddedNum}/20)`,
                                  certificateImage: cert.image
                                });
                              }
                            },
                            "Enlarge Certificate ⤢"
                          )
                        )
                    )
                  )
                );
              })
            )
          )
        )
      ),

      // ======================================================================
      // SECTION 07 — CAPSTONE DELIVERABLES & TECHNICAL IMPACT
      // ======================================================================
      h(
        "section",
        { className: "section-block", id: "journey-deliverables", style: { marginTop: "2.5rem" } },
        h(
          "div",
          { className: "journey-section-eyebrow" },
          h("span", { className: "eyebrow-num" }, "07"),
          h("span", null, "CAPSTONE DELIVERABLES & TECHNICAL IMPACT")
        ),
        h(
          "div",
          { className: "bezel-outer" },
          h(
            "div",
            { className: "bezel-inner", style: { padding: "2rem", background: "#FFFFFF" } },
            h(
              "div",
              { className: "section-title-group", style: { marginBottom: "0.75rem" } },
              h("span", { className: "section-red-bar" }),
              h("h2", { className: "section-heading", style: { fontSize: "1.45rem" } }, "Capstone Deliverables & Technical Impact")
            ),
            h(
              "p",
              { style: { color: "#334155", fontSize: "0.95rem", maxWidth: "800px", marginBottom: "1.35rem", lineHeight: 1.6 } },
              "Across 4 months (~134 logged hours), this internship bridged large-scale analytical data engineering (78.8M rows in DuckDB), leak-free client-grouped ranking evaluation (0.78 Precision@50 vs 0.30 fixed-rule baseline), and practical AI agent engineering (MCP servers, automation workflows, and the Study Coach agent)."
            ),
            h(
              "div",
              { style: { display: "flex", flexWrap: "wrap", gap: "0.75rem" } },
              h(
                "a",
                {
                  href: "https://github.com/fardinhossain/FlyRankAI-ML-Internship-Task",
                  target: "_blank",
                  rel: "noopener",
                  className: "btn-pill-dark"
                },
                h(GithubIcon, { size: 16 }),
                h("span", null, "ML Internship GitHub Repo"),
                h("span", { className: "btn-trailing-circle" }, "↗")
              ),
              h(
                "a",
                {
                  href: PROFILE_DATA.paperWebUrl,
                  target: "_blank",
                  rel: "noopener",
                  className: "btn-pill-yellow"
                },
                h("span", null, "Deployed Research Paper"),
                h("span", { className: "btn-trailing-circle" }, "↗")
              ),
              // Bug fix: absolute path /paper.pdf
              h(
                "a",
                {
                  href: "/paper.pdf",
                  target: "_blank",
                  rel: "noopener",
                  className: "btn-pill-light"
                },
                h("span", null, "📄 Download Paper PDF")
              ),
              // New verified link
              h(
                "a",
                {
                  href: verifyCredentialUrl,
                  target: "_blank",
                  rel: "noopener",
                  className: "btn-pill-light"
                },
                h("span", null, "✓ Verify FlyRank Credential")
              ),
              h(
                "button",
                {
                  type: "button",
                  className: "btn-pill-light",
                  onClick: onBackHome
                },
                h("span", null, "← Return to Main Portfolio")
              )
            ),

            // "Mission Complete" Finale Band
            h(
              "div",
              { className: "journey-mission-complete-band" },
              h(
                "div",
                { className: "finale-grid" },
                h(
                  "div",
                  null,
                  h(
                    "div",
                    { className: "finale-stamp-badge" },
                    h("span", { "aria-hidden": "true" }, "🤖"),
                    h("span", null, "ALL MODULES DELIVERED · MISSION COMPLETE → STANDBY")
                  ),
                  h("h3", { className: "finale-title" }, "FlyRank AI Internship — Official Completion"),
                  h(
                    "div",
                    { className: "finale-meta-list" },
                    h("span", null, "Completion Date: ", h("strong", null, "October 16, 2026"), " · Duration: ", h("strong", null, "01.07.2026 – 16.10.2026")),
                    h("span", null, "Tracks Completed: ", h("strong", null, "Track 1: Machine Learning"), " · ", h("strong", null, "Track 2: General AI Fluency")),
                    h("span", null, "Capstones Delivered: ", h("strong", null, "Lane 2 Content-Refresh Ranker (0.78 P@50)"), " · ", h("strong", null, "Personal Brand Site + Study Coach Agent")),
                    h("span", null, "Leaderboard Standing: ", h("strong", null, "Rank #23 of 4794"), " · ", h("strong", null, "2,136 Points"), " · Status: ", h("strong", null, "100% Verified"))
                  )
                ),
                h(
                  "div",
                  { style: { display: "flex", flexDirection: "column", gap: "0.6rem" } },
                  h(
                    "a",
                    {
                      href: verifyCredentialUrl,
                      target: "_blank",
                      rel: "noopener",
                      className: "btn-pill-yellow",
                      style: { textDecoration: "none", textAlign: "center", justifyContent: "center" }
                    },
                    h("span", null, "Verify Credential ID: FR-D11-9E3D0-1FE2A"),
                    h("span", { className: "btn-trailing-circle" }, "↗")
                  )
                )
              )
            )
          )
        )
      )
    )
  );
}
