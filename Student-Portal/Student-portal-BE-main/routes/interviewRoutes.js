import express from "express";
import { verifyToken } from "../middleware/auth.js";
import InterviewSession from "../models/InterviewSession.js";
import { analyzeResume } from "../services/resumeAnalyzer.js";
import { buildQuestions, evaluateAnswer, calculateFinalScore } from "../services/interviewEngine.js";
import { sendInterviewResultEmail } from "../services/emailService.js";
import Student from "../models/Student.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Multer for resume upload in interview
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/interview/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDF files allowed"));
}});

// ── POST /api/interview/start  — start session from skills list ─────────────
router.post("/start", verifyToken, async (req, res) => {
  try {
    const { skills } = req.body; // skills array passed from frontend

    // Abandon any existing active session
    await InterviewSession.updateMany(
      { studentId: req.user._id, status: "active" },
      { status: "abandoned" }
    );

    const questions = buildQuestions(skills || []);

    const session = await InterviewSession.create({
      studentId:      req.user._id,
      detectedSkills: skills || [],
      questions,
      answers:        [],
      currentIndex:   0,
      status:         "active",
    });

    res.status(201).json({
      sessionId:    session._id,
      totalQuestions: questions.length,
      firstQuestion: {
        id:         questions[0].id,
        text:       questions[0].text,
        category:   questions[0].category,
        difficulty: questions[0].difficulty,
        skill:      questions[0].skill,
        index:      0,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/interview/start-from-resume — parse PDF then start ────────────
router.post("/start-from-resume", verifyToken, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No resume file uploaded" });

    const analysis = await analyzeResume(req.file.path);
    fs.unlink(req.file.path, () => {}); // clean up

    const skills = analysis.skills || [];

    await InterviewSession.updateMany(
      { studentId: req.user._id, status: "active" },
      { status: "abandoned" }
    );

    const questions = buildQuestions(skills);

    const session = await InterviewSession.create({
      studentId:      req.user._id,
      detectedSkills: skills,
      questions,
      answers:        [],
      currentIndex:   0,
      status:         "active",
    });

    res.status(201).json({
      sessionId:      session._id,
      detectedSkills: skills,
      totalQuestions: questions.length,
      firstQuestion: {
        id:         questions[0].id,
        text:       questions[0].text,
        category:   questions[0].category,
        difficulty: questions[0].difficulty,
        skill:      questions[0].skill,
        index:      0,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/interview/:sessionId/question — get current question ───────────
router.get("/:sessionId/question", verifyToken, async (req, res) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.sessionId, studentId: req.user._id });
    if (!session) return res.status(404).json({ error: "Session not found" });
    if (session.status !== "active") return res.status(400).json({ error: "Session is not active" });

    const q = session.questions[session.currentIndex];
    if (!q) return res.status(404).json({ error: "No more questions" });

    res.json({
      id:             q.id,
      text:           q.text,
      category:       q.category,
      difficulty:     q.difficulty,
      skill:          q.skill,
      index:          session.currentIndex,
      total:          session.questions.length,
      answeredSoFar:  session.answers.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/interview/:sessionId/evaluate — submit answer ─────────────────
router.post("/:sessionId/evaluate", verifyToken, async (req, res) => {
  try {
    const { questionId, answerText } = req.body;
    if (!answerText?.trim()) return res.status(400).json({ error: "Answer cannot be empty" });

    const session = await InterviewSession.findOne({ _id: req.params.sessionId, studentId: req.user._id });
    if (!session) return res.status(404).json({ error: "Session not found" });
    if (session.status !== "active") return res.status(400).json({ error: "Session already completed" });

    const question = session.questions.find(q => q.id === questionId);
    if (!question) return res.status(404).json({ error: "Question not found in session" });

    const { score, feedback } = evaluateAnswer(question, answerText);

    // Save answer
    session.answers.push({
      questionId,
      questionText: question.text,
      answerText:   answerText.trim(),
      score,
      feedback,
      category:   question.category,
      difficulty: question.difficulty,
      answeredAt: new Date(),
    });

    // Advance to next question
    session.currentIndex += 1;
    const isLast = session.currentIndex >= session.questions.length;

    if (isLast) {
      // Compute and store final scores
      const finalScoreData = calculateFinalScore(session.answers);
      session.finalScore   = { overall: finalScoreData.overall, technical: finalScoreData.technical, communication: finalScoreData.communication, confidence: finalScoreData.confidence };
      session.tipsSummary  = finalScoreData.tips || [];
      session.status       = "completed";
      session.completedAt  = new Date();
    }

    await session.save();

    const responsePayload = {
      score,
      feedback,
      isLast,
    };

    if (!isLast) {
      const nextQ = session.questions[session.currentIndex];
      responsePayload.nextQuestion = {
        id:         nextQ.id,
        text:       nextQ.text,
        category:   nextQ.category,
        difficulty: nextQ.difficulty,
        skill:      nextQ.skill,
        index:      session.currentIndex,
        total:      session.questions.length,
      };
    } else {
      responsePayload.finalScore  = session.finalScore;
      responsePayload.tipsSummary = session.tipsSummary;
      responsePayload.sessionId   = session._id;

      // Send result email in background
      Student.findById(req.user._id).then(student => {
        if (student?.email) sendInterviewResultEmail(student, session).catch(() => {});
      }).catch(() => {});
    }

    res.json(responsePayload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/interview/sessions — all past sessions for student ─────────────
router.get("/sessions", verifyToken, async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ studentId: req.user._id })
      .sort({ createdAt: -1 })
      .select("status finalScore detectedSkills tipsSummary questions answers createdAt completedAt")
      .limit(20);
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/interview/sessions/:id — full session detail ───────────────────
router.get("/sessions/:id", verifyToken, async (req, res) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.id, studentId: req.user._id });
    if (!session) return res.status(404).json({ error: "Session not found" });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/interview/sessions/:id — abandon active session ─────────────
router.delete("/sessions/:id", verifyToken, async (req, res) => {
  try {
    await InterviewSession.findOneAndUpdate(
      { _id: req.params.id, studentId: req.user._id },
      { status: "abandoned" }
    );
    res.json({ message: "Session abandoned" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
