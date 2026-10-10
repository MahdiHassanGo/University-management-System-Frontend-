import { z } from "zod";

const name = z.string().trim().min(1, "Enter a name.");
const uuid = (field: string) => z.string().uuid(`Select a valid ${field}.`);
const positive = z.number().int().positive("Enter a positive whole number.");
const date = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date.");
const time = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Enter a valid time.");
export const departmentSchema = z.object({ code: name, name });
export const programSchema = z.object({
  code: name,
  name,
  departmentId: uuid("department"),
  degreeType: name,
  totalCredits: positive,
  maxSemesterCredits: positive,
});
export const courseSchema = z.object({
  code: name,
  title: name,
  credit: positive,
  departmentId: uuid("department"),
});
export const studentSchema = z.object({
  name,
  email: z.string().email("Enter a valid email."),
  password: z.string().min(6, "Password must contain at least 6 characters."),
  programId: uuid("program"),
  admissionSemesterId: uuid("semester"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
});
export const instructorSchema = z.object({
  name,
  email: z.string().email("Enter a valid email."),
  password: z.string().min(6, "Password must contain at least 6 characters."),
  departmentId: uuid("department"),
  designation: name,
});
export const invoiceSchema = z.object({
  semesterId: uuid("semester"),
  amount: z
    .number()
    .positive("Enter a positive amount.")
    .refine(
      (n) => Math.abs(n * 100 - Math.round(n * 100)) < 0.00001,
      "Use at most two decimal places.",
    ),
  dueDate: date,
});
export const semesterSchema = z
  .object({
    year: positive,
    term: z.enum(["SPRING", "SUMMER", "FALL"]),
    registrationStart: date,
    registrationEnd: date,
    classStart: date,
    classEnd: date,
  })
  .refine(
    (v) => v.registrationStart < v.registrationEnd,
    "Registration must end after it starts.",
  )
  .refine(
    (v) => v.classStart < v.classEnd,
    "Classes must end after they start.",
  );
export const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Enter your current password."),
    newPassword: z
      .string()
      .min(6, "New password must contain at least 6 characters."),
    confirmPassword: z.string(),
  })
  .refine(
    (v) => v.newPassword === v.confirmPassword,
    "The new passwords must match.",
  );
export const studentContactSchema = z.object({
  contactNo: z
    .string()
    .max(30, "Use at most 30 characters for your phone number."),
  address: z.string().max(500, "Use at most 500 characters for your address."),
});
export const instructorContactSchema = z.object({
  contactNo: z
    .string()
    .max(30, "Use at most 30 characters for your phone number."),
  designation: name,
});
export const attendanceSchema = z.object({
  sessionDate: date,
  startTime: time,
  topic: z.string(),
});
export const examSchema = z.object({
  examName: name,
  maxMarks: z.number().positive("Total marks must be positive."),
  weightage: z
    .number()
    .positive("Weight must be positive.")
    .max(100, "Weight cannot exceed 100%."),
  examDate: date,
});
export const sectionWizardSchema = z
  .object({
    courseId: uuid("course"),
    semesterId: uuid("semester"),
    instructorId: uuid("instructor"),
    sectionNumber: positive,
    capacity: positive,
    roomNumber: name,
    day: z.enum([
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ]),
    startTime: time,
    endTime: time,
  })
  .refine(
    (v) => v.startTime < v.endTime,
    "The class must end after it starts.",
  );
