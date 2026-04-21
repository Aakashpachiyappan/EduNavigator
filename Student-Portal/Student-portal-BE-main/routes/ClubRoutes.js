import express from "express";
import Club from "../models/Club.js";
import Notification from "../models/Notification.js";
import { getIO } from "../socket.js";
import { verifyToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

// ── Create a club (admin/superadmin only) ────────────────────────────────────
router.post("/", verifyToken, requireRole(["admin", "superadmin"]), async (req, res) => {
  try {
    const newClub = new Club(req.body);
    const saved = await newClub.save();

    // Global notification
    await Notification.create({
      userId: null,
      type: "club",
      message: `🎓 New club created: "${saved.name || saved.clubName || "New Club"}"`,
      link: "/clubs",
    });

    // Real-time socket broadcast
    try {
      getIO().emit("club-update", {
        message: `🎓 New club: "${saved.name || saved.clubName}"`,
        club: saved,
      });
    } catch (_) {}

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Error creating club", err });
  }
});

// ── Get all clubs ─────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const clubs = await Club.find().sort({ createdAt: -1 });
    res.status(200).json(clubs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching clubs", err });
  }
});

// ── Delete a club (admin/superadmin only) ───────────────────────────────────
router.delete("/:id", verifyToken, requireRole(["admin", "superadmin"]), async (req, res) => {
  try {
    const deleted = await Club.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Club not found" });
    res.status(200).json({ message: "Club deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting club", err });
  }
});

export default router;
