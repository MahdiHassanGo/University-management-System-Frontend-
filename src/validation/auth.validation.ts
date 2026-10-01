import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid academic email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and a number",
    ),
  confirmPassword: z.string(),
  programId: z.string().min(1, "Please select an academic program"),
  admissionSemesterId: z.string().min(1, "Please select an admission semester"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  contactNo: z.string(),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6, "Current password is required"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and a number",
    ),
  confirmNewPassword: z.string(),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;
