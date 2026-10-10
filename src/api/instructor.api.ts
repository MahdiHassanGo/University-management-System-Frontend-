import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  AttendanceSession,
  CourseResult,
  Exam,
  ExamResult,
  InstructorProfile,
  ListResponse,
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
  return apiClient<ListResponse<Section>>("/sections", {
    params: { limit: 100, ...(instructorId ? { instructorId } : {}) },
  });
}

export function getSectionStudents(sectionId: string) {
  return apiClient<
    ApiResponse<
      Array<{
        id: string;
        studentId: string;
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
    topic?: string;
  },
) {
  return apiClient<ApiResponse<AttendanceSession>>(
    `/sections/${sectionId}/attendance-sessions`,
    {
      method: "POST",
      body: {
        heldAt: new Date(
          `${payload.sessionDate}T${payload.startTime || "09:00"}:00+06:00`,
        ).toISOString(),
        topic: payload.topic,
      },
    },
  ).then((response) => ({ ...response, data: mapSession(response.data) }));
}

export function getSectionAttendance(sectionId: string) {
  return apiClient<ApiResponse<AttendanceSession[]>>(
    `/sections/${sectionId}/attendance`,
  ).then(mapSessions);
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
  return apiClient<ApiResponse<unknown>>(
    `/attendance/sessions/${sessionId}/records/bulk`,
    {
      method: "POST",
      body: {
        records: payload.records.map((record) => ({
          studentId: record.studentId,
          status: record.status,
          note: record.remark,
        })),
      },
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
    body: {
      title: payload.name,
      totalMarks: payload.maxMarks,
      weightPercentage: payload.weightage,
      heldAt: payload.examDate,
    },
  }).then((response) => ({ ...response, data: mapExam(response.data) }));
}

export function getSectionExams(sectionId: string) {
  return apiClient<ApiResponse<Exam[]>>(`/sections/${sectionId}/exams`).then(
    (response) => ({ ...response, data: response.data.map(mapExam) }),
  );
}

export function deleteExam(examId: string) {
  return apiClient<ApiResponse<unknown>>(`/exams/${examId}`, {
    method: "DELETE",
  });
}

export function getExamResults(examId: string) {
  return apiClient<ApiResponse<ExamResult[]>>(`/exams/${examId}/results`).then(
    (response) => ({
      ...response,
      data: response.data.map((result) => ({
        ...result,
        obtainedMarks: (result as ExamResult & { marks: number }).marks,
      })),
    }),
  );
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
  return apiClient<ApiResponse<unknown>>(`/exams/${examId}/results/bulk`, {
    method: "POST",
    body: {
      results: payload.marks.map((entry) => ({
        studentId: entry.studentId,
        marks: entry.obtainedMarks,
      })),
    },
  });
}

export function calculateSectionResults(sectionId: string) {
  return apiClient<ApiResponse<CourseResult[]>>(
    `/sections/${sectionId}/results/calculate`,
    {
      method: "POST",
    },
  );
}

export function publishSectionResults(sectionId: string) {
  return apiClient<ApiResponse<unknown>>(
    `/sections/${sectionId}/results/publish`,
    {
      method: "PATCH",
    },
  );
}

function mapSession(session: AttendanceSession) {
  const raw = session as AttendanceSession & { heldAt: string };
  return { ...session, sessionDate: raw.heldAt };
}
function mapSessions(response: ApiResponse<AttendanceSession[]>) {
  return { ...response, data: response.data.map(mapSession) };
}
function mapExam(exam: Exam) {
  const raw = exam as Exam & {
    title: string;
    totalMarks: number;
    weightPercentage: number;
    heldAt?: string;
  };
  return {
    ...exam,
    name: raw.title,
    maxMarks: raw.totalMarks,
    weightage: raw.weightPercentage,
    examDate: raw.heldAt || "",
    examType: "Assessment",
  };
}
