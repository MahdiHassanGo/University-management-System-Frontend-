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
  credits: number;
  departmentId: string;
  department?: Department;
  isElective: boolean;
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
  remarks?: string;
}

export interface AttendanceSession {
  id: string;
  sectionId: string;
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
  studentId: string;
  sectionId: string;
  section?: Section;
  totalMarks: number;
  grade: string;
  gradePoints: number;
  status: ResultStatus;
  calculatedAt?: string;
  publishedAt?: string;
}

export interface TranscriptSemester {
  semesterId: string;
  semesterName: string;
  year: number;
  term: SemesterTerm;
  semesterGpa: number;
  semesterCredits: number;
  results: CourseResult[];
}

export interface Transcript {
  studentId: string;
  studentName: string;
  programName: string;
  departmentName: string;
  cgpa: number;
  totalCreditsCompleted: number;
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
  isRead: boolean;
  relatedEntityId?: string;
  createdAt: string;
}

export interface EnrollmentReportItem {
  semester: string;
  year: number;
  term: SemesterTerm;
  totalEnrollments: number;
  activeStudents: number;
}

export interface AttendanceReportItem {
  status: AttendanceStatus;
  count: number;
  percentage: number;
}

export interface ResultReportItem {
  grade: string;
  count: number;
  percentage: number;
}

export interface FinanceReportItem {
  semester: string;
  totalInvoiced: number;
  totalCollected: number;
  totalPending: number;
}
