import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      default: null, // null = global notification for all users
    },
    type: {
      type: String,
      enum: ["job", "forum", "club"],
      required: true,
    },
    message: { type: String, required: true },
    link: { type: String, default: "" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", NotificationSchema);
