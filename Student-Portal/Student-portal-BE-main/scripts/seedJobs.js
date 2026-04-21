// scripts/seedJobs.js
// Run with: node scripts/seedJobs.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env") });

const JobBoardSchema = new mongoose.Schema({
  role: String, company: String, location: String, contact: String,
  description: String, type: String, skills: [String],
}, { timestamps: true });

const Job = mongoose.models.JobBoard || mongoose.model("JobBoard", JobBoardSchema);

const dummyJobs = [
  {
    role: "Frontend Developer",
    company: "TechVision Labs",
    location: "Bangalore, India",
    contact: "careers@techvisionlabs.io",
    description: "Build modern, responsive web applications using React and TypeScript. Collaborate with design and backend teams to deliver high-quality user experiences.",
    type: "Full-time",
    skills: ["React", "TypeScript", "CSS", "HTML", "Git", "REST API"],
  },
  {
    role: "Machine Learning Intern",
    company: "AI Nexus Solutions",
    location: "Remote / Hyderabad",
    contact: "intern@ainexus.com",
    description: "Assist in building NLP and computer vision models. Work with Python, TensorFlow, and real-world datasets. Great opportunity for final-year students.",
    type: "Internship",
    skills: ["Python", "Machine Learning", "TensorFlow", "NLP", "Git", "SQL"],
  },
  {
    role: "Full Stack Engineer",
    company: "CloudStack Inc.",
    location: "Pune, India",
    contact: "hr@cloudstack.dev",
    description: "Design and implement scalable full-stack applications. Work across React frontend and Node.js backend with MongoDB, deployed on AWS infrastructure.",
    type: "Full-time",
    skills: ["Node.js", "React", "MongoDB", "AWS", "Docker", "REST API", "TypeScript"],
  },
  {
    role: "Data Analyst",
    company: "Insight Analytics Co.",
    location: "Chennai / Remote",
    contact: "jobs@insightanalytics.co",
    description: "Analyze large datasets, create dashboards, and deliver actionable insights to product and leadership teams. SQL and Python proficiency required.",
    type: "Part-time",
    skills: ["Python", "SQL", "PostgreSQL", "Machine Learning", "REST API", "Git"],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB");

    const existing = await Job.countDocuments();
    if (existing >= 3) {
      console.log(`ℹ️  Already have ${existing} jobs — skipping seed.`);
    } else {
      await Job.insertMany(dummyJobs);
      console.log(`✅ Seeded ${dummyJobs.length} dummy jobs successfully!`);
    }
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected");
  }
}

seed();
