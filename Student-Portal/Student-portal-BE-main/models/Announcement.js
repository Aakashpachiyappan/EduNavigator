import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ["important", "info", "success", "default"], default: "default" },
  date: { type: String }
}, { timestamps: true });

export default mongoose.model("Announcement", announcementSchema);
