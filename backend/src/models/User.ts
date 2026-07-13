import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  phone: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: "customer" | "worker" | "admin";
  profileImage?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationTokenExpiry?: Date;
  phoneVerificationToken?: string;
  phoneVerificationTokenExpiry?: Date;
  googleId?: string;
  googleEmail?: string;
  isActive: boolean;
  isBlocked: boolean;
  blockedReason?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[0-9]{10,}$/
    },
    password: {
      type: String,
      select: false
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      enum: ["customer", "worker", "admin"],
      default: "customer"
    },
    profileImage: String,
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    isPhoneVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: {
      type: String,
      select: false
    },
    emailVerificationTokenExpiry: Date,
    phoneVerificationToken: {
      type: String,
      select: false
    },
    phoneVerificationTokenExpiry: Date,
    googleId: String,
    googleEmail: String,
    isActive: {
      type: Boolean,
      default: true
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    blockedReason: String,
    lastLogin: Date
  },
  {
    timestamps: true
  }
);

UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ googleId: 1 });

export const User = mongoose.model<IUser>("User", UserSchema);
