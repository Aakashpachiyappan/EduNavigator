import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
  questionId:  { type: String, required: true },
  questionText:{ type: String },
  answerText:  { type: String, required: true },
  score:       { type: Number, min: 0, max: 10, default: 0 },
  feedback: {
    strengths:   [String],
    weaknesses:  [String],
    tip:         { type: String, default: "" },
  },
  category:    { type: String, enum: ["technical","behavioral","project"], default: "technical" },
  difficulty:  { type: String, enum: ["easy","medium","hard"], default: "medium" },
  answeredAt:  { type: Date, default: Date.now },
});

const QuestionSchema = new mongoose.Schema({
  id:               { type: String, required: true },
  text:             { type: String, required: true },
  category:         { type: String, enum: ["technical","behavioral","project"], default: "technical" },
  difficulty:       { type: String, enum: ["easy","medium","hard"], default: "medium" },
  skill:            { type: String, default: "" },
  expectedKeywords: [String],
}, { _id: false });

const FinalScoreSchema = new mongoose.Schema({
  overall:       { type: Number, min: 0, max: 100, default: 0 },
  technical:     { type: Number, min: 0, max: 100, default: 0 },
  communication: { type: Number, min: 0, max: 100, default: 0 },
  confidence:    { type: Number, min: 0, max: 100, default: 0 },
}, { _id: false });

const InterviewSessionSchema = new mongoose.Schema({
  studentId:    { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  detectedSkills: [String],
  questions:    [QuestionSchema],
  answers:      [AnswerSchema],
  currentIndex: { type: Number, default: 0 },
  status:       { type: String, enum: ["active","completed","abandoned"], default: "active" },
  finalScore:   { type: FinalScoreSchema, default: () => ({}) },
  tipsSummary:  [String],
  completedAt:  { type: Date },
}, { timestamps: true });

export default mongoose.model("InterviewSession", InterviewSessionSchema);
