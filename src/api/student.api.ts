import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  AttendanceRecord,
  CourseResult,
  Enrollment,
  FeeInvoice,
  ListResponse,
  PaginationParams,
  Payment,
  Section,
  StudentProfile,
  Transcript,
} from "@/types";

export function getMyStudentProfile() {
  return apiClient<ApiResponse<StudentProfile>>("/students/me");
}

export function updateMyStudentProfile(payload: {
  contactNo?: string;
  address?: string;
}) {
  return apiClient<ApiResponse<StudentProfile>>("/students/me", {
    method: "PATCH",
    body: payload,
  });
}

export function getAvailableSections(
  params?: PaginationParams & {
    courseId?: string;
    semesterId?: string;
  },
) {
  return apiClient<ListResponse<Section>>("/sections/available", {
    params,
  });
}

export function enrollCourse(sectionId: string) {
  return apiClient<ApiResponse<Enrollment>>("/enrollments", {
    method: "POST",
    body: { sectionId },
  });
}

export function dropCourse(enrollmentId: string) {
  return apiClient<ApiResponse<Enrollment>>(
    `/enrollments/${enrollmentId}/drop`,
    {
      method: "PATCH",
    },
  );
}

export function getMyEnrollments() {
  return apiClient<ApiResponse<Enrollment[]>>("/enrollments/me");
}

export function getMyAttendance() {
  return apiClient<
    ApiResponse<{
      summaries: Array<{
        sectionId: string;
        courseCode: string;
        courseTitle: string;
        totalSessions: number;
        presentCount: number;
        percentage: number;
      }>;
      records: AttendanceRecord[];
    }>
  >("/attendance/me");
}

export function getMyResults() {
  return apiClient<ApiResponse<CourseResult[]>>("/results/me");
}

export function getMyTranscript() {
  return apiClient<ApiResponse<Transcript>>("/transcripts/me");
}

export function getMyInvoices() {
  return apiClient<ApiResponse<FeeInvoice[]>>("/fees/invoices/me");
}

export function initiatePayment(invoiceId: string) {
  const frontendUrl =
    typeof window !== "undefined" ? window.location.origin : undefined;
  return apiClient<
    ApiResponse<{
      paymentId: string;
      gatewayUrl: string;
      merchantInvoiceNumber: string;
      amount: number;
    }>
  >("/payments/initiate", {
    method: "POST",
    body: { invoiceId, frontendUrl },
  });
}

export function getMyPayments() {
  return apiClient<ApiResponse<Payment[]>>("/payments/me");
}

export function getPaymentById(paymentId: string) {
  return apiClient<ApiResponse<Payment>>(`/payments/${paymentId}`);
}
