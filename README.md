# UniCore — Assignment 7 frontend

A University Management System with dedicated Super Admin, Instructor, and Student workspaces. This frontend consumes the Assignment 6 REST API; core records are never generated in the browser.

## Run locally

Use Node.js 20.9 or newer. The npm lockfile was used for verification.

```bash
npm ci
cp .env.example .env.local
# Edit .env.local with your backend URL and dedicated demo account passwords.
npm run dev
```

Start the Assignment 6 backend first, with PostgreSQL configured. `API_BASE_URL` must include `/api/v1` (default `http://localhost:5000/api/v1`). Restart Next.js after changing environment variables. Do not copy the old uploaded frontend payment keys into this project.

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

Bun can also run the package scripts. The old Bun lockfile was excluded to avoid using dependency versions inconsistent with the verified npm lockfile.

## Demo login configuration

Three one-click demo login buttons are on `/login`. Credentials are read ONLY by the Next.js server, and are never displayed on the page or returned to the browser. Set these server environment variables to dedicated, limited demo accounts:

| Role | Seed email | Seed password | Server password variable |
| --- | --- | --- | --- |
| Super Admin | admin@university.edu | Admin123! | DEMO_ADMIN_PASSWORD |
| Instructor | instructor@university.edu | Instructor123! | DEMO_INSTRUCTOR_PASSWORD |
| Student | student@university.edu | Student123! | DEMO_STUDENT_PASSWORD |

These are development/evaluation accounts created by the backend's optional `npm run seed`. Existing account passwords are not reset by rerunning that seed; use the actual passwords in your database. Email overrides are documented in `.env.example`. Missing passwords disable the corresponding demo login with a clear error. Do not use real administrative account credentials for public demo access.

## SSLCommerz test payments

New checkout uses the Assignment 6 backend's SSLCommerz sandbox integration. Configure `SSLCOMMERZ_STORE_ID`, `SSLCOMMERZ_STORE_PASS`, `BACKEND_URL`, and `FRONTEND_URL` on the BACKEND. Merchant credentials must never use `NEXT_PUBLIC_` or be stored in frontend source.

The finance page sends only the invoice ID. The API checks ownership and derives the amount, reserves a payment attempt, and returns the provider's hosted checkout URL. SSLCommerz calls the backend, which validates the transaction directly with the gateway before settling the invoice. `/payment/success?paymentId=...` reads the authenticated database receipt; opening this URL cannot fabricate a payment. Pending receipts can be checked again to recover a lost callback. Cancellation pages advise checking history instead of assuming no charge occurred.

Local UI development works without gateway credentials, but real hosted checkout requires valid sandbox merchant credentials and publicly reachable HTTPS callback URLs. See `REVIEW_AND_SETUP.md` for a complete payment acceptance checklist. Payment code and regression checks passed; an actual merchant transaction was not performed in this review.

## Architecture

- Next.js 16 App Router, TypeScript strict mode, Tailwind, reusable shadcn/Base UI components.
- Server route entry points with metadata; interactive workspace modules use React Query, TanStack Form, and Zod. The section creation workflow has four steps.
- `src/proxy.ts` protects role routes using the backend's current user record. Next.js 16 calls this convention Proxy.
- Same-origin `/api/backend/*` forwards API requests with HttpOnly session cookies; JavaScript never receives the access token. The backend independently validates every protected operation.
- Five public pages, two authentication pages, three role portals, receipt/cancellation pages, route skeletons, and error boundaries. More than 18 application pages are present.
- URL-backed search, filtering, sorting, pagination, and instructor workspace selections. Tables scroll within their containers; mobile tuition invoices use cards with visible payment actions.
- Real API data for programs, semesters, notifications, attendance, results, transcripts, and billing. Contact inquiries create notifications for active administrators.

## Deployment and submission

Deploy the frontend as a Next.js app. Set `API_BASE_URL` to the deployed backend API and the server-only demo credentials in the hosting environment. Set the backend's `FRONTEND_URL` to the frontend origin and `BACKEND_URL` to the backend origin; then perform all payment acceptance checks. Google login is optional and requires matching `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and backend `GOOGLE_CLIENT_ID`, plus the correct authorized browser origin.

This delivery contains source fixes, setup examples, and review notes. It does not create a live deployment, a walkthrough recording, or the required 20 meaningful Git commits. Merge the changes into your existing repositories and provide those submission items separately. See `REVIEW_AND_SETUP.md` and `docs/previews/`.
