"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
);

type PaymentStatus = "loading" | "succeeded" | "processing" | "failed";

export default function CheckoutCompletePage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("checkout_email") ?? "";
    setEmail(savedEmail);

    // Stripe redirects back here with ?payment_intent_client_secret=...
    // for redirect-based payment methods. We verify the PI status.
    const clientSecret =
      searchParams.get("payment_intent_client_secret") ??
      localStorage.getItem("stripe_client_secret");

    if (!clientSecret) {
      // Arrived here after a synchronous card confirmation (no redirect).
      // The checkout page already confirmed success, so we just show success.
      setStatus("succeeded");
      return;
    }

    const checkStatus = async () => {
      const stripe = await stripePromise;
      if (!stripe) return;

      const { paymentIntent } =
        await stripe.retrievePaymentIntent(clientSecret);
      switch (paymentIntent?.status) {
        case "succeeded":
          setStatus("succeeded");
          localStorage.removeItem("stripe_client_secret");
          localStorage.removeItem("checkout_email");
          break;
        case "processing":
          setStatus("processing");
          break;
        default:
          setStatus("failed");
      }
    };

    checkStatus();
  }, [searchParams]);

  console.log("email: ", email);

  return (
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
      {/* Header */}
      <header
        style={{
          borderBottom: "1.5px solid rgba(14,14,14,0.1)",
          padding: "16px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--ink)",
            textDecoration: "none",
          }}
        >
          <span style={{ color: "var(--red)" }}>▲</span> Risk Mapper
        </Link>
      </header>

      <main
        style={{
          maxWidth: 560,
          margin: "0 auto",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        {status === "loading" && (
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "rgba(14,14,14,0.4)",
              letterSpacing: "0.1em",
            }}
          >
            Confirming payment...
          </div>
        )}

        {status === "succeeded" && (
          <>
            {/* Big checkmark */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(42,110,63,0.1)",
                border: "2px solid var(--green)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 32px",
                fontSize: 28,
              }}
            >
              ✓
            </div>

            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--green)",
                marginBottom: 12,
              }}
            >
              Payment confirmed
            </div>

            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 400,
                lineHeight: 1.1,
                marginBottom: 20,
              }}
            >
              Your report is
              <br />
              <em style={{ color: "var(--red)" }}>being generated.</em>
            </h1>

            <p
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: "rgba(14,14,14,0.55)",
                marginBottom: 8,
              }}
            >
              We'll email your full Risk Report to{" "}
              <strong style={{ color: "var(--ink)", fontWeight: 500 }}>
                {email || "your inbox"}
              </strong>{" "}
              within a few minutes.
            </p>
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.7,
                color: "rgba(14,14,14,0.4)",
                marginBottom: 40,
              }}
            >
              The email includes your PDF report, heat map, and 30-day action
              plan. Check your spam folder if it doesn't arrive in 5 minutes.
            </p>

            {/* What's next box */}
            <div
              style={{
                background: "var(--ink)",
                color: "var(--paper)",
                padding: "28px 32px",
                borderRadius: 2,
                textAlign: "left",
                marginBottom: 32,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(244,240,232,0.35)",
                  marginBottom: 16,
                }}
              >
                While you wait
              </div>
              {[
                "Check your email — receipt is on its way",
                "Your report will arrive within 2–5 minutes",
                "The report link is valid for 30 days",
                "Questions? hello@riskmapper.co",
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    marginBottom: 10,
                    fontSize: 13,
                    color: "rgba(244,240,232,0.65)",
                  }}
                >
                  <span
                    style={{
                      color: "rgba(244,240,232,0.3)",
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      marginTop: 2,
                      flexShrink: 0,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item}
                </div>
              ))}
            </div>

            <Link
              href="/"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(14,14,14,0.35)",
                textDecoration: "none",
              }}
            >
              ← Back to home
            </Link>
          </>
        )}

        {status === "processing" && (
          <>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(212,135,10,0.1)",
                border: "2px solid var(--amber)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 32px",
                fontSize: 28,
              }}
            >
              ⏳
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--amber)",
                marginBottom: 12,
              }}
            >
              Payment processing
            </div>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                fontWeight: 400,
                marginBottom: 16,
              }}
            >
              Your payment is being processed.
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "rgba(14,14,14,0.5)",
                lineHeight: 1.7,
              }}
            >
              This can take a moment. We'll email you at{" "}
              <strong>{email || "your inbox"}</strong> as soon as it's confirmed
              and your report is ready.
            </p>
          </>
        )}

        {status === "failed" && (
          <>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(193,40,30,0.1)",
                border: "2px solid var(--red)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 32px",
                fontSize: 28,
              }}
            >
              ✕
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--red)",
                marginBottom: 12,
              }}
            >
              Payment failed
            </div>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                fontWeight: 400,
                marginBottom: 16,
              }}
            >
              Something went wrong.
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "rgba(14,14,14,0.5)",
                lineHeight: 1.7,
                marginBottom: 32,
              }}
            >
              Your card was not charged. Please go back and try again with a
              different payment method.
            </p>
            <Link
              href="/preview"
              style={{
                display: "inline-block",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "12px 28px",
                background: "var(--ink)",
                color: "var(--paper)",
                textDecoration: "none",
                borderRadius: 2,
              }}
            >
              ← Try again
            </Link>
          </>
        )}
      </main>
    </div>
  );
}
