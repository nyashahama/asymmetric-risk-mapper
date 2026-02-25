// components/assessment/SectionSidebar.tsx
"use client";

import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Section } from "@/types/assessment";

interface SectionSidebarProps {
  sections: Section[];
  currentSectionIndex: number;
  progressPercent: number;
}

export function SectionSidebar({
  sections,
  currentSectionIndex,
  progressPercent,
}: SectionSidebarProps) {
  return (
    <aside
      style={{
        width: 232,
        borderRight: "1px solid #1e293b",
        padding: "32px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 40,
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <a
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          textDecoration: "none",
          color: "#475569",
          fontSize: 11,
          letterSpacing: "0.2em",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#ef4444",
            flexShrink: 0,
          }}
        />
        ARM
      </a>

      {/* Section nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {sections.map((section, i) => {
          const isActive = i === currentSectionIndex;
          const isDone = i < currentSectionIndex;

          return (
            <div
              key={section.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 4,
                fontSize: 12,
                color: isDone ? "#334155" : isActive ? "#e2e8f0" : "#1e293b",
                background: isActive ? "rgba(239,68,68,0.06)" : "transparent",
                borderLeft: isActive
                  ? "2px solid #ef4444"
                  : "2px solid transparent",
                transition: "all 0.15s ease",
              }}
            >
              <span
                style={{
                  fontStyle: "italic",
                  fontSize: 10,
                  opacity: 0.5,
                  minWidth: 20,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ flex: 1 }}>{section.label}</span>
              {isDone && (
                <span style={{ color: "#22c55e", fontSize: 11 }}>✓</span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Progress */}
      <div style={{ marginTop: "auto" }}>
        <ProgressBar
          value={progressPercent}
          label={`${progressPercent}% complete`}
        />
      </div>
    </aside>
  );
}
