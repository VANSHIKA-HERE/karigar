import { Schema, model, Document, Types } from "mongoose";

export type WalletTransactionType =
  | "credit"
  | "debit"
  | "refund"
  | "payment"
  | "withdrawal";
export type WalletTransactionStatus = "pending" | "completed" | "failed";

export interface IWallet extends Document {
  userId: Types.ObjectId; // Reference to User
  balance: number; // Current wallet balance in INR
  totalCredits: number; // Total amount credited (lifetime)
  totalDebits: number; // Total amount debited (lifetime)
  transactions: Array<{
    id: string;
    type: WalletTransactionType;
    amount: number;
    description: string;
    referenceId: Types.ObjectId | null; // Booking, Payment, etc.
    referenceType: string; // "booking", "payment", "refund", etc.
    balanceBefore: number;
    balanceAfter: number;
    status: WalletTransactionStatus;
    timestamp: Date;
  }>;
  bankDetails: {
    accountHolderName: string | null;
    accountNumber: string | null;
    ifscCode: string | null;
    bankName: string | null;
  };
  lastWithdrawalAt: Date | null;
  totalWithdrawn: number; // Total amount withdrawn to bank
  createdAt: Date;
  updatedAt: Date;
}

const walletSchema = new Schema<IWallet>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
      index: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: [0, "Balance cannot be negative"],
    },
    totalCredits: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalDebits: {
      type: Number,
      default: 0,
      min: 0,
    },
    transactions: [
      {
        id: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: {
            values: ["credit", "debit", "refund", "payment", "withdrawal"],
            message: "{VALUE} is not a valid transaction type",
          },
          required: true,
        },
        amount: {
          type: Number,
          required: [true, "Transaction amount is required"],
          min: [0, "Amount cannot be negative"],
        },
        description: {
          type: String,
          required: [true, "Transaction description is required"],
          maxlength: [250, "Description cannot exceed 250 characters"],
        },
        referenceId: {
          type: Schema.Types.ObjectId,
          default: null,
        },
        referenceType: {
          type: String,
          enum: ["booking", "payment", "refund", "withdrawal", "credit"],
          default: null,
        },
        balanceBefore: {
          type: Number,
          required: true,
          min: 0,
        },
        balanceAfter: {
          type: Number,
          required: true,
          min: 0,
        },
        status: {
          type: String,
          enum: {
            values: ["pending", "completed", "failed"],
            message: "{VALUE} is not a valid transaction status",
          },
          default: "completed",
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    bankDetails: {
      accountHolderName: {
        type: String,
        default: null,
        maxlength: [100, "Account holder name cannot exceed 100 characters"],
      },
      accountNumber: {
        type: String,
        default: null,
        maxlength: [20, "Account number cannot exceed 20 characters"],
      },
      ifscCode: {
        type: String,
        default: null,
        maxlength: [11, "IFSC code cannot exceed 11 characters"],
      },
      bankName: {
        type: String,
        default: null,
        maxlength: [100, "Bank name cannot exceed 100 characters"],
      },
    },
    lastWithdrawalAt: {
      type: Date,
      default: null,
    },
    totalWithdrawn: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index frequently queried fields
walletSchema.index({ userId: 1 });
walletSchema.index({ "transactions.timestamp": -1 });
walletSchema.index({ balance: 1 });

export default model<IWallet>("Wallet", walletSchema);
