import { User, IUser } from "../models/User";
import { Worker } from "../models/Worker";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { hashPassword, comparePassword, generateVerificationToken, generateOTP } from "../utils/crypto";
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput
} from "../validators/auth";

export class AuthService {
  async register(input: RegisterInput): Promise<{ user: IUser; tokens: { accessToken: string; refreshToken: string } }> {
    const existingUser = await User.findOne({ $or: [{ email: input.email }, { phone: input.phone }] });

    if (existingUser) {
      throw new Error("User with this email or phone already exists");
    }

    const hashedPassword = await hashPassword(input.password);
    const verificationToken = generateVerificationToken();

    const user = await User.create({
      email: input.email,
      phone: input.phone,
      password: hashedPassword,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role,
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    if (input.role === "worker") {
      await Worker.create({
        userId: user._id,
        categories: [],
        hourlyRate: 0
      });
    }

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    return {
      user,
      tokens: { accessToken, refreshToken }
    };
  }

  async login(input: LoginInput): Promise<{ user: IUser; tokens: { accessToken: string; refreshToken: string } }> {
    const user = await User.findOne({ email: input.email }).select("+password");

    if (!user || !user.password) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await comparePassword(input.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    if (user.isBlocked) {
      throw new Error(`Account is blocked. Reason: ${user.blockedReason || "Unknown"}`);
    }

    await User.updateOne({ _id: user._id }, { lastLogin: new Date() });

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    return {
      user: user.toObject({ transform: (doc: any, ret: any) => { delete ret.password; return ret; } }),
      tokens: { accessToken, refreshToken }
    };
  }

  async requestOTP(phone: string): Promise<{ otp: string }> {
    const user = await User.findOne({ phone });

    if (!user) {
      throw new Error("User with this phone number does not exist");
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await User.updateOne(
      { _id: user._id },
      {
        phoneVerificationToken: otp,
        phoneVerificationTokenExpiry: otpExpiry
      }
    );

    return { otp };
  }

  async verifyOTP(phone: string, otp: string): Promise<{ user: IUser; tokens: { accessToken: string; refreshToken: string } }> {
    const user = await User.findOne({ phone }).select("+phoneVerificationToken +phoneVerificationTokenExpiry");

    if (!user) {
      throw new Error("User with this phone number does not exist");
    }

    if (!user.phoneVerificationToken || user.phoneVerificationToken !== otp) {
      throw new Error("Invalid OTP");
    }

    if (user.phoneVerificationTokenExpiry && new Date() > user.phoneVerificationTokenExpiry) {
      throw new Error("OTP has expired");
    }

    await User.updateOne(
      { _id: user._id },
      {
        isPhoneVerified: true,
        phoneVerificationToken: undefined,
        phoneVerificationTokenExpiry: undefined,
        lastLogin: new Date()
      }
    );

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    return {
      user,
      tokens: { accessToken, refreshToken }
    };
  }

  async forgotPassword(email: string): Promise<{ resetToken: string }> {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("No user found with this email");
    }

    const resetToken = generateVerificationToken();
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await User.updateOne(
      { _id: user._id },
      {
        emailVerificationToken: resetToken,
        emailVerificationTokenExpiry: resetTokenExpiry
      }
    );

    return { resetToken };
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    const hashedPassword = await hashPassword(newPassword);

    await User.updateOne(
      { _id: user._id },
      {
        password: hashedPassword,
        emailVerificationToken: undefined,
        emailVerificationTokenExpiry: undefined
      }
    );
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      throw new Error("Invalid or expired verification token");
    }

    await User.updateOne(
      { _id: user._id },
      {
        isEmailVerified: true,
        emailVerificationToken: undefined,
        emailVerificationTokenExpiry: undefined
      }
    );
  }

  async refreshTokens(userId: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    return { accessToken, refreshToken };
  }

  async logout(): Promise<void> {
    // In production, add token to blacklist or use Redis
  }

  async getCurrentUser(userId: string): Promise<IUser> {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}

export const authService = new AuthService();
