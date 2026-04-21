import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { initSocket } from "./socket.js";

// Routes
import eventRouter from "./routes/EventRoutes.js";
import forumRouter from "./routes/ForumRoutes.js";
import clubRouter from "./routes/ClubRoutes.js";
import studentDashboardRouter from "./routes/studentDashboard.js";
import authRoutes from "./routes/authRoutes.js";
import JobBoardRouter from "./routes/JobBoardRoutes.js";
import badWordsRouter from "./routes/BadWordsRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "https://ephemeral-daffodil-28e8d0.netlify.app",
  "https://warm-frangollo-91690f.netlify.app",
  "https://astonishing-tarsier-522f3e.netlify.app",
  "http://localhost:5173",
  "http://localhost:5174",
];

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ── Socket.IO ─────────────────────────────────────────────────────────────────
initSocket(server);

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());

app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.path} — origin: ${req.headers.origin}`);
  next();
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/forum", forumRouter);
app.use("/api/events", eventRouter);
app.use("/api/clubs", clubRouter);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/jobs", JobBoardRouter);
app.use("/api", badWordsRouter);
app.use("/api/resume", resumeRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/interview", interviewRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (req, res) => res.json({ status: "ok" }));

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err.message);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

// ── Bootstrap ─────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5500;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`✅ Server + Socket.IO running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });