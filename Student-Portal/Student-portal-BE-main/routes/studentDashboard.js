import express from "express";
import Student from "../models/Student.js"; 

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id); 
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).json({ error: "Server error" });
  }
});



export default router;
