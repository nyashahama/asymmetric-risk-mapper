"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { sessionsService } from "@/api/services/sessionsService";

interface StartButtonProps {
  label?: string;
  style?: React.CSSProperties;
}

export function StartButton({
  label = "Start the Assessment — Free →",
  style,
}: StartButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // Reuse existing session if one already exists
      const existingID = localStorage.getItem("session_id");
      if (existingID) {
        router.push("/assessment");
        return;
      }

      const { session_id, anon_token } = await sessionsService.createSession(
        {},
      );
      localStorage.setItem("session_id", session_id);
      localStorage.setItem("anon_token", anon_token);
      router.push("/assessment");
    } catch (err) {
      console.error("Failed to create session:", err);
      // Fallback: still attempt to navigate; assessment page will retry
      router.push("/assessment");
    } finally {
      setLoading(false);
    }
  };

  const defaultStyle: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    padding: "14px 32px",
    background: loading ? "rgba(14,14,14,0.6)" : "var(--ink)",
    color: "var(--paper)",
    border: "none",
    borderRadius: 2,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    boxShadow: "4px 4px 0 rgba(14,14,14,0.15)",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "background 0.12s",
  };

  return (
    <button onClick={handleStart} style={{ ...defaultStyle, ...style }}>
      {loading ? "Starting…" : label}
    </button>
  );
}
