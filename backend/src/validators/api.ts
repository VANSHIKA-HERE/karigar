import { z } from "zod";

// ========== WORKER VALIDATORS ==========
export const GetWorkerByIdSchema = z.object({
  workerId: z.string().min(1, "Worker ID is required"),
});

export const SearchWorkersSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  page: z.string().or(z.number()).optional().default("1"),
  limit: z.string().or(z.number()).optional().default("20"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  radius: z.number().optional().default(10), // in km
});

export const FilterWorkersSchema = z.object({
  categoryId: z.string().optional(),
  minRating: z.number().min(0).max(5).optional().default(0),
  maxPrice: z.number().positive().optional(),
  minPrice: z.number().positive().optional(),
  isVerified: z.boolean().optional(),
  page: z.string().or(z.number()).optional().default("1"),
  limit: z.string().or(z.number()).optional().default("20"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  radius: z.number().optional().default(10), // in km
});

export const GetAllWorkersSchema = z.object({
  page: z.string().or(z.number()).optional().default("1"),
  limit: z.string().or(z.number()).optional().default("20"),
  isActive: z.boolean().optional(),
});

// ========== BOOKING VALIDATORS ==========
export const CreateBookingSchema = z.object({
  workerId: z.string().min(1, "Worker ID is required"),
  categoryId: z.string().min(1, "Category ID is required"),
  serviceTitle: z.string().min(5, "Service title must be at least 5 characters"),
  serviceDescription: z
    .string()
    .min(10, "Service description must be at least 10 characters")
    .max(500, "Service description cannot exceed 500 characters"),
  scheduledDate: z.string().datetime("Invalid date format"),
  duration: z
    .number()
    .min(15, "Duration must be at least 15 minutes")
    .max(480, "Duration cannot exceed 480 minutes"),
  location: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z
      .string()
      .regex(/^[0-9]{6}$/, "Postal code must be 6 digits"),
    latitude: z.number(),
    longitude: z.number(),
  }),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

export const UpdateBookingSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  serviceTitle: z
    .string()
    .min(5, "Service title must be at least 5 characters")
    .optional(),
  serviceDescription: z
    .string()
    .min(10, "Service description must be at least 10 characters")
    .max(500, "Service description cannot exceed 500 characters")
    .optional(),
  scheduledDate: z.string().datetime("Invalid date format").optional(),
  duration: z
    .number()
    .min(15, "Duration must be at least 15 minutes")
    .max(480, "Duration cannot exceed 480 minutes")
    .optional(),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

export const CancelBookingSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  reason: z
    .string()
    .min(5, "Cancellation reason must be at least 5 characters")
    .max(250, "Reason cannot exceed 250 characters"),
});

export const GetBookingHistorySchema = z.object({
  status: z
    .enum(["pending", "accepted", "in_progress", "completed", "cancelled", "no_show"])
    .optional(),
  page: z.string().or(z.number()).optional().default("1"),
  limit: z.string().or(z.number()).optional().default("20"),
});

// ========== REVIEW VALIDATORS ==========
export const AddReviewSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  title: z
    .string()
    .min(5, "Review title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),
  comment: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(1000, "Review cannot exceed 1000 characters"),
  cleanliness: z.number().min(1).max(5).optional(),
  punctuality: z.number().min(1).max(5).optional(),
  professionalism: z.number().min(1).max(5).optional(),
  communication: z.number().min(1).max(5).optional(),
  quality: z.number().min(1).max(5).optional(),
  tags: z
    .array(
      z.enum([
        "on-time",
        "friendly",
        "professional",
        "skilled",
        "honest",
        "clean",
        "courteous",
      ])
    )
    .optional(),
});

export const GetReviewsSchema = z.object({
  workerId: z.string().min(1, "Worker ID is required"),
  page: z.string().or(z.number()).optional().default("1"),
  limit: z.string().or(z.number()).optional().default("20"),
  sortBy: z.enum(["recent", "rating-high", "rating-low"]).optional().default("recent"),
});

// ========== PAYMENT VALIDATORS ==========
export const CreatePaymentSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  amount: z.number().min(1, "Amount must be at least 1"),
  method: z.enum(["card", "upi", "netbanking", "wallet"]),
});

export const VerifyPaymentSchema = z.object({
  razorpayOrderId: z.string().min(1, "Order ID is required"),
  razorpayPaymentId: z.string().min(1, "Payment ID is required"),
  razorpaySignature: z.string().min(1, "Signature is required"),
});

// ========== NOTIFICATION VALIDATORS ==========
export const GetNotificationsSchema = z.object({
  page: z.string().or(z.number()).optional().default("1"),
  limit: z.string().or(z.number()).optional().default("20"),
  type: z
    .enum([
      "booking_request",
      "booking_accepted",
      "booking_rejected",
      "booking_completed",
      "booking_cancelled",
      "payment_confirmed",
      "payment_failed",
      "worker_arrived",
      "worker_on_the_way",
      "review_received",
      "message_received",
      "promotion",
      "system_update",
      "admin_alert",
    ])
    .optional(),
  isRead: z.boolean().optional(),
});

// ========== CHAT VALIDATORS ==========
export const CreateChatSchema = z.object({
  recipientId: z.string().min(1, "Recipient ID is required"),
});

export const SendMessageSchema = z.object({
  chatId: z.string().min(1, "Chat ID is required"),
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(5000, "Message cannot exceed 5000 characters"),
  messageType: z
    .enum(["text", "image", "document", "location"])
    .optional()
    .default("text"),
  mediaUrl: z.string().url().optional(),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
      address: z.string().optional(),
    })
    .optional(),
});

export const GetMessagesSchema = z.object({
  chatId: z.string().min(1, "Chat ID is required"),
  page: z.string().or(z.number()).optional().default("1"),
  limit: z.string().or(z.number()).optional().default("50"),
});

// Export type inferences
export type GetWorkerByIdInput = z.infer<typeof GetWorkerByIdSchema>;
export type SearchWorkersInput = z.infer<typeof SearchWorkersSchema>;
export type FilterWorkersInput = z.infer<typeof FilterWorkersSchema>;
export type GetAllWorkersInput = z.infer<typeof GetAllWorkersSchema>;

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
export type UpdateBookingInput = z.infer<typeof UpdateBookingSchema>;
export type CancelBookingInput = z.infer<typeof CancelBookingSchema>;
export type GetBookingHistoryInput = z.infer<typeof GetBookingHistorySchema>;

export type AddReviewInput = z.infer<typeof AddReviewSchema>;
export type GetReviewsInput = z.infer<typeof GetReviewsSchema>;

export type CreatePaymentInput = z.infer<typeof CreatePaymentSchema>;
export type VerifyPaymentInput = z.infer<typeof VerifyPaymentSchema>;

export type GetNotificationsInput = z.infer<typeof GetNotificationsSchema>;

export type CreateChatInput = z.infer<typeof CreateChatSchema>;
export type SendMessageInput = z.infer<typeof SendMessageSchema>;
export type GetMessagesInput = z.infer<typeof GetMessagesSchema>;
