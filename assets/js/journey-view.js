// ==========================================================================
// FARDIN.AI — INTERACTIVE 4-MONTH FLYRANK AI INTERNSHIP JOURNEY
// Dedicated Case-Study Documentary View (/experience/flyrank-ai)
// Source of Truth: journey.html
// ==========================================================================

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  PROFILE_DATA,
  JOURNEY_OVERVIEW,
  JOURNEY_STATS,
  RANKER_SAMPLE_PAGES,
  JOURNEY_TIMELINE,
  ANTHROPIC_CERTIFICATES
} from "./data.js";
import { JourneyPipelineScene } from "./three-scenes.js";
import { ExternalArrowIcon, GithubIcon } from "./visual-previews.js";

const h = React.createElement;

// Animated Count-Up Number Component
function CountUpValue({ target, decimals = 0, prefix = "", suffix = "" }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (target === null || target === undefined) return;
    let rafId = null;
    let start = null;
    const duration = 1200;

    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = target * (1 - Math.pow(1 - p, 3));
      setVal(eased);
      if (p < 1) {
        rafId = requestAnimationFrame(step);
      }
    };
    rafId = requestAnimationFrame(step);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [target]);

  if (target === null || target === undefined) return null;

  const formatted =
    decimals > 0
      ? val.toFixed(decimals)
      : Math.round(val).toLocaleString();

  return h("span", null, `${prefix}${formatted}${suffix}`);
}

export function FlyRankJourneyView({ onBackHome, initialSection, onSelectCertModal }) {
  const [topN, setTopN] = useState(6);
  const [activeMonthId, setActiveMonthId] = useState("july");
  const [expandedMonths, setExpandedMonths] = useState({
    july: true,
    "july-aug": true,
    august: true,
    september: true,
    october: true,
    "in-progress": true
  });
  const [flippedCerts, setFlippedCerts] = useState({});
  const [flipAll, setFlipAll] = useState(false);
  const [certWallFilter, setCertWallFilter] = useState("all");
  const [certQuery, setCertQuery] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    if (initialSection) {
      const el = document.getElementById(initialSection);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 120);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [initialSection]);

  // Exact sorting logic from journey.html
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

  return h(
    "div",
    { className: "journey-view-wrapper" },
    h(
      "div",
      { className: "page-shell", style: { paddingTop: "1.5rem" } },

      // Top Breadcrumb & Action Bar
      h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginBottom: "1.25rem"
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
              href: PROFILE_DATA.flyrankVerifyUrl,
              target: "_blank",
              rel: "noopener",
              className: "verified-pill",
              style: { padding: "0.42rem 0.85rem", fontSize: "0.76rem", textDecoration: "none" }
            },
            h("span", null, "✓ Verified Credential: FR-D1-T668H-R789R ↗")
          )
        )
      ),

      // 1. OPENING HERO SCREEN
      h(
        motion.section,
        {
          className: "journey-hero-banner",
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45 }
        },
        h(
          "div",
          { className: "hero-eyebrow" },
          h("span", { className: "red-dot" }),
          h("span", null, "INTERACTIVE TECHNICAL DOCUMENTARY • FLYRANK AI INTERNSHIP"),
          h("span", { style: { color: "var(--text-muted)" } }, `(${JOURNEY_OVERVIEW.period})`)
        ),
        h(
          "h1",
          {
            style: {
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.85rem, 3.6vw, 2.85rem)",
              fontWeight: 900,
              letterSpacing: "-0.035em",
              lineHeight: 1.1,
              marginBottom: "0.75rem"
            }
          },
          JOURNEY_OVERVIEW.title
        ),
        h(
          "p",
          {
            style: {
              fontSize: "1.02rem",
              color: "var(--text-secondary)",
              maxWidth: "820px",
              marginBottom: "0.4rem"
            }
          },
          JOURNEY_OVERVIEW.subtitle
        ),
        h(
          "p",
          {
            style: {
              fontSize: "0.9rem",
              color: "var(--text-muted)",
              fontWeight: 600
            }
          },
          JOURNEY_OVERVIEW.promptLine
        ),

        // Track Overview Pills
        h(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
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
                padding: "0.95rem 1.15rem"
              }
            },
            h(
              "div",
              { style: { fontSize: "0.72rem", fontWeight: 800, color: "var(--accent-red)", textTransform: "uppercase", letterSpacing: "0.06em" } },
              "Track 1 · Machine Learning (Main Track)"
            ),
            h(
              "div",
              { style: { fontSize: "0.86rem", color: "var(--text-secondary)", marginTop: "0.25rem" } },
              "Lane 2 Content-Refresh Opportunity Scoring: 78.8M daily-performance rows in DuckDB, 9,961 candidate pages, client-grouped holdout, 0.78 Precision@50 vs 0.30 baseline."
            )
          ),
          h(
            "div",
            {
              style: {
                background: "#FFFFFF",
                border: "1px solid var(--border-light)",
                borderRadius: "14px",
                padding: "0.95rem 1.15rem"
              }
            },
            h(
              "div",
              { style: { fontSize: "0.72rem", fontWeight: 800, color: "#B45309", textTransform: "uppercase", letterSpacing: "0.06em" } },
              "Track 2 · General AI Fluency"
            ),
            h(
              "div",
              { style: { fontSize: "0.86rem", color: "var(--text-secondary)", marginTop: "0.25rem" } },
              "5-run automation workflows (FL-04), Model Context Protocol connectors (FL-05), Study Coach personal agent (FL-07/FL-09), 20/20 Anthropic Academy certificates, and shipped portfolio."
            )
          )
        ),

        // Honest Progress Bar (37 of 39 portal cards submitted = 94.9%)
        h(
          "div",
          { className: "journey-progress-track", role: "progressbar", "aria-valuenow": 94.9, "aria-valuemin": 0, "aria-valuemax": 100 },
          h("div", { className: "journey-progress-fill" })
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
              color: "var(--text-secondary)",
              fontWeight: 600
            }
          },
          h("span", null, JOURNEY_OVERVIEW.progressLabel),
          h(
            "span",
            { style: { fontFamily: "var(--font-mono)", fontWeight: 800, color: "var(--text-primary)" } },
            "37 / 39 Cards (94.9%)"
          )
        ),

        // 2. ANIMATED IMPACT METRICS GRID
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
                      { style: { fontSize: "0.95rem", color: "var(--text-muted)", fontWeight: 700 } },
                      stat.subDisplay
                    )
                  ),
              h("span", { className: "journey-stat-caption" }, stat.label)
            )
          )
        )
      ),

      // 3. INTERACTIVE TOP-N RANKING DEMO ("PLAY WITH THE RANKER")
      h(
        "section",
        { className: "section-block", id: "journey-ranker" },
        h(
          "div",
          { className: "section-header-bar" },
          h(
            "div",
            { className: "section-title-group" },
            h("span", { className: "section-red-bar" }),
            h("h2", { className: "section-heading" }, "Play with the Ranker", h("span", { className: "red-dot" }))
          ),
          h(
            "span",
            { className: "tech-chip", style: { fontWeight: 700, background: "#FEF3C7", borderColor: "#FDE68A", color: "#92400E" } },
            "Illustrative 12-Page Interactive Demo"
          )
        ),
        h(
          "div",
          { className: "bezel-outer" },
          h(
            "div",
            { className: "bezel-inner", style: { padding: "1.75rem" } },
            h(
              "p",
              { style: { color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "1rem" } },
              "The capstone question: which pages should be refreshed first? Drag the slider to choose how many pages make the cut, and watch the learned ranker (combining traffic decline + search demand) beat the naive fixed rule (biggest decline only)."
            ),

            // Top-N Slider Controls
            h(
              "div",
              {
                style: {
                  background: "var(--bg-page)",
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
                style: { flex: 1, minWidth: "200px", accentColor: "#E11D48", cursor: "pointer" },
                "aria-label": "Select Top-N pages cut"
              }),
              h(
                "span",
                { style: { fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 } },
                "12 sample pages · 6 truly need a refresh"
              )
            ),

            // Restrained 3D Node Visualization synchronized with Top-N slider
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
                  { style: { fontSize: "0.84rem", fontWeight: 700, color: "#065F46" } },
                  "Learned ranker (decline + demand)"
                ),
                h(
                  "b",
                  { className: "ranker-big-score", style: { color: "#065F46" } },
                  learnedPrecision.toFixed(2)
                ),
                h(
                  "span",
                  { style: { fontSize: "0.8rem", fontFamily: "var(--font-mono)", color: "#047857" } },
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
                  { style: { fontSize: "0.84rem", fontWeight: 700, color: "#9F1239" } },
                  "Fixed rule (biggest decline only)"
                ),
                h(
                  "b",
                  { className: "ranker-big-score", style: { color: "#BE123C" } },
                  fixedPrecision.toFixed(2)
                ),
                h(
                  "span",
                  { style: { fontSize: "0.8rem", fontFamily: "var(--font-mono)", color: "#9F1239" } },
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

            // Honest Separation Callout (Strictly separates 12-page illustrative demo from 9,961-page capstone evaluation)
            h(
              "div",
              {
                style: {
                  marginTop: "1.5rem",
                  background: "var(--bg-subtle)",
                  borderLeft: "4px solid var(--accent-red)",
                  borderRadius: "0 12px 12px 0",
                  padding: "0.95rem 1.15rem",
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)"
                }
              },
              h("strong", { style: { color: "var(--text-primary)" } }, "Honest label (Illustrative Demo vs. Actual Evaluation Dataset): "),
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

      // 4. MONTH-BY-MONTH INTERACTIVE TIMELINE
      h(
        "section",
        { className: "section-block", id: "journey-timeline" },
        h(
          "div",
          { className: "section-header-bar" },
          h(
            "div",
            { className: "section-title-group" },
            h("span", { className: "section-red-bar" }),
            h("h2", { className: "section-heading" }, "The Journey, Month by Month", h("span", { className: "red-dot" }))
          ),
          h(
            "span",
            { style: { fontSize: "0.84rem", color: "var(--text-muted)", fontWeight: 600 } },
            "Click any milestone to expand or collapse details"
          )
        ),

        h(
          "div",
          { className: "journey-timeline-layout" },
          // Persistent Month Navigator
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
                  color: "var(--text-muted)",
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
                      activeMonthId === m.id ? "var(--text-primary)" : "transparent",
                    color:
                      activeMonthId === m.id ? "#FFFFFF" : "var(--text-secondary)",
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
                    background: m.status === "done" ? "#10B981" : "#F59E0B",
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
              const isDone = m.status === "done";
              return h(
                "article",
                {
                  key: m.id,
                  id: `timeline-${m.id}`,
                  className: `month-step-card ${!isDone ? "honest-open" : ""}`
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
                          background: isDone ? "#10B981" : "#F59E0B",
                          display: "inline-block"
                        }
                      }
                    ),
                    h(
                      "h3",
                      { style: { fontSize: "1.12rem", fontWeight: 800, color: "var(--text-primary)" } },
                      m.month,
                      h(
                        "span",
                        { style: { fontWeight: 500, color: "var(--text-muted)", fontSize: "0.95rem" } },
                        ` · ${m.theme}`
                      )
                    ),
                    h(
                      "span",
                      { className: isDone ? "verified-pill" : "inprogress-pill" },
                      isDone ? "✓ done" : "⏳ in progress"
                    )
                  ),
                  h(
                    "span",
                    {
                      style: {
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: "var(--text-muted)"
                      }
                    },
                    isExpanded ? "Hide Details ▲" : "Expand Details ▼"
                  )
                ),

                h(
                  "p",
                  { style: { fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "0.55rem" } },
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

                    // Links (if present, e.g., October Capstones)
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
                      ),

                    // Honest explanation box for In Progress items
                    m.honestNoteBody &&
                      h(
                        "div",
                        {
                          style: {
                            marginTop: "0.85rem",
                            background: "#FFFFFF",
                            border: "1px solid #FDE68A",
                            borderRadius: "12px",
                            padding: "0.9rem 1.1rem"
                          }
                        },
                        h(
                          "div",
                          { style: { fontWeight: 800, fontSize: "0.84rem", color: "#92400E", marginBottom: "0.3rem" } },
                          m.honestNoteTitle
                        ),
                        h(
                          "p",
                          { style: { fontSize: "0.84rem", color: "var(--text-secondary)" } },
                          m.honestNoteBody
                        )
                      )
                  )
              );
            })
          )
        )
      ),

      // 5. CERTIFICATE WALL — 20/20 ANTHROPIC ACADEMY (REAL SCANS & KEY TAKEAWAYS)
      h(
        "section",
        { className: "section-block", id: "journey-certificates" },
        h(
          "div",
          { id: "anthropic-cert-wall", className: "bezel-outer" },
          h(
            "div",
            { className: "bezel-inner cert-wall-stage-inner" },
            // Wall Header & Filter Chips (All / AI Fluency / ML & Backend + Search & Flip All)
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
                  { className: "cert-wall-heading" },
                  "20/20 Certificate Wall — Real Scans & Key Takeaways"
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
                // Filter Chips: All / AI Fluency / ML & Backend
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
                      background: "#FFFFFF"
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
                    // FRONT FACE: Real Certificate Image (lazy-loaded) + Course Title Footer
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

                    // BACK FACE: Course Name, Issuer, and One-Line "What I Learned" Note
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

      // 6. CAPSTONE DELIVERABLES & TECHNICAL SUMMARY
      h(
        "section",
        { className: "section-block", id: "journey-deliverables" },
        h(
          "div",
          { className: "bezel-outer" },
          h(
            "div",
            { className: "bezel-inner", style: { padding: "2rem" } },
            h(
              "div",
              { className: "section-title-group", style: { marginBottom: "0.75rem" } },
              h("span", { className: "section-red-bar" }),
              h("h2", { className: "section-heading" }, "Capstone Deliverables & Technical Impact")
            ),
            h(
              "p",
              { style: { color: "var(--text-secondary)", fontSize: "0.94rem", maxWidth: "780px", marginBottom: "1.35rem" } },
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
              h(
                "a",
                {
                  href: PROFILE_DATA.paperPdfUrl,
                  target: "_blank",
                  rel: "noopener",
                  className: "btn-pill-light"
                },
                h("span", null, "📄 Download Paper PDF")
              ),
              h(
                "a",
                {
                  href: PROFILE_DATA.flyrankVerifyUrl,
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
            )
          )
        )
      )
    )
  );
}
