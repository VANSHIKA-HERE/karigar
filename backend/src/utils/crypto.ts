import bcrypt from "bcrypt";
import crypto from "crypto";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
