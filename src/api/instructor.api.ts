import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  AttendanceSession,
  Exam,
  ExamResult,
  InstructorProfile,
  Section,
  StudentProfile,
} from "@/types";

export function getMyInstructorProfile() {
  return apiClient<ApiResponse<InstructorProfile>>("/instructors/me");
}

export function updateMyInstructorProfile(payload: {
  contactNo?: string;
  designation?: string;
}) {
  return apiClient<ApiResponse<InstructorProfile>>("/instructors/me", {
    method: "PATCH",
    body: payload,
  });
}

export function getInstructorSections(instructorId?: string) {
  return apiClient<ApiResponse<Section[]>>("/sections", {
    params: instructorId ? { instructorId } : undefined,
  });
}

export function getSectionStudents(sectionId: string) {
  return apiClient<
    ApiResponse<
      Array<{
        id: string;
        student: StudentProfile;
        status: string;
        enrolledAt: string;
      }>
    >
  >(`/sections/${sectionId}/students`);
}

export function createAttendanceSession(
  sectionId: string,
  payload: {
    sessionDate: string;
    startTime: string;
    endTime: string;
    topic?: string;
  },
) {
  return apiClient<ApiResponse<AttendanceSession>>(
    `/sections/${sectionId}/attendance-sessions`,
    {
      method: "POST",
      body: payload,
    },
  );
}

export function getSectionAttendance(sectionId: string) {
  return apiClient<ApiResponse<AttendanceSession[]>>(
    `/sections/${sectionId}/attendance`,
  );
}

export function bulkMarkAttendance(
  sessionId: string,
  payload: {
    records: Array<{
      studentId: string;
      status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
      remark?: string;
    }>;
  },
) {
  return apiClient<ApiResponse<any>>(
    `/attendance/sessions/${sessionId}/records/bulk`,
    {
      method: "POST",
      body: payload,
    },
  );
}

export function createSectionExam(
  sectionId: string,
  payload: {
    name: string;
    examType: string;
    maxMarks: number;
    weightage: number;
    examDate: string;
    startTime?: string;
    endTime?: string;
  },
) {
  return apiClient<ApiResponse<Exam>>(`/sections/${sectionId}/exams`, {
    method: "POST",
    body: payload,
  });
}

export function getSectionExams(sectionId: string) {
  return apiClient<ApiResponse<Exam[]>>(`/sections/${sectionId}/exams`);
}

export function deleteExam(examId: string) {
  return apiClient<ApiResponse<any>>(`/exams/${examId}`, {
    method: "DELETE",
  });
}

export function getExamResults(examId: string) {
  return apiClient<ApiResponse<ExamResult[]>>(`/exams/${examId}/results`);
}

export function bulkMarkExamResults(
  examId: string,
  payload: {
    marks: Array<{
      studentId: string;
      obtainedMarks: number;
      remarks?: string;
    }>;
  },
) {
  return apiClient<ApiResponse<any>>(`/exams/${examId}/results/bulk`, {
    method: "POST",
    body: payload,
  });
}

export function calculateSectionResults(sectionId: string) {
  return apiClient<ApiResponse<any>>(
    `/sections/${sectionId}/results/calculate`,
    {
      method: "POST",
    },
  );
}

export function publishSectionResults(sectionId: string) {
  return apiClient<ApiResponse<any>>(`/sections/${sectionId}/results/publish`, {
    method: "PATCH",
  });
}
