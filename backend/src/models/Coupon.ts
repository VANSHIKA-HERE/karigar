import { Schema, model, Document, Types } from "mongoose";

export interface ICoupon extends Document {
  code: string; // Unique coupon code
  description: string;
  discountType: "percentage" | "fixed"; // Percentage off or fixed amount
  discountValue: number; // e.g., 20 for 20% or 100 for 100 INR
  maxDiscountAmount: number | null; // Maximum discount in INR (for percentage discounts)
  minOrderAmount: number; // Minimum booking amount to use coupon
  maxUsagePerUser: number; // How many times a user can use this coupon
  totalUsageLimit: number | null; // Total times coupon can be used globally
  currentUsageCount: number; // Current number of times used
  applicableCategories: Types.ObjectId[]; // References to ServiceCategory (null means all)
  applicableRoles: ("customer" | "worker")[]; // Which roles can use this
  validFrom: Date;
  validTill: Date;
  isActive: boolean;
  createdBy: Types.ObjectId; // Reference to Admin User
  usedBy: Array<{
    userId: Types.ObjectId;
    usedAt: Date;
    bookingId: Types.ObjectId;
  }>;
  terms: string; // Terms and conditions
  isDeleted: boolean; // Soft delete
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: [20, "Coupon code cannot exceed 20 characters"],
      index: true,
    },
    description: {
      type: String,
      required: [true, "Coupon description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    discountType: {
      type: String,
      enum: {
        values: ["percentage", "fixed"],
        message: "{VALUE} is not a valid discount type",
      },
      required: [true, "Discount type is required"],
    },
    discountValue: {
      type: Number,
      required: [true, "Discount value is required"],
      min: [0, "Discount value cannot be negative"],
      validate: {
        validator: function (this: ICoupon, value: number) {
          if (this.discountType === "percentage") {
            return value <= 100;
          }
          return value >= 0;
        },
        message: "Percentage discount cannot exceed 100",
      },
    },
    maxDiscountAmount: {
      type: Number,
      default: null,
      min: [0, "Max discount amount cannot be negative"],
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: [0, "Minimum order amount cannot be negative"],
    },
    maxUsagePerUser: {
      type: Number,
      default: 1,
      min: [1, "Max usage per user must be at least 1"],
    },
    totalUsageLimit: {
      type: Number,
      default: null,
      min: [1, "Total usage limit must be at least 1"],
    },
    currentUsageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    applicableCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "ServiceCategory",
      },
    ],
    applicableRoles: [
      {
        type: String,
        enum: ["customer", "worker"],
      },
    ],
    validFrom: {
      type: Date,
      required: [true, "Validity start date is required"],
      index: true,
    },
    validTill: {
      type: Date,
      required: [true, "Validity end date is required"],
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Created by admin is required"],
    },
    usedBy: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        usedAt: {
          type: Date,
          default: Date.now,
        },
        bookingId: {
          type: Schema.Types.ObjectId,
          ref: "Booking",
        },
      },
    ],
    terms: {
      type: String,
      default: "",
      maxlength: [1000, "Terms cannot exceed 1000 characters"],
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
couponSchema.index({ code: 1, isActive: 1 });
couponSchema.index({ validFrom: 1, validTill: 1 });
couponSchema.index({ isActive: 1, createdAt: -1 });
couponSchema.index({ isDeleted: 1, createdAt: -1 });

export default model<ICoupon>("Coupon", couponSchema);
