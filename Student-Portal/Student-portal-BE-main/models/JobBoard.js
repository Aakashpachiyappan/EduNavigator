import mongoose from "mongoose";

const JobBoardModel = new mongoose.Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    contact: { type: String, required: true },
    description: { type: String, default: "" },
    skills: { type: [String], default: [] },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
      default: "Full-time",
    },
  },
  { timestamps: true }
);

export default mongoose.model("JobBoard", JobBoardModel);