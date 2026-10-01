import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  AttendanceRecord,
  CourseResult,
  Enrollment,
  FeeInvoice,
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

export function getAvailableSections(params?: {
  courseId?: string;
  semesterId?: string;
}) {
  return apiClient<ApiResponse<Section[]>>("/sections/available", {
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
      summary: Array<{
        sectionId: string;
        courseCode: string;
        courseTitle: string;
        totalSessions: number;
        presentCount: number;
        attendancePercentage: number;
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
  return apiClient<
    ApiResponse<{
      paymentId: string;
      paymentID?: string;
      bkashURL?: string;
      sslcommerzGatewayUrl?: string;
      merchantInvoiceNumber: string;
      amount: number;
    }>
  >("/payments/initiate", {
    method: "POST",
    body: { invoiceId },
  });
}

export function getMyPayments() {
  return apiClient<ApiResponse<Payment[]>>("/payments/me");
}

export function getPaymentById(paymentId: string) {
  return apiClient<ApiResponse<Payment>>(`/payments/${paymentId}`);
}
