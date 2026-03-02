"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SECTIONS, ALL_QUESTIONS, Answers, TOTAL_QUESTIONS } from "@/lib/risks";
import { ProgressBar } from "@/components/assessment/ProgressBar";
import { SectionHeader } from "@/components/assessment/SectionHeader";
import { RadioOptions } from "@/components/assessment/RadioOptions";
import { TextInput } from "@/components/assessment/TextInput";
import { NavButtons } from "@/components/assessment/NavButtons";

const ESTIMATED_MINUTES = 12;

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
    (val: string) => setAnswers((prev) => ({ ...prev, [question.id]: val })),
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

        <NavButtons
          globalIdx={globalIdx}
          isLastQ={isLastQ}
          canAdvance={canAdvance}
          isOptionalEmpty={!question.required && currentAnswer === ""}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </main>
    </div>
  );
}
