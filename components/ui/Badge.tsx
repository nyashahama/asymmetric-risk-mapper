// components/ui/Badge.tsx

import type { CSSProperties, ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  color: string;
  bg?: string;
  style?: CSSProperties;
}

export function Badge({ children, color, bg, style }: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 9,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "3px 7px",
        borderRadius: 3,
        fontFamily: "'DM Mono', monospace",
        color,
        background: bg ?? color + "15",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
