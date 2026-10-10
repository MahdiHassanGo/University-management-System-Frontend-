export type SemesterTerm = "SPRING" | "SUMMER" | "FALL";
export type SemesterStatus =
  | "DRAFT"
  | "REGISTRATION_OPEN"
  | "ONGOING"
  | "COMPLETED";
export type SectionStatus = "DRAFT" | "OPEN" | "CLOSED" | "COMPLETED";
export type EnrollmentStatus = "ENROLLED" | "DROPPED" | "COMPLETED" | "FAILED";
export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
export type ExamStatus = "DRAFT" | "PUBLISHED" | "COMPLETED";
export type ResultStatus = "DRAFT" | "PUBLISHED";
export type InvoiceStatus = "UNPAID" | "PAID" | "OVERDUE" | "CANCELLED";
export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export interface Department {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Program {
  id: string;
  code: string;
  name: string;
  departmentId: string;
  department?: Department;
  degreeType: string;
  totalCredits: number;
  maxSemesterCredits: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  credit: number;
  departmentId: string;
  department?: Department;
  isActive: boolean;
  courseLevel: number;
  description?: string;
  syllabus?: string;
  prerequisites?: Array<{
    id: string;
    prerequisiteCourse: Course;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicSemester {
  id: string;
  year: number;
  term: SemesterTerm;
  status: SemesterStatus;
  registrationStart: string;
  registrationEnd: string;
  classStart: string;
  classEnd: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassScheduleItem {
  dayOfWeek:
    | "SATURDAY"
    | "SUNDAY"
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY";
  startTime: string;
  endTime: string;
  room?: string;
}

export interface Section {
  id: string;
  courseId: string;
  course?: Course;
  semesterId: string;
  semester?: AcademicSemester;
  instructorId: string;
  instructor?: {
    id: string;
    name: string;
    employeeId: string;
    designation: string;
  };
  sectionNumber: number;
  capacity: number;
  enrolledCount?: number;
  roomNumber?: string;
  schedules?: Array<{
    id?: string;
    room?: string;
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
  }>;
  schedule?: ClassScheduleItem[] | unknown;
  status: SectionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  student?: {
    id: string;
    studentId: string;
    name: string;
  };
  sectionId: string;
  section?: Section;
  status: EnrollmentStatus;
  grade?: string;
  gradePoints?: number;
  enrolledAt: string;
  droppedAt?: string;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  student?: {
    id: string;
    studentId: string;
    name: string;
  };
  status: AttendanceStatus;
  note?: string;
  session?: AttendanceSession;
}

export interface AttendanceSession {
  id: string;
  sectionId: string;
  heldAt?: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  topic?: string;
  records?: AttendanceRecord[];
}

export interface Exam {
  id: string;
  sectionId: string;
  name: string;
  examType: string;
  maxMarks: number;
  weightage: number;
  examDate: string;
  startTime?: string;
  endTime?: string;
  status: ExamStatus;
  results?: ExamResult[];
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  student?: {
    id: string;
    studentId: string;
    name: string;
  };
  obtainedMarks: number;
  remarks?: string;
}

export interface CourseResult {
  id: string;
  enrollmentId: string;
  enrollment?: Enrollment;
  totalMarks: number;
  letterGrade: string;
  gradePoint: number;
  publicationStatus: ResultStatus;
  publishedAt?: string;
}
export interface TranscriptCourse {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  credit: number;
  letterGrade: string;
  gradePoint: number;
}
export interface TranscriptSemester {
  semesterId: string;
  year: number;
  term: SemesterTerm;
  gpa: number;
  totalCredits: number;
  courses: TranscriptCourse[];
}
export interface Transcript {
  student: {
    id: string;
    studentId: string;
    name: string;
    academicStatus: string;
    program: { code: string; name: string; department: string };
    admissionSemester: string;
  };
  cgpa: number;
  totalEarnedCredits: number;
  semesters: TranscriptSemester[];
}

export interface FeeInvoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  student?: {
    id: string;
    studentId: string;
    name: string;
  };
  semesterId: string;
  semester?: AcademicSemester;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
  createdAt: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoice?: FeeInvoice;
  amount: number;
  gateway: string;
  merchantInvoiceNumber: string;
  trxID?: string;
  status: PaymentStatus;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  recipientId: string;
  type: string;
  title: string;
  message: string;
  readAt?: string;
  relatedEntityId?: string;
  createdAt: string;
}

export interface EnrollmentReport {
  totalActiveEnrollments: number;
  totalSectionCapacity: number;
  totalStudentsEnrolled: number;
  enrollmentsByProgram: Array<{
    programId: string;
    programCode: string;
    programName: string;
    studentCount: number;
  }>;
}

export interface AttendanceReport {
  totalAttendanceSessions: number;
  totalRecordsMarked: number;
  breakdown: Record<string, number>;
  overallAttendanceRate: number;
}

export interface ResultReport {
  totalPublishedCourseResults: number;
  passedCount: number;
  failedCount: number;
  passRate: number;
  averageGradePoint: number;
  gradeDistribution: Record<string, number>;
}

export interface FinanceReport {
  totalInvoices: number;
  totalBilledAmount: number;
  totalCollectedAmount: number;
  totalUnpaidAmount: number;
  successfulPaymentsCount: number;
  collectionRate: number;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actor?: { email: string };
  action: string;
  entityType: string;
  entityId?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}
