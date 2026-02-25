// app/report/[sessionId]/preview/page.tsx
"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { usePaywall } from "@/hooks/usePaywall";
import { PaywallGate } from "@/components/report/PaywallGate";

export default function PreviewPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const router = useRouter();
  const { isPaid, isChecking, initiateCheckout } = usePaywall(sessionId);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Already paid — redirect to full report
  if (!isChecking && isPaid) {
    router.replace(`/report/${sessionId}`);
    return null;
  }

  const handleUnlock = async (email?: string) => {
    setIsRedirecting(true);
    try {
      await initiateCheckout(email);
    } catch {
      setIsRedirecting(false);
    }
  };

  return <PaywallGate onUnlock={handleUnlock} isRedirecting={isRedirecting} />;
}
