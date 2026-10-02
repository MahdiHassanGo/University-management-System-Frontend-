# 📋 University Management System — Final Submission Sheet

This document contains the finalized submission parameters for the **B7A7 University Management System** assignment.

---

## 📌 Submission Information

- **Project Name**: University Management System (UniCore ERP)
- **Frontend Repository**: [https://github.com/MahdiHassanGo/University-management-System-Frontend-.git](https://github.com/MahdiHassanGo/University-management-System-Frontend-.git)
- **Backend Repository**: [https://github.com/MahdiHassanGo/University-Management-System-Backend](https://github.com/MahdiHassanGo/University-Management-System-Backend) (Level 2 Assignment 6)
- **Live Production Backend API**: `https://university-management-system-mu-sage.vercel.app/api/v1`
- **Backend Health Check**: `https://university-management-system-mu-sage.vercel.app/health`
- **Live Frontend URL**: Deployed via Vercel connecting to `MahdiHassanGo/University-management-System-Frontend-`
- **API Documentation**: Documented in `docs/ROLE_API_MATRIX.md` covering all 19 modules, endpoints, request/response structures, and UI consumers.
- **Video Walkthrough Guide**: Documented in `docs/VIDEO_WALKTHROUGH_SCRIPT.md` with timestamped narration and step-by-step clicks.

---

## 🔑 Demo Account Credentials

| Institutional Role | Demo Email | Demo Password | Role Access Level |
|---|---|---|---|
| **Super Admin** | `admin@university.edu` | `Admin123!` | Master governance, catalog CRUD, billing, reports |
| **Faculty Instructor** | `instructor@university.edu` | `Instructor123!` | Assigned sections, attendance register, exam marks, grade publication |
| **Student** | `student@university.edu` | `Student123!` | Self-registration, class schedule, transcript, fee payments |

> 💡 **One-Click Real Demo Access**: The login page (`/login`) features functioning 1-click buttons that automatically authenticate against the live production backend, receive cryptographically signed JWT access tokens, establish secure session cookies, and route to the correct workspace.

---

## 🏆 Mandatory Criteria Completion Checklist

- [x] **Day 1: Planning, Setup & Design System**
  - Mapped real backend endpoints in `docs/ROLE_API_MATRIX.md`.
  - Next.js 16 App Router + React 19 + Tailwind CSS v4 + Biome 2.4.2 + Bun.
  - Scholarly academic navy design system tokens in `globals.css`.
  - Foundational layouts, shell, header, sidebar, mobile navigation, ofetch API client, and providers.
- [x] **Day 2: Authentication & Protected Routes**
  - Real backend authentication APIs (login, register, logout, current user, change password).
  - TanStack React Form + Zod validation with server error feedback.
  - Mandatory One-Click Demo Login for all 3 roles.
  - Next.js 16 Edge Middleware (`middleware.ts`) enforcing strict role boundaries (`/admin/**`, `/instructor/**`, `/student/**`).
  - Dual protection with client-side `AuthGuard` and `RoleGuard`.
- [x] **Day 3: Core Features & Dashboards**
  - Full CRUD and management for Students, Instructors, Departments, Programs, Courses, Semesters, Sections, Invoices, and Enrollments.
  - Student academic portal (registration, enrolled courses, attendance, results, transcript).
  - Faculty workspace (assigned sections, student rosters, bulk attendance register, exams marks entry matrix, automated grade calculations, and formal publishing).
  - URL-synced search, pagination, and filters (`UrlSearch`, `UrlPagination`).
  - Loading skeletons (`TableSkeleton`, `loading.tsx`), empty states (`EmptyState`), and error boundaries (`error.tsx`).
  - 4 Recharts data visualizations in `/admin/reports` using real backend metrics.
- [x] **Day 4: Complex Workflows & Payment**
  - Mandatory 4-Step Create Section Wizard (`create-section-wizard.tsx`).
  - Zustand UI store (`use-ui-store.ts`) for mobile drawer state.
  - Optimistic UI updates on notification mark-as-read with TanStack Query rollback.
  - SSLCommerz Test Mode hosted payment gateway integration with `/payment/success` and `/payment/cancel` callbacks.
  - Student finance invoice management and payment initiation.
- [x] **Day 5: Polish & Quality**
  - Responsive layouts tested across 375px mobile, tablet, and desktop viewports.
  - 100% clean check under Biome 2.4.2 (0 errors, 0 warnings).
  - 100% clean check under TypeScript strict mode (0 errors).
  - 100% clean Next.js production build (`40/40` static and dynamic routes compiled).
  - 25+ conventional, structured commits pushed to GitHub.
