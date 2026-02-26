"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SECTIONS, ALL_QUESTIONS, Answers, TOTAL_QUESTIONS } from "@/lib/risks";
import Link from "next/link";

const ESTIMATED_MINUTES = 12;

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ marginBottom: 40 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: "rgba(14,14,14,0.35)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Question {current} of {total}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: "rgba(14,14,14,0.35)",
          }}
        >
          {pct}%
        </span>
      </div>
      <div style={{ height: 2, background: "rgba(14,14,14,0.08)" }}>
        <div
          style={{
            height: "100%",
            background: "var(--ink)",
            width: `${pct}%`,
            transition: "width 0.4s cubic-bezier(.16,1,.3,1)",
          }}
        />
      </div>
    </div>
  );
}

function SectionHeader({
  sectionIdx,
  title,
  icon,
  subtitle,
}: {
  sectionIdx: number;
  title: string;
  icon: string;
  subtitle: string;
}) {
  return (
    <div className="fade-up" style={{ marginBottom: 32 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 2,
            background: "var(--ink)",
            color: "var(--paper)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 14,
          }}
        >
          {icon}
        </div>
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(14,14,14,0.35)",
              marginBottom: 2,
            }}
          >
            Section {sectionIdx + 1} of {SECTIONS.length}
          </div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem" }}>
            {title}
          </div>
        </div>
      </div>
      <p
        style={{
          fontSize: 13,
          color: "rgba(14,14,14,0.5)",
          lineHeight: 1.65,
          paddingBottom: 24,
          borderBottom: "1px solid rgba(14,14,14,0.08)",
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}

function RadioOptions({
  opts,
  value,
  onChange,
}: {
  opts: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {opts.map((opt) => {
        const sel = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              textAlign: "left",
              padding: "13px 16px",
              border: `1.5px solid ${sel ? "var(--ink)" : "rgba(14,14,14,0.14)"}`,
              borderRadius: 2,
              background: sel ? "var(--ink)" : "white",
              color: sel ? "var(--paper)" : "var(--ink)",
              fontSize: 14,
              cursor: "pointer",
              transition: "all 0.12s",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                flexShrink: 0,
                border: `1.5px solid ${sel ? "var(--paper)" : "rgba(14,14,14,0.25)"}`,
                background: sel ? "var(--paper)" : "transparent",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.12s",
              }}
            >
              {sel && (
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "var(--ink)",
                    display: "block",
                  }}
                />
              )}
            </span>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? "Your answer..."}
      rows={4}
      style={{
        width: "100%",
        padding: "14px 16px",
        border: "1.5px solid rgba(14,14,14,0.14)",
        borderRadius: 2,
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        lineHeight: 1.6,
        background: "white",
        color: "var(--ink)",
        resize: "vertical",
        outline: "none",
        transition: "border-color 0.15s",
        boxSizing: "border-box",
      }}
      onFocus={(e) => (e.target.style.borderColor = "var(--ink)")}
      onBlur={(e) => (e.target.style.borderColor = "rgba(14,14,14,0.14)")}
    />
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function AssessmentPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>({});
  const [globalIdx, setGlobalIdx] = useState(0);

  const question = ALL_QUESTIONS[globalIdx];
  const currentAnswer = answers[question?.id] ?? "";

  const sectionIdx = SECTIONS.findIndex((s) => s.id === question?.sectionId);
  const section = SECTIONS[sectionIdx];

  const prevSectionIdx =
    globalIdx > 0
      ? SECTIONS.findIndex(
          (s) => s.id === ALL_QUESTIONS[globalIdx - 1]?.sectionId,
        )
      : -1;
  const isSectionStart = sectionIdx !== prevSectionIdx;

  const isLastQ = globalIdx === ALL_QUESTIONS.length - 1;
  const canAdvance = !question?.required || currentAnswer.trim().length > 0;

  const handleAnswer = useCallback(
    (val: string) => {
      setAnswers((prev) => ({ ...prev, [question.id]: val }));
    },
    [question?.id],
  );

  const handleNext = () => {
    if (isLastQ) {
      sessionStorage.setItem("rm_answers", JSON.stringify(answers));
      router.push("/preview");
    } else {
      setGlobalIdx((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (globalIdx > 0) setGlobalIdx((i) => i - 1);
  };

  if (!question) return null;

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
      {/* Header */}
      <header
        style={{
          borderBottom: "1.5px solid rgba(14,14,14,0.1)",
          padding: "16px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--ink)",
            textDecoration: "none",
          }}
        >
          <span style={{ color: "var(--red)" }}>▲</span> Risk Mapper
        </Link>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "rgba(14,14,14,0.35)",
          }}
        >
          ~{ESTIMATED_MINUTES} min · No account needed
        </span>
      </header>

      {/* Section sidebar strip */}
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background:
            "linear-gradient(to bottom, var(--ink), rgba(14,14,14,0.15))",
        }}
      />

      <main
        style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 100px" }}
      >
        <ProgressBar current={globalIdx + 1} total={TOTAL_QUESTIONS} />

        {/* Section header — only on first Q of each section */}
        {isSectionStart && section && (
          <SectionHeader
            key={`sh-${sectionIdx}`}
            sectionIdx={sectionIdx}
            title={section.title}
            icon={section.icon}
            subtitle={section.subtitle}
          />
        )}

        {/* Question card */}
        <div className="fade-up" key={question.id}>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.3rem, 2.5vw, 1.75rem)",
              fontWeight: 400,
              lineHeight: 1.35,
              marginBottom: question.subtext ? 10 : 28,
            }}
          >
            {question.text}
          </h2>

          {question.subtext && (
            <p
              style={{
                fontSize: 13,
                color: "rgba(14,14,14,0.5)",
                lineHeight: 1.65,
                marginBottom: 28,
                fontStyle: "italic",
              }}
            >
              {question.subtext}
            </p>
          )}

          {(question.type === "radio" || question.type === "select") &&
            question.opts && (
              <RadioOptions
                opts={question.opts}
                value={currentAnswer}
                onChange={handleAnswer}
              />
            )}

          {question.type === "text" && (
            <TextInput
              value={currentAnswer}
              onChange={handleAnswer}
              placeholder={question.placeholder}
            />
          )}

          {!question.required && (
            <div
              style={{
                marginTop: 10,
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "rgba(14,14,14,0.28)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Optional — skip if you prefer
            </div>
          )}
        </div>

        {/* Nav */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 48,
            paddingTop: 24,
            borderTop: "1px solid rgba(14,14,14,0.08)",
          }}
        >
          <button
            onClick={handlePrev}
            disabled={globalIdx === 0}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color:
                globalIdx === 0 ? "rgba(14,14,14,0.18)" : "rgba(14,14,14,0.4)",
              background: "none",
              border: "none",
              cursor: globalIdx === 0 ? "default" : "pointer",
              padding: 0,
            }}
          >
            ← Back
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {!question.required && currentAnswer === "" && (
              <button
                onClick={handleNext}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(14,14,14,0.38)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Skip
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canAdvance}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "12px 28px",
                border: `1.5px solid ${canAdvance ? "var(--ink)" : "rgba(14,14,14,0.12)"}`,
                borderRadius: 2,
                background: canAdvance ? "var(--ink)" : "rgba(14,14,14,0.05)",
                color: canAdvance ? "var(--paper)" : "rgba(14,14,14,0.22)",
                cursor: canAdvance ? "pointer" : "not-allowed",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!canAdvance) return;
                (e.currentTarget as HTMLButtonElement).style.background =
                  "var(--red)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "var(--red)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  canAdvance ? "var(--ink)" : "rgba(14,14,14,0.05)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  canAdvance ? "var(--ink)" : "rgba(14,14,14,0.12)";
              }}
            >
              {isLastQ ? "See My Results →" : "Continue →"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
