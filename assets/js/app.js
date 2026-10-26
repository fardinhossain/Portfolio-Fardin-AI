// ==========================================================================
// FARDIN.AI — MAIN REACT 18 + FRAMER MOTION + THREE.JS APPLICATION
// Supports both Homepage ("/") and Interactive Journey ("/experience/flyrank-ai")
// ==========================================================================

import React, { useState, useEffect, useMemo } from "react";
import ReactDOM from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  PROFILE_DATA,
  HERO_METRICS,
  PROJECT_CATEGORIES,
  PROJECTS_LIST,
  VERIFIED_CERTIFICATIONS,
  SKILL_GROUPS
} from "./data.js";
import { HeroNeuralScene, ContactGlobeScene } from "./three-scenes.js";
import {
  MetricIcon,
  GithubIcon,
  LinkedInIcon,
  MailIcon,
  ExternalArrowIcon,
  ProjectVisualHeader
} from "./visual-previews.js";
import { FlyRankJourneyView } from "./journey-view.js";
import { FeaturedProjects } from "./project-showcase-3d.js";
import { ExperienceTimelineSection } from "./experience-timeline-3d.js";

const h = React.createElement;

// Helper to detect if current URL points to the FlyRank AI Journey page
function isJourneyRouteFromLocation() {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();
  return (
    path.includes("/experience/flyrank-ai") ||
    path.endsWith("/journey.html") ||
    path.endsWith("/journey") ||
    hash.includes("experience/flyrank-ai") ||
    hash.includes("journey") ||
    search.includes("journey=flyrank-ai")
  );
}

// --------------------------------------------------------------------------
// 3D TILT PROJECT CARD COMPONENT
// --------------------------------------------------------------------------
function ProjectCard({ project, onOpenModal, onOpenJourney }) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handlePointerMove = (e) => {
    if (window.innerWidth < 768) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
    const ny = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
    setTilt({ rx: -ny * 5, ry: nx * 5 });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  return h(
    motion.article,
    {
      layout: true,
      initial: { opacity: 0, y: 18 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, scale: 0.96 },
      transition: { duration: 0.32 },
      className: "bezel-outer project-card-3d",
      onPointerMove: handlePointerMove,
      onPointerLeave: handlePointerLeave,
      onClick: () => onOpenModal(project),
      style: {
        transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`
      }
    },
    h(
      "div",
      { className: "bezel-inner", style: { display: "flex", flexDirection: "column" } },
      // Top Preview Window
      h(
        "div",
        { className: "project-preview-window" },
        h("span", { className: "project-floating-cat" }, project.shortCategory),
        (project.liveUrl || project.githubUrl) &&
          h(
            "a",
            {
              href: project.liveUrl || project.githubUrl,
              target: "_blank",
              rel: "noopener",
              className: "project-floating-ext",
              title: project.liveUrl ? `Open ${project.title} Live Demo` : `Open ${project.title} GitHub`,
              onClick: (e) => e.stopPropagation()
            },
            h(ExternalArrowIcon, { size: 14 })
          ),
        h(ProjectVisualHeader, { project })
      ),

      // Card Body
      h(
        "div",
        { className: "project-body" },
        h(
          "div",
          null,
          h("h3", { className: "project-title" }, project.title),
          h("p", { className: "project-desc" }, project.summary),
          h(
            "div",
            { className: "project-tags-row" },
            project.tags.slice(0, 4).map((tag) =>
              h("span", { key: tag, className: "tech-chip" }, tag)
            )
          )
        ),

        // Card Footer Actions (Every visible button has a working action)
        h(
          "div",
          { className: "project-actions-footer" },
          h(
            "div",
            { style: { display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" } },
            project.journeyTrigger
              ? h(
                  "button",
                  {
                    type: "button",
                    className: "project-action-pill highlight-yellow",
                    onClick: (e) => {
                      e.stopPropagation();
                      onOpenJourney();
                    }
                  },
                  h("span", null, "Interactive Journey →")
                )
              : project.liveUrl
              ? h(
                  "a",
                  {
                    href: project.liveUrl,
                    target: "_blank",
                    rel: "noopener",
                    className: "project-action-pill",
                    onClick: (e) => e.stopPropagation()
                  },
                  h("span", { className: "red-dot", style: { width: 6, height: 6 } }),
                  h("span", null, "Live Demo →")
                )
              : h(
                  "button",
                  {
                    type: "button",
                    className: "project-action-pill",
                    onClick: (e) => {
                      e.stopPropagation();
                      onOpenModal(project);
                    }
                  },
                  h("span", null, "View Details →")
                ),

            project.liveUrl &&
              h(
                "button",
                {
                  type: "button",
                  className: "project-action-pill",
                  style: { padding: "0.42rem 0.7rem", fontWeight: 600 },
                  onClick: (e) => {
                    e.stopPropagation();
                    onOpenModal(project);
                  }
                },
                "Specs"
              )
          ),

          project.githubUrl &&
            h(
              "a",
              {
                href: project.githubUrl,
                target: "_blank",
                rel: "noopener",
                className: "icon-circle-btn",
                title: `View ${project.title} Source Code on GitHub`,
                "aria-label": `View ${project.title} Source Code on GitHub`,
                onClick: (e) => e.stopPropagation()
              },
              h(GithubIcon, { size: 16 })
            )
        )
      )
    )
  );
}

// --------------------------------------------------------------------------
// MAIN PORTFOLIO APPLICATION
// --------------------------------------------------------------------------
function PortfolioApp() {
  const [view, setView] = useState(() =>
    isJourneyRouteFromLocation() ? "journey" : "home"
  );
  const [journeyTargetSection, setJourneyTargetSection] = useState(null);
  const [activeNav, setActiveNav] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Projects Filter State
  const [projectFilter, setProjectFilter] = useState("all");
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Certificate Image Modal State
  const [selectedCertModal, setSelectedCertModal] = useState(null);

  // Contact Modal / Copy State
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Sync browser back/forward button
  useEffect(() => {
    const onPopState = () => {
      setView(isJourneyRouteFromLocation() ? "journey" : "home");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Open Dedicated FlyRank AI 4-Month Journey View (/experience/flyrank-ai)
  const openJourneyExperience = (sectionId = null) => {
    setMobileMenuOpen(false);
    setSelectedProject(null);
    setJourneyTargetSection(sectionId);
    setView("journey");
    try {
      window.history.pushState({ view: "journey" }, "", "/experience/flyrank-ai");
    } catch (e) {
      window.location.hash = "#/experience/flyrank-ai";
    }
  };

  // Return to Portfolio Homepage
  const closeJourneyExperience = (targetAnchor = null) => {
    setView("home");
    try {
      window.history.pushState({ view: "home" }, "", "/");
    } catch (e) {
      window.location.hash = "";
    }
    if (targetAnchor) {
      setTimeout(() => {
        const el = document.getElementById(targetAnchor);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 80);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const navigateToSection = (sectionId) => {
    setMobileMenuOpen(false);
    setActiveNav(sectionId);
    if (view !== "home") {
      closeJourneyExperience(sectionId);
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const filteredProjects = useMemo(() => {
    const byCat =
      projectFilter === "all"
        ? PROJECTS_LIST
        : PROJECTS_LIST.filter((p) => p.categories.includes(projectFilter));
    if (showAllProjects || projectFilter !== "all") return byCat;
    return byCat.filter((p) => p.featured);
  }, [projectFilter, showAllProjects]);

  const handleCopyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(PROFILE_DATA.email).catch(() => {});
    }
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  return h(
    React.Fragment,
    null,
    h("a", { href: "#main-content", className: "skip-link" }, "Skip to content"),

    // ========================================================================
    // A. STICKY NAVBAR
    // ========================================================================
    h(
      "header",
      { className: "navbar-wrapper" },
      h(
        "nav",
        { className: "navbar-glass", "aria-label": "Primary Navigation" },
        // Brand Logo: fardin.ai •
        h(
          "a",
          {
            href: "#home",
            className: "brand-logo",
            onClick: (e) => {
              e.preventDefault();
              navigateToSection("home");
            }
          },
          h("span", { className: "brand-icon-circle", "aria-hidden": "true" }, "✦"),
          h("span", null, "fardin.ai"),
          h("span", { className: "red-dot", "aria-hidden": "true" })
        ),

        // Desktop Navigation Links
        h(
          "ul",
          { className: "nav-links-desktop" },
          [
            { id: "home", label: "Home" },
            { id: "about", label: "About" },
            { id: "experience", label: "Experience" },
            { id: "projects", label: "Projects" },
            { id: "certifications", label: "Certifications" },
            { id: "contact", label: "Contact" }
          ].map((item) =>
            h(
              "li",
              { key: item.id },
              h(
                "button",
                {
                  type: "button",
                  className: `nav-item-btn ${
                    view === "home" && activeNav === item.id ? "active" : ""
                  }`,
                  onClick: () => navigateToSection(item.id)
                },
                item.label
              )
            )
          ),
          h(
            "li",
            null,
            h(
              "button",
              {
                type: "button",
                className: "nav-journey-pill",
                onClick: () => openJourneyExperience()
              },
              h("span", { className: "red-dot", style: { width: 6, height: 6 } }),
              h("span", null, "4-Month Journey")
            )
          )
        ),

        // Right Actions: Let's Talk + Mobile Menu Button
        h(
          "div",
          { className: "nav-actions-right" },
          h(
            "button",
            {
              type: "button",
              className: "btn-pill-dark",
              onClick: () => navigateToSection("contact")
            },
            h("span", null, "Let's Talk"),
            h("span", { className: "btn-trailing-circle", "aria-hidden": "true" }, "→")
          ),
          h(
            "button",
            {
              type: "button",
              className: "mobile-menu-trigger",
              "aria-label": mobileMenuOpen ? "Close Menu" : "Open Menu",
              "aria-expanded": mobileMenuOpen,
              onClick: () => setMobileMenuOpen((v) => !v)
            },
            mobileMenuOpen ? "✕" : "☰"
          )
        )
      ),

      // Mobile Slide-Down Drawer
      AnimatePresence &&
        h(
          AnimatePresence,
          null,
          mobileMenuOpen &&
            h(
              motion.div,
              {
                initial: { opacity: 0, y: -10 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -10 },
                transition: { duration: 0.2 },
                style: {
                  marginTop: "8px",
                  background: "#FFFFFF",
                  border: "1px solid var(--border-light)",
                  borderRadius: "20px",
                  padding: "1rem",
                  boxShadow: "var(--shadow-elevated)"
                }
              },
              h(
                "div",
                { style: { display: "flex", flexDirection: "column", gap: "0.4rem" } },
                [
                  { id: "home", label: "Home" },
                  { id: "about", label: "About Me" },
                  { id: "projects", label: "Featured Projects" },
                  { id: "experience", label: "FlyRank AI Experience" },
                  { id: "certifications", label: "Certifications" },
                  { id: "contact", label: "Contact" }
                ].map((item) =>
                  h(
                    "button",
                    {
                      key: item.id,
                      type: "button",
                      onClick: () => navigateToSection(item.id),
                      style: {
                        textAlign: "left",
                        padding: "0.65rem 0.9rem",
                        borderRadius: "12px",
                        border: "none",
                        background:
                          activeNav === item.id ? "var(--bg-subtle)" : "transparent",
                        fontWeight: 700,
                        fontSize: "0.92rem",
                        color: "var(--text-primary)",
                        cursor: "pointer"
                      }
                    },
                    item.label
                  )
                ),
                h(
                  "button",
                  {
                    type: "button",
                    className: "btn-pill-yellow",
                    style: { justifyContent: "space-between", marginTop: "0.4rem" },
                    onClick: () => openJourneyExperience()
                  },
                  h("span", null, "Explore 4-Month FlyRank AI Journey"),
                  h("span", { className: "btn-trailing-circle" }, "→")
                )
              )
            )
        )
    ),

    // ========================================================================
    // MAIN CONTENT VIEW SWITCHER (HOMEPAGE VS. INTERACTIVE 4-MONTH JOURNEY)
    // ========================================================================
    h(
      "main",
      { id: "main-content" },
      view === "journey"
        ? h(FlyRankJourneyView, {
            onBackHome: () => closeJourneyExperience(),
            initialSection: journeyTargetSection
          })
        : h(
            "div",
            { className: "page-shell" },

            // ================================================================
            // B. HERO SECTION
            // ================================================================
            h(
              "section",
              { id: "home", className: "bezel-outer hero-card-outer" },
              h(
                "div",
                { className: "bezel-inner hero-stage-inner" },
                // Three.js Interactive 3D Neural Network & Orbital Rings
                h(HeroNeuralScene),

                h(
                  "div",
                  { className: "hero-grid" },
                  // Left Column: Headline, Supporting Copy & Primary Actions
                  h(
                    motion.div,
                    {
                      initial: { opacity: 0, y: 18 },
                      animate: { opacity: 1, y: 0 },
                      transition: { duration: 0.5 }
                    },
                    h(
                      "div",
                      { className: "hero-eyebrow" },
                      h("span", null, PROFILE_DATA.roleLine),
                      h("span", { className: "red-dot" })
                    ),
                    h(
                      "h1",
                      { className: "hero-headline" },
                      PROFILE_DATA.heroHeadlinePrefix,
                      h("span", { className: "text-red" }, PROFILE_DATA.heroHeadlineHighlight)
                    ),
                    h("p", { className: "hero-subtext" }, PROFILE_DATA.heroSupportingText),

                    // Primary & Secondary CTA Buttons
                    h(
                      "div",
                      { className: "hero-cta-row" },
                      h(
                        "button",
                        {
                          type: "button",
                          className: "btn-pill-dark",
                          onClick: () => navigateToSection("projects")
                        },
                        h("span", null, "Explore My Work"),
                        h("span", { className: "btn-trailing-circle", "aria-hidden": "true" }, "→")
                      ),
                      h(
                        "a",
                        {
                          href: PROFILE_DATA.resumeUrl,
                          download: "Fardin_Hossain_Resume.pdf",
                          target: "_blank",
                          rel: "noopener",
                          className: "btn-pill-light"
                        },
                        h("span", { "aria-hidden": "true" }, "↓"),
                        h("span", null, "Download Resume")
                      )
                    ),

                    // Direct Shortcut to the 4-Month Interactive Journey
                    h(
                      "button",
                      {
                        type: "button",
                        className: "hero-journey-shortcut",
                        onClick: () => openJourneyExperience()
                      },
                      h("span", { className: "yellow-dot" }),
                      h(
                        "span",
                        null,
                        "New: Explore My Interactive 4-Month FlyRank AI Journey (0.78 P@50) →"
                      )
                    )
                  ),

                  // Right Column: Uploaded Professional Editorial Portrait + Layered 3D Details
                  h(
                    motion.div,
                    {
                      className: "hero-visual-stage",
                      initial: { opacity: 0, scale: 0.96 },
                      animate: { opacity: 1, scale: 1 },
                      transition: { duration: 0.55, delay: 0.08 }
                    },
                    h(
                      "div",
                      { className: "hero-annotation-badge" },
                      h("span", { className: "red-dot" }),
                      h("span", null, "Md. Fardin Hossain")
                    ),
                    h(
                      "div",
                      { className: "hero-portrait-card" },
                      h("img", {
                        src: PROFILE_DATA.heroPortrait,
                        alt: "Md. Fardin Hossain — AI Engineer & Full-Stack Developer",
                        className: "hero-portrait-img"
                      })
                    ),
                    h(
                      "div",
                      { className: "hero-pillars-float", "aria-label": "Engineering workflow pillars" },
                      h("span", null, "IDEAS"),
                      h("span", null, "CODE"),
                      h("span", null, "MODELS"),
                      h("span", null, "PRODUCTS"),
                      h("span", null, "IMPACT")
                    )
                  )
                )
              )
            ),

            // ================================================================
            // C. FEATURED PROJECTS SECTION (3D FLYING ROBOT SHOWCASE)
            // ================================================================
            h(FeaturedProjects, {
              projectsList: PROJECTS_LIST,
              categories: PROJECT_CATEGORIES,
              onOpenModal: setSelectedProject,
              onOpenJourney: () => openJourneyExperience()
            }),

            // ================================================================
            // D. EXPERIENCE SECTION (ROBOT-GUIDED FLYRANK AI TIMELINE ONLY)
            // ================================================================
            h(ExperienceTimelineSection, {
              onExploreInternship: () => openJourneyExperience()
            }),

            // ================================================================
            // F, G. LOWER BENTO: CERTIFICATIONS & CONTACT
            // ================================================================
            h(
              "div",
              { className: "section-block lower-bento-grid" },

              // 2. CERTIFICATIONS COLUMN
              h(
                "section",
                { id: "certifications" },
                h(
                  "div",
                  { className: "section-header-bar" },
                  h(
                    "div",
                    { className: "section-title-group" },
                    h("span", { className: "section-red-bar" }),
                    h(
                      "h2",
                      { className: "section-heading" },
                      "Certifications",
                      h("span", { className: "red-dot" })
                    )
                  ),
                  h(
                    "button",
                    {
                      type: "button",
                      className: "project-action-pill",
                      onClick: () => openJourneyExperience("journey-certificates")
                    },
                    "20/20 Wall →"
                  )
                ),

                h(
                  "div",
                  { className: "bezel-outer" },
                  h(
                    "div",
                    { className: "bezel-inner cert-stack-list" },
                    VERIFIED_CERTIFICATIONS.map((cert) =>
                      h(
                        "div",
                        { key: cert.id, className: "cert-row-card" },
                        h(
                          "div",
                          { style: { display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 } },
                          h("div", { className: "cert-issuer-logo" }, cert.logoText),
                          h(
                            "div",
                            { style: { minWidth: 0 } },
                            h(
                              "div",
                              { style: { fontWeight: 800, fontSize: "0.88rem", color: "var(--text-primary)" } },
                              cert.issuer
                            ),
                            h(
                              "div",
                              {
                                style: {
                                  fontSize: "0.76rem",
                                  color: "var(--text-muted)",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis"
                                }
                              },
                              cert.title
                            )
                          )
                        ),
                        h(
                          "div",
                          { style: { display: "flex", alignItems: "center", gap: "0.45rem", flexShrink: 0 } },
                          h(
                            "span",
                            {
                              className:
                                cert.statusType === "verified"
                                  ? "verified-pill"
                                  : "inprogress-pill"
                            },
                            cert.statusType === "verified" ? `✓ ${cert.status}` : `⏳ ${cert.status}`
                          ),
                          cert.verifyUrl &&
                            h(
                              "a",
                              {
                                href: cert.verifyUrl,
                                target: "_blank",
                                rel: "noopener",
                                className: "icon-circle-btn",
                                style: { width: 28, height: 28 },
                                title: `Verify ${cert.issuer} Credential`
                              },
                              h(ExternalArrowIcon, { size: 12 })
                            ),
                          cert.certificateImage &&
                            h(
                              "button",
                              {
                                type: "button",
                                className: "icon-circle-btn",
                                style: { width: 28, height: 28 },
                                title: `View ${cert.title} Certificate Scan`,
                                onClick: () => setSelectedCertModal(cert)
                              },
                              "👁"
                            ),
                          (cert.openCertWall || cert.openJourney) &&
                            h(
                              "button",
                              {
                                type: "button",
                                className: "icon-circle-btn",
                                style: { width: 28, height: 28 },
                                title: "Open in Interactive Journey",
                                onClick: () =>
                                  openJourneyExperience(
                                    cert.openCertWall ? "journey-certificates" : "journey-timeline"
                                  )
                              },
                              "→"
                            )
                        )
                      )
                    )
                  )
                )
              ),

              // 3. CONTACT & 3D GLOBE COLUMN
              h(
                "section",
                { id: "contact" },
                h(
                  "div",
                  { className: "section-header-bar" },
                  h(
                    "div",
                    { className: "section-title-group" },
                    h("span", { className: "section-red-bar" }),
                    h(
                      "h2",
                      { className: "section-heading" },
                      "Let's Connect",
                      h("span", { className: "red-dot" })
                    )
                  )
                ),

                h(
                  "div",
                  { className: "bezel-outer" },
                  h(
                    "div",
                    { className: "bezel-inner contact-card-body" },
                    h(
                      "p",
                      { style: { fontSize: "0.88rem", color: "var(--text-secondary)", maxWidth: "280px" } },
                      "Open to AI Engineering, Machine Learning, and Full-Stack roles, research collaborations, and technical interviews."
                    ),

                    // Interactive Three.js 3D Globe with Dhaka, Bangladesh Pin
                    h(
                      "div",
                      { className: "contact-globe-wrap" },
                      h(
                        "div",
                        { className: "dhaka-pin-badge" },
                        h("span", { className: "red-dot" }),
                        h("span", null, "Dhaka, Bangladesh")
                      ),
                      h(ContactGlobeScene)
                    ),

                    // Social Icons Row
                    h(
                      "div",
                      { style: { display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "0.9rem" } },
                      h(
                        "a",
                        {
                          href: PROFILE_DATA.github,
                          target: "_blank",
                          rel: "noopener",
                          className: "icon-circle-btn",
                          title: "GitHub @fardinhossain",
                          "aria-label": "GitHub Profile"
                        },
                        h(GithubIcon, { size: 17 })
                      ),
                      h(
                        "a",
                        {
                          href: PROFILE_DATA.linkedin,
                          target: "_blank",
                          rel: "noopener",
                          className: "icon-circle-btn",
                          title: "LinkedIn @fardinhosn",
                          "aria-label": "LinkedIn Profile"
                        },
                        h(LinkedInIcon, { size: 17 })
                      ),
                      h(
                        "a",
                        {
                          href: `mailto:${PROFILE_DATA.email}`,
                          className: "icon-circle-btn",
                          title: `Email ${PROFILE_DATA.email}`,
                          "aria-label": "Send Email"
                        },
                        h(MailIcon, { size: 17 })
                      ),
                      h(
                        "button",
                        {
                          type: "button",
                          className: "project-action-pill",
                          style: { fontSize: "0.72rem", padding: "0.35rem 0.7rem" },
                          onClick: handleCopyEmail
                        },
                        copiedEmail ? "✓ Email Copied" : "Copy Email"
                      )
                    ),

                    h(
                      "a",
                      {
                        href: `mailto:${PROFILE_DATA.email}?subject=AI%20Engineering%20%2F%20Full-Stack%20Opportunity`,
                        className: "btn-pill-dark",
                        style: { width: "100%", justifyContent: "space-between" }
                      },
                      h("span", null, "Say Hello (fardin.hosn@gmail.com)"),
                      h("span", { className: "btn-trailing-circle" }, "→")
                    )
                  )
                )
              )
            ),

            // ================================================================
            // E. ABOUT ME & TECHNICAL SKILLS SECTION
            // ================================================================
            h(
              "section",
              { id: "about", className: "section-block" },
              h(
                "div",
                { className: "section-header-bar" },
                h(
                  "div",
                  { className: "section-title-group" },
                  h("span", { className: "section-red-bar" }),
                  h(
                    "h2",
                    { className: "section-heading" },
                    "About Me & Technical Stack",
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

              h(
                "div",
                { className: "bezel-outer" },
                h(
                  "div",
                  {
                    className: "bezel-inner",
                    style: {
                      padding: "2rem",
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                      gap: "2rem",
                      alignItems: "center"
                    }
                  },
                  // Left: Portrait + Short Personal Introduction & 4 Pillars
                  h(
                    "div",
                    { style: { display: "flex", flexDirection: "column", gap: "1.15rem" } },
                    h(
                      "div",
                      { style: { display: "flex", alignItems: "center", gap: "1rem" } },
                      h("img", {
                        src: PROFILE_DATA.aboutPortrait,
                        alt: "Md. Fardin Hossain",
                        style: {
                          width: "76px",
                          height: "76px",
                          borderRadius: "18px",
                          objectFit: "cover",
                          border: "2px solid var(--border-light)"
                        },
                        loading: "lazy"
                      }),
                      h(
                        "div",
                        null,
                        h(
                          "h3",
                          { style: { fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" } },
                          PROFILE_DATA.name
                        ),
                        h(
                          "div",
                          { style: { fontSize: "0.84rem", fontWeight: 700, color: "var(--accent-red)" } },
                          "AI Engineer & Full-Stack Developer · Dhaka, Bangladesh"
                        )
                      )
                    ),
                    h(
                      "p",
                      { style: { fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.65 } },
                      "I am a Computer Science & Engineering student at Southeast University and Machine Learning Intern at FlyRank AI. I build leak-free ranking pipelines, computer vision classifiers, and full-stack web & mobile products designed to hold up on messy real-world data."
                    ),
                    h(
                      "div",
                      {
                        style: {
                          display: "grid",
                          gridTemplateColumns: "repeat(2, 1fr)",
                          gap: "0.65rem"
                        }
                      },
                      [
                        { title: "AI & Machine Learning", desc: "Ranking, DuckDB, PyTorch CV & LLMs" },
                        { title: "Full-Stack Development", desc: "React, Next.js, TypeScript, MERN & Flutter" },
                        { title: "Research Problem Solving", desc: "Client-grouped evaluation & 12 ML notebooks" },
                        { title: "Software & Security", desc: "557 Vitest tests, C|PTE & OWASP Top 10" }
                      ].map((pillar) =>
                        h(
                          "div",
                          {
                            key: pillar.title,
                            style: {
                              background: "var(--bg-page)",
                              border: "1px solid var(--border-light)",
                              borderRadius: "12px",
                              padding: "0.75rem 0.9rem"
                            }
                          },
                          h(
                            "div",
                            { style: { fontWeight: 800, fontSize: "0.82rem", color: "var(--text-primary)" } },
                            pillar.title
                          ),
                          h(
                            "div",
                            { style: { fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "0.15rem" } },
                            pillar.desc
                          )
                        )
                      )
                    )
                  ),

                  // Right: Categorized Technical Skill Chips
                  h(
                    "div",
                    { style: { display: "flex", flexDirection: "column", gap: "1rem" } },
                    SKILL_GROUPS.map((group) =>
                      h(
                        "div",
                        {
                          key: group.category,
                          style: {
                            background: "var(--bg-page)",
                            border: "1px solid var(--border-light)",
                            borderRadius: "14px",
                            padding: "0.95rem 1.15rem"
                          }
                        },
                        h(
                          "div",
                          {
                            style: {
                              fontSize: "0.76rem",
                              fontWeight: 800,
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                              color: "var(--text-primary)",
                              marginBottom: "0.5rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.4rem"
                            }
                          },
                          h("span", {
                            className: group.accent === "red" ? "red-dot" : "yellow-dot",
                            style: { width: 6, height: 6 }
                          }),
                          group.category
                        ),
                        h(
                          "div",
                          { style: { display: "flex", flexWrap: "wrap", gap: "0.38rem" } },
                          group.items.map((skill) =>
                            h(
                              "span",
                              {
                                key: skill,
                                className: "tech-chip",
                                style: { background: "#FFFFFF", fontWeight: 600 }
                              },
                              skill
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            ),

            // ================================================================
            // FOOTER
            // ================================================================
            h(
              "footer",
              {
                style: {
                  marginTop: "4rem",
                  paddingTop: "1.75rem",
                  borderTop: "1px solid var(--border-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "1rem",
                  fontSize: "0.82rem",
                  color: "var(--text-muted)"
                }
              },
              h(
                "div",
                { style: { display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, color: "var(--text-primary)" } },
                h("span", null, "fardin.ai"),
                h("span", { className: "red-dot" }),
                h(
                  "span",
                  { style: { fontWeight: 500, color: "var(--text-muted)" } },
                  "· Md. Fardin Hossain · AI Engineer & Full-Stack Developer"
                )
              )
            )
          )
    ),

    // ========================================================================
    // MOBILE BOTTOM TAB BAR (MATCHES FIGMA MOBILE DESIGN)
    // ========================================================================
    h(
      "nav",
      { className: "mobile-bottom-bar", "aria-label": "Mobile Quick Navigation" },
      [
        { id: "home", label: "Home", icon: "⌂", action: () => navigateToSection("home") },
        { id: "projects", label: "Projects", icon: "⊞", action: () => navigateToSection("projects") },
        { id: "journey", label: "Journey", icon: "★", action: () => openJourneyExperience() },
        { id: "certifications", label: "Certs", icon: "✓", action: () => navigateToSection("certifications") },
        { id: "contact", label: "Contact", icon: "✉", action: () => navigateToSection("contact") }
      ].map((tab) => {
        const isActive =
          (tab.id === "journey" && view === "journey") ||
          (view === "home" && activeNav === tab.id);
        return h(
          "button",
          {
            key: tab.id,
            type: "button",
            className: `mobile-tab-item ${isActive ? "active" : ""}`,
            onClick: tab.action
          },
          h("span", { style: { fontSize: "1rem", lineHeight: 1 } }, tab.icon),
          h("span", null, tab.label)
        );
      })
    ),

    // ========================================================================
    // PROJECT DETAILS MODAL
    // ========================================================================
    h(
      AnimatePresence,
      null,
      selectedProject &&
        h(
          motion.div,
          {
            className: "modal-overlay",
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            onClick: () => setSelectedProject(null)
          },
          h(
            motion.div,
            {
              className: "modal-window",
              initial: { opacity: 0, scale: 0.95, y: 16 },
              animate: { opacity: 1, scale: 1, y: 0 },
              exit: { opacity: 0, scale: 0.95, y: 16 },
              onClick: (e) => e.stopPropagation(),
              role: "dialog",
              "aria-modal": "true",
              "aria-labelledby": "project-modal-title"
            },
            h(
              "div",
              { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" } },
              h(
                "div",
                null,
                h("span", { className: "tech-chip", style: { fontWeight: 700 } }, selectedProject.shortCategory),
                h(
                  "h3",
                  { id: "project-modal-title", style: { fontSize: "1.5rem", fontWeight: 900, marginTop: "0.4rem" } },
                  selectedProject.title
                )
              ),
              h(
                "button",
                {
                  type: "button",
                  className: "icon-circle-btn",
                  onClick: () => setSelectedProject(null),
                  "aria-label": "Close project details modal"
                },
                "✕"
              )
            ),

            h(
              "p",
              { style: { color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "1.25rem" } },
              selectedProject.description
            ),

            h(
              "h4",
              { style: { fontSize: "0.82rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "0.5rem" } },
              "Key Engineering Highlights"
            ),
            h(
              "ul",
              { className: "exp-bullets", style: { marginBottom: "1.25rem" } },
              selectedProject.highlights.map((hl, i) => h("li", { key: i }, hl))
            ),

            h(
              "div",
              { className: "project-tags-row", style: { marginBottom: "1.5rem" } },
              selectedProject.tags.map((t) => h("span", { key: t, className: "tech-chip" }, t))
            ),

            h(
              "div",
              { style: { display: "flex", flexWrap: "wrap", gap: "0.75rem", paddingTop: "1rem", borderTop: "1px solid var(--border-light)" } },
              selectedProject.journeyTrigger &&
                h(
                  "button",
                  {
                    type: "button",
                    className: "btn-pill-yellow",
                    onClick: () => openJourneyExperience()
                  },
                  h("span", null, "Open Interactive 4-Month Journey"),
                  h("span", { className: "btn-trailing-circle" }, "→")
                ),
              selectedProject.liveUrl &&
                h(
                  "a",
                  {
                    href: selectedProject.liveUrl,
                    target: "_blank",
                    rel: "noopener",
                    className: "btn-pill-dark"
                  },
                  h("span", null, "Open Live Application"),
                  h("span", { className: "btn-trailing-circle" }, "↗")
                ),
              selectedProject.paperUrl &&
                h(
                  "a",
                  {
                    href: selectedProject.paperUrl,
                    target: "_blank",
                    rel: "noopener",
                    className: "btn-pill-light"
                  },
                  "📄 Download Paper PDF"
                ),
              selectedProject.githubUrl &&
                h(
                  "a",
                  {
                    href: selectedProject.githubUrl,
                    target: "_blank",
                    rel: "noopener",
                    className: "btn-pill-light"
                  },
                  h(GithubIcon, { size: 16 }),
                  h("span", null, "View GitHub Repository ↗")
                )
            )
          )
        )
    ),

    // ========================================================================
    // CERTIFICATE SCAN MODAL (FOR CPTE & EDGE-CUET)
    // ========================================================================
    h(
      AnimatePresence,
      null,
      selectedCertModal &&
        h(
          motion.div,
          {
            className: "modal-overlay",
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            onClick: () => setSelectedCertModal(null)
          },
          h(
            motion.div,
            {
              className: "modal-window",
              initial: { opacity: 0, scale: 0.95 },
              animate: { opacity: 1, scale: 1 },
              exit: { opacity: 0, scale: 0.95 },
              onClick: (e) => e.stopPropagation(),
              role: "dialog",
              "aria-modal": "true"
            },
            h(
              "div",
              { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" } },
              h(
                "div",
                null,
                h("div", { style: { fontSize: "0.78rem", fontWeight: 700, color: "var(--accent-red)" } }, selectedCertModal.issuer),
                h("h3", { style: { fontSize: "1.2rem", fontWeight: 800 } }, selectedCertModal.title)
              ),
              h(
                "button",
                {
                  type: "button",
                  className: "icon-circle-btn",
                  onClick: () => setSelectedCertModal(null),
                  "aria-label": "Close certificate preview"
                },
                "✕"
              )
            ),
            selectedCertModal.certificateImage &&
              h("img", {
                src: selectedCertModal.certificateImage,
                alt: selectedCertModal.title,
                style: { width: "100%", borderRadius: "14px", border: "1px solid var(--border-light)" }
              })
          )
        )
    )
  );
}

const rootElement = document.getElementById("app-root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(h(PortfolioApp));
}
