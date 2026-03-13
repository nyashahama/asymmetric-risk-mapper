# Asymmetric Risk Mapper

> Find the risks that can actually end your business.

A SaaS tool that helps business owners identify and prioritize existential risks. Users answer 20 questions across 5 risk categories and receive a heat map plus a detailed 30-day action plan — all without creating an account.

---

## How It Works

1. **Answer 20 questions** across 5 risk sections (~12 minutes)
2. **See a live risk preview** — a heat map plotting your risks by probability and impact
3. **Unlock the full report** for a one-time $59 payment via Stripe
4. **Receive your report by email** — a detailed risk register, executive summary, and prioritized action plan

Risks are scored using a **4-bucket model**:

| Bucket | Condition | Action |
|--------|-----------|--------|
| Red Zone | High probability + High impact | Address immediately |
| Watch List | Low probability + High impact | Monitor closely |
| Manage It | High probability + Low impact | Manage routinely |
| Ignore Now | Low probability + Low impact | Deprioritize |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Payments | Stripe (PaymentElement) |
| HTTP Client | Axios |
| Backend | Go REST API (separate service) |
| Fonts | DM Serif Display, DM Sans, IBM Plex Mono |

---

## Project Structure

```
.
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Landing page
│   ├── assessment/             # 20-question interactive assessment
│   ├── preview/                # Risk preview with paywall
│   ├── checkout/               # Stripe payment form
│   │   └── complete/           # Payment confirmation
│   ├── report/                 # Internal report view (dev/testing)
│   └── report/[accessToken]/   # Public report URL (emailed to user)
│
├── components/
│   ├── landing/                # Hero, pricing, testimonials, how-it-works
│   ├── assessment/             # Progress bar, question cards, navigation
│   ├── preview/                # Heat map, blurred risk rows, paywall overlay
│   └── report/                 # Cover, heat map, risk register, action plan, export
│
├── hooks/                      # React hooks for API integration
│   ├── useGetQuestions.ts      # Fetch questions, hydrate saved answers
│   ├── useUpsertAnswers.ts     # Batch-save answers to backend
│   ├── useCreateCheckout.ts    # Create Stripe PaymentIntent
│   ├── useGetReport.ts         # Poll for report generation status
│   ├── useCreateSession.ts     # Create anonymous session
│   └── useUpdateContext.ts     # Update business context metadata
│
├── api/services/               # Typed API service layer (Axios)
│   ├── apiClient.ts            # Axios instance + auth interceptor
│   ├── sessionsService.ts      # Session creation and context updates
│   ├── questionsService.ts     # Questions fetch and section grouping
│   ├── answersService.ts       # Answer upsert with client scores
│   ├── checkoutService.ts      # PaymentIntent creation
│   └── reportsService.ts       # Report retrieval by access token
│
└── lib/
    ├── risks.ts                # Client-side risk scoring engine (~1000 lines)
    ├── usePreviewData.ts       # Computes risks from session answers (preview)
    ├── useReportData.ts        # Reads sessionStorage for internal report view
    └── landingData.ts          # Static copy for landing page
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- A running instance of the backend API
- Stripe account with a publishable key

### Installation

```bash
git clone https://github.com/your-org/asymmetric-risk-mapper.git
cd asymmetric-risk-mapper
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=https://your-backend-api.onrender.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build

```bash
npm run build
npm start
```

---

## Session Model

The app is **auth-free**. Each user gets an anonymous session on first visit:

- A `session_id` (UUID) and `anon_token` are created via the backend and stored in `localStorage`
- The `anon_token` is sent as `X-Anon-Token` on every API request
- A 401 response clears the session and redirects to home
- No account creation or login required at any point

---

## Payment Flow

1. User clicks "Unlock Report" on the preview page
2. `useCreateCheckout` calls the backend to create a Stripe `PaymentIntent`
3. The `client_secret` is stored in `localStorage` and the user is navigated to `/checkout`
4. Stripe's `PaymentElement` handles card input and 3DS if required
5. On success, the user lands on `/checkout/complete`
6. The backend generates the AI-scored report and emails a unique link to the user
7. The report is accessible at `/report/[accessToken]` — no login needed

---

## Report Delivery

The full report includes:

- **Executive Summary** — AI-generated overview of the business risk profile
- **Risk Heat Map** — 2D scatter plot of all identified risks
- **Risk Register** — Complete table of risks with tier, probability, and impact scores
- **Risk Cards** — Detailed breakdown per risk with recommended action (hedge)
- **30-Day Action Plan** — Top 3 risks with specific weekly actions
- **Export Options** — Print to PDF or copy plain text

Reports are polled every 4 seconds until generation is complete. Once ready, the page renders the full report and stops polling.

---

## Risk Scoring

Client-side scoring is handled in `lib/risks.ts`. Each question has:

- A `pCalc(answer)` function → probability score (0–1)
- An `iCalc(answer)` function → impact score (0–1)

Scores are computed locally for the preview heat map. The backend performs its own AI-assisted scoring for the full paid report.

---

## Deployment

The frontend deploys to any platform that supports Next.js (Vercel recommended).

The backend is a separate Go service deployed on Render.com.

**Vercel (recommended):**

```bash
vercel deploy
```

Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` as environment variables in your Vercel project settings.

---

## License

Private. All rights reserved.
