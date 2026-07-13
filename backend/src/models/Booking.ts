import { Schema, model, Document, Types } from "mongoose";

export type BookingStatus =
  | "pending"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export interface IBooking extends Document {
  customerId: Types.ObjectId; // Reference to User (Customer)
  workerId: Types.ObjectId; // Reference to User (Worker)
  categoryId: Types.ObjectId; // Reference to ServiceCategory
  status: BookingStatus;
  serviceTitle: string;
  serviceDescription: string;
  scheduledDate: Date;
  completionDate: Date | null;
  duration: number; // in minutes
  basePrice: number; // in INR
  discountAmount: number; // in INR
  taxAmount: number; // in INR
  totalAmount: number; // in INR
  paymentId: Types.ObjectId | null; // Reference to Payment
  couponCode: string | null;
  location: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    latitude: number;
    longitude: number;
  };
  workerRating: number | null; // 1-5 stars
  workerReviewId: Types.ObjectId | null; // Reference to Review
  customerCancellationReason: string | null;
  workerCancellationReason: string | null;
  notes: string; // Customer notes for worker
  isDeleted: boolean; // Soft delete
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer ID is required"],
      index: true,
    },
    workerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Worker ID is required"],
      index: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "ServiceCategory",
      required: [true, "Category ID is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "accepted", "in_progress", "completed", "cancelled", "no_show"],
        message: "{VALUE} is not a valid booking status",
      },
      default: "pending",
      index: true,
    },
    serviceTitle: {
      type: String,
      required: [true, "Service title is required"],
      maxlength: [100, "Service title cannot exceed 100 characters"],
    },
    serviceDescription: {
      type: String,
      required: [true, "Service description is required"],
      maxlength: [500, "Service description cannot exceed 500 characters"],
    },
    scheduledDate: {
      type: Date,
      required: [true, "Scheduled date is required"],
      index: true,
    },
    completionDate: {
      type: Date,
      default: null,
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [15, "Duration must be at least 15 minutes"],
      max: [480, "Duration cannot exceed 480 minutes"],
    },
    basePrice: {
      type: Number,
      required: [true, "Base price is required"],
      min: [0, "Price cannot be negative"],
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: [0, "Tax cannot be negative"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
    couponCode: {
      type: String,
      default: null,
    },
    location: {
      street: {
        type: String,
        required: [true, "Street is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
        index: true,
      },
      state: {
        type: String,
        required: [true, "State is required"],
      },
      postalCode: {
        type: String,
        required: [true, "Postal code is required"],
      },
      latitude: {
        type: Number,
        required: [true, "Latitude is required"],
      },
      longitude: {
        type: Number,
        required: [true, "Longitude is required"],
      },
    },
    workerRating: {
      type: Number,
      default: null,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    workerReviewId: {
      type: Schema.Types.ObjectId,
      ref: "Review",
      default: null,
    },
    customerCancellationReason: {
      type: String,
      default: null,
      maxlength: [250, "Cancellation reason cannot exceed 250 characters"],
    },
    workerCancellationReason: {
      type: String,
      default: null,
      maxlength: [250, "Cancellation reason cannot exceed 250 characters"],
    },
    notes: {
      type: String,
      default: "",
      maxlength: [500, "Notes cannot exceed 500 characters"],
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

// Composite indexes for common queries
bookingSchema.index({ customerId: 1, createdAt: -1 });
bookingSchema.index({ workerId: 1, status: 1 });
bookingSchema.index({ status: 1, scheduledDate: 1 });
bookingSchema.index({ isDeleted: 1, createdAt: -1 });

export default model<IBooking>("Booking", bookingSchema);
