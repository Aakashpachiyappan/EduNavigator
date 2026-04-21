import express from "express";
import swearjar from "swearjar";

const badWordsRouter = express.Router();


badWordsRouter.post("/check-badwords", (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  const containsBadWords = swearjar.profane(text);
  const cleaned = swearjar.censor(text);

  if (containsBadWords) {
    return res.status(403).json({
      message: "You can't upload this post due to bad words",
      cleaned
    });
  }

  res.json({
    message: "Clean content",
    cleaned
  });
});

export default badWordsRouter;
