export interface AuthResponse {
  message: string;
  user?: {
    id: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    role: "customer" | "worker" | "admin";
    profileImage?: string;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    isActive?: boolean;
    isBlocked?: boolean;
  };
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
  resetToken?: string;
  otp?: string;
  error?: string;
  details?: Array<{
    path: string;
    message: string;
  }>;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: "customer" | "worker" | "admin";
  type: "access" | "refresh";
  iat?: number;
  exp?: number;
}

export interface VerificationOTP {
  phone: string;
  otp: string;
  expiresAt: Date;
}
