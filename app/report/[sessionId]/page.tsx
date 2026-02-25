// app/report/[sessionId]/page.tsx
"use client";

import { use, useState, useEffect } from "react";
import { usePaywall } from "@/hooks/usePaywall";
import { getReport } from "@/lib/api";
import { ReportShell } from "@/components/report/ReportShell";
import { ExecutiveSummary } from "@/components/report/ExecutiveSummary";
import { HeatMap } from "@/components/report/HeatMap";
import { ActionChecklist } from "@/components/report/ActionChecklist";
import { RiskCard } from "@/components/report/RiskCard";
import { PaywallGate } from "@/components/report/PaywallGate";
import type { ReportData } from "@/types/report";

export default function ReportPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const { isPaid, isChecking, initiateCheckout } = usePaywall(sessionId);
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isPaid) return;
    setIsLoadingReport(true);
    getReport(sessionId)
      .then(({ report }) => setReport(report))
      .catch((e: Error) => setReportError(e.message))
      .finally(() => setIsLoadingReport(false));
  }, [isPaid, sessionId]);

  // Loading states
  if (isChecking) return <CenteredMessage message="Verifying access..." />;

  // Not paid
  if (!isPaid) {
    const handleUnlock = async (email?: string) => {
      setIsRedirecting(true);
      try {
        await initiateCheckout(email);
      } catch {
        setIsRedirecting(false);
      }
    };
    return (
      <PaywallGate onUnlock={handleUnlock} isRedirecting={isRedirecting} />
    );
  }

  if (isLoadingReport)
    return <CenteredMessage message="Building your risk map..." />;
  if (reportError) return <CenteredMessage message={reportError} isError />;
  if (!report) return null;

  const existentialRisks = report.risks.filter(
    (r) => r.bucket === "red_zone" || r.bucket === "watch_list",
  );

  return (
    <ReportShell
      businessName={report.businessName}
      generatedAt={report.generatedAt}
    >
      <ExecutiveSummary
        summary={report.executiveSummary}
        existentialCount={existentialRisks.length}
      />

      <HeatMap points={report.heatMapPoints} />

      <ActionChecklist actions={report.topActions} />

      {/* All risks grid */}
      <section>
        <p
          style={{
            fontSize: 10,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#334155",
            marginBottom: 16,
          }}
        >
          All Identified Risks
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
            gap: 14,
          }}
        >
          {report.risks.map((risk) => (
            <RiskCard key={risk.id} risk={risk} />
          ))}
        </div>
      </section>
    </ReportShell>
  );
}

function CenteredMessage({
  message,
  isError,
}: {
  message: string;
  isError?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#080a0d",
        fontFamily: "'DM Mono', monospace",
        color: isError ? "#ef4444" : "#475569",
        fontSize: 13,
      }}
    >
      {message}
    </div>
  );
}
