import { Schema, model, Document, Types } from "mongoose";

export interface IChat extends Document {
  customerId: Types.ObjectId; // Reference to User (Customer)
  workerId: Types.ObjectId; // Reference to User (Worker)
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number; // Unread messages for customer
  workerUnreadCount: number; // Unread messages for worker
  isActive: boolean; // If chat is still active/ongoing
  isDeleted: boolean; // Soft delete
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
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
    lastMessage: {
      type: String,
      default: "",
      maxlength: [1000, "Last message cannot exceed 1000 characters"],
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    unreadCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    workerUnreadCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
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

// Composite index for unique chat pair
chatSchema.index({ customerId: 1, workerId: 1 }, { unique: true });
// Index for listing chats by customer
chatSchema.index({ customerId: 1, lastMessageAt: -1 });
// Index for listing chats by worker
chatSchema.index({ workerId: 1, lastMessageAt: -1 });
// Index for active chats
chatSchema.index({ isActive: 1, isDeleted: 1 });

export default model<IChat>("Chat", chatSchema);
