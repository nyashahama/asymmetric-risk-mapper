interface NavButtonsProps {
  globalIdx: number;
  isLastQ: boolean;
  canAdvance: boolean;
  isSaving: boolean;
  isOptionalEmpty: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function NavButtons({
  globalIdx,
  isLastQ,
  canAdvance,
  isSaving,
  isOptionalEmpty,
  onPrev,
  onNext,
}: NavButtonsProps) {
  const label = isSaving
    ? "Saving..."
    : isLastQ
      ? "See My Results →"
      : "Continue →";

  return (
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
        onClick={onPrev}
        disabled={globalIdx === 0 || isSaving}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color:
            globalIdx === 0 || isSaving
              ? "rgba(14,14,14,0.18)"
              : "rgba(14,14,14,0.4)",
          background: "none",
          border: "none",
          cursor: globalIdx === 0 || isSaving ? "default" : "pointer",
          padding: 0,
        }}
      >
        ← Back
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {isOptionalEmpty && !isSaving && (
          <button
            onClick={onNext}
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
          onClick={onNext}
          disabled={!canAdvance || isSaving}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "12px 28px",
            border: `1.5px solid ${canAdvance && !isSaving ? "var(--ink)" : "rgba(14,14,14,0.12)"}`,
            borderRadius: 2,
            background:
              canAdvance && !isSaving ? "var(--ink)" : "rgba(14,14,14,0.05)",
            color:
              canAdvance && !isSaving ? "var(--paper)" : "rgba(14,14,14,0.22)",
            cursor: canAdvance && !isSaving ? "pointer" : "not-allowed",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            if (!canAdvance || isSaving) return;
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--red)";
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "var(--red)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              canAdvance && !isSaving ? "var(--ink)" : "rgba(14,14,14,0.05)";
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              canAdvance && !isSaving ? "var(--ink)" : "rgba(14,14,14,0.12)";
          }}
        >
          {label}
        </button>
      </div>
    </div>
  );
}
