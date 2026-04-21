import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true },
    email:      { type: String, required: true, unique: true },
    department: String,
    password:   { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "admin", "superadmin"],
      default: "student",
    },
    // 'active'   → normal, can log in
    // 'pending'  → admin registered, awaiting superadmin approval
    // 'rejected' → superadmin rejected admin request
    status: {
      type: String,
      enum: ["active", "pending", "rejected"],
      default: "active",
    },
    skills:         [String],
    courses:        [String],
    upcomingEvents: [String],
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" },
  },
  { timestamps: true }
);

export default mongoose.model("Student", StudentSchema);
