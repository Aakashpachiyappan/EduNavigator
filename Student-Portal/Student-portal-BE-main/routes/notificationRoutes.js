import express from "express";
import { verifyToken } from "../middleware/auth.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// ── GET /api/notifications  ──────────────────────────────────────────────────
// Returns notifications for this user OR global (userId: null) ones.
router.get("/", verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [{ userId: req.userId }, { userId: null }],
    })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      $or: [{ userId: req.userId }, { userId: null }],
      read: false,
    });

    res.json({ notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// ── PATCH /api/notifications/:id/read ────────────────────────────────────────
router.patch("/:id/read", verifyToken, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark as read" });
  }
});

// ── PATCH /api/notifications/read-all ────────────────────────────────────────
router.patch("/read-all", verifyToken, async (req, res) => {
  try {
    await Notification.updateMany(
      { $or: [{ userId: req.userId }, { userId: null }], read: false },
      { read: true }
    );
    res.json({ message: "All marked as read" });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark all as read" });
  }
});

// ── DELETE /api/notifications/clear ──────────────────────────────────────────
router.delete("/clear", verifyToken, async (req, res) => {
  try {
    await Notification.deleteMany({
      $or: [{ userId: req.userId }, { userId: null }],
    });
    res.json({ message: "Notifications cleared" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear notifications" });
  }
});

export default router;
