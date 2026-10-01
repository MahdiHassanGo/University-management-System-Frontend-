import apiClient from "@/lib/apiClient";
import type {
  AcademicSemester,
  ApiResponse,
  AttendanceReport,
  Course,
  Department,
  Enrollment,
  EnrollmentReport,
  FeeInvoice,
  FinanceReport,
  InstructorProfile,
  PaginationParams,
  Program,
  ResultReport,
  Section,
  StudentProfile,
} from "@/types";

// --- STUDENTS ---
export function getAllStudents(params?: PaginationParams) {
  return apiClient<ApiResponse<StudentProfile[]>>("/students", {
    params,
  });
}

export function getStudentById(id: string) {
  return apiClient<ApiResponse<StudentProfile>>(`/students/${id}`);
}

export function createStudent(payload: any) {
  return apiClient<ApiResponse<StudentProfile>>("/students", {
    method: "POST",
    body: payload,
  });
}

export function updateStudent(id: string, payload: any) {
  return apiClient<ApiResponse<StudentProfile>>(`/students/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

// --- INSTRUCTORS ---
export function getAllInstructors(params?: PaginationParams) {
  return apiClient<ApiResponse<InstructorProfile[]>>("/instructors", {
    params,
  });
}

export function getInstructorById(id: string) {
  return apiClient<ApiResponse<InstructorProfile>>(`/instructors/${id}`);
}

export function createInstructor(payload: any) {
  return apiClient<ApiResponse<InstructorProfile>>("/instructors", {
    method: "POST",
    body: payload,
  });
}

export function updateInstructor(id: string, payload: any) {
  return apiClient<ApiResponse<InstructorProfile>>(`/instructors/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

// --- DEPARTMENTS ---
export function getAllDepartments(params?: {
  searchTerm?: string;
  isActive?: boolean;
}) {
  return apiClient<ApiResponse<Department[]>>("/departments", {
    params,
  });
}

export function createDepartment(payload: { code: string; name: string }) {
  return apiClient<ApiResponse<Department>>("/departments", {
    method: "POST",
    body: payload,
  });
}

export function updateDepartment(
  id: string,
  payload: { code?: string; name?: string; isActive?: boolean },
) {
  return apiClient<ApiResponse<Department>>(`/departments/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteDepartment(id: string) {
  return apiClient<ApiResponse<any>>(`/departments/${id}`, {
    method: "DELETE",
  });
}

// --- PROGRAMS ---
export function getAllPrograms(params?: {
  searchTerm?: string;
  departmentId?: string;
  degreeType?: string;
  isActive?: boolean;
}) {
  return apiClient<ApiResponse<Program[]>>("/programs", {
    params,
  });
}

export function createProgram(payload: {
  code: string;
  name: string;
  departmentId: string;
  degreeType: string;
  totalCredits: number;
  maxSemesterCredits: number;
}) {
  return apiClient<ApiResponse<Program>>("/programs", {
    method: "POST",
    body: payload,
  });
}

export function updateProgram(id: string, payload: any) {
  return apiClient<ApiResponse<Program>>(`/programs/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteProgram(id: string) {
  return apiClient<ApiResponse<any>>(`/programs/${id}`, {
    method: "DELETE",
  });
}

// --- COURSES ---
export function getAllCourses(params?: PaginationParams) {
  return apiClient<ApiResponse<Course[]>>("/courses", {
    params,
  });
}

export function getCourseById(id: string) {
  return apiClient<ApiResponse<Course>>(`/courses/${id}`);
}

export function createCourse(payload: {
  code: string;
  title: string;
  credits: number;
  departmentId: string;
  isElective?: boolean;
  description?: string;
  syllabus?: string;
  prerequisites?: string[];
}) {
  return apiClient<ApiResponse<Course>>("/courses", {
    method: "POST",
    body: payload,
  });
}

export function updateCourse(id: string, payload: any) {
  return apiClient<ApiResponse<Course>>(`/courses/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteCourse(id: string) {
  return apiClient<ApiResponse<any>>(`/courses/${id}`, {
    method: "DELETE",
  });
}

// --- SEMESTERS ---
export function getAllSemesters(params?: {
  year?: number;
  term?: string;
  status?: string;
}) {
  return apiClient<ApiResponse<AcademicSemester[]>>("/semesters", {
    params,
  });
}

export function createSemester(payload: any) {
  return apiClient<ApiResponse<AcademicSemester>>("/semesters", {
    method: "POST",
    body: payload,
  });
}

export function updateSemesterStatus(id: string, status: string) {
  return apiClient<ApiResponse<AcademicSemester>>(`/semesters/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export function deleteSemester(id: string) {
  return apiClient<ApiResponse<any>>(`/semesters/${id}`, {
    method: "DELETE",
  });
}

// --- SECTIONS ---
export function getAllSections(params?: {
  courseId?: string;
  semesterId?: string;
  instructorId?: string;
  status?: string;
  searchTerm?: string;
}) {
  return apiClient<ApiResponse<Section[]>>("/sections", {
    params,
  });
}

export function getSectionById(id: string) {
  return apiClient<ApiResponse<Section>>(`/sections/${id}`);
}

export function createSection(payload: {
  courseId: string;
  semesterId: string;
  instructorId: string;
  sectionNumber: number;
  capacity: number;
  roomNumber?: string;
  schedule?: any;
}) {
  return apiClient<ApiResponse<Section>>("/sections", {
    method: "POST",
    body: payload,
  });
}

export function updateSection(id: string, payload: any) {
  return apiClient<ApiResponse<Section>>(`/sections/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteSection(id: string) {
  return apiClient<ApiResponse<any>>(`/sections/${id}`, {
    method: "DELETE",
  });
}

// --- ENROLLMENTS ---
export function getAllEnrollments(params?: {
  studentId?: string;
  sectionId?: string;
  semesterId?: string;
  status?: string;
}) {
  return apiClient<ApiResponse<Enrollment[]>>("/enrollments", {
    params,
  });
}

// --- INVOICES & REPORTS ---
export function getAllInvoices(params?: {
  status?: string;
  studentId?: string;
  semesterId?: string;
}) {
  return apiClient<ApiResponse<FeeInvoice[]>>("/fees/invoices", {
    params,
  });
}

export function createInvoice(payload: {
  studentId: string;
  semesterId: string;
  amount: number;
  dueDate: string;
}) {
  return apiClient<ApiResponse<FeeInvoice>>("/fees/invoices", {
    method: "POST",
    body: payload,
  });
}

export function bulkCreateInvoices(payload: {
  semesterId: string;
  amount: number;
  dueDate: string;
}) {
  return apiClient<ApiResponse<any>>("/fees/invoices/bulk", {
    method: "POST",
    body: payload,
  });
}

export function getEnrollmentReport() {
  return apiClient<ApiResponse<EnrollmentReport>>("/reports/enrollments");
}

export function getAttendanceReport() {
  return apiClient<ApiResponse<AttendanceReport>>("/reports/attendance");
}

export function getResultReport() {
  return apiClient<ApiResponse<ResultReport>>("/reports/results");
}

export function getFinanceReport() {
  return apiClient<ApiResponse<FinanceReport>>("/reports/finance");
}

export function getAllAuditLogs(params?: PaginationParams) {
  return apiClient<ApiResponse<any[]>>("/audit-logs", {
    params,
  });
}
