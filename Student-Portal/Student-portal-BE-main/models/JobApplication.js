import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema({
  jobId:         { type: mongoose.Schema.Types.ObjectId, ref: "JobBoard", required: true },
  jobRole:       { type: String, required: true },
  company:       { type: String, required: true },
  studentId:     { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  studentName:   { type: String, required: true },
  studentEmail:  { type: String, required: true },
  department:    { type: String, default: "" },
  status:        { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  coverNote:     { type: String, default: "" },
}, { timestamps: true });

// Prevent duplicate applications
JobApplicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });

export default mongoose.model("JobApplication", JobApplicationSchema);
