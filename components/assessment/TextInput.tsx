interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function TextInput({ value, onChange, placeholder }: Props) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? "Your answer..."}
      rows={4}
      style={{
        width: "100%",
        padding: "14px 16px",
        border: "1.5px solid rgba(14,14,14,0.14)",
        borderRadius: 2,
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        lineHeight: 1.6,
        background: "white",
        color: "var(--ink)",
        resize: "vertical",
        outline: "none",
        transition: "border-color 0.15s",
        boxSizing: "border-box",
      }}
      onFocus={(e) => (e.target.style.borderColor = "var(--ink)")}
      onBlur={(e) => (e.target.style.borderColor = "rgba(14,14,14,0.14)")}
    />
  );
}
