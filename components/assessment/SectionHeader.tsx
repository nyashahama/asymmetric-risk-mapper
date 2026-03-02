import { SECTIONS } from "@/lib/risks";

interface Props {
  sectionIdx: number;
  title: string;
  icon: string;
  subtitle: string;
}

export function SectionHeader({ sectionIdx, title, icon, subtitle }: Props) {
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
