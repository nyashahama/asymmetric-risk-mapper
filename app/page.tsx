"use client";
import Link from "next/link";
import { TOTAL_QUESTIONS, ESTIMATED_MINUTES } from "@/lib/risks";

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote:
      "Found a key-person risk I'd been ignoring for two years. Fixed it in 30 days.",
    name: "Sara M.",
    role: "Founder, $2M ARR SaaS",
  },
  {
    quote: "The blind spot questions made me uncomfortable. That's the point.",
    name: "James T.",
    role: "CEO, Professional Services",
  },
  {
    quote:
      "Worth 10x what we paid. Identified a customer concentration issue before it became a crisis.",
    name: "Priya K.",
    role: "Co-founder, E-commerce",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Answer ~20 questions",
    desc: `${ESTIMATED_MINUTES} minutes. No account required. The questions are deliberately uncomfortable — that's where the value is.`,
  },
  {
    step: "02",
    title: "We score your risks",
    desc: "Every answer feeds a risk model. We separate what's existential from what's merely annoying. You don't rate your own risks — humans are bad at it.",
  },
  {
    step: "03",
    title: "Get your report",
    desc: "A heat map, prioritised risk register, and specific hedge actions. Plus: what to do in the next 30 days on your two biggest risks.",
  },
];

const RISK_EXAMPLES = [
  {
    tier: "Red Zone",
    color: "#c1281e",
    desc: "Low probability, but if it happens — you're done.",
    example: "Your sole supplier exits the market",
  },
  {
    tier: "Watch List",
    color: "#d4870a",
    desc: "Probably will happen. And it'll hurt badly.",
    example: "60% of revenue from 2 customers",
  },
  {
    tier: "Manage It",
    color: "#1a4a7a",
    desc: "Likely. But you'll survive it.",
    example: "A key hire leaves without documentation",
  },
  {
    tier: "Ignore For Now",
    color: "rgba(14,14,14,0.4)",
    desc: "Low odds, low damage. Not worth your time.",
    example: "Minor regulatory paperwork risk",
  },
];

export default function LandingPage() {
  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* ── NAV ── */}
      <nav
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "24px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--ink)",
          }}
        >
          <span style={{ color: "var(--red)" }}>▲</span> Risk Mapper
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "rgba(14,14,14,0.4)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            $59 · One-time
          </span>
          <Link
            href="/assessment"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "9px 20px",
              background: "var(--ink)",
              color: "var(--paper)",
              textDecoration: "none",
              borderRadius: 2,
            }}
          >
            Start Free →
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px 96px" }}
      >
        <div style={{ maxWidth: 760 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--red)",
              marginBottom: 20,
            }}
          >
            Risk Intelligence for Small Business
          </div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              lineHeight: 1.02,
              fontWeight: 400,
              marginBottom: 28,
            }}
          >
            Most businesses stress about the wrong risks.
            <br />
            <em style={{ color: "var(--red)" }}>
              This one finds the right ones.
            </em>
          </h1>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.7,
              color: "rgba(14,14,14,0.65)",
              maxWidth: 580,
              marginBottom: 40,
            }}
          >
            Answer {TOTAL_QUESTIONS} questions. Get a risk heat map that
            separates what could actually end your business from the things that
            are merely annoying. Then hedge only what matters.
          </p>
          <div
            style={{
              display: "flex",
              gap: 14,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/assessment"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "14px 32px",
                background: "var(--ink)",
                color: "var(--paper)",
                textDecoration: "none",
                borderRadius: 2,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "4px 4px 0 rgba(14,14,14,0.15)",
              }}
            >
              Start the Assessment — Free →
            </Link>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "rgba(14,14,14,0.4)",
              }}
            >
              ~{ESTIMATED_MINUTES} min · No account needed · $59 to unlock
              report
            </span>
          </div>
        </div>

        {/* ── Preview card mockup ── */}
        <div
          style={{
            marginTop: 72,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: 8,
            maxWidth: 600,
          }}
        >
          {RISK_EXAMPLES.map((ex) => (
            <div
              key={ex.tier}
              style={{
                background: "white",
                border: "1.5px solid rgba(14,14,14,0.1)",
                borderRadius: 2,
                padding: "14px 12px",
                borderTop: `3px solid ${ex.color}`,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 8,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: ex.color,
                  marginBottom: 6,
                }}
              >
                {ex.tier}
              </div>
              <div
                style={{
                  fontSize: 11,
                  lineHeight: 1.4,
                  color: "rgba(14,14,14,0.6)",
                  marginBottom: 8,
                }}
              >
                {ex.desc}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: "rgba(14,14,14,0.35)",
                  fontStyle: "italic",
                }}
              >
                {ex.example}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        style={{
          background: "var(--ink)",
          color: "var(--paper)",
          padding: "80px 32px",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(244,240,232,0.4)",
              marginBottom: 12,
            }}
          >
            How It Works
          </div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)",
              fontWeight: 400,
              marginBottom: 60,
            }}
          >
            Built for operators who are tired of generic advice.
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 40,
            }}
          >
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step}>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 28,
                    fontWeight: 700,
                    color: "rgba(244,240,232,0.12)",
                    marginBottom: 12,
                    lineHeight: 1,
                  }}
                >
                  {item.step}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.3rem",
                    fontWeight: 400,
                    marginBottom: 10,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.7,
                    color: "rgba(244,240,232,0.55)",
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE FOUR BUCKETS ── */}
      <section
        style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px" }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(14,14,14,0.4)",
            marginBottom: 12,
          }}
        >
          The Framework
        </div>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
            fontWeight: 400,
            marginBottom: 16,
            maxWidth: 600,
          }}
        >
          Four buckets. Most people have never sorted their risks into them.
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "rgba(14,14,14,0.55)",
            marginBottom: 48,
            maxWidth: 560,
            lineHeight: 1.7,
          }}
        >
          We don't ask you to rate your own risks — you'll systematically
          underestimate what's existential and overestimate what's merely
          annoying. The model does the scoring.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {RISK_EXAMPLES.map((ex) => (
            <div
              key={ex.tier}
              style={{
                padding: "24px 20px",
                background: "white",
                border: `1.5px solid rgba(14,14,14,0.1)`,
                borderLeft: `4px solid ${ex.color}`,
                borderRadius: "0 2px 2px 0",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: ex.color,
                  marginBottom: 10,
                }}
              >
                {ex.tier}
              </div>
              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.55,
                  color: "rgba(14,14,14,0.7)",
                  marginBottom: 12,
                }}
              >
                {ex.desc}
              </p>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "rgba(14,14,14,0.35)",
                  paddingTop: 12,
                  borderTop: "1px solid rgba(14,14,14,0.08)",
                }}
              >
                e.g. {ex.example}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section
        style={{
          background: "var(--paper-dark)",
          padding: "72px 32px",
          borderTop: "1px solid rgba(14,14,14,0.08)",
          borderBottom: "1px solid rgba(14,14,14,0.08)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  padding: "24px",
                  border: "1.5px solid rgba(14,14,14,0.1)",
                  borderRadius: 2,
                }}
              >
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.65,
                    fontStyle: "italic",
                    marginBottom: 16,
                    color: "rgba(14,14,14,0.75)",
                  }}
                >
                  "{t.quote}"
                </p>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "rgba(14,14,14,0.4)",
                  }}
                >
                  <span style={{ fontWeight: 700, color: "var(--ink)" }}>
                    {t.name}
                  </span>{" "}
                  · {t.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section
        style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "start",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(14,14,14,0.4)",
                marginBottom: 12,
              }}
            >
              Pricing
            </div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)",
                fontWeight: 400,
                marginBottom: 16,
              }}
            >
              $59. One report.
              <br />
              No subscription.
            </h2>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: "rgba(14,14,14,0.55)",
                marginBottom: 32,
              }}
            >
              You do the assessment for free. You only pay if you want the full
              report — after you've already seen the heat map preview and
              decided it's worth it.
            </p>
            <Link
              href="/assessment"
              style={{
                display: "inline-flex",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "13px 28px",
                background: "var(--ink)",
                color: "var(--paper)",
                textDecoration: "none",
                borderRadius: 2,
                boxShadow: "4px 4px 0 rgba(14,14,14,0.15)",
              }}
            >
              Start the Assessment — Free →
            </Link>
          </div>
          <div
            style={{
              background: "white",
              border: "2px solid var(--ink)",
              padding: 32,
              boxShadow: "5px 5px 0 var(--ink)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(14,14,14,0.4)",
                marginBottom: 16,
              }}
            >
              What you get
            </div>
            {[
              "Risk heat map (probability × impact)",
              "4-bucket risk classification for every risk",
              "Specific hedge action for each risk",
              "Executive summary written plainly",
              "30-day action plan for top 2 risks",
              "PDF download + email delivery",
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  gap: 10,
                  marginBottom: 12,
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    color: "var(--green)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  ✓
                </span>
                <span style={{ fontSize: 13, lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
            <div
              style={{
                marginTop: 24,
                paddingTop: 20,
                borderTop: "1.5px solid rgba(14,14,14,0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "rgba(14,14,14,0.4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                One-time
              </span>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "2.2rem",
                  fontWeight: 400,
                }}
              >
                $59
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: "1.5px solid rgba(14,14,14,0.1)",
          padding: "32px 32px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "rgba(14,14,14,0.35)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            <span style={{ color: "var(--red)" }}>▲</span> Risk Mapper · Built
            for operators
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "rgba(14,14,14,0.35)",
            }}
          >
            Questions? hello@riskmapper.co
          </div>
        </div>
      </footer>
    </div>
  );
}
