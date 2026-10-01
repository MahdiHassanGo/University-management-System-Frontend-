export type UserRole = "SUPER_ADMIN" | "INSTRUCTOR" | "STUDENT";

export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export type AcademicStatus = "ACTIVE" | "SUSPENDED" | "GRADUATED" | "INACTIVE";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  provider: "CREDENTIALS" | "GOOGLE";
  emailVerified: boolean;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  studentId: string;
  userId: string;
  name: string;
  gender?: Gender;
  contactNo?: string;
  address?: string;
  programId: string;
  admissionSemesterId: string;
  academicStatus: AcademicStatus;
  cgpa?: number;
  completedCredits?: number;
  user: User;
  program?: {
    id: string;
    code: string;
    name: string;
    degreeType: string;
    department?: {
      id: string;
      code: string;
      name: string;
    };
  };
  admissionSemester?: {
    id: string;
    year: number;
    term: string;
    status: string;
  };
}

export interface InstructorProfile {
  id: string;
  employeeId: string;
  userId: string;
  name: string;
  designation: string;
  departmentId: string;
  contactNo?: string;
  academicStatus: AcademicStatus;
  user: User;
  department?: {
    id: string;
    code: string;
    name: string;
  };
}

export type AuthUserProfile =
  | (StudentProfile & { role: "STUDENT" })
  | (InstructorProfile & { role: "INSTRUCTOR" })
  | (User & { role: "SUPER_ADMIN"; name?: string });

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  needPasswordChange?: boolean;
}

export interface RegistrationPayload {
  email: string;
  password: string;
  name: string;
  programId: string;
  admissionSemesterId: string;
  gender: Gender;
  contactNo?: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}
