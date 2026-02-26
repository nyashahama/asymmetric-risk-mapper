import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title:
    "Asymmetric Risk Mapper — Find the risks that can actually end your business",
  description:
    "Answer 20 questions. Get a risk heat map that separates what could end your business from what's merely annoying. Hedge only what matters. $59 one-time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
