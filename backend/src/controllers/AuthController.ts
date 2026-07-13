import { Request, Response } from "express";
import { authService } from "../services/AuthService";
import {
  RegisterSchema,
  LoginSchema,
  LoginWithPhoneSchema,
  RequestOTPSchema,
  VerifyOTPSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  RefreshTokenSchema,
  VerifyEmailSchema
} from "../validators/auth";
import { verifyRefreshToken } from "../utils/jwt";

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const input = RegisterSchema.parse(req.body);
    const { user, tokens } = await authService.register(input);

    res.status(201).json({
      message: "Registration successful. Please verify your email.",
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      tokens
    });
  }

  async login(req: Request, res: Response): Promise<void> {
    const input = LoginSchema.parse(req.body);
    const { user, tokens } = await authService.login(input);

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified
      },
      tokens
    });
  }

  async requestOTP(req: Request, res: Response): Promise<void> {
    const input = RequestOTPSchema.parse(req.body);
    const { otp } = await authService.requestOTP(input.phone);

    res.json({
      message: "OTP sent successfully",
      otp
    });
  }

  async verifyOTP(req: Request, res: Response): Promise<void> {
    const input = VerifyOTPSchema.parse(req.body);
    const { user, tokens } = await authService.verifyOTP(input.phone, input.otp);

    res.json({
      message: "OTP verified successfully",
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      tokens
    });
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const input = ForgotPasswordSchema.parse(req.body);
    const { resetToken } = await authService.forgotPassword(input.email);

    res.json({
      message: "Password reset link sent to your email",
      resetToken
    });
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const input = ResetPasswordSchema.parse(req.body);
    await authService.resetPassword(input.token, input.password);

    res.json({
      message: "Password reset successfully"
    });
  }

  async verifyEmail(req: Request, res: Response): Promise<void> {
    const input = VerifyEmailSchema.parse(req.body);
    await authService.verifyEmail(input.token);

    res.json({
      message: "Email verified successfully"
    });
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const input = RefreshTokenSchema.parse(req.body);
    const payload = verifyRefreshToken(input.refreshToken);

    if (!payload) {
      res.status(401).json({ error: "Invalid or expired refresh token" });
      return;
    }

    const { accessToken, refreshToken } = await authService.refreshTokens(payload.userId);

    res.json({
      message: "Tokens refreshed successfully",
      tokens: { accessToken, refreshToken }
    });
  }

  async logout(req: Request, res: Response): Promise<void> {
    await authService.logout();

    res.json({
      message: "Logout successful"
    });
  }

  async getCurrentUser(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const user = await authService.getCurrentUser(req.user.userId);

    res.json({
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profileImage: user.profileImage,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        isActive: user.isActive,
        isBlocked: user.isBlocked
      }
    });
  }
}

export const authController = new AuthController();
