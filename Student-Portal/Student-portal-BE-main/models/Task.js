import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  title: { type: String, required: true },
  subject: { type: String },
  status: { type: String, enum: ["pending", "completed", "overdue"], default: "pending" },
  dueDate: { type: Date }
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);
