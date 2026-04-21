
import mongoose from "mongoose";

const forumSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId , ref : "Student" }, 
}, { timestamps: true });

export default mongoose.model("ForumPost", forumSchema);
