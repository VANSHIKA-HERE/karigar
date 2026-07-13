import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[0-9]{10,}$/, "Invalid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  role: z.enum(["customer", "worker", "admin"]).default("customer")
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string()
});

export const LoginWithPhoneSchema = z.object({
  phone: z.string().regex(/^[0-9]{10,}$/, "Invalid phone number"),
  otp: z.string().length(6, "OTP must be 6 digits")
});

export const RequestOTPSchema = z.object({
  phone: z.string().regex(/^[0-9]{10,}$/, "Invalid phone number")
});

export const VerifyOTPSchema = z.object({
  phone: z.string().regex(/^[0-9]{10,}$/, "Invalid phone number"),
  otp: z.string().length(6, "OTP must be 6 digits")
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address")
});

export const ResetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string()
});

export const VerifyEmailSchema = z.object({
  token: z.string()
});

export const GoogleAuthSchema = z.object({
  idToken: z.string(),
  role: z.enum(["customer", "worker", "admin"]).default("customer")
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type LoginWithPhoneInput = z.infer<typeof LoginWithPhoneSchema>;
export type RequestOTPInput = z.infer<typeof RequestOTPSchema>;
export type VerifyOTPInput = z.infer<typeof VerifyOTPSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;
export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;
export type GoogleAuthInput = z.infer<typeof GoogleAuthSchema>;
