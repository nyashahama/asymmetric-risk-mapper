// components/ui/Button.tsx
"use client";

import type { CSSProperties, ReactNode, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  fullWidth?: boolean;
}

const base: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
  fontFamily: "'DM Mono', monospace",
  fontWeight: 400,
  letterSpacing: "0.03em",
  transition: "all 0.15s ease",
  textDecoration: "none",
};

const variants: Record<Variant, CSSProperties> = {
  primary: {
    background: "#ef4444",
    color: "#fff",
  },
  ghost: {
    background: "transparent",
    color: "#94a3b8",
    border: "1px solid #1e293b",
  },
  danger: {
    background: "rgba(239,68,68,0.1)",
    color: "#ef4444",
    border: "1px solid rgba(239,68,68,0.3)",
  },
};

const sizes: Record<Size, CSSProperties> = {
  sm: { fontSize: 11, padding: "8px 14px" },
  md: { fontSize: 13, padding: "12px 20px" },
  lg: { fontSize: 14, padding: "15px 28px" },
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  fullWidth,
  style,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      style={{
        ...base,
        ...variants[variant],
        ...sizes[size],
        ...(fullWidth ? { width: "100%" } : {}),
        ...(disabled ? { opacity: 0.4, cursor: "not-allowed" } : {}),
        ...style,
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
