import { Schema, model, Document, Types } from "mongoose";

export interface IReview extends Document {
  bookingId: Types.ObjectId; // Reference to Booking
  customerId: Types.ObjectId; // Reference to User (Customer)
  workerId: Types.ObjectId; // Reference to User (Worker)
  rating: number; // 1-5 stars
  title: string;
  comment: string;
  cleanliness: number; // 1-5, for workers providing cleaning services
  punctuality: number; // 1-5
  professionalism: number; // 1-5
  communication: number; // 1-5
  quality: number; // 1-5
  tags: string[]; // e.g., ["on-time", "friendly", "professional"]
  images: string[]; // Cloudinary URLs
  helpful: number; // Count of users who found review helpful
  isVerified: boolean; // Purchase verified review
  isDeleted: boolean; // Soft delete
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
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
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Review title is required"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      minlength: [10, "Comment must be at least 10 characters"],
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    cleanliness: {
      type: Number,
      min: [1, "Cleanliness rating must be at least 1"],
      max: [5, "Cleanliness rating cannot exceed 5"],
      default: null,
    },
    punctuality: {
      type: Number,
      min: [1, "Punctuality rating must be at least 1"],
      max: [5, "Punctuality rating cannot exceed 5"],
      default: null,
    },
    professionalism: {
      type: Number,
      min: [1, "Professionalism rating must be at least 1"],
      max: [5, "Professionalism rating cannot exceed 5"],
      default: null,
    },
    communication: {
      type: Number,
      min: [1, "Communication rating must be at least 1"],
      max: [5, "Communication rating cannot exceed 5"],
      default: null,
    },
    quality: {
      type: Number,
      min: [1, "Quality rating must be at least 1"],
      max: [5, "Quality rating cannot exceed 5"],
      default: null,
    },
    tags: [
      {
        type: String,
        enum: [
          "on-time",
          "friendly",
          "professional",
          "skilled",
          "honest",
          "clean",
          "courteous",
        ],
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    helpful: {
      type: Number,
      default: 0,
      min: 0,
    },
    isVerified: {
      type: Boolean,
      default: true, // Verified through completed booking
      index: true,
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
reviewSchema.index({ workerId: 1, rating: 1 });
reviewSchema.index({ workerId: 1, createdAt: -1 });
reviewSchema.index({ rating: 1, createdAt: -1 });
reviewSchema.index({ isDeleted: 1, isVerified: 1 });

export default model<IReview>("Review", reviewSchema);
