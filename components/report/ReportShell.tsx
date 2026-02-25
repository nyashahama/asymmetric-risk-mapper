// components/report/ReportShell.tsx
"use client";

import type { ReactNode } from "react";
import { formatDate } from "@/lib/utils";

interface ReportShellProps {
  businessName?: string;
  generatedAt: string;
  children: ReactNode;
}

export function ReportShell({
  businessName,
  generatedAt,
  children,
}: ReportShellProps) {
  return (
    <div
      style={{
        background: "#080a0d",
        color: "#e2e8f0",
        minHeight: "100vh",
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {/* Sticky header */}
      <header
        style={{
          borderBottom: "1px solid #1e293b",
          padding: "18px 60px",
          position: "sticky",
          top: 0,
          background: "#080a0d",
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 10,
            letterSpacing: "0.18em",
            color: "#334155",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#ef4444",
            }}
          />
          ASYMMETRIC RISK MAPPER
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {businessName && (
            <span style={{ fontSize: 13, color: "#94a3b8" }}>
              {businessName}
            </span>
          )}
          <span style={{ fontSize: 11, color: "#334155" }}>
            {formatDate(generatedAt)}
          </span>
        </div>
      </header>

      <main
        style={{
          padding: "72px 60px",
          maxWidth: 1160,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 72,
        }}
      >
        {children}
      </main>
    </div>
  );
}
