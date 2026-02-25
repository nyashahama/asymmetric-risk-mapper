// components/assessment/AssessmentShell.tsx
"use client";

import type { ReactNode } from "react";

interface AssessmentShellProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function AssessmentShell({ sidebar, children }: AssessmentShellProps) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#080a0d",
        color: "#e2e8f0",
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {sidebar}
      {children}
    </div>
  );
}
