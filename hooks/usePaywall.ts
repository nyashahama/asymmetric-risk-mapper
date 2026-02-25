// hooks/usePaywall.ts
"use client";

import { useState, useEffect } from "react";
import { getSessionStatus, createCheckout } from "@/lib/api";

export function usePaywall(sessionId: string) {
  const [isPaid, setIsPaid] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Stripe redirects back with ?paid=true — trust it immediately
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "true") {
      setIsPaid(true);
      setIsChecking(false);
      return;
    }

    getSessionStatus(sessionId)
      .then(({ status }) => {
        setIsPaid(status === "paid");
        setIsChecking(false);
      })
      .catch(() => setIsChecking(false));
  }, [sessionId]);

  const initiateCheckout = async (email?: string) => {
    const { checkoutUrl } = await createCheckout(sessionId, email);
    window.location.href = checkoutUrl;
  };

  return { isPaid, isChecking, initiateCheckout };
}
