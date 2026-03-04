"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// ─── Stripe initialisation ────────────────────────────────────────────────────
// NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must be set in your .env.local
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
);

// ─── Inner form (needs to be inside <Elements>) ───────────────────────────────
function CheckoutForm({ email }: { email: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!stripe || !elements || status === "submitting") return;

    setStatus("submitting");
    setErrorMsg(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Stripe will redirect here after 3DS / bank redirect flows.
        // For card payments that don't need a redirect this URL is still
        // required by the API but won't be visited.
        return_url: `${window.location.origin}/checkout/complete`,
        receipt_email: email,
      },
      // Don't redirect for card payments that complete synchronously —
      // we handle the success ourselves.
      redirect: "if_required",
    });

    if (error) {
      setErrorMsg(error.message ?? "Payment failed. Please try again.");
      setStatus("error");
      return;
    }

    // Payment confirmed synchronously (no redirect needed).
    setStatus("success");
    // Clear checkout state from localStorage.
    setStatus("success");
    router.push("/checkout/complete");
    setTimeout(() => {
      localStorage.removeItem("stripe_client_secret");
      localStorage.removeItem("checkout_email");
    }, 2000);
  };

  return (
    <div>
      <PaymentElement
        options={{
          layout: "tabs",
          defaultValues: {
            billingDetails: { email },
          },
        }}
      />

      {errorMsg && (
        <div
          style={{
            marginTop: 16,
            padding: "10px 14px",
            background: "rgba(193,40,30,0.08)",
            border: "1.5px solid var(--red)",
            borderRadius: 2,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--red)",
            letterSpacing: "0.05em",
          }}
        >
          {errorMsg}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!stripe || !elements || status === "submitting"}
        style={{
          marginTop: 24,
          width: "100%",
          padding: "15px",
          background:
            status === "submitting" ? "rgba(14,14,14,0.5)" : "var(--ink)",
          color: "var(--paper)",
          border: "none",
          borderRadius: 2,
          cursor:
            status === "submitting" || !stripe || !elements
              ? "not-allowed"
              : "pointer",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          transition: "background 0.15s",
        }}
      >
        {status === "submitting"
          ? "Processing..."
          : "Pay $59 — Unlock Report →"}
      </button>

      <div
        style={{
          marginTop: 14,
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          color: "rgba(14,14,14,0.35)",
          textAlign: "center",
          letterSpacing: "0.08em",
        }}
      >
        Secured by Stripe · 256-bit encryption · No data stored on our servers
      </div>
    </div>
  );
}

// ─── Page shell ───────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const secret = localStorage.getItem("stripe_client_secret");
    const savedEmail = localStorage.getItem("checkout_email") ?? "";

    if (!secret) {
      // No payment intent — user navigated here directly, send them back.
      router.replace("/preview");
      return;
    }

    setClientSecret(secret);
    setEmail(savedEmail);
    setReady(true);
  }, [router]);

  if (!ready || !clientSecret) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "rgba(14,14,14,0.4)",
          letterSpacing: "0.1em",
        }}
      >
        Loading payment...
      </div>
    );
  }

  const elementsOptions: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#0e0e0e",
        colorBackground: "#ffffff",
        colorText: "#0e0e0e",
        colorDanger: "#c1281e",
        fontFamily: "var(--font-mono), monospace",
        borderRadius: "2px",
        spacingUnit: "4px",
      },
      rules: {
        ".Input": {
          border: "1.5px solid rgba(14,14,14,0.18)",
          boxShadow: "none",
          padding: "10px 12px",
        },
        ".Input:focus": {
          border: "1.5px solid rgba(14,14,14,0.6)",
          boxShadow: "none",
          outline: "none",
        },
        ".Label": {
          fontFamily: "var(--font-mono)",
          fontSize: "9px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(14,14,14,0.45)",
          marginBottom: "4px",
        },
        ".Tab": {
          border: "1.5px solid rgba(14,14,14,0.12)",
          boxShadow: "none",
        },
        ".Tab--selected": {
          border: "1.5px solid rgba(14,14,14,0.6)",
          boxShadow: "none",
        },
      },
    },
  };

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
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "rgba(14,14,14,0.35)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--green)",
            }}
          />
          Secure checkout
        </div>
      </header>

      <main
        style={{
          maxWidth: 540,
          margin: "0 auto",
          padding: "56px 24px 80px",
        }}
      >
        {/* Title block */}
        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--red)",
              marginBottom: 10,
            }}
          >
            One-time payment
          </div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              fontWeight: 400,
              lineHeight: 1.1,
              marginBottom: 12,
            }}
          >
            Unlock your full
            <br />
            <em style={{ color: "var(--red)" }}>Risk Report</em>
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "rgba(14,14,14,0.5)",
              lineHeight: 1.7,
            }}
          >
            Your report will be emailed to{" "}
            <strong style={{ color: "var(--ink)", fontWeight: 500 }}>
              {email || "you"}
            </strong>{" "}
            within minutes of payment.
          </p>
        </div>

        {/* Order summary */}
        <div
          style={{
            padding: "16px 20px",
            background: "rgba(14,14,14,0.03)",
            border: "1.5px solid rgba(14,14,14,0.08)",
            borderRadius: 2,
            marginBottom: 28,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--ink)",
                marginBottom: 2,
              }}
            >
              Asymmetric Risk Report
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "rgba(14,14,14,0.4)",
              }}
            >
              Full report · PDF · 30-day action plan
            </div>
          </div>
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.6rem",
              fontWeight: 400,
              color: "var(--ink)",
            }}
          >
            $59
          </div>
        </div>

        {/* Stripe Elements */}
        <div
          style={{
            padding: "28px 28px 32px",
            background: "white",
            border: "2px solid var(--ink)",
            boxShadow: "4px 4px 0 var(--ink)",
            borderRadius: 2,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(14,14,14,0.35)",
              marginBottom: 20,
            }}
          >
            Payment details
          </div>
          <Elements stripe={stripePromise} options={elementsOptions}>
            <CheckoutForm email={email} />
          </Elements>
        </div>

        {/* Back link */}
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Link
            href="/preview"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(14,14,14,0.35)",
              textDecoration: "none",
            }}
          >
            ← Back to preview
          </Link>
        </div>
      </main>
    </div>
  );
}
