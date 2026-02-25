// config/questions.ts

import type { Section } from "@/types/assessment";

export const SECTIONS: Section[] = [
  {
    id: "snapshot",
    index: 1,
    title: "Business Snapshot",
    subtitle:
      "Context only — not scored. Helps calibrate what 'existential' means for your specific business.",
    label: "Snapshot",
    scored: false,
    questions: [
      {
        id: "snap_01",
        sectionId: "snapshot",
        text: "What industry are you in?",
        subtext:
          "Be specific. 'Tech' is not an industry. 'B2B SaaS for logistics companies' is.",
        type: "text",
        placeholder:
          "e.g. B2B SaaS for logistics, independent restaurant group, boutique law firm...",
        required: true,
      },
      {
        id: "snap_02",
        sectionId: "snapshot",
        text: "What's your annual revenue range?",
        type: "select",
        options: [
          { value: "pre_revenue", label: "Pre-revenue" },
          { value: "under_250k", label: "Under $250K" },
          { value: "250k_1m", label: "$250K – $1M" },
          { value: "1m_5m", label: "$1M – $5M" },
          { value: "5m_20m", label: "$5M – $20M" },
          { value: "over_20m", label: "Over $20M" },
        ],
        required: true,
      },
      {
        id: "snap_03",
        sectionId: "snapshot",
        text: "How many full-time people are on your team (including yourself)?",
        type: "select",
        options: [
          { value: "solo", label: "Just me" },
          { value: "2_5", label: "2–5" },
          { value: "6_15", label: "6–15" },
          { value: "16_50", label: "16–50" },
          { value: "over_50", label: "50+" },
        ],
        required: true,
      },
      {
        id: "snap_04",
        sectionId: "snapshot",
        text: "How old is the business?",
        type: "select",
        options: [
          { value: "under_1yr", label: "Less than 1 year" },
          { value: "1_3yr", label: "1–3 years" },
          { value: "3_7yr", label: "3–7 years" },
          { value: "over_7yr", label: "7+ years" },
        ],
        required: true,
      },
    ],
  },

  {
    id: "dependency",
    index: 2,
    title: "Dependency Risks",
    subtitle:
      "Concentration risk is where most businesses are quietly fragile. These questions surface it.",
    label: "Dependencies",
    scored: true,
    questions: [
      {
        id: "dep_01",
        sectionId: "dependency",
        text: "Name the one supplier, tool, or platform that if it disappeared tomorrow would take you more than 3 months to replace.",
        subtext:
          "Think: payment processor, key software, raw material source, cloud provider, API you depend on.",
        type: "textarea",
        placeholder: "Be specific. Name the actual company or tool.",
        required: true,
      },
      {
        id: "dep_02",
        sectionId: "dependency",
        text: "What percentage of your revenue comes from your top 3 customers combined?",
        type: "select",
        options: [
          { value: "under_20", label: "Under 20%" },
          { value: "20_40", label: "20–40%" },
          { value: "40_60", label: "40–60%" },
          { value: "60_80", label: "60–80%" },
          { value: "over_80", label: "Over 80%" },
        ],
        required: true,
      },
      {
        id: "dep_03",
        sectionId: "dependency",
        text: "Is there a single person on your team whose departure would seriously damage the business — not just inconvenience it?",
        subtext: "This includes you. It especially includes you.",
        type: "select",
        options: [
          { value: "yes_me", label: "Yes — me specifically" },
          {
            value: "yes_employee",
            label: "Yes — a specific employee or co-founder",
          },
          { value: "yes_both", label: "Yes — multiple people including me" },
          { value: "no", label: "No, we're well distributed" },
        ],
        required: true,
      },
      {
        id: "dep_04",
        sectionId: "dependency",
        text: "If your top customer called tomorrow to cancel, what happens to your business?",
        type: "select",
        options: [
          { value: "fine", label: "We'd barely notice" },
          { value: "painful", label: "Painful but survivable — we'd adjust" },
          { value: "crisis", label: "Crisis mode — hard cuts immediately" },
          { value: "fatal", label: "It would likely end the business" },
        ],
        required: true,
      },
      {
        id: "dep_05",
        sectionId: "dependency",
        text: "How much of your business depends on a single distribution channel you don't control?",
        subtext:
          "Think: an app store, Amazon, Google search traffic, one social platform, a reseller.",
        type: "select",
        options: [
          { value: "none", label: "Not applicable to our model" },
          { value: "minor", label: "Less than 20% of revenue" },
          { value: "significant", label: "20–50% of revenue" },
          { value: "majority", label: "More than 50% of revenue" },
        ],
        required: true,
      },
    ],
  },

  {
    id: "market",
    index: 3,
    title: "Market & Competitive Risks",
    subtitle:
      "Strategic vulnerabilities that build slowly and arrive suddenly.",
    label: "Market",
    scored: true,
    questions: [
      {
        id: "mkt_01",
        sectionId: "market",
        text: "Is there a regulatory change in your industry that you're aware of but haven't fully planned for?",
        subtext: "Honesty matters here. This is not a compliance audit.",
        type: "select",
        options: [
          { value: "no_aware", label: "No — we're ahead of it" },
          { value: "aware_planned", label: "Yes, and we have a concrete plan" },
          {
            value: "aware_unplanned",
            label: "Yes, and we don't have a real plan yet",
          },
          {
            value: "not_sure",
            label: "I'm not sure what's coming in our industry",
          },
        ],
        required: true,
      },
      {
        id: "mkt_02",
        sectionId: "market",
        text: "Could a well-funded competitor offer your core product for free — and survive doing it?",
        subtext:
          "Think: VC-backed startup, big tech adjacent move, private equity roll-up.",
        type: "select",
        options: [
          { value: "no_moat", label: "No — we have a real defensible moat" },
          { value: "unlikely", label: "Unlikely — very hard to replicate us" },
          {
            value: "possible",
            label: "Possibly — a funded competitor could run at it",
          },
          { value: "yes_vulnerable", label: "Yes — and I think about this" },
        ],
        required: true,
      },
      {
        id: "mkt_03",
        sectionId: "market",
        text: "How long would it take a smart, well-resourced competitor to build a good-enough version of your core offering?",
        type: "select",
        options: [
          { value: "years", label: "Years — genuinely hard to replicate" },
          { value: "12_18mo", label: "12–18 months" },
          { value: "6_12mo", label: "6–12 months" },
          { value: "under_6mo", label: "Under 6 months" },
        ],
        required: true,
      },
      {
        id: "mkt_04",
        sectionId: "market",
        text: "If your market shrinks 30% in the next 2 years, what happens to your business model?",
        type: "select",
        options: [
          {
            value: "fine",
            label: "Fine — we can grow share in a smaller market",
          },
          {
            value: "painful",
            label: "Painful but survivable with restructuring",
          },
          { value: "broken", label: "Our model breaks — it depends on growth" },
          {
            value: "not_applicable",
            label: "Not applicable to our market dynamics",
          },
        ],
        required: true,
      },
    ],
  },

  {
    id: "operational",
    index: 4,
    title: "Operational & Financial Risks",
    subtitle: "Slow-burning threats that don't feel urgent until they are.",
    label: "Operations",
    scored: true,
    questions: [
      {
        id: "ops_01",
        sectionId: "operational",
        text: "How many months of operating expenses can you cover if revenue dropped 40% tomorrow?",
        subtext: "Include any existing credit lines or committed funding.",
        type: "select",
        options: [
          { value: "under_1mo", label: "Less than 1 month" },
          { value: "1_3mo", label: "1–3 months" },
          { value: "3_6mo", label: "3–6 months" },
          { value: "6_12mo", label: "6–12 months" },
          { value: "over_12mo", label: "More than 12 months" },
        ],
        required: true,
      },
      {
        id: "ops_02",
        sectionId: "operational",
        text: "Do you have any contracts with auto-renewal clauses you haven't reviewed in over a year?",
        type: "select",
        options: [
          { value: "no", label: "No — we review all contracts regularly" },
          { value: "maybe", label: "Possibly — I'd have to check" },
          { value: "yes_minor", label: "Yes — but they're minor" },
          {
            value: "yes_significant",
            label: "Yes — and some are significant commitments",
          },
        ],
        required: true,
      },
      {
        id: "ops_03",
        sectionId: "operational",
        text: "Do your 3 most critical operations have documented processes — or do they live in someone's head?",
        type: "select",
        options: [
          { value: "documented", label: "Yes — fully documented and tested" },
          { value: "partial", label: "Partially documented" },
          { value: "heads", label: "Mostly in people's heads" },
          { value: "my_head", label: "In my head specifically" },
        ],
        required: true,
      },
      {
        id: "ops_04",
        sectionId: "operational",
        text: "What would a complete data loss event cost you to recover from?",
        type: "select",
        options: [
          { value: "days", label: "Days — solid backups and a recovery plan" },
          { value: "weeks", label: "Weeks — painful but recoverable" },
          { value: "months", label: "Months — seriously harm the business" },
          { value: "fatal", label: "We would not recover" },
          {
            value: "not_applicable",
            label: "Not applicable — not data-dependent",
          },
        ],
        required: true,
      },
      {
        id: "ops_05",
        sectionId: "operational",
        text: "Any unresolved legal exposure — IP disputes, employment claims, contractor misclassification?",
        type: "select",
        options: [
          { value: "none", label: "None that I'm aware of" },
          { value: "minor", label: "Minor issues being managed" },
          {
            value: "significant",
            label: "Significant — actively working on resolution",
          },
          { value: "unknown", label: "Honestly, I'm not sure" },
        ],
        required: true,
      },
    ],
  },

  {
    id: "blindspot",
    index: 5,
    title: "Blind Spot Probes",
    subtitle:
      "The uncomfortable ones. Designed to surface risks you didn't know you had.",
    label: "Blind Spots",
    scored: true,
    questions: [
      {
        id: "blind_01",
        sectionId: "blindspot",
        text: "What's the thing you and your co-founder (or leadership team) disagree about most — but never fully resolve?",
        subtext:
          "Solo founder? Answer for yourself: what strategic question do you keep avoiding?",
        type: "textarea",
        placeholder: "There's always something. What is it?",
        required: true,
      },
      {
        id: "blind_02",
        sectionId: "blindspot",
        text: "What would a smart, motivated ex-employee tell your biggest competitor about you?",
        subtext:
          "The person who left on decent terms but was frustrated. What did they know?",
        type: "textarea",
        placeholder: "Be honest. This one only hurts if it's true.",
        required: true,
      },
      {
        id: "blind_03",
        sectionId: "blindspot",
        text: "If you had to bet your own money: what's the most likely thing that derails your business in the next 3 years?",
        subtext: "Not the official answer. The real one.",
        type: "textarea",
        placeholder: "What do you actually think?",
        required: true,
      },
      {
        id: "blind_04",
        sectionId: "blindspot",
        text: "What assumption is your entire business model built on — that you've never actually tested?",
        type: "textarea",
        placeholder: "The thing you've been taking for granted.",
        required: true,
      },
      {
        id: "blind_05",
        sectionId: "blindspot",
        text: "Is there a risk you haven't mentioned yet — something that keeps you up at night but feels too sensitive to put in a formal assessment?",
        subtext: "This is anonymous. Say it.",
        type: "textarea",
        placeholder: "Optional, but often the most important one.",
        required: false,
      },
    ],
  },
];

export const ALL_QUESTIONS = SECTIONS.flatMap((s) => s.questions);
export const TOTAL_QUESTIONS = ALL_QUESTIONS.length;
