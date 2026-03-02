import Link from "next/link";

interface Props {
  copied: boolean;
  onCopy: () => void;
}

function ExportButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        padding: "8px 16px",
        border: "1.5px solid rgba(14,14,14,0.15)",
        borderRadius: 2,
        background: "white",
        color: "var(--ink)",
        cursor: "pointer",
        transition: "all 0.12s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "var(--ink)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--paper)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "white";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--ink)";
      }}
    >
      {label}
    </button>
  );
}

export function ExportBar({ copied, onCopy }: Props) {
  return (
    <div
      className="no-print"
      style={{
        display: "flex",
        gap: 10,
        padding: 16,
        background: "var(--paper-dark)",
        border: "1.5px solid rgba(14,14,14,0.1)",
        borderRadius: 2,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(14,14,14,0.4)",
          marginRight: 4,
        }}
      >
        Export
      </span>
      <ExportButton
        label={copied ? "✓ Copied!" : "📋 Copy text"}
        onClick={onCopy}
      />
      <ExportButton label="🖨 Print / PDF" onClick={() => window.print()} />
      <Link
        href="/assessment"
        onClick={() => sessionStorage.clear()}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "8px 16px",
          border: "1.5px solid rgba(14,14,14,0.15)",
          borderRadius: 2,
          background: "white",
          color: "var(--ink)",
          cursor: "pointer",
          textDecoration: "none",
        }}
      >
        ↩ New Assessment
      </Link>
    </div>
  );
}
