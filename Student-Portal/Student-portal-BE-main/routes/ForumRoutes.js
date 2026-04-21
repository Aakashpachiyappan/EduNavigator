import express from "express";
import ForumPost from "../models/ForumPost.js";
import Student from "../models/Student.js";
import Notification from "../models/Notification.js";
import { verifyToken, requireRole } from "../middleware/auth.js";
import { getIO } from "../socket.js";

const forumRouter = express.Router();

// ── Get all posts ─────────────────────────────────────────────────────────────
forumRouter.get("/", async (req, res) => {
  try {
    const posts = await ForumPost.find().sort({ createdAt: -1 });
    const postsWithNames = await Promise.all(
      posts.map(async (post) => {
        const student = await Student.findById(post.author).select("name");
        return {
          ...post.toObject(),
          authorName: student ? student.name : "Unknown",
          authorId: post.author?.toString() || null,
        };
      })
    );
    res.json(postsWithNames);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch forum posts" });
  }
});

// ── Create post (admin/superadmin only) ──────────────────────────────────────
forumRouter.post("/", verifyToken, requireRole(["admin", "superadmin"]), async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = new ForumPost({ title, content, author: req.userId });
    await newPost.save();

    const author = await Student.findById(req.userId).select("name");

    // Global notification
    await Notification.create({
      userId: null,
      type: "forum",
      message: `💬 New forum post: "${title}" by ${author?.name || "Someone"}`,
      link: "/forum",
    });

    // Real-time socket broadcast
    try {
      getIO().emit("new-forum-post", {
        message: `💬 New post: "${title}"`,
        post: newPost,
      });
    } catch (_) {}

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
});

// ── Delete post (admin/superadmin) ──────────────────────────────────────────
forumRouter.delete("/:id", verifyToken, requireRole(["admin", "superadmin"]), async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    await post.deleteOne();
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
});

// ── Get single post ───────────────────────────────────────────────────────────
forumRouter.get("/:id", verifyToken, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    
    const author = await Student.findById(post.author).select("name");
    
    res.status(200).json({
      ...post.toObject(),
      authorName: author ? author.name : "Unknown",
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post details", error });
  }
});

export default forumRouter;