import { Schema, model, Document, Types } from "mongoose";

export type NotificationType =
  | "booking_request"
  | "booking_accepted"
  | "booking_rejected"
  | "booking_completed"
  | "booking_cancelled"
  | "payment_confirmed"
  | "payment_failed"
  | "worker_arrived"
  | "worker_on_the_way"
  | "review_received"
  | "message_received"
  | "promotion"
  | "system_update"
  | "admin_alert";

export interface INotification extends Document {
  userId: Types.ObjectId; // Reference to User (recipient)
  type: NotificationType;
  title: string;
  message: string;
  description: string | null;
  icon: string | null; // Emoji or Cloudinary URL
  data: {
    bookingId?: Types.ObjectId;
    chatId?: Types.ObjectId;
    paymentId?: Types.ObjectId;
    workerId?: Types.ObjectId;
    customerId?: Types.ObjectId;
    actionUrl?: string;
    [key: string]: any;
  };
  isRead: boolean;
  readAt: Date | null;
  actionUrl: string | null;
  isDeleted: boolean; // Soft delete
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    type: {
      type: String,
      enum: {
        values: [
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
        ],
        message: "{VALUE} is not a valid notification type",
      },
      required: [true, "Notification type is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Notification title is required"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
      maxlength: [500, "Message cannot exceed 500 characters"],
    },
    description: {
      type: String,
      default: null,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    icon: {
      type: String,
      default: "🔔",
    },
    data: {
      bookingId: {
        type: Schema.Types.ObjectId,
        ref: "Booking",
        default: null,
      },
      chatId: {
        type: Schema.Types.ObjectId,
        ref: "Chat",
        default: null,
      },
      paymentId: {
        type: Schema.Types.ObjectId,
        ref: "Payment",
        default: null,
      },
      workerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      customerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      actionUrl: {
        type: String,
        default: null,
      },
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    actionUrl: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index frequently queried fields
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ isDeleted: 1, createdAt: -1 });

export default model<INotification>("Notification", notificationSchema);
