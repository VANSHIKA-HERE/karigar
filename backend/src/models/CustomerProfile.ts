import { Schema, model, Document, Types } from "mongoose";

export interface ICustomerProfile extends Document {
  userId: Types.ObjectId;
  firstName: string;
  lastName: string;
  profileImage: string;
  phone: string;
  addresses: Array<{
    type: "home" | "work" | "other";
    street: string;
    city: string;
    state: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    isDefault: boolean;
  }>;
  preferredCategories: Types.ObjectId[]; // References to ServiceCategory
  favoriteWorkers: Types.ObjectId[]; // References to Worker
  totalBookings: number;
  totalSpent: number; // in INR
  averageRating: number;
  loyaltyPoints: number;
  preferences: {
    notifications: boolean;
    smsUpdates: boolean;
    emailUpdates: boolean;
    allowLocationTracking: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const customerProfileSchema = new Schema<ICustomerProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
      index: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    profileImage: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[0-9]{10,}$/, "Please provide a valid phone number"],
    },
    addresses: [
      {
        type: {
          type: String,
          enum: ["home", "work", "other"],
          required: true,
        },
        street: {
          type: String,
          required: [true, "Street is required"],
        },
        city: {
          type: String,
          required: [true, "City is required"],
        },
        state: {
          type: String,
          required: [true, "State is required"],
        },
        postalCode: {
          type: String,
          required: [true, "Postal code is required"],
          match: [/^[0-9]{6}$/, "Please provide a valid 6-digit postal code"],
        },
        latitude: {
          type: Number,
          required: true,
        },
        longitude: {
          type: Number,
          required: true,
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    preferredCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "ServiceCategory",
      },
    ],
    favoriteWorkers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Worker",
      },
    ],
    totalBookings: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: 0,
    },
    averageRating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    preferences: {
      notifications: {
        type: Boolean,
        default: true,
      },
      smsUpdates: {
        type: Boolean,
        default: true,
      },
      emailUpdates: {
        type: Boolean,
        default: true,
      },
      allowLocationTracking: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index frequently queried fields
customerProfileSchema.index({ userId: 1 });
customerProfileSchema.index({ phone: 1 });
customerProfileSchema.index({ createdAt: -1 });

export default model<ICustomerProfile>(
  "CustomerProfile",
  customerProfileSchema
);
