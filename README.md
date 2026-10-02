# 🎓 University Management System (UMS) — Enterprise Frontend

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=flat&logo=react-query)](https://tanstack.com/query)
[![Biome](https://img.shields.io/badge/Biome-2.4.2-60A5FA?style=flat&logo=biome)](https://biomejs.dev/)
[![Bun](https://img.shields.io/badge/Bun-1.4.2-FBF0DF?style=flat&logo=bun)](https://bun.sh/)

An enterprise-grade, high-performance, and accessible University Management System built for modern higher education institutions. Designed and implemented following the **B7A7 Mandatory 5-Day Implementation Roadmap**, this frontend couples strict role-based governance with delightful scholar-first user experiences.

---

## 📌 Submission Overview

- **Project Name**: University Management System (UMS)
- **Frontend Repository**: [https://github.com/MahdiHassanGo/University-management-System-Frontend-.git](https://github.com/MahdiHassanGo/University-management-System-Frontend-.git)
- **Backend Repository**: Level 2 Assignment 6 University Management System Backend
- **Target Remote Branch**: `main`

---

## 🔑 One-Click Demo Credentials

The login page includes **Mandatory 1-Click Real Authentication Buttons** that automatically authenticate against the live backend, establish secure JWT cookie sessions, decode privileges, and redirect to the corresponding workspace:

| Role | Demo Email | Demo Password | Default Redirect |
|---|---|---|---|
| **Super Admin** | `admin@university.edu` | `Admin123!` | `/admin` |
| **Instructor** | `instructor@university.edu` | `Instructor123!` | `/instructor` |
| **Student** | `student@university.edu` | `Student123!` | `/student` |

---

## 🏛️ System Roles & Core Capabilities

### 1. 🛡️ Super Admin Console (`/admin`)
- **Student Administration (`/admin/students`)**: URL-synced search, filtering by academic status (`ACTIVE`, `SUSPENDED`, `GRADUATED`), pagination, and student profile registration modal.
- **Faculty Administration (`/admin/instructors`)**: Faculty member registry with department affiliation and employee designation management.
- **Academic Catalogs (`/admin/departments`, `/admin/programs`, `/admin/courses`)**:
  - Departments with active catalog codes.
  - Degree programs with total credit caps and semester load limits.
  - Course curriculum with credit values, syllabus outlines, and prerequisite requirements.
- **Term Scheduling (`/admin/semesters`)**: Semester lifecycle management (`DRAFT` → `REGISTRATION_OPEN` → `ONGOING` → `COMPLETED`).
- **Section Management & Wizard (`/admin/sections`)**: 4-step wizard for section offering creation (Course & Term → Faculty & Capacity → Schedule & Room → Review & Submit).
- **Institutional Enrollment Roster (`/admin/enrollments`)**: Master enrollment history across all academic terms.
- **Billing & Invoicing (`/admin/invoices`)**: Tuition invoice generation, individual student billing, and term-wide bulk invoice creation.
- **Executive Analytics Hub (`/admin/reports`)**: 4 Recharts data visualizations driven by real backend report data:
  1. *Program Distribution*: Active scholars categorized by degree program.
  2. *Attendance Trends*: Campus-wide presence rates and absence breakdown.
  3. *Grade Distribution*: Aggregated academic performance curve (A+, A, B, C, F) and pass percentage.
  4. *Financial Collection*: Billed tuition fees vs. settled collections and outstanding amounts.
- **Security Audit Logs (`/admin/audit-logs`)**: Immutable audit trail documenting administrative actions with actor metadata and timestamps.
- **Profile & Security (`/admin/profile`)**: Privilege overview and administrative access key update.

### 2. 👨‍🏫 Faculty Workspace (`/instructor`)
- **Teaching Dashboard (`/instructor`)**: Live section counters, total scholars taught, and quick shortcuts.
- **Assigned Sections (`/instructor/sections`)**: Comprehensive cards with seat capacities, enrollment progress bars, and room numbers.
- **Section Details & Roster (`/instructor/sections/[id]`)**: Roster of enrolled students with contact numbers and email details.
- **Attendance Register (`/instructor/attendance`)**:
  - New session scheduler (date, time, lecture topic).
  - Bulk attendance sheet with one-click **"Mark All Present"** and fast status toggles (`PRESENT`, `ABSENT`, `LATE`, `EXCUSED`).
- **Examinations & Marksheets (`/instructor/exams`)**:
  - Assessment creator (Quizzes, Assignments, Midterms, Finals) with weightages and max score thresholds.
  - Bulk score entry matrix with real-time input bounds validation.
- **Grade Calculation & Publishing (`/instructor/results`)**:
  - Weighted score and GPA computation from assessment scores (`calculateSectionResults`).
  - Pre-publication gradebook review.
  - Formal student grade publishing with confirmation dialog (`publishSectionResults`).
- **Faculty Profile (`/instructor/profile`)**: Manage designation, contact phone number, and password credentials.

### 3. 🧑‍🎓 Student Academic Portal (`/student`)
- **Scholar Overview (`/student`)**: Cumulative GPA, earned credit units, current term enrollment status, and quick academic actions.
- **Course Self-Registration (`/student/registration`)**: Real-time catalog of open sections with seat availability badges and 1-click enrollment.
- **My Courses & Drop Workflow (`/student/courses`)**: Enrolled courses table with instructor details and drop course action.
- **Attendance Monitoring (`/student/attendance`)**: Overall attendance rate percentage badge and chronological lecture logs.
- **Published Results (`/student/results`)**: Term-by-term published course grades and earned grade points.
- **Official Transcript (`/student/transcript`)**: Academic transcript displaying CGPA, completed credit units, degree program, and term breakdown.
- **Student Finance & Payments (`/student/finance`)**:
  - Fee invoice tracking with outstanding vs. paid statuses.
  - Payment initiation connecting to **SSLCommerz Test Gateway** hosted flow.
  - Transaction history receipt logs with transaction references (`trxID`).
- **Student Profile (`/student/profile`)**: View academic standing, update residential address, contact number, and update password.

---

## 💳 Payment Architecture (SSLCommerz Test Mode)

In accordance with B7A7 mandatory guidelines, the application implements real payment gateway initiation and hosted redirection:
1. **Initiation**: Student clicks "Pay Now" on an outstanding invoice (`/student/finance`).
2. **Gateway Dispatch**: The request routes via `src/app/api/payment/sslcommerz/initiate` or backend payment gateway to SSLCommerz Sandbox (`https://sandbox.sslcommerz.com/gwprocess/v4/api.php`).
3. **Hosted Portal**: The scholar is redirected to SSLCommerz hosted checkout portal.
4. **Authoritative Callback**:
   - Success redirect: `/payment/success?tran_id=...&amount=...` with confetti visual confirmation.
   - Cancel redirect: `/payment/cancel` with safe return options.
5. **No Client-Side State Faking**: Invoices are never marked paid client-side; authoritative status updates occur server-side.

---

## ⚡ Technical Architecture & Highlights

- **Next.js 16 App Router**: Strict layout nesting, route groups `(marketing)`, `(auth)`, and `(dashboard)`, thin `page.tsx` architecture.
- **React 19 Server & Client Components**: Seamless separation of static layout trees and interactive client islands.
- **Edge Middleware (`src/middleware.ts`)**: Server-side JWT cookie verification with role-based routing boundaries (`/admin/**`, `/instructor/**`, `/student/**`).
- **TanStack Query v5**:
  - Domain-isolated query keys (`["admin", ...]`, `["student", ...]`, `["instructor", ...]`).
  - Cache invalidation and background refetching.
  - **Optimistic UI Updates**: Notification mark-as-read updates instant UI cache before server settlement with rollback protection.
- **TanStack React Form & Zod**: Type-safe validation on authentication, student registration, section creation wizard, and password management.
- **Zustand UI Store (`src/store/use-ui-store.ts`)**: Global UI client state for mobile drawer toggles and active semester filters without duplicating server cache.
- **URL-Synced Data State**: Search query terms (`searchTerm`), pagination indices (`page`, `limit`), and filter criteria are synced to browser URL parameters.
- **Scholarly Design System**: Built with Tailwind CSS v4 and OKLCH color spaces, establishing an academic navy palette (`oklch(0.38 0.16 260)`), slate neutrals, responsive data tables, and accessible contrast ratios.
- **Zero-Warning Code Quality**: 100% clean check under Biome 2.4.2 and TypeScript strict mode across all 125 project files.

---

## 📁 Project Directory Structure

```text
src/
├── api/                  # Typed domain API client services
│   ├── admin.api.ts      # Super Admin CRUD endpoints
│   ├── auth.api.ts       # Auth, current user & password endpoints
│   ├── instructor.api.ts # Section teaching, attendance & grading endpoints
│   ├── student.api.ts    # Student registration, transcript & finance endpoints
│   └── index.ts
├── app/                  # Next.js 16 App Router
│   ├── (auth)/           # /login, /register route group
│   ├── (dashboard)/      # Protected workspace route group
│   │   ├── admin/        # 12 Super Admin administration modules
│   │   ├── instructor/   # 6 Faculty teaching modules
│   │   └── student/      # 7 Student scholar modules
│   ├── (public)/         # Public marketing & informational routes
│   │   ├── about/
│   │   ├── academics/
│   │   ├── contact/
│   │   └── features/
│   ├── api/payment/      # SSLCommerz test mode API routes
│   ├── payment/          # Hosted gateway return callbacks (/success, /cancel)
│   ├── error.tsx         # Global error boundary
│   ├── loading.tsx       # Global Suspense skeleton boundary
│   └── globals.css       # Academic design tokens & OKLCH variables
├── components/           # Reusable UI domain components
│   ├── auth/             # Demo login buttons, AuthGuard, RoleGuard
│   ├── common/           # StatCard, EmptyState, TableSkeleton, UrlSearch, UrlPagination
│   ├── dashboard/        # DashboardShell, DashboardHeader, DashboardSidebar
│   ├── form/             # LoginForm, RegisterForm (TanStack Form + Zod)
│   ├── layout/           # PublicHeader, PublicFooter
│   ├── modules/          # SectionWizard (4-step section creator)
│   └── ui/               # Base UI & Tailwind atomic primitives
├── hooks/                # Custom React hooks (auth, debounce)
├── lib/                  # apiClient (ofetch interceptors), auth-token (cookies/JWT)
├── providers/            # QueryProvider, GoogleAuthProvider, TooltipProvider, Toaster
├── store/                # Zustand useUiStore
├── types/                # Domain TypeScript interfaces (academic, auth, api)
└── validation/           # Zod schemas (auth, section, exam)
```

---

## 🛠️ Environment Configuration

Create a `.env.local` file in the project root:

```env
# Backend REST API Base URL
NEXT_PUBLIC_API_BASE_URL=https://university-management-system-mu-sage.vercel.app/api/v1

# SSLCommerz Test Mode Credentials (Optional Override)
SSLCOMMERZ_STORE_ID=testbox
SSLCOMMERZ_STORE_PASS=qwerty

# Google OAuth Client ID (Optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

---

## 🚀 Development & Production Commands

```bash
# Install dependencies using Bun
bun install

# Start local Next.js development server
bun run dev

# Run Biome code quality and lint checks
bun run lint

# Run TypeScript strict type verification
bunx tsc --noEmit

# Compile production bundle
bun run build

# Start production server
bun run start
```

---

## 📜 5-Day Implementation Commit Trail

The repository features 22+ structured, conventional commits strictly mapping to the official 5-Day Roadmap:

1. `dafe364` — `first commit`
2. `541a2a8` — `chore: initialize university management frontend`
3. `9251517` — `chore: configure shadcn tailwind and biome`
4. `ac4952f` — `feat: establish application route groups`
5. `e550c78` — `feat: add shared public and dashboard layouts`
6. `6ff5f6a` — `feat: configure api client and query provider`
7. `769cc88` — `feat: implement authentication api integration`
8. `87c9b27` — `feat: add one-click demo authentication`
9. `82bf2b5` — `feat: add login and registration forms`
10. `84ca32b` — `feat: protect dashboard routes with middleware`
11. `d652cd6` — `feat: add reusable data table controls and boundary states`
12. `9df84a9` — `feat: implement domain api services for admin, student, and instructor`
13. `2ada79b` — `feat: add student and faculty administration dashboards`
14. `d5b2e6f` — `feat: implement department, degree program, and course catalogs`
15. `7425229` — `feat: implement semester scheduling and multi-step section creation wizard`
16. `7869fb3` — `feat: add fee invoicing, enrollment tracking, audit logs, and recharts analytics`
17. `493b987` — `feat: implement student academic portal with self-registration and fee payments`
18. `835f39d` — `feat: add lightweight ui state store`
19. `580bb78` — `feat: add instructor section workflows`
20. `f956b82` — `feat: implement role-specific profile and security settings`
21. `735c66c` — `feat: integrate sslcommerz test payment flow`
22. `0148e67` — `fix: resolve hydration and responsive issues`
