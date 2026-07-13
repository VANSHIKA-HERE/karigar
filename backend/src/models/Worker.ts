import mongoose, { Schema, Document } from "mongoose";

export interface IWorker extends Document {
  userId: mongoose.Types.ObjectId;
  categories: string[];
  yearsOfExperience: number;
  bio: string;
  profileImage?: string;
  documents: {
    type: "id" | "certification" | "license";
    url: string;
    verified: boolean;
    verifiedAt?: Date;
  }[];
  isVerified: boolean;
  verificationStatus: "pending" | "verified" | "rejected";
  verificationRejectionReason?: string;
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  completedBookings: number;
  cancellationRate: number;
  hourlyRate: number;
  location: {
    address: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
  };
  availability: {
    [key: string]: {
      isAvailable: boolean;
      slots?: {
        startTime: string;
        endTime: string;
      }[];
    };
  };
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    verified: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const WorkerSchema = new Schema<IWorker>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    categories: {
      type: [String],
      required: true
    },
    yearsOfExperience: {
      type: Number,
      default: 0
    },
    bio: {
      type: String,
      maxlength: 500
    },
    profileImage: String,
    documents: [
      {
        type: {
          type: String,
          enum: ["id", "certification", "license"]
        },
        url: String,
        verified: {
          type: Boolean,
          default: false
        },
        verifiedAt: Date
      }
    ],
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending"
    },
    verificationRejectionReason: String,
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    totalBookings: {
      type: Number,
      default: 0
    },
    completedBookings: {
      type: Number,
      default: 0
    },
    cancellationRate: {
      type: Number,
      default: 0
    },
    hourlyRate: {
      type: Number,
      required: true
    },
    location: {
      address: String,
      latitude: Number,
      longitude: Number,
      city: String,
      state: String
    },
    availability: {
      type: Map,
      of: {
        isAvailable: Boolean,
        slots: [
          {
            startTime: String,
            endTime: String
          }
        ]
      }
    },
    bankDetails: {
      accountName: String,
      accountNumber: String,
      ifscCode: String,
      verified: {
        type: Boolean,
        default: false
      }
    }
  },
  {
    timestamps: true
  }
);

WorkerSchema.index({ userId: 1 });
WorkerSchema.index({ categories: 1 });
WorkerSchema.index({ verificationStatus: 1 });
WorkerSchema.index({ "location.city": 1 });

export const Worker = mongoose.model<IWorker>("Worker", WorkerSchema);
