// ─────────────────────────────────────────────────────────────────────────────
// RISK DATA LIBRARY — v2
// 5-section question flow matching the product spec.
// The AI (Go backend) does final scoring; these pCalc/iCalc are used for
// the client-side preview heat map only.
// ─────────────────────────────────────────────────────────────────────────────

export type QuestionType = "radio" | "text" | "select";

export interface Section {
  id: string;
  title: string;
  subtitle: string;
  icon: string; // single emoji
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  subtext?: string; // the uncomfortable clarifying sentence
  type: QuestionType;
  opts?: string[]; // radio options
  placeholder?: string; // text input placeholder
  required: boolean;
  // Risk mapping (for client-side preview scoring)
  riskName: string;
  riskDesc: string;
  hedge: string;
  pCalc: (v: string) => number; // probability 1–10
  iCalc: (v: string) => number; // impact 1–10
}

export type RiskTier = "red" | "watch" | "manage" | "ignore";

export interface ComputedRisk {
  id: string;
  idx: number;
  name: string;
  desc: string;
  hedge: string;
  section: string;
  p: number;
  i: number;
  score: number;
  tier: RiskTier;
}

export interface TierConfig {
  label: string;
  sublabel: string;
  color: string;
  bgDim: string;
  pillBg: string;
  pillColor: string;
  dot: string;
}

// ─── TIER CONFIGURATION (4-bucket model) ─────────────────────────────────────
// Red Zone    — low probability, existential impact
// Watch List  — higher probability, existential impact
// Manage It   — high probability, survivable
// Ignore Now  — low probability, survivable

export const TIER_CONFIG: Record<RiskTier, TierConfig> = {
  red: {
    label: "Red Zone",
    sublabel: "Low probability, existential impact — hedge now",
    color: "#c1281e",
    bgDim: "rgba(193,40,30,0.07)",
    pillBg: "#c1281e",
    pillColor: "white",
    dot: "#c1281e",
  },
  watch: {
    label: "Watch List",
    sublabel: "Higher probability, existential impact — on fire, slowly",
    color: "#d4870a",
    bgDim: "rgba(212,135,10,0.07)",
    pillBg: "#d4870a",
    pillColor: "white",
    dot: "#d4870a",
  },
  manage: {
    label: "Manage It",
    sublabel: "High probability, survivable — handle operationally",
    color: "#1a4a7a",
    bgDim: "rgba(26,74,122,0.06)",
    pillBg: "#1a4a7a",
    pillColor: "white",
    dot: "#1a4a7a",
  },
  ignore: {
    label: "Ignore For Now",
    sublabel: "Low probability, survivable — not worth your attention",
    color: "rgba(14,14,14,0.3)",
    bgDim: "rgba(14,14,14,0.03)",
    pillBg: "rgba(14,14,14,0.1)",
    pillColor: "rgba(14,14,14,0.55)",
    dot: "rgba(14,14,14,0.25)",
  },
};

// ─── SCORING ──────────────────────────────────────────────────────────────────

export function getRiskTier(p: number, i: number): RiskTier {
  const highImpact = i >= 7;
  const highProb = p >= 6;
  if (highImpact && highProb) return "watch";
  if (highImpact && !highProb) return "red";
  if (!highImpact && highProb) return "manage";
  return "ignore";
}

function r(val: string, opts: string[], scores: number[]): number {
  const idx = opts.indexOf(val);
  return idx >= 0 ? scores[idx] : 1;
}

function clamp(v: number): number {
  return Math.min(10, Math.max(1, Math.round(v)));
}

// ─── SECTIONS & QUESTIONS ─────────────────────────────────────────────────────

export const SECTIONS: Section[] = [
  // ── SECTION 1: Business Snapshot (context only, minimal scoring) ─────────────
  {
    id: "snapshot",
    title: "Business Snapshot",
    subtitle:
      "Context so we can calibrate what 'existential' actually means for you.",
    icon: "◎",
    questions: [
      {
        id: "s1_industry",
        text: "What industry are you in?",
        type: "radio",
        opts: [
          "SaaS / Software",
          "E-commerce",
          "Professional Services",
          "Retail / F&B",
          "Manufacturing",
          "Healthcare",
          "Media / Creative",
          "Construction / Trades",
          "Other",
        ],
        required: true,
        riskName: "Industry Baseline",
        riskDesc: "Context for calibrating sector-specific risk exposure.",
        hedge: "N/A — context question.",
        pCalc: () => 3,
        iCalc: () => 3,
      },
      {
        id: "s1_revenue",
        text: "Approximate annual revenue?",
        subtext:
          "We use this to calibrate what 'survivable' means for your size.",
        type: "radio",
        opts: [
          "Pre-revenue",
          "Under $250K",
          "$250K–$1M",
          "$1M–$5M",
          "$5M–$20M",
          "$20M+",
        ],
        required: true,
        riskName: "Revenue Scale",
        riskDesc: "Context for calibrating risk thresholds.",
        hedge: "N/A — context question.",
        pCalc: () => 3,
        iCalc: () => 3,
      },
      {
        id: "s1_team",
        text: "How many full-time people?",
        type: "radio",
        opts: ["Just me", "2–5", "6–15", "16–50", "51–200", "200+"],
        required: true,
        riskName: "Team Scale",
        riskDesc: "Context for calibrating operational risk.",
        hedge: "N/A — context question.",
        pCalc: () => 3,
        iCalc: () => 3,
      },
      {
        id: "s1_age",
        text: "How old is the business?",
        subtext:
          "Newer businesses carry different risk profiles than established ones.",
        type: "radio",
        opts: [
          "Under 1 year",
          "1–3 years",
          "3–7 years",
          "7–15 years",
          "15+ years",
        ],
        required: true,
        riskName: "Business Age",
        riskDesc: "Context for calibrating maturity and stability.",
        hedge: "N/A — context question.",
        pCalc: () => 3,
        iCalc: () => 3,
      },
    ],
  },

  // ── SECTION 2: Dependency Risks ───────────────────────────────────────────────
  {
    id: "dependency",
    title: "Dependency Risks",
    subtitle:
      "These questions surface concentration risk — the things that could vanish and take you with them.",
    icon: "⬡",
    questions: [
      {
        id: "s2_supplier",
        text: "Name the one supplier, tool, or platform that if it disappeared tomorrow would take you more than 3 months to replace.",
        subtext:
          "If nothing comes to mind immediately, you're either very resilient or not thinking hard enough.",
        type: "text",
        placeholder:
          "e.g. AWS, our sole manufacturer in Shenzhen, Salesforce, our payment processor...",
        required: true,
        riskName: "Single-Point Supplier",
        riskDesc:
          "Critical vendor or platform with no viable short-term alternative.",
        hedge:
          "Identify and qualify a backup vendor now, before you need one. Negotiate contract protections.",
        pCalc: (v) => (v.trim().length > 3 ? 6 : 2),
        iCalc: (v) => (v.trim().length > 3 ? 8 : 2),
      },
      {
        id: "s2_customer_pct",
        text: "What percentage of your revenue comes from your top 3 customers combined?",
        subtext:
          "If that number is over 50%, you don't have a customer base — you have a dependency.",
        type: "radio",
        opts: [
          "Under 20%",
          "20–40%",
          "40–60%",
          "60–80%",
          "Over 80%",
          "I have no recurring customers",
        ],
        required: true,
        riskName: "Customer Concentration",
        riskDesc: "Revenue overly concentrated in a small number of accounts.",
        hedge:
          "Cap any single client at 20% of revenue. Actively build pipeline diversity.",
        pCalc: (v) =>
          r(
            v,
            [
              "Under 20%",
              "20–40%",
              "40–60%",
              "60–80%",
              "Over 80%",
              "I have no recurring customers",
            ],
            [1, 3, 5, 7, 9, 4],
          ),
        iCalc: (v) =>
          r(
            v,
            [
              "Under 20%",
              "20–40%",
              "40–60%",
              "60–80%",
              "Over 80%",
              "I have no recurring customers",
            ],
            [2, 4, 6, 8, 10, 5],
          ),
      },
      {
        id: "s2_keyman",
        text: "Is there a single person on your team whose departure would seriously damage the business?",
        subtext: "Be honest. Most founders undercount this. Include yourself.",
        type: "radio",
        opts: [
          "No — we're fully cross-trained",
          "Maybe 1 person",
          "Yes, 1 clear person",
          "Yes, 2–3 people",
          "Yes — it's basically me",
        ],
        required: true,
        riskName: "Key Person Dependency",
        riskDesc:
          "Critical knowledge, relationships, or capability concentrated in one person.",
        hedge:
          "Document everything they know. Cross-train. Consider key-person insurance.",
        pCalc: (v) =>
          r(
            v,
            [
              "No — we're fully cross-trained",
              "Maybe 1 person",
              "Yes, 1 clear person",
              "Yes, 2–3 people",
              "Yes — it's basically me",
            ],
            [1, 3, 6, 7, 9],
          ),
        iCalc: (v) =>
          r(
            v,
            [
              "No — we're fully cross-trained",
              "Maybe 1 person",
              "Yes, 1 clear person",
              "Yes, 2–3 people",
              "Yes — it's basically me",
            ],
            [1, 4, 7, 7, 9],
          ),
      },
      {
        id: "s2_channel",
        text: "What percentage of your new customer acquisition comes from a single channel?",
        subtext:
          "Google, Instagram, one referral partner, a single salesperson — monocultures in acquisition are fragile.",
        type: "radio",
        opts: [
          "Spread across 4+ channels",
          "2–3 channels roughly equal",
          "One dominant channel (~50%)",
          "One channel (70%+)",
          "Almost entirely one channel",
        ],
        required: true,
        riskName: "Acquisition Channel Risk",
        riskDesc:
          "Over-reliance on a single acquisition channel creates sudden-death exposure.",
        hedge:
          "Build a second acquisition channel to 20% of volume before the first one breaks.",
        pCalc: (v) =>
          r(
            v,
            [
              "Spread across 4+ channels",
              "2–3 channels roughly equal",
              "One dominant channel (~50%)",
              "One channel (70%+)",
              "Almost entirely one channel",
            ],
            [1, 2, 5, 7, 9],
          ),
        iCalc: (v) =>
          r(
            v,
            [
              "Spread across 4+ channels",
              "2–3 channels roughly equal",
              "One dominant channel (~50%)",
              "One channel (70%+)",
              "Almost entirely one channel",
            ],
            [2, 3, 5, 7, 8],
          ),
      },
    ],
  },

  // ── SECTION 3: Market & Competitive ──────────────────────────────────────────
  {
    id: "market",
    title: "Market & Competitive Risks",
    subtitle:
      "Strategic vulnerabilities — the things that could make your business model obsolete.",
    icon: "△",
    questions: [
      {
        id: "s3_regulation",
        text: "Is there a regulatory change in your industry that you're aware of but haven't planned for?",
        subtext:
          "GDPR, licensing changes, platform policy shifts, sector-specific legislation. If you thought of something reading that sentence, it counts.",
        type: "radio",
        opts: [
          "No known exposure",
          "Aware of something, low risk",
          "Aware of something, haven't planned",
          "Significant exposure, no plan",
          "This could end our model",
        ],
        required: true,
        riskName: "Regulatory Exposure",
        riskDesc: "Known regulatory risk without a mitigation plan.",
        hedge:
          "Get a legal opinion on your top regulatory exposure this quarter. Don't wait.",
        pCalc: (v) =>
          r(
            v,
            [
              "No known exposure",
              "Aware of something, low risk",
              "Aware of something, haven't planned",
              "Significant exposure, no plan",
              "This could end our model",
            ],
            [1, 3, 6, 7, 9],
          ),
        iCalc: (v) =>
          r(
            v,
            [
              "No known exposure",
              "Aware of something, low risk",
              "Aware of something, haven't planned",
              "Significant exposure, no plan",
              "This could end our model",
            ],
            [2, 3, 6, 8, 10],
          ),
      },
      {
        id: "s3_freemium",
        text: "Could a well-funded competitor offer your core product for free and survive doing it?",
        subtext:
          "Think: Google offering a free version of your product, or a VC-backed startup subsidising acquisition. Would that kill you?",
        type: "radio",
        opts: [
          "No — our moat makes this irrelevant",
          "Unlikely — we have real switching costs",
          "Maybe — we'd lose some customers",
          "Probably — price is a key factor for us",
          "Yes — we'd lose most customers",
        ],
        required: true,
        riskName: "Commoditisation Risk",
        riskDesc:
          "Vulnerability to a funded competitor using price as a weapon.",
        hedge:
          "Identify and deepen defensible moats: integrations, data, relationships, brand, compliance.",
        pCalc: (v) =>
          r(
            v,
            [
              "No — our moat makes this irrelevant",
              "Unlikely — we have real switching costs",
              "Maybe — we'd lose some customers",
              "Probably — price is a key factor for us",
              "Yes — we'd lose most customers",
            ],
            [1, 2, 4, 7, 8],
          ),
        iCalc: (v) =>
          r(
            v,
            [
              "No — our moat makes this irrelevant",
              "Unlikely — we have real switching costs",
              "Maybe — we'd lose some customers",
              "Probably — price is a key factor for us",
              "Yes — we'd lose most customers",
            ],
            [2, 3, 5, 7, 9],
          ),
      },
      {
        id: "s3_macro",
        text: "How dependent is your demand on a specific macro condition continuing?",
        subtext:
          "Low interest rates, a bull market, remote work, a specific trend. What changes in the world would hurt you most?",
        type: "radio",
        opts: [
          "Counter-cyclical or recession-resistant",
          "Mostly stable across conditions",
          "Somewhat sensitive to macro",
          "Clearly tied to current conditions",
          "Entirely dependent on current environment",
        ],
        required: true,
        riskName: "Macro / Cycle Exposure",
        riskDesc: "Business model fragile to a macro shift or trend reversal.",
        hedge:
          "Scenario-plan for a 30% revenue drop. Build the version of your business that survives it.",
        pCalc: (v) =>
          r(
            v,
            [
              "Counter-cyclical or recession-resistant",
              "Mostly stable across conditions",
              "Somewhat sensitive to macro",
              "Clearly tied to current conditions",
              "Entirely dependent on current environment",
            ],
            [1, 2, 4, 6, 8],
          ),
        iCalc: (v) =>
          r(
            v,
            [
              "Counter-cyclical or recession-resistant",
              "Mostly stable across conditions",
              "Somewhat sensitive to macro",
              "Clearly tied to current conditions",
              "Entirely dependent on current environment",
            ],
            [2, 3, 5, 7, 9],
          ),
      },
      {
        id: "s3_ip",
        text: "If your main competitor hired your best people and copied your approach, what would stop them?",
        subtext:
          "Not what would slow them down — what would actually stop them.",
        type: "radio",
        opts: [
          "Contracts, patents, and real legal protection",
          "Strong brand and customer relationships",
          "Network effects or data advantages",
          "Honestly, not much",
          "Nothing — we're easily replicable",
        ],
        required: true,
        riskName: "Intellectual Property / Moat",
        riskDesc:
          "Insufficient competitive protection — the business can be replicated.",
        hedge:
          "Audit your IP. Assign ownership formally. Register what can be registered. Build network effects.",
        pCalc: (v) =>
          r(
            v,
            [
              "Contracts, patents, and real legal protection",
              "Strong brand and customer relationships",
              "Network effects or data advantages",
              "Honestly, not much",
              "Nothing — we're easily replicable",
            ],
            [1, 2, 3, 6, 8],
          ),
        iCalc: (v) =>
          r(
            v,
            [
              "Contracts, patents, and real legal protection",
              "Strong brand and customer relationships",
              "Network effects or data advantages",
              "Honestly, not much",
              "Nothing — we're easily replicable",
            ],
            [2, 4, 4, 7, 8],
          ),
      },
    ],
  },

  // ── SECTION 4: Operational & Financial ───────────────────────────────────────
  {
    id: "operational",
    title: "Operational & Financial Risks",
    subtitle:
      "Slow-burning threats. These rarely announce themselves — they compound quietly until they don't.",
    icon: "▣",
    questions: [
      {
        id: "s4_runway",
        text: "If revenue dropped 40% tomorrow and stayed there for 6 months, what happens?",
        subtext:
          "Not 'what would you do about it' — what actually happens to the business.",
        type: "radio",
        opts: [
          "We'd survive easily",
          "Painful but survivable with cuts",
          "We'd need emergency financing",
          "We'd probably close within 6 months",
          "We'd close within 90 days",
        ],
        required: true,
        riskName: "Revenue Shock Fragility",
        riskDesc:
          "Insufficient buffer to absorb a significant revenue disruption.",
        hedge:
          "Build 6 months of operating expenses in reserve. Arrange credit facilities before you need them.",
        pCalc: (v) =>
          r(
            v,
            [
              "We'd survive easily",
              "Painful but survivable with cuts",
              "We'd need emergency financing",
              "We'd probably close within 6 months",
              "We'd close within 90 days",
            ],
            [1, 3, 5, 7, 9],
          ),
        iCalc: (v) =>
          r(
            v,
            [
              "We'd survive easily",
              "Painful but survivable with cuts",
              "We'd need emergency financing",
              "We'd probably close within 6 months",
              "We'd close within 90 days",
            ],
            [2, 4, 6, 9, 10],
          ),
      },
      {
        id: "s4_contracts",
        text: "Do you have contracts with auto-renewal clauses you haven't reviewed in over a year?",
        subtext:
          "Vendor contracts, leases, software subscriptions, service agreements. The ones you agreed to in a hurry and never went back to.",
        type: "radio",
        opts: [
          "No — I review all contracts annually",
          "A few small ones, low exposure",
          "Yes, several — I should look at them",
          "Yes, including significant ones",
          "I genuinely don't know what I've signed",
        ],
        required: true,
        riskName: "Contract Liability",
        riskDesc:
          "Unreviewed contractual commitments creating hidden financial exposure.",
        hedge:
          "Audit all contracts this quarter. Calendar every renewal date. Kill the ones you don't need.",
        pCalc: (v) =>
          r(
            v,
            [
              "No — I review all contracts annually",
              "A few small ones, low exposure",
              "Yes, several — I should look at them",
              "Yes, including significant ones",
              "I genuinely don't know what I've signed",
            ],
            [1, 2, 5, 7, 8],
          ),
        iCalc: (v) =>
          r(
            v,
            [
              "No — I review all contracts annually",
              "A few small ones, low exposure",
              "Yes, several — I should look at them",
              "Yes, including significant ones",
              "I genuinely don't know what I've signed",
            ],
            [1, 3, 4, 6, 7],
          ),
      },
      {
        id: "s4_data",
        text: "How long would it take to recover if your primary data or systems were wiped out today?",
        subtext:
          "Ransomware, accidental deletion, a vendor shutting down with no notice. Have you actually tested your backup?",
        type: "radio",
        opts: [
          "Under 4 hours — tested recently",
          "Under a day — probably",
          "1–3 days — I think",
          "1–2 weeks — it would be bad",
          "Longer than 2 weeks, or I don't know",
        ],
        required: true,
        riskName: "Data Loss / Recovery",
        riskDesc: "Inadequate backup or disaster recovery capability.",
        hedge:
          "Automate daily off-site backups. Test recovery quarterly. Document the runbook.",
        pCalc: (v) =>
          r(
            v,
            [
              "Under 4 hours — tested recently",
              "Under a day — probably",
              "1–3 days — I think",
              "1–2 weeks — it would be bad",
              "Longer than 2 weeks, or I don't know",
            ],
            [1, 2, 4, 6, 7],
          ),
        iCalc: (v) =>
          r(
            v,
            [
              "Under 4 hours — tested recently",
              "Under a day — probably",
              "1–3 days — I think",
              "1–2 weeks — it would be bad",
              "Longer than 2 weeks, or I don't know",
            ],
            [2, 3, 5, 7, 9],
          ),
      },
      {
        id: "s4_legal",
        text: "How exposed are you to a lawsuit or IP dispute in the next 24 months?",
        subtext:
          "Even frivolous litigation costs $50–150K to defend. Could you absorb that without disrupting operations?",
        type: "radio",
        opts: [
          "Very unlikely — clean contracts, adequate coverage",
          "Low risk — some exposure but manageable",
          "Moderate — a few areas of concern",
          "High — I know the specific risk",
          "I'm already dealing with something",
        ],
        required: true,
        riskName: "Litigation Exposure",
        riskDesc: "Legal action risk without adequate protection or reserves.",
        hedge:
          "Get legal review on your top exposure. Ensure liability coverage is adequate. Document everything.",
        pCalc: (v) =>
          r(
            v,
            [
              "Very unlikely — clean contracts, adequate coverage",
              "Low risk — some exposure but manageable",
              "Moderate — a few areas of concern",
              "High — I know the specific risk",
              "I'm already dealing with something",
            ],
            [1, 3, 5, 7, 9],
          ),
        iCalc: (v) =>
          r(
            v,
            [
              "Very unlikely — clean contracts, adequate coverage",
              "Low risk — some exposure but manageable",
              "Moderate — a few areas of concern",
              "High — I know the specific risk",
              "I'm already dealing with something",
            ],
            [2, 4, 5, 7, 8],
          ),
      },
    ],
  },

  // ── SECTION 5: Blind Spot Probes ─────────────────────────────────────────────
  {
    id: "blindspots",
    title: "Blind Spot Probes",
    subtitle:
      "These are the uncomfortable ones. They're designed to surface risks you didn't know you had.",
    icon: "◈",
    questions: [
      {
        id: "s5_disagreement",
        text: "What's the thing you and your co-founder (or leadership team) disagree about most but never resolve?",
        subtext:
          "If you're a solo founder, what's the decision you keep putting off? If you don't have disagreements, that's also an answer.",
        type: "text",
        placeholder:
          "e.g. How fast to grow, whether to raise funding, a specific person on the team, pricing strategy, our exit timeline...",
        required: false,
        riskName: "Leadership Alignment Risk",
        riskDesc:
          "Unresolved strategic disagreement at the leadership level that could fracture under pressure.",
        hedge:
          "Facilitate a structured offsite to resolve the top 3 recurring disagreements. Don't let them compound.",
        pCalc: (v) => (v.trim().length > 10 ? 6 : 2),
        iCalc: (v) => (v.trim().length > 10 ? 7 : 2),
      },
      {
        id: "s5_exemployee",
        text: "What would a smart, motivated ex-employee tell your biggest competitor about you?",
        subtext:
          "Assume they left unhappy and they know things. What's the thing that would actually hurt if it got out?",
        type: "text",
        placeholder:
          "e.g. Our margins are thinner than we let on, we're losing our best engineer, our churn is higher than our metrics suggest...",
        required: false,
        riskName: "Internal Exposure / Culture Risk",
        riskDesc:
          "Information asymmetry — critical internal weaknesses visible to former employees.",
        hedge:
          "Address the thing you just wrote down. If it would hurt to leak, it's already hurting internally.",
        pCalc: (v) => (v.trim().length > 10 ? 5 : 2),
        iCalc: (v) => (v.trim().length > 10 ? 6 : 2),
      },
      {
        id: "s5_founder_out",
        text: "If you personally were out of the business for 90 days — no calls, no decisions — what breaks first?",
        subtext:
          "Be specific. Not 'things would be harder' — what specific thing breaks and in roughly how long?",
        type: "text",
        placeholder:
          "e.g. Client relationships, our sales pipeline, the technical architecture, morale, cash management...",
        required: true,
        riskName: "Founder / Operator Dependency",
        riskDesc:
          "The business can't function without the founder's direct involvement.",
        hedge:
          "Document and delegate the specific thing that breaks. This is your most urgent operational risk.",
        pCalc: (v) => (v.trim().length > 5 ? 5 : 2),
        iCalc: (v) => (v.trim().length > 5 ? 8 : 3),
      },
      {
        id: "s5_assumption",
        text: "What's the single most important assumption your business model depends on being true?",
        subtext:
          "Not a hope — an assumption. The thing that, if it turned out to be wrong, would require you to fundamentally rethink how you make money.",
        type: "text",
        placeholder:
          "e.g. That customers will pay for X, that our CAC stays under $Y, that regulation Z doesn't change, that our key technology scales...",
        required: true,
        riskName: "Core Model Assumption",
        riskDesc:
          "Critical unvalidated assumption underpinning the entire business model.",
        hedge:
          "Design a test to validate or falsify this assumption in the next 60 days. Don't let it stay unexamined.",
        pCalc: (v) => (v.trim().length > 5 ? 5 : 3),
        iCalc: (v) => (v.trim().length > 5 ? 8 : 4),
      },
    ],
  },
];

// ─── FLAT QUESTION LIST ───────────────────────────────────────────────────────

export const ALL_QUESTIONS: (Question & {
  sectionId: string;
  sectionTitle: string;
})[] = SECTIONS.flatMap((s) =>
  s.questions.map((q) => ({ ...q, sectionId: s.id, sectionTitle: s.title })),
);

// ─── ANSWERS TYPE ─────────────────────────────────────────────────────────────

export type Answers = Record<string, string>;

// ─── COMPUTE RISKS (client-side preview) ─────────────────────────────────────

export function computeRisks(answers: Answers): ComputedRisk[] {
  const scored = ALL_QUESTIONS.filter((q) => q.sectionId !== "snapshot") // snapshot is context only
    .map((q, idx) => {
      const val = answers[q.id] ?? "";
      const p = clamp(q.pCalc(val));
      const i = clamp(q.iCalc(val));
      const score = p * i;
      return {
        id: q.id,
        idx: idx + 1,
        name: q.riskName,
        desc: q.riskDesc,
        hedge: q.hedge,
        section: q.sectionTitle,
        p,
        i,
        score,
        tier: getRiskTier(p, i),
      } as ComputedRisk;
    });

  return scored.sort((a, b) => b.score - a.score);
}

// ─── HEATMAP HELPERS ──────────────────────────────────────────────────────────

export function cellColor(row: number, col: number): string {
  // row 0 = top = high impact, col 4 = right = high probability
  const highProb = col >= 3;
  const highImpact = row <= 1;
  if (highProb && highImpact) return "rgba(212,135,10,0.15)"; // watch
  if (!highProb && highImpact) return "rgba(193,40,30,0.13)"; // red zone
  if (highProb && !highImpact) return "rgba(26,74,122,0.10)"; // manage
  return "rgba(14,14,14,0.025)"; // ignore
}

export function toGridCell(val: number): number {
  return Math.min(4, Math.floor((val - 1) / 2));
}

export function toImpactRow(impact: number): number {
  return 4 - toGridCell(impact);
}

// ─── MISC ─────────────────────────────────────────────────────────────────────

export const TOTAL_QUESTIONS = ALL_QUESTIONS.length;
export const ESTIMATED_MINUTES = 12;

// ─── COMPATIBILITY EXPORTS ────────────────────────────────────────────────────
// These exports align components that were written against an earlier API.

/** Tier aliases used by some components */
export type RiskTierAlias = "critical" | "serious" | "monitor" | "low";

/** Map old tier names → current tier names */
export function normalizeTier(t: string): RiskTier {
  const map: Record<string, RiskTier> = {
    critical: "watch",
    serious: "red",
    monitor: "manage",
    low: "ignore",
  };
  return (map[t] as RiskTier) ?? (t as RiskTier);
}

export const INDUSTRIES = [
  "SaaS / Software",
  "E-commerce",
  "Professional Services",
  "Retail / F&B",
  "Manufacturing",
  "Healthcare",
  "Media / Creative",
  "Construction / Trades",
  "Other",
] as const;

export const STAGES = [
  "Pre-revenue",
  "Early (< $1M ARR)",
  "Growth ($1M–$10M ARR)",
  "Scale ($10M+ ARR)",
  "Profitable / Stable",
] as const;

export const STEPS = ["Context", "Questions", "Heat Map", "Report"] as const;

/**
 * QUESTIONS — the non-snapshot questions, with extra fields expected by
 * QuestionCard / QuestionsStep (category, hint, type normalised to
 * "radio" | "slider").  Slider questions are emitted as radio here
 * since the underlying data is all radio/text.
 */
export interface QuestionCompat {
  id: string;
  text: string;
  hint: string;
  category: string;
  type: "radio" | "slider" | "text";
  opts?: string[];
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  placeholder?: string;
  required: boolean;
  riskName: string;
  riskDesc: string;
  hedge: string;
  pCalc: (v: string) => number;
  iCalc: (v: string) => number;
}

export const QUESTIONS: QuestionCompat[] = ALL_QUESTIONS.filter(
  (q) => q.sectionId !== "snapshot",
).map((q) => {
  const section = SECTIONS.find((s) => s.id === q.sectionId);
  return {
    ...q,
    category: section?.title ?? q.sectionId,
    hint: q.subtext ?? "",
    type: q.type === "select" ? "radio" : q.type,
  } as QuestionCompat;
});
