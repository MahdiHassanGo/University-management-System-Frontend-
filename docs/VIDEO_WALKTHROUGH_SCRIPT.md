# 🎬 University Management System — Video Walkthrough & Presentation Guide

This guide provides a professional, minute-by-minute script and execution checklist for presenting and recording the **5–10 Minute Video Walkthrough** required for the B7A7 submission.

---

## ⏱️ Video Structure & Timeline (Target: 7–8 Minutes)

| Time | Segment | What to Show / Demonstrate | Key Technical Talking Points |
|---|---|---|---|
| **0:00 – 1:00** | **Project Overview & Architecture** | Public Homepage (`/`), Brand Identity, Nav Links | Next.js 16 App Router, React 19, Tailwind CSS v4, Academic OKLCH design system, separation of Server & Client components |
| **1:00 – 2:00** | **Authentication & One-Click Demo** | `/login`, Demo Buttons (Super Admin, Instructor, Student), Zod Form Validation | Real backend authentication, JWT cookies (`ums_access_token`), edge `middleware.ts` route protection, Zod validation errors on invalid inputs |
| **2:00 – 3:30** | **Super Admin Console** | `/admin`, Students (`/admin/students`), Sections & Wizard (`/admin/sections`), Analytics (`/admin/reports`) | URL-synced debounced search & pagination, 4-step Section Wizard with TanStack Form, 4 Recharts visual charts based on real backend metrics |
| **3:30 – 5:00** | **Faculty Workspace (Instructor)** | `/instructor`, Assigned Sections (`/instructor/sections`), Attendance Sheet (`/instructor/attendance`), Exam Scores & Grade Publishing (`/instructor/results`) | Section seat progress bars, bulk attendance marking with *"Mark All Present"*, score entry matrix, automated grade calculations and confirmation dialog |
| **5:00 – 6:30** | **Student Academic Portal & Payments** | `/student`, Course Registration (`/student/registration`), Attendance & Results, Student Finance (`/student/finance`) | Real-time seat availability, 1-click course enrollment & drop, official CGPA transcript, SSLCommerz Test Mode hosted payment gateway |
| **6:30 – 7:30** | **Optimistic UI, Responsiveness & Wrap-up** | Notification mark-as-read, Mobile drawer viewport (375px), DevTools inspect | TanStack Query `onMutate` optimistic updates with cache snapshot & rollback, responsive drawers, Biome & TypeScript 0-warning guarantee |

---

## 🎙️ Step-by-Step Script & Narration Guide

### 1. Introduction (0:00 – 1:00)
- **Action**: Open `http://localhost:3000` (or your live deployed Vercel URL).
- **Narration**:
  > *"Hello and welcome to the demonstration of UniCore ERP — a modern, enterprise-grade University Management System built for the B7A7 assignment. This frontend is developed using Next.js 16 App Router, React 19, TypeScript strict mode, Tailwind CSS v4, and TanStack Query v5.*
  > *Notice our cohesive scholarly design system featuring an academic navy palette, glassmorphism headers, accessible contrast ratios, and responsive layouts across all device sizes."*
- **Action**: Scroll through the public homepage showing Academic Programs, Statistics, and Features. Click on `/academics` and `/contact`.

---

### 2. Authentication & 1-Click Demo Login (1:00 – 2:00)
- **Action**: Click **"Sign In"** in the top navigation bar to go to `/login`.
- **Narration**:
  > *"Here on the authentication portal, we implement dual validation: client-side type-safe schemas powered by Zod and TanStack React Form, paired with real backend API responses. If I enter an invalid email or short password, Zod instantly indicates validation feedback."*
- **Action**: Type `abc` in the email input and blur to trigger instant Zod validation error.
- **Narration**:
  > *"For instant institutional evaluation, we built the Mandatory One-Click Demo Access buttons. Clicking any of these three buttons does not simply populate text fields — it executes real authentication against our live backend REST API, receives a cryptographically signed JWT token, establishes HTTP-safe cookies, and redirects according to role boundaries."*
- **Action**: Click the **"Super Admin"** demo button. Observe the loading spinner and instant redirect to `/admin`.

---

### 3. Super Admin Workspace (2:00 – 3:30)
- **Action**: On `/admin`, show the live KPI StatCards (Total Students, Faculty Members, Curriculum Courses, Active Sections).
- **Narration**:
  > *"We are now in the Super Admin Console. Let's inspect Student Administration."*
- **Action**: Navigate to `/admin/students`. Type a search query in the search bar (e.g., `student`).
- **Narration**:
  > *"Notice that search terms and pagination are fully URL-synchronized using our custom useDebounce hook and Next.js navigation. Refreshing the browser preserves the exact filtered view. We also have full loading skeletons and empty states."*
- **Action**: Navigate to `/admin/sections`. Click **"Create Section Offering"**.
- **Narration**:
  > *"Here is the Mandatory 4-Step Section Creation Wizard: Step 1 selects the Course and Semester term; Step 2 assigns the Faculty Instructor and Seat Capacity; Step 3 configures the weekly class schedule and room number; and Step 4 provides a full review before committing to the real backend database."*
- **Action**: Navigate to `/admin/reports`. Show the 4 Recharts data visualizations.
- **Narration**:
  > *"Our Executive Analytics Hub features four real-time charts populated directly from backend reports: Program Enrollment Distribution, Campus Attendance Breakdown, Grade Distribution Curve, and Finance Tuition Collection."*
- **Action**: Click the sign-out icon in the top right user menu to log out.

---

### 4. Faculty Workspace (Instructor) (3:30 – 5:00)
- **Action**: On `/login`, click the **"Instructor"** demo button. Redirect to `/instructor`.
- **Narration**:
  > *"Now logged in as a Faculty Member. Here in the Faculty Workspace, professors manage their assigned teaching sections, track daily attendance, record examination scores, and publish final student grades."*
- **Action**: Navigate to `/instructor/sections`.
- **Narration**:
  > *"In Assigned Sections, each card displays real-time enrolled student ratios with visual progress bars, room assignments, and direct shortcuts to Rosters and Attendance."*
- **Action**: Navigate to `/instructor/attendance`. Select a section and show the student sheet. Click **"Mark All Present"**.
- **Narration**:
  > *"The attendance register lets instructors schedule sessions and mark student attendance in bulk with a single click, or toggle individual Present, Absent, Late, or Excused status badges."*
- **Action**: Navigate to `/instructor/results`.
- **Narration**:
  > *"Once exams and quizzes are scored, instructors click 'Calculate Final Grades' to compute weighted GPAs, review the gradebook, and formally publish grades with an authoritative confirmation modal."*
- **Action**: Click the sign-out icon.

---

### 5. Student Academic Portal & Payments (5:00 – 6:30)
- **Action**: On `/login`, click the **"Student"** demo button. Redirect to `/student`.
- **Narration**:
  > *"Now logging in as an enrolled Student. The Student Portal provides a complete academic command center: Cumulative GPA, earned credits, enrolled courses, and active invoices."*
- **Action**: Navigate to `/student/registration`. Show open sections.
- **Narration**:
  > *"Under Course Registration, students can browse available sections with real-time seat counts and enroll with a single click."*
- **Action**: Navigate to `/student/transcript`.
- **Narration**:
  > *"The Official Transcript organizes all completed semesters, calculating term GPAs and cumulative CGPAs using authoritative server data."*
- **Action**: Navigate to `/student/finance`.
- **Narration**:
  > *"In Student Finance, scholars track tuition invoices and payment receipts. Clicking 'Pay Now' initiates our SSLCommerz Test Mode hosted payment flow, taking the scholar to the secure checkout gateway, and returning them to our payment success screen with confetti confirmation upon verification."*

---

### 6. Optimistic UI & Mobile Responsiveness (6:30 – 7:30)
- **Action**: Click the **Bell Icon** in the top header. Click **"Mark read"** on an unread notification.
- **Narration**:
  > *"Notice the notification counter: we implemented TanStack Query optimistic updates using onMutate, cache snapshots, and rollback error handling so interactions feel instantaneous."*
- **Action**: Open Chrome DevTools, toggle Device Toolbar to iPhone SE / 375px width. Open the sidebar navigation drawer.
- **Narration**:
  > *"Finally, every screen is fully responsive. Our navigation drawer transforms into an accessible mobile sheet, data tables feature horizontal scrolling to prevent clipped layouts, and all modals adapt to compact viewports."*
- **Action**: Close DevTools and conclude.
- **Narration**:
  > *"The entire codebase has 0 lint errors in Biome, 0 TypeScript strict errors, 40 out of 40 compiled routes in Next.js production build, and 24 conventional commits pushed to our GitHub repository. Thank you for watching!"*

---

## 📋 Checklist Before Pressing Record

- [ ] Dev server running (`bun run dev` at `http://localhost:3000`) or Live Vercel URL open.
- [ ] Browser zoom set to 100% or 110% for crisp readability.
- [ ] Microphone tested and background audio clear.
- [ ] Screen recording resolution set to 1080p (1920x1080).
