import { Schema, model, Document, Types } from "mongoose";

export type ComplaintStatus =
  | "open"
  | "in_progress"
  | "resolved"
  | "closed"
  | "rejected";
export type ComplaintPriority = "low" | "medium" | "high" | "urgent";

export interface IComplaint extends Document {
  complaintNumber: string; // Unique complaint number for customer reference
  bookingId: Types.ObjectId | null; // Reference to Booking (can be null for general complaints)
  complainantId: Types.ObjectId; // Reference to User (customer filing complaint)
  defendantId: Types.ObjectId; // Reference to User (worker being complained about)
  category: string; // e.g., "quality", "behavior", "punctuality", "payment", "hygiene"
  subject: string;
  description: string;
  evidence: string[]; // Cloudinary URLs - photos, videos, documents
  status: ComplaintStatus;
  priority: ComplaintPriority;
  resolution: string | null;
  resolutionNotes: string | null;
  refundAmount: number | null; // in INR
  compensationAmount: number | null; // in INR
  assignedAdmin: Types.ObjectId | null; // Reference to Admin User
  responseFromWorker: string | null;
  respondedAt: Date | null;
  resolvedAt: Date | null;
  closedAt: Date | null;
  isDeleted: boolean; // Soft delete
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const complaintSchema = new Schema<IComplaint>(
  {
    complaintNumber: {
      type: String,
      required: [true, "Complaint number is required"],
      unique: true,
      index: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
    complainantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Complainant ID is required"],
      index: true,
    },
    defendantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Defendant ID is required"],
      index: true,
    },
    category: {
      type: String,
      required: [true, "Complaint category is required"],
      enum: [
        "quality",
        "behavior",
        "punctuality",
        "payment",
        "hygiene",
        "safety",
        "fraud",
        "other",
      ],
      index: true,
    },
    subject: {
      type: String,
      required: [true, "Complaint subject is required"],
      maxlength: [100, "Subject cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Complaint description is required"],
      minlength: [20, "Description must be at least 20 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    evidence: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: {
        values: ["open", "in_progress", "resolved", "closed", "rejected"],
        message: "{VALUE} is not a valid complaint status",
      },
      default: "open",
      index: true,
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high", "urgent"],
        message: "{VALUE} is not a valid priority level",
      },
      default: "medium",
      index: true,
    },
    resolution: {
      type: String,
      default: null,
      maxlength: [500, "Resolution cannot exceed 500 characters"],
    },
    resolutionNotes: {
      type: String,
      default: null,
      maxlength: [1000, "Resolution notes cannot exceed 1000 characters"],
    },
    refundAmount: {
      type: Number,
      default: null,
      min: [0, "Refund amount cannot be negative"],
    },
    compensationAmount: {
      type: Number,
      default: null,
      min: [0, "Compensation amount cannot be negative"],
    },
    assignedAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    responseFromWorker: {
      type: String,
      default: null,
      maxlength: [1000, "Response cannot exceed 1000 characters"],
    },
    respondedAt: {
      type: Date,
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    closedAt: {
      type: Date,
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
complaintSchema.index({ status: 1, priority: 1 });
complaintSchema.index({ complainantId: 1, createdAt: -1 });
complaintSchema.index({ defendantId: 1, status: 1 });
complaintSchema.index({ assignedAdmin: 1, status: 1 });
complaintSchema.index({ isDeleted: 1, createdAt: -1 });

export default model<IComplaint>("Complaint", complaintSchema);
