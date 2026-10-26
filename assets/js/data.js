// ==========================================================================
// FARDIN.AI — VERIFIED PORTFOLIO & FLYRANK AI 4-MONTH JOURNEY DATA
// Source of Truth: journey.html, Fardin_Hossain_Resume.pdf, and GitHub repos
// ==========================================================================

export const PROFILE_DATA = {
  name: "Md. Fardin Hossain",
  handle: "fardin.ai",
  roleLine: "AI ENGINEER • FULL-STACK DEVELOPER • PROBLEM SOLVER",
  heroHeadlinePrefix: "Building ",
  heroHeadlineHighlight: "Intelligent Solutions.",
  heroSupportingText: "AI engineering, machine learning, and full-stack development for real-world impact.",
  location: "Dhaka, Bangladesh",
  email: "fardin.hosn@gmail.com",
  phone: "+8801992748470",
  github: "https://github.com/fardinhossain",
  linkedin: "https://www.linkedin.com/in/fardinhosn/",
  liveSite: "https://fardinflyrankai.vercel.app/",
  previousPortfolio: "https://mdfardin.vercel.app/",
  resumeUrl: "Fardin_Hossain_Resume.pdf",
  paperPdfUrl: "paper.pdf",
  paperWebUrl: "https://fardinhossain.github.io/FlyRankAI-ML-Internship-Task/",
  flyrankVerifyUrl: "https://internship.flyrank.ai/verify?id=FR-D1-T668H-R789R&first_name=Fardin",
  flyrankCredentialId: "FR-D1-T668H-R789R",
  heroPortrait: "assets/images/fardin_hero_editorial.jpg",
  aboutPortrait: "assets/images/fardin_profile.jpg"
};

export const HERO_METRICS = [
  {
    id: "rows",
    value: "78.8M+",
    label: "Daily-Performance Rows (DuckDB)",
    icon: "database"
  },
  {
    id: "precision",
    value: "0.78 vs 0.30",
    label: "Precision@50 (Learned vs Rule)",
    icon: "target"
  },
  {
    id: "pages",
    value: "9,961",
    label: "Candidate Pages Ranked",
    icon: "layers"
  },
  {
    id: "certs",
    value: "20/20",
    label: "Anthropic Academy Certificates",
    icon: "award"
  }
];

export const PROJECT_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "ai-ml", label: "AI / ML" },
  { id: "web", label: "Web Applications" },
  { id: "systems", label: "Systems" },
  { id: "research", label: "Research" }
];

export const PROJECTS_LIST = [
  {
    id: "civic-pulse",
    title: "Civic-Pulse AI",
    shortCategory: "AI / ML",
    categories: ["ai-ml", "web"],
    featured: true,
    visualType: "civic",
    summary: "AI-powered civic infrastructure reporting for smarter municipalities with computer vision anomaly triage.",
    description:
      "End-to-end municipal incident reporting and intelligence platform built for urban infrastructure management. Uses computer vision and LLM triage to classify citizen-submitted reports of road damage, electrical faults, and water leakages, assign priority scores, and map failure hotspots.",
    highlights: [
      "Automated visual anomaly classification and multi-tier urgency scoring for municipal defects",
      "Interactive geospatial clustering to identify recurring neighborhood infrastructure failures",
      "Real-time citizen resolution tracking and dispatch queue prioritization"
    ],
    tags: ["LLM", "FastAPI", "Computer Vision", "PyTorch", "React", "Leaflet"],
    liveUrl: "https://civicpulseai.vercel.app/",
    githubUrl: "https://github.com/fardinhossain/Civic-Pulse_AI_API_Hackathon_2026"
  },
  {
    id: "locationkhuji",
    title: "LocationKhuji",
    shortCategory: "Web App",
    categories: ["ai-ml", "web"],
    featured: true,
    visualType: "location",
    image: "assets/images/locationkhuji.png",
    summary: "AI-powered location search platform for discovering places and services across Bangladesh.",
    description:
      "Full-stack MERN platform for discovering flats, hospitals, pharmacies, and essential services across Bangladesh. Implements natural-language search in English, Bangla, and Banglish using LLM APIs (Groq, OpenRouter) with a multi-layer fallback architecture for reliability.",
    highlights: [
      "Natural-language search across English, Bangla, and Banglish powered by Groq and OpenRouter LLM APIs",
      "Multi-layer fallback search architecture ensuring reliable discovery even under API rate limits",
      "Interactive Leaflet maps, geospatial filtering, and role-based dashboards (User, Owner, Admin)"
    ],
    tags: ["React", "Node.js", "LLM APIs", "Leaflet Maps", "MongoDB", "Tailwind CSS"],
    liveUrl: "https://locationkhuji.vercel.app/",
    githubUrl: "https://github.com/fardinhossain/Locationkhuji"
  },
  {
    id: "schedos",
    title: "SchedOS",
    shortCategory: "Systems",
    categories: ["systems", "web"],
    featured: true,
    visualType: "schedos",
    summary: "Interactive CPU scheduling simulator with real-time Gantt visualization and 557 passing Vitest tests.",
    description:
      "Client-side operating system simulation laboratory built with React, TypeScript, and Tailwind CSS that visualizes 8 CPU scheduling algorithms (FCFS, SJF, SRTF, LJF, LRTF, Round Robin, Priority preemptive & non-preemptive) in real time with a zero-backend architecture.",
    highlights: [
      "Visualizes 8 CPU scheduling algorithms in real time with interactive Gantt charts and queue telemetry",
      "Zero-backend deterministic simulation core verified by 557 passing Vitest unit tests",
      "Live turnaround time, waiting time, response time, and CPU utilization comparison matrix"
    ],
    tags: ["React", "TypeScript", "Algorithms", "Simulation", "Tailwind CSS", "Vitest"],
    liveUrl: "https://sched-os.vercel.app",
    githubUrl: "https://github.com/fardinhossain/SchedOS"
  },
  {
    id: "skin-disease-cv",
    title: "Skin Disease Classification",
    shortCategory: "AI / ML",
    categories: ["ai-ml", "research"],
    featured: true,
    visualType: "skincv",
    summary: "Transfer learning computer vision pipeline using GoogLeNet & MobileNet for dermatological image classification.",
    description:
      "Diagnostic computer vision study utilizing fine-tuned GoogLeNet and MobileNet convolutional architectures to classify dermatological lesion imagery across clinical classes with calibrated confidence and Grad-CAM visual explainability.",
    highlights: [
      "Fine-tuned GoogLeNet and MobileNetV2 transfer learning models achieving 98.7% test accuracy",
      "Class-imbalance mitigation and Grad-CAM heatmaps highlighting predictive lesion regions",
      "Evaluated for lightweight CPU and edge deployment latency"
    ],
    tags: ["Python", "PyTorch", "Deep Learning", "Computer Vision", "GoogLeNet", "MobileNet"],
    liveUrl: "",
    githubUrl: "https://github.com/fardinhossain/Skin-Disease-Classification-using-Transfer-Learning"
  },
  {
    id: "flyrank-ml-capstone",
    title: "FlyRank AI ML Capstone",
    shortCategory: "Research",
    categories: ["ai-ml", "research"],
    featured: true,
    visualType: "flyrank",
    image: "assets/images/figures/cost_value_matrix.png",
    summary: "Content-refresh opportunity ranking over 78.8M DuckDB rows and 9,961 pages (0.78 Precision@50 vs 0.30 baseline).",
    description:
      "Industrial machine learning research capstone framing content-refresh prioritization as a ranking task over 9,961 candidate pages drawn from a 78.8M-row content-performance warehouse in DuckDB. Evaluated strictly on a client-grouped holdout to prevent domain leakage.",
    highlights: [
      "Achieved 0.78 Precision@50 with the learned ranker vs 0.30 for the fixed-rule baseline on unseen client domains",
      "Out-of-core DuckDB data contract over 78.8M daily-performance rows with full feature leakage audit",
      "Delivered 12 executed ML notebooks, action playbook, and formal research paper"
    ],
    tags: ["Python", "DuckDB", "scikit-learn", "Ranking Systems", "pandas", "Research Paper"],
    liveUrl: "https://fardinhossain.github.io/FlyRankAI-ML-Internship-Task/",
    paperUrl: "paper.pdf",
    journeyTrigger: true,
    githubUrl: "https://github.com/fardinhossain/FlyRankAI-ML-Internship-Task"
  },
  {
    id: "seu-routine-maker",
    title: "SEU Routine Maker",
    shortCategory: "Web App",
    categories: ["web"],
    featured: false,
    visualType: "routine",
    summary: "University routine builder with OCR course-code detection, conflict analysis, and .ics/PDF/PNG export.",
    description:
      "React and Next.js tool that converts Southeast University UMS exports (HTML, PDF, screenshots) into a conflict-free weekly class routine with OCR-based course-code detection, free-gap analysis, and calendar exports.",
    highlights: [
      "Converts UMS HTML, PDF, and screenshot exports into structured weekly schedules using OCR",
      "Real-time timetable conflict detection, free-gap analysis, and browser class reminders",
      "One-click export to .ics calendar, high-res PDF, and PNG"
    ],
    tags: ["React", "Next.js", "TypeScript", "OCR", "Tailwind CSS"],
    liveUrl: "https://seuroutine.vercel.app",
    githubUrl: "https://github.com/fardinhossain/SEU-Routine_Maker"
  },
  {
    id: "gainthebrain",
    title: "GainTheBrain",
    shortCategory: "Web App",
    categories: ["web"],
    featured: false,
    visualType: "brain",
    summary: "Interactive cognitive acceleration and spaced-repetition learning web platform.",
    description:
      "Cognitive acceleration and micro-learning application featuring adaptive spaced repetition, mental agility sprints, and retention analytics.",
    highlights: [
      "Adaptive spaced-repetition scheduling tailored to user retention curves",
      "Interactive cognitive sprints with millisecond accuracy timers and streak tracking",
      "Fast client-side state persistence and responsive mobile-first interface"
    ],
    tags: ["React", "Vite", "Spaced Repetition", "Tailwind CSS", "PWA"],
    liveUrl: "https://gainthebrain.vercel.app/",
    githubUrl: "https://github.com/fardinhossain/GainTheBrain"
  },
  {
    id: "unibuddy",
    title: "UniBuddy App",
    shortCategory: "Web App",
    categories: ["web", "systems"],
    featured: false,
    visualType: "unibuddy",
    image: "assets/images/unibuddy-app.png",
    summary: "Cross-platform Flutter & Appwrite university student collaboration platform with multi-semester CGPA tracking.",
    description:
      "Cross-platform Flutter (Dart) application backed by Appwrite Cloud featuring a multi-semester GPA/CGPA calculator, PDF grade-report export, user authentication, and offline support for Android, iOS, and Web.",
    highlights: [
      "Multi-semester GPA/CGPA calculator with cloud sync and PDF grade-report generation",
      "Appwrite authentication, student profiles, and academic resource sharing",
      "Offline-first synchronization across Android, iOS, and Web"
    ],
    tags: ["Flutter", "Dart", "Appwrite", "Cross-Platform", "PDF Export"],
    liveUrl: "",
    githubUrl: "https://github.com/fardinhossain/Unibuddy_app"
  }
];

// ==========================================================================
// FLYRANK AI 4-MONTH INTERNSHIP JOURNEY (EXACT SOURCE OF TRUTH FROM journey.html)
// ==========================================================================

export const JOURNEY_OVERVIEW = {
  title: "My 4-Month FlyRank AI Internship Journey",
  role: "Machine Learning Intern — FlyRank AI",
  period: "July – October 2026 · Remote",
  location: "Remote · Dhaka, Bangladesh",
  subtitle:
    "Two tracks, one story: the ML track (ranking 9,961 pages by refresh opportunity) and the AI Fluency track (agents, automation, and a shipped portfolio).",
  promptLine: "Explore it: play with the ranker, walk the timeline, flip the certificates.",
  progressPercent: 94.9,
  progressSubmitted: 37,
  progressTotal: 39,
  progressLabel:
    '37 of 39 portal cards submitted — the last two are honestly marked "in progress" below.'
};

export const JOURNEY_STATS = [
  {
    id: "pages",
    count: 9961,
    decimals: 0,
    display: "9,961",
    label: "candidate pages ranked"
  },
  {
    id: "precision",
    count: null,
    display: "0.78",
    subDisplay: "vs 0.30",
    label: "precision@50, learned ranker vs fixed rule"
  },
  {
    id: "rows",
    count: 78.8,
    decimals: 1,
    suffix: "M",
    display: "78.8M",
    label: "million daily-performance rows (DuckDB)"
  },
  {
    id: "notebooks",
    count: 12,
    decimals: 0,
    display: "12",
    label: "executed ML notebooks + research paper"
  },
  {
    id: "certs",
    count: 20,
    decimals: 0,
    display: "20",
    label: "Anthropic Academy certificates"
  },
  {
    id: "hours",
    count: 134,
    decimals: 0,
    prefix: "~",
    display: "~134",
    label: "hours logged (approx.)"
  }
];

// Exact 12-page illustrative ranking dataset from journey.html
export const RANKER_SAMPLE_PAGES = [
  { name: "Page A", decline: 42, demand: 90, needs: true },
  { name: "Page B", decline: 38, demand: 20, needs: false },
  { name: "Page C", decline: 30, demand: 95, needs: true },
  { name: "Page D", decline: 55, demand: 10, needs: false },
  { name: "Page E", decline: 25, demand: 88, needs: true },
  { name: "Page F", decline: 48, demand: 30, needs: false },
  { name: "Page G", decline: 20, demand: 92, needs: true },
  { name: "Page H", decline: 60, demand: 15, needs: false },
  { name: "Page I", decline: 33, demand: 85, needs: true },
  { name: "Page J", decline: 28, demand: 25, needs: false },
  { name: "Page K", decline: 45, demand: 80, needs: true },
  { name: "Page L", decline: 15, demand: 40, needs: false }
];

// Exact Month-by-Month Timeline from journey.html
export const JOURNEY_TIMELINE = [
  {
    id: "july",
    navLabel: "July · Foundations",
    month: "July 2026",
    theme: "Foundations",
    status: "done",
    summary: "Internship onboarding, starter ML notebooks, AI Fluency workflow audit, and portfolio architecture planning.",
    tags: ["Python", "Jupyter", "AI Fluency Audit", "Portfolio Sitemap"],
    items: [
      "Joined the FlyRank AI internship (July cohort) — ML as the main track",
      "ML: starter notebooks — first look, first readable model, full release",
      "AI Fluency: FL-01 workflow audit & tool setup · Draw the Path (portfolio sitemap + toolkit) · What Are You Proving?"
    ],
    deliverables: [
      { label: "ML Starter Notebooks (00–02)", type: "notebook" },
      { label: "FL-01 Workflow Audit & Sitemap Plan", type: "doc" }
    ]
  },
  {
    id: "july-aug",
    navLabel: "Jul–Aug · Problem Framing",
    month: "July – August 2026",
    theme: "Framing the problem",
    status: "done",
    summary: "Defined content-refresh opportunity scoring as a ranking task over 9,961 candidate pages evaluated with Precision@50.",
    tags: ["Lane 2 Ranking", "Precision@50", "Automation Workflow", "MCP Basics"],
    items: [
      "ML w01: research question → Lane 2: Content Refresh / Opportunity Scoring",
      "ML w02: framed as a ranking task — 9,961 candidate pages, precision@50",
      "AI Fluency: Three Roads (stack rationale) · FL-04 automation workflow (5 real runs) · FL-05 agent & MCP explainer"
    ],
    deliverables: [
      { label: "Lane 2 Problem Formulation & Ranking Spec", type: "research" },
      { label: "FL-04 5-Run Automation Pipeline & FL-05 MCP Explainer", type: "doc" }
    ]
  },
  {
    id: "august",
    navLabel: "August · Data & Baselines",
    month: "August 2026",
    theme: "Data & baselines",
    status: "done",
    summary: "Queried the 78.8M-row warehouse with DuckDB, audited feature leakage, established the fixed-rule baseline, and designed the personal agent.",
    tags: ["DuckDB", "78.8M Rows", "Leakage Audit", "Baseline Scoring", "FL-06 Agent Spec"],
    items: [
      "ML w03: data contract — DuckDB over 78.8M daily-performance rows + feature leakage check",
      "ML w04: baseline score + signal audit",
      "AI Fluency: Make It Do Something · Explain It Like You Built It · FL-06 agent design spec"
    ],
    deliverables: [
      { label: "DuckDB 78.8M-Row Data Contract & Signal Audit", type: "code" },
      { label: "FL-06 Personal Agent Architecture Spec", type: "doc" }
    ]
  },
  {
    id: "september",
    navLabel: "September · Models & Agents",
    month: "September 2026",
    theme: "Models & agents",
    status: "done",
    summary: "Trained and validated ML ranking models on a client-grouped holdout, built the Study Coach agent with narrated demo video, and shipped the live site.",
    tags: ["scikit-learn", "Client-Grouped Holdout", "FL-07 Study Coach Agent", "Vercel DNS", "Mobile QA"],
    items: [
      "ML w05: model (logistic regression + random forest) · w06: validation audit on a client-grouped holdout",
      "AI Fluency: FL-07 Study Coach agent — built, tested, run video · FL-09 README + narrated demo · Plan to Keep Building",
      "Portfolio site deployed on Vercel + DNS walkthrough (PF-04) · mobile QA fix log · Break-Your-Own-Site report"
    ],
    deliverables: [
      { label: "Client-Grouped Holdout Validation Notebooks (w05–w06)", type: "notebook" },
      { label: "FL-07 Study Coach Agent MVP & FL-09 Demo Documentation", type: "code" },
      { label: "Live Portfolio Deployment + Adversarial QA Report", type: "web" }
    ]
  },
  {
    id: "october",
    navLabel: "October · Capstones & Proof",
    month: "October 2026",
    theme: "Capstones & proof",
    status: "done",
    summary: "Completed the ML capstone notebook and research paper (0.78 Precision@50 vs 0.30 baseline), AI Fluency Impact Project, and all 20/20 Anthropic Academy certificates.",
    tags: ["0.78 Precision@50", "Research Paper", "20/20 Anthropic Certs", "~134 Hours Logged"],
    items: [
      "ML w07: action playbook · ML capstone notebook + research paper — 0.78 precision@50 vs 0.30 baseline",
      "AI Fluency capstone: Impact Project — personal site + Study Coach agent + 20/20 certificates",
      "Send the Link · Plant Your Flag · 20/20 Anthropic Academy certificates · ~134 hours logged"
    ],
    links: [
      {
        label: "Code: FlyRankAI-ML-Internship-Task",
        url: "https://github.com/fardinhossain/FlyRankAI-ML-Internship-Task"
      },
      {
        label: "Site: fardinflyrankai.vercel.app",
        url: "https://fardinflyrankai.vercel.app/"
      },
      {
        label: "Research Paper (PDF)",
        url: "paper.pdf"
      },
      {
        label: "Deployed Research Paper",
        url: "https://fardinhossain.github.io/FlyRankAI-ML-Internship-Task/"
      }
    ],
    deliverables: [
      { label: "ML Capstone Notebook & Research Paper (0.78 vs 0.30)", type: "research" },
      { label: "20/20 Anthropic Academy Certificates Uploaded", type: "cert" }
    ]
  },
  {
    id: "in-progress",
    navLabel: "In Progress · Honest Last Mile",
    month: "In progress",
    theme: "the honest last mile",
    status: "open",
    summary: "Two final checkpoint cards remain open pending genuine human review and sign-off — never fabricated.",
    tags: ["Human Review Pending", "Zero Fabricated Sign-Offs", "Transparency"],
    items: [
      "Survive the Crit — waiting on a real human review of the portfolio (no fabricated reviews, ever)",
      "Show It / Tell the Story — build-in-public post + human sign-off + retrospective & hours approval"
    ],
    honestNoteTitle: "Why these two are still open",
    honestNoteBody:
      "Both cards close only on real human input — a genuine reviewer reply, and a genuine sign-off. They are shown as in progress rather than quietly marked done, because the journey page has to defend the same claim as everything on it: work you can trust."
  }
];

// Exact 20 Anthropic Academy Certificates from journey.html
export const ANTHROPIC_CERTIFICATES = [
  {
    index: 1,
    title: "AI Fluency: Framework & Foundations",
    learned:
      "The 4D framework — Delegation, Description, Discernment, Diligence — and calibrated trust instead of all-or-nothing AI trust."
  },
  {
    index: 2,
    title: "Claude 101",
    learned:
      "Prompting fundamentals: give context and constraints, then iterate conversationally instead of expecting perfection first try."
  },
  {
    index: 3,
    title: "Introduction to Claude Cowork",
    learned:
      "Agentic workspace mode: delegate multi-step, file-based tasks to Claude and review what it did."
  },
  {
    index: 4,
    title: "AI Capabilities and Limitations",
    learned:
      "How LLMs really work, why they hallucinate, and why specific facts in outputs must always be verified."
  },
  {
    index: 5,
    title: "AI Fluency for Students",
    learned:
      "AI as a learning partner, not a substitute — real learning is proven when you can explain it to someone else."
  },
  {
    index: 6,
    title: "AI Fluency for Small Businesses",
    learned:
      "The 4Ds for business: keep your voice in drafts, keep a human reviewing, never paste raw client data into prompts."
  },
  {
    index: 7,
    title: "AI Fluency for Educators",
    learned:
      "The 4Ds for teaching: objectives-first assessments, and transparency about classroom AI use."
  },
  {
    index: 8,
    title: "Teaching AI Fluency",
    learned:
      "Teaching the loops — linear, focused, loop-based — and assessing process, not just the final product."
  },
  {
    index: 9,
    title: "AI Fluency for Nonprofits",
    learned:
      "Ask 'should AI do this?' before 'can it?' — pilot on known answers, then scale, mission first."
  },
  {
    index: 10,
    title: "AI Fluency for Builders",
    learned:
      "The builder's toolkit, the Five Lenses for reviewing AI output, and acceptance tests before prompting."
  },
  {
    index: 11,
    title: "Claude Code 101",
    learned:
      "Terminal-based agentic coding: Claude reads, edits, and runs code in your project under your supervision."
  },
  {
    index: 12,
    title: "Claude Code in Action",
    learned:
      "Planning mode, context management, and reliable multi-file workflows on real codebases."
  },
  {
    index: 13,
    title: "Claude Platform 101",
    learned:
      "The Console, API basics, and how models, API, and tools fit together."
  },
  {
    index: 14,
    title: "Building with the Claude API",
    learned:
      "Evals before prompt tuning, structured outputs, tool use, and RAG — the production discipline."
  },
  {
    index: 15,
    title: "Introduction to Model Context Protocol",
    learned:
      "MCP primitives — tools, resources, prompts — and building servers with the Python SDK."
  },
  {
    index: 16,
    title: "Model Context Protocol: Advanced Topics",
    learned:
      "Sampling, progress notifications, least-privilege roots, and STDIO vs StreamableHTTP transports."
  },
  {
    index: 17,
    title: "Introduction to Agent Skills",
    learned:
      "Reusable SKILL.md instructions with triggerable descriptions, so you stop repeating yourself."
  },
  {
    index: 18,
    title: "Introduction to Subagents",
    learned:
      "Specialized agents with their own context, orchestrated in parallel under one coordinator."
  },
  {
    index: 19,
    title: "Claude with Amazon Bedrock",
    learned:
      "Claude through Bedrock's Converse API — same Claude, inside AWS IAM and VPC controls."
  },
  {
    index: 20,
    title: "Claude with Google Cloud's Vertex AI",
    learned:
      "Claude through Vertex AI — unified billing, IAM, and data residency in your GCP region."
  }
];

export const VERIFIED_CERTIFICATIONS = [
  {
    id: "flyrank-cert",
    issuer: "FlyRank AI",
    logoText: "FR",
    title: "ML Internship (Applied Search Intelligence)",
    period: "Jul – Oct 2026",
    credentialId: "FR-D1-T668H-R789R",
    status: "Verified",
    statusType: "verified",
    verifyUrl: "https://internship.flyrank.ai/verify?id=FR-D1-T668H-R789R&first_name=Fardin",
    description: "Cryptographically verified internship credential for 78.8M-row DuckDB search telemetry ranking and 0.78 Precision@50 capstone."
  },
  {
    id: "datacamp-ai",
    issuer: "DataCamp",
    logoText: "DC",
    title: "Associate AI Engineer for Developers",
    period: "2026",
    status: "Verified",
    statusType: "verified",
    verifyUrl: "Fardin_Hossain_Resume.pdf",
    description: "Certified proficiency in LLM APIs, production prompt engineering, vector embeddings, and software integration."
  },
  {
    id: "ibm-genai",
    issuer: "IBM",
    logoText: "IBM",
    title: "Generative AI Engineering Professional Certificate",
    period: "2026",
    status: "Verified",
    statusType: "verified",
    verifyUrl: "Fardin_Hossain_Resume.pdf",
    description: "Comprehensive engineering credential covering foundation models, fine-tuning, transformers, and retrieval-augmented generation."
  },
  {
    id: "mile2-cpte",
    issuer: "mile2",
    logoText: "m2",
    title: "C|PTE: Certified Penetration Testing Engineer",
    period: "2026 – 2029",
    status: "Verified",
    statusType: "verified",
    certificateImage: "assets/images/cpte_fardin.jpg",
    description: "Hands-on offensive security auditing, vulnerability assessment, network reconnaissance, and OWASP Top 10 remediation."
  },
  {
    id: "anthropic-20",
    issuer: "Anthropic",
    logoText: "AA",
    title: "Anthropic Academy — 20/20 Certificate Courses",
    period: "Oct 2026",
    status: "20/20 Earned",
    statusType: "verified",
    openCertWall: true,
    description: "All 20 certificate courses completed across Claude API, Claude Code, Model Context Protocol (MCP), Agent Skills, Subagents, Bedrock & Vertex AI."
  },
  {
    id: "edge-cuet",
    issuer: "EDGE-CUET",
    logoText: "EC",
    title: "Applied Penetration Testing Assessment",
    period: "2026",
    status: "Verified",
    statusType: "verified",
    certificateImage: "assets/images/EDGE-CUET.jpg",
    description: "Hands-on enterprise penetration testing and cybersecurity assessment under the EDGE-CUET / DST initiative."
  },
  {
    id: "flyrank-fluency-review",
    issuer: "FlyRank AI",
    logoText: "FL",
    title: "AI Fluency Track Final Human Sign-Off (37/39 Cards)",
    period: "Oct 2026",
    status: "In Progress (2 cards)",
    statusType: "inprogress",
    openJourney: true,
    description: "37 of 39 portal cards submitted. 'Survive the Crit' and 'Show It / Tell the Story' remain honestly marked in progress awaiting human reviewer sign-off."
  }
];

export const SKILL_GROUPS = [
  {
    category: "Machine Learning & AI",
    accent: "red",
    items: [
      "Machine Learning",
      "scikit-learn",
      "pandas",
      "PyTorch",
      "DuckDB (78.8M+ Rows)",
      "Ranking & Precision@K",
      "Client-Grouped Validation",
      "Deep Learning & Transfer Learning",
      "LLM APIs (Groq, OpenRouter, Claude)",
      "Model Context Protocol (MCP)"
    ]
  },
  {
    category: "Programming Languages",
    accent: "dark",
    items: ["Python", "TypeScript", "JavaScript", "Dart", "Java", "C / C++", "SQL"]
  },
  {
    category: "Full-Stack Web & Mobile",
    accent: "yellow",
    items: [
      "React",
      "Next.js",
      "Node.js",
      "Express.js",
      "FastAPI",
      "Flutter",
      "Tailwind CSS",
      "Leaflet Maps",
      "REST APIs",
      "Vitest (557 Tests)"
    ]
  },
  {
    category: "Databases, Cloud & Security",
    accent: "green",
    items: [
      "MongoDB",
      "Firebase",
      "Appwrite",
      "Git & GitHub",
      "Vercel",
      "Linux",
      "Penetration Testing (C|PTE)",
      "Web Application Security",
      "OWASP Top 10"
    ]
  }
];
