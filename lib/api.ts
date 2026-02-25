// lib/api.ts
// All communication with the Go backend lives here.
// Components never call fetch directly.

import type { ReportData } from "@/types/report";
import type { AnswersMap } from "@/types/assessment";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { error?: string }).error ?? `Request failed: ${res.status}`,
    );
  }

  return res.json() as Promise<T>;
}

// ── Sessions ──────────────────────────────────────────────────────────────────

export async function createSession(
  answers: AnswersMap,
): Promise<{ sessionId: string }> {
  return request("/sessions", {
    method: "POST",
    body: JSON.stringify({ answers }),
  });
}

export async function getSessionStatus(
  sessionId: string,
): Promise<{ status: "in_progress" | "complete" | "paid" }> {
  return request(`/sessions/${sessionId}/status`);
}

// ── Reports ───────────────────────────────────────────────────────────────────

export async function getReport(
  sessionId: string,
): Promise<{ report: ReportData }> {
  return request(`/sessions/${sessionId}/report`);
}

// ── Checkout ──────────────────────────────────────────────────────────────────

export async function createCheckout(
  sessionId: string,
  email?: string,
): Promise<{ checkoutUrl: string }> {
  return request("/checkout", {
    method: "POST",
    body: JSON.stringify({ sessionId, email }),
  });
}
