import { Router } from "express";
import { authController } from "../controllers/AuthController";
import { authenticate } from "../middlewares/auth";
import { errorHandler } from "../middlewares/errorHandler";

const router = Router();

// Public routes
router.post("/register", errorHandler(authController.register.bind(authController)));
router.post("/login", errorHandler(authController.login.bind(authController)));
router.post("/request-otp", errorHandler(authController.requestOTP.bind(authController)));
router.post("/verify-otp", errorHandler(authController.verifyOTP.bind(authController)));
router.post("/forgot-password", errorHandler(authController.forgotPassword.bind(authController)));
router.post("/reset-password", errorHandler(authController.resetPassword.bind(authController)));
router.post("/verify-email", errorHandler(authController.verifyEmail.bind(authController)));
router.post("/refresh-token", errorHandler(authController.refreshToken.bind(authController)));

// Protected routes
router.post("/logout", authenticate, errorHandler(authController.logout.bind(authController)));
router.get("/me", authenticate, errorHandler(authController.getCurrentUser.bind(authController)));

export { router as authRoutes };
