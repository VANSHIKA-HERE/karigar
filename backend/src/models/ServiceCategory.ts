import { Schema, model, Document } from "mongoose";

export interface IServiceCategory extends Document {
  name: string;
  description: string;
  icon: string; // Cloudinary URL or emoji
  baseRate: number; // Base hourly rate in INR
  image: string; // Cloudinary URL
  estimatedDuration: number; // in minutes
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceCategorySchema = new Schema<IServiceCategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
    description: {
      type: String,
      required: [true, "Category description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    icon: {
      type: String,
      required: [true, "Category icon is required"],
      default: "👷",
    },
    baseRate: {
      type: Number,
      required: [true, "Base rate is required"],
      min: [100, "Base rate must be at least 100 INR"],
      max: [10000, "Base rate cannot exceed 10000 INR"],
    },
    image: {
      type: String,
      default: null,
    },
    estimatedDuration: {
      type: Number,
      default: 60, // 1 hour default
      min: [15, "Duration must be at least 15 minutes"],
      max: [480, "Duration cannot exceed 480 minutes (8 hours)"],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index frequently queried fields
serviceCategorySchema.index({ name: 1 });
serviceCategorySchema.index({ isActive: 1 });
serviceCategorySchema.index({ createdAt: -1 });

export default model<IServiceCategory>(
  "ServiceCategory",
  serviceCategorySchema
);
