# University Management System — Role & API Matrix

This internal matrix maps the real backend REST API functionality inspected from the B7A6 University Management System backend against the consuming frontend pages, components, and user roles.

---

## Roles Overview
- **`SUPER_ADMIN`**: Institutional governance, academic catalog management, student/faculty administration, enrollments, reports & analytics.
- **`INSTRUCTOR`**: Course section management, student rosters, session attendance, exams & grading, and result publication.
- **`STUDENT`**: Academic dashboard, course enrollment, class schedules, attendance tracking, published grades, unofficial transcripts, and fee payment.

---

## Detailed Endpoint Matrix

| Endpoint | HTTP Method | Auth Required | Allowed Roles | Request Body | Query Parameters | Response Structure | Frontend Consumer Page / Component |
|---|---|---|---|---|---|---|---|
| `/auth/login` | `POST` | No | Public | `{ email, password }` | None | `{ accessToken, needPasswordChange }` | `LoginForm`, `OneClickDemoLogin` |
| `/auth/register` | `POST` | No | Public | `{ email, password, name, programId, admissionSemesterId, gender, contactNo }` | None | Student Profile & User object | `RegisterForm` |
| `/auth/refresh-token` | `POST` | Cookie / Opt | Public | None | None | `{ accessToken }` | `apiClient` token interceptor |
| `/auth/logout` | `POST` | No | Public | None | None | `null` | Header, Sidebar user menu |
| `/auth/google` | `POST` | No | Public | `{ idToken, programId?, admissionSemesterId? }` | None | `{ accessToken, needPasswordChange }` | `GoogleLoginComponent` |
| `/auth/me` | `GET` | Yes | `SUPER_ADMIN`, `INSTRUCTOR`, `STUDENT` | None | None | Full profile (`user`, relations) | `AuthGuard`, `RoleGuard`, `useGetMe` |
| `/auth/change-password` | `POST` | Yes | `SUPER_ADMIN`, `INSTRUCTOR`, `STUDENT` | `{ oldPassword, newPassword }` | None | `null` | Settings/Password Modal |
| `/students` | `GET` | Yes | `SUPER_ADMIN` | None | `page, limit, searchTerm, programId, academicStatus, gender` | Paginated `{ meta, data: Student[] }` | `/admin/students` Data Table |
| `/students/:id` | `GET` | Yes | `SUPER_ADMIN` | None | None | Student details | `/admin/students/[id]` |
| `/students` | `POST` | Yes | `SUPER_ADMIN` | `{ name, email, password, programId, admissionSemesterId, ... }` | None | Student object | Create Student Dialog |
| `/students/:id` | `PATCH` | Yes | `SUPER_ADMIN` | Partial student update payload | None | Updated student | Edit Student Dialog |
| `/students/me` | `GET` | Yes | `STUDENT` | None | None | Current student profile | `/student/profile`, `/student` |
| `/students/me` | `PATCH` | Yes | `STUDENT` | `{ contactNo, address, ... }` | None | Updated profile | Student Profile Editor |
| `/instructors` | `GET` | Yes | `SUPER_ADMIN` | None | `page, limit, searchTerm, departmentId, designation` | Paginated `{ meta, data: Instructor[] }` | `/admin/instructors` Data Table |
| `/instructors/:id` | `GET` | Yes | `SUPER_ADMIN` | None | None | Instructor details | `/admin/instructors/[id]` |
| `/instructors` | `POST` | Yes | `SUPER_ADMIN` | `{ name, email, password, departmentId, designation, ... }` | None | Instructor object | Create Instructor Dialog |
| `/instructors/:id` | `PATCH` | Yes | `SUPER_ADMIN` | Partial instructor payload | None | Updated instructor | Edit Instructor Dialog |
| `/instructors/me` | `GET` | Yes | `INSTRUCTOR` | None | None | Current instructor profile | `/instructor/profile`, `/instructor` |
| `/departments` | `GET` | Optional | All / Public | None | `searchTerm, isActive` | Department[] | Catalog selectors, `/admin/departments` |
| `/departments` | `POST` | Yes | `SUPER_ADMIN` | `{ code, name }` | None | Department object | Create Department Form |
| `/departments/:id` | `PATCH` | Yes | `SUPER_ADMIN` | `{ code?, name?, isActive? }` | None | Department object | Edit Department Form |
| `/departments/:id` | `DELETE` | Yes | `SUPER_ADMIN` | None | None | Deleted confirmation | Delete Department Action |
| `/programs` | `GET` | Optional | All / Public | None | `searchTerm, departmentId, degreeType` | Program[] | Registration form, `/admin/programs` |
| `/programs` | `POST` | Yes | `SUPER_ADMIN` | `{ code, name, departmentId, degreeType, totalCredits }` | None | Program object | Create Program Form |
| `/programs/:id` | `PATCH` | Yes | `SUPER_ADMIN` | Partial program payload | None | Program object | Edit Program Form |
| `/courses` | `GET` | Yes | `SUPER_ADMIN`, `INSTRUCTOR`, `STUDENT` | None | `page, limit, searchTerm, departmentId` | Paginated Course[] | Catalog, `/admin/courses` |
| `/courses` | `POST` | Yes | `SUPER_ADMIN` | `{ code, title, credits, departmentId, ... }` | None | Course object | Create Course Form |
| `/courses/:id` | `PATCH` | Yes | `SUPER_ADMIN` | Partial course payload | None | Course object | Edit Course Form |
| `/semesters` | `GET` | Yes | `SUPER_ADMIN`, `INSTRUCTOR`, `STUDENT` | None | `year, term, status` | Semester[] | Semester picker, `/admin/semesters` |
| `/semesters` | `POST` | Yes | `SUPER_ADMIN` | `{ year, term, registrationStart, classStart, ... }` | None | Semester object | Create Semester Form |
| `/semesters/:id/status` | `PATCH` | Yes | `SUPER_ADMIN` | `{ status }` | None | Updated Semester | Semester Status Transition Flow |
| `/sections` | `GET` | Yes | `SUPER_ADMIN`, `INSTRUCTOR`, `STUDENT` | None | `courseId, semesterId, instructorId, status` | Section[] | Section listings, `/admin/sections` |
| `/sections/available` | `GET` | Yes | `STUDENT` | None | `courseId?, semesterId?` | AvailableSection[] | Student Course Registration |
| `/sections` | `POST` | Yes | `SUPER_ADMIN` | Multi-step section payload | None | Created Section | Multi-step Section Wizard |
| `/sections/:id/students` | `GET` | Yes | `SUPER_ADMIN`, `INSTRUCTOR` | None | None | Student Roster | Section Student Roster |
| `/sections/:id/attendance-sessions` | `POST` | Yes | `INSTRUCTOR`, `SUPER_ADMIN` | `{ sessionDate, startTime, endTime, topic }` | None | AttendanceSession | New Attendance Session Modal |
| `/sections/:id/attendance` | `GET` | Yes | `INSTRUCTOR`, `SUPER_ADMIN` | None | None | AttendanceSession[] with records | Instructor Attendance Grid |
| `/attendance/sessions/:id/records/bulk`| `POST` | Yes | `INSTRUCTOR`, `SUPER_ADMIN` | `{ records: [{ studentId, status, remark? }] }` | None | AttendanceRecord[] | Bulk Attendance Marker |
| `/attendance/me` | `GET` | Yes | `STUDENT` | None | None | Summary & Records | Student Attendance Dashboard |
| `/sections/:id/exams` | `POST` | Yes | `INSTRUCTOR`, `SUPER_ADMIN` | `{ name, examType, maxMarks, weightage, examDate }` | None | Exam object | Create Exam Dialog |
| `/sections/:id/exams` | `GET` | Yes | `INSTRUCTOR`, `SUPER_ADMIN` | None | None | Exam[] | Section Exams List |
| `/exams/:id/results/bulk` | `POST` | Yes | `INSTRUCTOR`, `SUPER_ADMIN` | `{ marks: [{ studentId, obtainedMarks, remarks? }] }` | None | ExamResult[] | Bulk Mark Submitter |
| `/sections/:id/results/calculate` | `POST` | Yes | `INSTRUCTOR`, `SUPER_ADMIN` | None | None | Calculation summary | Calculate Grades Action |
| `/sections/:id/results/publish` | `PATCH` | Yes | `INSTRUCTOR`, `SUPER_ADMIN` | None | None | Published confirmation | Publish Grades Action |
| `/results/me` | `GET` | Yes | `STUDENT` | None | None | CourseResult[] | Student Grades Tab |
| `/transcripts/me` | `GET` | Yes | `STUDENT` | None | None | Official Transcript Object | Student Transcript Page |
| `/enrollments/me` | `GET` | Yes | `STUDENT` | None | None | Enrollment[] | My Courses / Active Classes |
| `/enrollments` | `POST` | Yes | `STUDENT` | `{ sectionId }` | None | Enrollment confirmation | Course Registration Action |
| `/enrollments/:id/drop` | `PATCH` | Yes | `STUDENT`, `SUPER_ADMIN` | None | None | Dropped enrollment | Drop Course Dialog |
| `/enrollments` | `GET` | Yes | `SUPER_ADMIN` | None | `studentId, sectionId, semesterId, status` | Enrollment[] | Admin Enrollments Management |
| `/fees/invoices/me` | `GET` | Yes | `STUDENT` | None | None | FeeInvoice[] | Student Finance / Invoices |
| `/fees/invoices` | `GET` | Yes | `SUPER_ADMIN` | None | `status, studentId, semesterId` | FeeInvoice[] | Admin Invoices Management |
| `/fees/invoices` | `POST` | Yes | `SUPER_ADMIN` | `{ studentId, semesterId, amount, dueDate }` | None | FeeInvoice | Create Invoice Form |
| `/payments/initiate` | `POST` | Yes | `STUDENT` | `{ invoiceId }` | None | Payment session redirect | Pay Now / SSLCommerz Flow |
| `/payments/me` | `GET` | Yes | `STUDENT` | None | None | Payment[] | Student Payment History |
| `/payments/:id` | `GET` | Yes | `STUDENT`, `SUPER_ADMIN` | None | None | Payment & Invoice status | Payment Verification View |
| `/notifications` | `GET` | Yes | All Authenticated | None | None | Notification[] | Header Notification Bell |
| `/notifications/:id/read` | `PATCH` | Yes | All Authenticated | None | None | Updated Notification | Optimistic Mark-as-read Action |
| `/reports/enrollments` | `GET` | Yes | `SUPER_ADMIN` | None | None | Enrollment stats by semester | Recharts Enrollment Chart |
| `/reports/attendance` | `GET` | Yes | `SUPER_ADMIN` | None | None | University attendance rates | Recharts Attendance Chart |
| `/reports/results` | `GET` | Yes | `SUPER_ADMIN` | None | None | Grade distribution stats | Recharts Grade Distribution Chart |
| `/reports/finance` | `GET` | Yes | `SUPER_ADMIN` | None | None | Collected vs Pending dues | Recharts Finance Overview |
