import { Schema, model, Document, Types } from "mongoose";

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
export type PaymentMethod = "card" | "upi" | "netbanking" | "wallet";

export interface IPayment extends Document {
  bookingId: Types.ObjectId; // Reference to Booking
  customerId: Types.ObjectId; // Reference to User (Customer)
  workerId: Types.ObjectId; // Reference to User (Worker)
  status: PaymentStatus;
  method: PaymentMethod;
  amount: number; // in INR
  currency: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  transactionId: string; // Internal transaction ID
  description: string;
  failureReason: string | null;
  refundAmount: number; // in INR
  refundedAt: Date | null;
  taxAmount: number; // in INR
  platformFee: number; // in INR (commission/fee)
  workerAmount: number; // Amount received by worker after fees
  receipt: string; // Razorpay receipt ID
  notes: string;
  metadata: {
    paymentGateway: string;
    ipAddress: string;
    userAgent: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking ID is required"],
      unique: true,
      index: true,
    },
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
    status: {
      type: String,
      enum: {
        values: ["pending", "completed", "failed", "refunded"],
        message: "{VALUE} is not a valid payment status",
      },
      default: "pending",
      index: true,
    },
    method: {
      type: String,
      enum: {
        values: ["card", "upi", "netbanking", "wallet"],
        message: "{VALUE} is not a valid payment method",
      },
      required: [true, "Payment method is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [1, "Amount must be at least 1 INR"],
      max: [1000000, "Amount cannot exceed 10,00,000 INR"],
    },
    currency: {
      type: String,
      default: "INR",
      enum: ["INR"],
    },
    razorpayOrderId: {
      type: String,
      default: null,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
      index: true,
    },
    razorpaySignature: {
      type: String,
      default: null,
    },
    transactionId: {
      type: String,
      required: [true, "Transaction ID is required"],
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [250, "Description cannot exceed 250 characters"],
    },
    failureReason: {
      type: String,
      default: null,
      maxlength: [250, "Failure reason cannot exceed 250 characters"],
    },
    refundAmount: {
      type: Number,
      default: 0,
      min: [0, "Refund amount cannot be negative"],
    },
    refundedAt: {
      type: Date,
      default: null,
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: [0, "Tax cannot be negative"],
    },
    platformFee: {
      type: Number,
      default: 0,
      min: [0, "Platform fee cannot be negative"],
    },
    workerAmount: {
      type: Number,
      required: [true, "Worker amount is required"],
      min: [0, "Worker amount cannot be negative"],
    },
    receipt: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      default: "",
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    metadata: {
      paymentGateway: {
        type: String,
        default: "razorpay",
      },
      ipAddress: {
        type: String,
        default: null,
      },
      userAgent: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index frequently queried fields
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ customerId: 1, createdAt: -1 });
paymentSchema.index({ workerId: 1, status: 1 });

export default model<IPayment>("Payment", paymentSchema);
