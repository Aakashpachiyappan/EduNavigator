import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  filename: { type: String, default: "" },
  extractedText: { type: String, default: "" },
  skills: { type: [String], default: [] },
  experience: { type: [String], default: [] },
  education: { type: [String], default: [] },
  atsScore: { type: Number, default: 0 },
  suggestions: { type: [String], default: [] },
  matchingRoles: { type: [String], default: [] },
  skillGaps: { type: [String], default: [] },
  analyzedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Resume", ResumeSchema);
