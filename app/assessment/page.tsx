"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGetQuestions } from "@/hooks/useGetQuestions";
import { useUpsertAnswers } from "@/hooks/useUpsertAnswers";
import { sessionsService } from "@/api/services/sessionsService";
import { Question } from "@/api/services/questionsService";
import { ProgressBar } from "@/components/assessment/ProgressBar";
import { SectionHeader } from "@/components/assessment/SectionHeader";
import { RadioOptions } from "@/components/assessment/RadioOptions";
import { TextInput } from "@/components/assessment/TextInput";
import { NavButtons } from "@/components/assessment/NavButtons";

const ESTIMATED_MINUTES = 12;

// ─── Section metadata ─────────────────────────────────────────────────────────
const SECTION_META: Record<string, { icon: string; subtitle: string }> = {
  snapshot: {
    icon: "◎",
    subtitle:
      "Context so we can calibrate what 'existential' actually means for you.",
  },
  dependency: {
    icon: "⬡",
    subtitle:
      "These questions surface concentration risk — the things that could vanish and take you with them.",
  },
  market: {
    icon: "△",
    subtitle:
      "Strategic vulnerabilities — the things that could make your business model obsolete.",
  },
  operational: {
    icon: "▣",
    subtitle:
      "Slow-burning threats. These rarely announce themselves — they compound quietly until they don't.",
  },
  blindspots: {
    icon: "◈",
    subtitle:
      "These are the uncomfortable ones. They're designed to surface risks you didn't know you had.",
  },
};

export default function AssessmentPage() {
  const router = useRouter();

  // ── Session identity ────────────────────────────────────────────────────────
  const [sessionID, setSessionID] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        let id = localStorage.getItem("session_id");

        if (!id) {
          // No session created yet (user navigated directly) — create one now
          const { session_id, anon_token } =
            await sessionsService.createSession({});
          localStorage.setItem("session_id", session_id);
          localStorage.setItem("anon_token", anon_token);
          id = session_id;
        }

        setSessionID(id);
      } catch (err) {
        console.error("Failed to initialise session:", err);
        setSessionError(true);
      }
    };

    init();
  }, []);

  // ── Data fetching ───────────────────────────────────────────────────────────
  const {
    data,
    answers,
    totalAnswered,
    loading,
    error,
    setAnswer,
    buildAnswerPayload,
  } = useGetQuestions(sessionID);

  const { upsertAnswers, loading: saving } = useUpsertAnswers(sessionID ?? "");

  // ── Navigation state ────────────────────────────────────────────────────────
  const [globalIdx, setGlobalIdx] = useState(0);
  const lastPersistedSectionRef = useRef<string | null>(null);

  const allQuestions: Question[] = data?.questions ?? [];
  const totalQuestions = allQuestions.length;
  const question = allQuestions[globalIdx] ?? null;
  const currentAnswer = question ? (answers[question.id] ?? "") : "";

  // ── Section transition detection ────────────────────────────────────────────
  const prevSectionID =
    globalIdx > 0 ? allQuestions[globalIdx - 1]?.section_id : null;
  const isSectionStart = question && question.section_id !== prevSectionID;

  const sections = data
    ? Array.from(
        new Map(data.questions.map((q) => [q.section_id, q.section_title])),
      )
    : [];
  const sectionIdx = sections.findIndex(([id]) => id === question?.section_id);

  // ── Persist helpers ─────────────────────────────────────────────────────────
  const persistCurrentSection = useCallback(async () => {
    if (!data || !question) return;
    const sectionQuestions = data.questions.filter(
      (q) => q.section_id === question.section_id,
    );
    const payload = buildAnswerPayload(sectionQuestions);
    const nonEmpty = payload.filter((a) => a.answer_text.trim().length > 0);
    if (nonEmpty.length === 0) return;
    try {
      await upsertAnswers({ answers: nonEmpty });
      lastPersistedSectionRef.current = question.section_id;
    } catch {
      // Non-fatal — answers are still in local state
    }
  }, [data, question, buildAnswerPayload, upsertAnswers]);

  // ── Navigation ──────────────────────────────────────────────────────────────
  const isLastQ = globalIdx === totalQuestions - 1;
  const canAdvance = !question?.required || currentAnswer.trim().length > 0;

  const handleNext = async () => {
    const nextSectionID = allQuestions[globalIdx + 1]?.section_id;
    const isCrossingSectionBoundary =
      nextSectionID && nextSectionID !== question?.section_id;

    if (isCrossingSectionBoundary || isLastQ) {
      await persistCurrentSection();
    }

    if (isLastQ) {
      router.push("/preview");
    } else {
      setGlobalIdx((i) => i + 1);
    }
  };

  const handlePrev = async () => {
    if (globalIdx === 0) return;
    const prevSectionID2 = allQuestions[globalIdx - 1]?.section_id;
    const isCrossingSectionBoundary =
      prevSectionID2 && prevSectionID2 !== question?.section_id;
    if (isCrossingSectionBoundary) {
      await persistCurrentSection();
    }
    setGlobalIdx((i) => i - 1);
  };

  // ── Loading / error states ──────────────────────────────────────────────────
  if (sessionError) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 24,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--red)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Failed to start session
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "10px 24px",
            border: "1.5px solid var(--ink)",
            borderRadius: 2,
            background: "var(--ink)",
            color: "var(--paper)",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!sessionID || loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "rgba(14,14,14,0.35)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Loading assessment...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 24,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--red)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Failed to load questions
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "10px 24px",
            border: "1.5px solid var(--ink)",
            borderRadius: 2,
            background: "var(--ink)",
            color: "var(--paper)",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!question) return null;

  const meta = SECTION_META[question.section_id] ?? { icon: "◆", subtitle: "" };

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
        <ProgressBar current={globalIdx + 1} total={totalQuestions} />

        {isSectionStart && (
          <SectionHeader
            key={`sh-${question.section_id}`}
            sectionIdx={sectionIdx}
            title={question.section_title}
            icon={meta.icon}
            subtitle={meta.subtitle}
            totalSections={sections.length}
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
            question.options && (
              <RadioOptions
                options={question.options}
                value={currentAnswer}
                onChange={(val) => setAnswer(question.id, val)}
              />
            )}

          {question.type === "text" && (
            <TextInput
              value={currentAnswer}
              onChange={(val) => setAnswer(question.id, val)}
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
          isSaving={saving}
          isOptionalEmpty={!question.required && currentAnswer === ""}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </main>
    </div>
  );
}
