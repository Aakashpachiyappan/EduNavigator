import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const KEYWORDS = [
  // Job Titles
  "Frontend Developer", "Software Engineer", "Full Stack Developer", "Backend Developer",

  // Programming Languages
  "Python", "Java", "C++", "JavaScript", "TypeScript", "C#", "Go", "Swift", "Kotlin",

  // Frameworks & Libraries
  "React", "Angular", "Vue.js", "Django", "Flask", "Node.js", "Spring Boot", "Bootstrap",

  // Tools & Platforms
  "Git", "GitHub", "Docker", "Jenkins", "Postman", "VS Code", "Selenium", "JIRA", "Figma",

  // Cloud
  "AWS", "Azure", "GCP", "Heroku", "Netlify",

  // Databases
  "MySQL", "MongoDB", "PostgreSQL", "SQLite", "Redis", "Oracle",

  // Security
  "Encryption", "Authentication", "OAuth", "SSL", "Hashing", "Firewalls",

  // DevOps
  "CI/CD", "Bash", "Shell Scripting", "Agile", "Scrum", "Version Control",

  // Machine Learning / AI
  "TensorFlow", "Keras", "PyTorch", "Scikit-learn", "OpenCV", "NLP",

  // Mobile Development
  "Flutter", "React Native", "Android SDK", "iOS SDK",

  // Operating Systems
  "Linux", "Windows", "macOS", "Unix",

  // Miscellaneous Technical Terms
  "REST APIs", "JSON", "XML", "MVC Architecture", "Responsive Design", 
  "Multithreading", "Memory Management", "Compiler Design", "Virtualization",
  "Network Protocols", "Scheduling Algorithms", "DBMS Concepts",

  // Soft Skills
  "Communication", "Team Collaboration", "Problem Solving", "Leadership",
  "Adaptability", "Creativity", "Time Management", "Critical Thinking",

  // Action Verbs
  "Developed", "Designed", "Implemented", "Engineered", "Optimized",
  "Analyzed", "Built", "Led", "Delivered", "Automated", "Collaborated",
  "Resolved", "Tested", "Managed", "Launched",

  // Certifications
  "Meta Front-End Developer Certificate", "AWS Certified Solutions Architect",
  "Google IT Support Certificate", "Cisco CCNA", "Azure Fundamentals",

  // Education Phrases
  "Bachelor of Technology in Computer Science", 
  "Master of Science in Data Science",
  "Diploma in Information Technology",
  "Coursework in algorithms and data structures",

  // Resume Sections
  "Summary", "Experience", "Skills", "Education", "Projects"
];


export default async function resumeChecker(filePath) {
  const uint8Array = new Uint8Array(fs.readFileSync(filePath)); 
  const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
  const pdf = await loadingTask.promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(" ");
    fullText += pageText + "\n";
  }

  let score = 0;
  const suggestions = [];

  KEYWORDS.forEach(keyword => {
    if (fullText.includes(keyword)) score += 10;
  });

  if (!/education/i.test(fullText)) suggestions.push("Add an 'Education' section.");
  if (!/experience/i.test(fullText)) suggestions.push("Add a 'Work Experience' section.");
  if (!/projects?/i.test(fullText)) suggestions.push("Mention your projects clearly.");
  if (!/contact|email/i.test(fullText)) suggestions.push("Include contact or email information.");

  return {
    atsScore: Math.min(score, 100),
    suggestions,
  };
}

