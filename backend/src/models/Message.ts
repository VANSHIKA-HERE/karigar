import { Schema, model, Document, Types } from "mongoose";

export interface IMessage extends Document {
  chatId: Types.ObjectId; // Reference to Chat
  senderId: Types.ObjectId; // Reference to User
  receiverId: Types.ObjectId; // Reference to User
  message: string;
  messageType: "text" | "image" | "document" | "location";
  mediaUrl: string | null; // Cloudinary URL for images/documents
  mediaType: string | null; // MIME type
  location: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;
  isRead: boolean;
  readAt: Date | null;
  isEdited: boolean;
  editedAt: Date | null;
  isDeleted: boolean; // Soft delete
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: [true, "Chat ID is required"],
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender ID is required"],
      index: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver ID is required"],
      index: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      maxlength: [5000, "Message cannot exceed 5000 characters"],
    },
    messageType: {
      type: String,
      enum: {
        values: ["text", "image", "document", "location"],
        message: "{VALUE} is not a valid message type",
      },
      default: "text",
    },
    mediaUrl: {
      type: String,
      default: null,
    },
    mediaType: {
      type: String,
      default: null,
    },
    location: {
      latitude: {
        type: Number,
        default: null,
      },
      longitude: {
        type: Number,
        default: null,
      },
      address: {
        type: String,
        default: null,
      },
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
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
messageSchema.index({ chatId: 1, createdAt: 1 });
messageSchema.index({ chatId: 1, isRead: 1 });
messageSchema.index({ senderId: 1, createdAt: -1 });
messageSchema.index({ receiverId: 1, isRead: 1 });

export default model<IMessage>("Message", messageSchema);
