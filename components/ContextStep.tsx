"use client";

import { INDUSTRIES, STAGES } from "@/lib/risks";

export interface BusinessContext {
  bizName: string;
  industry: string;
  stage: string;
}

interface ContextStepProps {
  context: BusinessContext;
  onChange: (ctx: BusinessContext) => void;
  onNext: () => void;
}

const SECTION_LABEL_STYLE = {
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.18em",
  textTransform: "uppercase" as const,
  color: "rgba(14,14,14,0.4)",
  marginBottom: 4,
};

const CARD_STYLE = {
  background: "white",
  border: "1.5px solid rgba(14,14,14,0.12)",
  borderRadius: 2,
  padding: 24,
  marginBottom: 16,
};

const TAG_STYLE = {
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.15em",
  textTransform: "uppercase" as const,
  color: "rgba(14,14,14,0.35)",
  marginBottom: 8,
};

const QUESTION_STYLE = {
  fontSize: 15,
  fontWeight: 500,
  lineHeight: 1.5,
  marginBottom: 4,
};

const HINT_STYLE = {
  fontSize: 12,
  color: "rgba(14,14,14,0.5)",
  fontStyle: "italic",
  marginBottom: 16,
  lineHeight: 1.55,
};

export function ContextStep({ context, onChange, onNext }: ContextStepProps) {
  const set = (key: keyof BusinessContext) => (val: string) =>
    onChange({ ...context, [key]: val });

  return (
    <div>
      <div style={SECTION_LABEL_STYLE}>Step 1 of 4</div>
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
          fontWeight: 400,
          marginBottom: 8,
        }}
      >
        Tell us about your business
      </h2>
      <p
        style={{
          fontSize: 13,
          color: "rgba(14,14,14,0.6)",
          lineHeight: 1.65,
          maxWidth: 560,
          marginBottom: 32,
        }}
      >
        We&apos;ll use this context to calibrate risk severity. No data is
        stored anywhere.
      </p>

      {/* Business name */}
      <div className="fade-up" style={CARD_STYLE}>
        <div style={TAG_STYLE}>Business Name</div>
        <p style={QUESTION_STYLE}>What&apos;s your business called?</p>
        <p style={HINT_STYLE}>Or just a code name if you prefer privacy.</p>
        <input
          type="text"
          value={context.bizName}
          onChange={(e) => set("bizName")(e.target.value)}
          placeholder="e.g. Acme Co."
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1.5px solid rgba(14,14,14,0.15)",
            borderRadius: 2,
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            background: "transparent",
            color: "var(--ink)",
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--ink)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(14,14,14,0.15)")}
        />
      </div>

      {/* Industry */}
      <div className="fade-up-1" style={CARD_STYLE}>
        <div style={TAG_STYLE}>Industry</div>
        <p style={QUESTION_STYLE}>What industry or sector?</p>
        <p style={HINT_STYLE}>Broad strokes is fine.</p>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((opt) => (
            <button
              key={opt}
              onClick={() => set("industry")(opt)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                padding: "7px 14px",
                border: "1.5px solid",
                borderColor:
                  context.industry === opt
                    ? "var(--ink)"
                    : "rgba(14,14,14,0.18)",
                borderRadius: 2,
                background:
                  context.industry === opt ? "var(--ink)" : "transparent",
                color: context.industry === opt ? "var(--paper)" : "var(--ink)",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Stage */}
      <div className="fade-up-2" style={CARD_STYLE}>
        <div style={TAG_STYLE}>Stage</div>
        <p style={QUESTION_STYLE}>Where are you in the journey?</p>
        <p style={HINT_STYLE}>This affects which risks matter most.</p>
        <div className="flex flex-wrap gap-2">
          {STAGES.map((opt) => (
            <button
              key={opt}
              onClick={() => set("stage")(opt)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                padding: "7px 14px",
                border: "1.5px solid",
                borderColor:
                  context.stage === opt ? "var(--ink)" : "rgba(14,14,14,0.18)",
                borderRadius: 2,
                background:
                  context.stage === opt ? "var(--ink)" : "transparent",
                color: context.stage === opt ? "var(--paper)" : "var(--ink)",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex items-center gap-3 mt-8">
        <button
          onClick={onNext}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "12px 28px",
            border: "1.5px solid var(--ink)",
            borderRadius: 2,
            background: "var(--ink)",
            color: "var(--paper)",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--red)";
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "var(--red)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--ink)";
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "var(--ink)";
          }}
        >
          Begin Risk Assessment →
        </button>
      </div>
    </div>
  );
}
