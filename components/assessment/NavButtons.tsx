interface Props {
  globalIdx: number;
  isLastQ: boolean;
  canAdvance: boolean;
  isOptionalEmpty: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function NavButtons({
  globalIdx,
  isLastQ,
  canAdvance,
  isOptionalEmpty,
  onPrev,
  onNext,
}: Props) {
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
        disabled={globalIdx === 0}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: globalIdx === 0 ? "rgba(14,14,14,0.18)" : "rgba(14,14,14,0.4)",
          background: "none",
          border: "none",
          cursor: globalIdx === 0 ? "default" : "pointer",
          padding: 0,
        }}
      >
        ← Back
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {isOptionalEmpty && (
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
            (e.currentTarget as HTMLButtonElement).style.background = canAdvance
              ? "var(--ink)"
              : "rgba(14,14,14,0.05)";
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              canAdvance ? "var(--ink)" : "rgba(14,14,14,0.12)";
          }}
        >
          {isLastQ ? "See My Results →" : "Continue →"}
        </button>
      </div>
    </div>
  );
}
