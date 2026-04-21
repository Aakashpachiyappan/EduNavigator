import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

// ─── Comprehensive Tech Skills Dictionary ──────────────────────────────────
const TECH_SKILLS = [
  "React", "Angular", "Vue.js", "Vue", "HTML", "CSS", "JavaScript",
  "TypeScript", "Next.js", "Nuxt.js", "Svelte", "jQuery", "Bootstrap",
  "Tailwind CSS", "SASS", "SCSS", "Redux", "Webpack", "Vite", "Babel",
  "Node.js", "Express", "Django", "Flask", "FastAPI", "Spring Boot", "Spring",
  "Laravel", "Ruby on Rails", "ASP.NET", ".NET", "PHP",
  "Python", "Java", "C++", "C#", "Go", "Rust", "Swift", "Kotlin", "Ruby",
  "Scala", "R", "MATLAB", "Dart",
  "MongoDB", "MySQL", "PostgreSQL", "SQLite", "Redis", "Cassandra", "Oracle",
  "Firebase", "DynamoDB", "Elasticsearch", "SQL",
  "AWS", "Azure", "GCP", "Google Cloud", "Heroku", "Docker", "Kubernetes",
  "CI/CD", "Jenkins", "GitHub Actions", "Terraform", "Ansible", "Vercel",
  "TensorFlow", "PyTorch", "Keras", "Scikit-learn", "OpenCV", "NLP",
  "Machine Learning", "Deep Learning", "Data Science", "Pandas", "NumPy",
  "LangChain", "Hugging Face",
  "Git", "GitHub", "GitLab", "Jira", "Figma", "Postman", "Linux", "Bash",
  "REST API", "REST APIs", "GraphQL", "gRPC", "Microservices", "Agile", "Scrum",
  "React Native", "Flutter", "Android", "iOS", "Xamarin",
  "Authentication", "OAuth", "JWT", "SSL", "bcrypt", "Encryption",
  "Communication", "Leadership", "Team Collaboration", "Problem Solving",
];

const JOB_ROLE_SKILLS = {
  "Frontend Developer":     ["React", "HTML", "CSS", "JavaScript", "TypeScript"],
  "Backend Developer":      ["Node.js", "Python", "Java", "MongoDB", "MySQL", "REST API", "Express"],
  "Full Stack Developer":   ["React", "Node.js", "MongoDB", "Express", "JavaScript", "TypeScript"],
  "Data Scientist":         ["Python", "Machine Learning", "Pandas", "NumPy", "TensorFlow", "Scikit-learn"],
  "DevOps Engineer":        ["Docker", "Kubernetes", "AWS", "CI/CD", "Jenkins", "Linux", "Terraform"],
  "Mobile Developer":       ["React Native", "Flutter", "Android", "iOS"],
  "AI/ML Engineer":         ["Python", "TensorFlow", "PyTorch", "NLP", "Deep Learning", "Scikit-learn"],
  "Cloud Engineer":         ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform"],
  "Software Engineer":      ["Java", "Python", "C++", "Git", "REST API", "Agile"],
  "Database Administrator": ["MySQL", "PostgreSQL", "MongoDB", "Oracle", "Redis", "SQL"],
  "Cybersecurity Analyst":  ["Authentication", "OAuth", "SSL", "Encryption", "Linux", "Bash"],
};

const GENERAL_TECH_STACK = [
  "React", "Node.js", "Python", "Docker", "AWS", "MongoDB", "TypeScript",
  "Git", "REST API", "Agile", "CI/CD", "SQL",
];

export async function analyzeResume(filePath) {
  const uint8Array = new Uint8Array(fs.readFileSync(filePath));
  const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
  const pdf = await loadingTask.promise;

  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map((item) => item.str).join(" ") + "\n";
  }

  // 2. Skill extraction
  const foundSkills = [];
  TECH_SKILLS.forEach((skill) => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?<![\\w/])${escaped}(?![\\w/])`, "i");
    if (regex.test(fullText) && !foundSkills.includes(skill)) foundSkills.push(skill);
  });

  // 3. Education
  const education = [];
  [
    /(?:bachelor|master|b\.?tech|m\.?tech|b\.?e|m\.?e|b\.?sc|m\.?sc|phd|ph\.d|diploma|degree)[^\n.]{0,100}/gi,
    /(?:university|college|institute of technology|school of)[^\n.]{0,80}/gi,
  ].forEach((pat) => {
    (fullText.match(pat) || []).slice(0, 3).forEach((m) => {
      const t = m.trim().replace(/\s+/g, " ").substring(0, 120);
      if (!education.includes(t)) education.push(t);
    });
  });

  // 4. Experience
  const experience = [];
  [
    /(?:intern|engineer|developer|analyst|manager|lead|architect|consultant)[^\n.]{0,120}/gi,
    /\d+\+?\s*(?:year|yr|month)s?\s*(?:of\s*)?(?:experience|exp)[^\n.]{0,60}/gi,
  ].forEach((pat) => {
    (fullText.match(pat) || []).slice(0, 4).forEach((m) => {
      const t = m.trim().replace(/\s+/g, " ").substring(0, 140);
      if (!experience.includes(t)) experience.push(t);
    });
  });

  // 5. Detailed section detection
  const has = {
    email:        /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/i.test(fullText),
    phone:        /(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/.test(fullText),
    linkedin:     /linkedin\.com|linkedin/i.test(fullText),
    github:       /github\.com|github/i.test(fullText),
    portfolio:    /portfolio|behance|dribbble/i.test(fullText),
    education:    /education|qualification|academic/i.test(fullText),
    experience:   /experience|work history|employment|internship/i.test(fullText),
    projects:     /project|build|developed|created|implemented/i.test(fullText),
    skills:       /skill|technology|tech stack|proficiency|expertise/i.test(fullText),
    summary:      /summary|objective|profile|about me|career goal/i.test(fullText),
    certif:       /certif|certification|certified|credential/i.test(fullText),
    awards:       /award|achievement|honour|honor|recognition|scholarship/i.test(fullText),
    quantified:   /\d+\s*%|increased|reduced|improved|saved|delivered|generated|grew|scaled|launched/i.test(fullText),
    actionVerbs:  /\b(?:led|built|developed|designed|optimized|managed|created|implemented|deployed|maintained|collaborated)\b/i.test(fullText),
    gpa:          /gpa|cgpa|grade point|percentage/i.test(fullText),
    volunteer:    /volunteer|community|society|club|organization|ngo/i.test(fullText),
    bullets:      (fullText.match(/[•·▪▸\-]\s+\w/g) || []).length,
    wordCount:    fullText.split(/\s+/).filter(Boolean).length,
    pages:        pdf.numPages,
  };

  // 6. ATS Score
  let score = Math.min(foundSkills.length * 4, 40);
  if (has.education)  score += 8;
  if (has.experience) score += 8;
  if (has.projects)   score += 6;
  if (has.skills)     score += 5;
  if (has.email)      score += 4;
  if (has.summary)    score += 5;
  if (has.github || has.portfolio) score += 5;
  if (has.certif)     score += 4;
  if (has.quantified) score += 6;
  if (has.actionVerbs) score += 4;
  if (has.linkedin)   score += 2;
  if (has.bullets > 5) score += 2;
  const atsScore = Math.min(Math.round(score), 100);

  // 7. Rich, context-aware suggestions
  const suggestions = [];

  // Contact
  if (!has.email)
    suggestions.push("Add a professional email address — recruiters need a direct way to reach you.");
  if (!has.phone)
    suggestions.push("Include a phone number so hiring managers can contact you quickly.");
  if (!has.linkedin)
    suggestions.push("Add your LinkedIn profile URL — 87% of recruiters use LinkedIn to verify candidates.");
  if (!has.github && foundSkills.some(s => ["JavaScript","Python","Java","React","Node.js","C++","Go","Rust"].includes(s)))
    suggestions.push("Link your GitHub to showcase your actual code — critical for software roles.");
  if (!has.portfolio && foundSkills.some(s => ["React","Angular","Vue","CSS","Figma","Flutter"].includes(s)))
    suggestions.push("Add a portfolio link (website/Behance) — show your design/dev work in action.");

  // Structure
  if (!has.summary)
    suggestions.push("Add a 2–3 line Professional Summary at the top — it's the first thing recruiters read.");
  if (!has.education)
    suggestions.push("Add an 'Education' section with your degree, institution, and graduation year.");
  if (!has.experience && !has.projects)
    suggestions.push("Add 'Work Experience' or 'Projects' — hiring managers need proof of real-world impact.");
  if (!has.projects)
    suggestions.push("Include 2–3 projects with tech stack used and measurable outcomes.");
  if (!has.skills)
    suggestions.push("Add a dedicated 'Skills' section listing your core technologies clearly.");

  // Impact
  if (!has.quantified)
    suggestions.push("Quantify your accomplishments — e.g., 'Reduced API response time by 35%' or 'Handled 10K+ daily users'. Numbers stand out.");
  if (!has.actionVerbs)
    suggestions.push("Start each bullet with strong action verbs: 'Built', 'Optimized', 'Deployed', 'Led', 'Designed'. Passive language weakens impact.");

  // Skills depth
  if (foundSkills.length < 5)
    suggestions.push("Only a few skills detected. List 10+ technologies to pass ATS keyword filters.");
  else if (foundSkills.length < 10)
    suggestions.push(`${foundSkills.length} skills detected — aim for 12+ to be competitive across ATS systems.`);

  // Certifications
  if (!has.certif)
    suggestions.push("No certifications found. Industry certs (AWS, Google Cloud, Meta, Microsoft) significantly boost your profile.");

  // Document quality
  if (has.wordCount < 200)
    suggestions.push("Resume appears too brief (under 200 words). Expand each experience and project with more detail.");
  if (has.wordCount > 900 && has.pages < 2)
    suggestions.push("Content is dense for one page. Consider a clean 2-page layout at this word count.");
  if (has.bullets < 5)
    suggestions.push("Use bullet points (•) to describe your roles — they are 3x easier for recruiters to scan than paragraphs.");

  // Extras
  if (!has.gpa && has.education)
    suggestions.push("If your GPA/CGPA is strong (≥ 3.5 / 8.5), add it — it signals academic excellence.");
  if (!has.awards)
    suggestions.push("Mention scholarships, hackathon wins, or recognitions — they differentiate you instantly.");
  if (!has.volunteer)
    suggestions.push("List volunteer work, open source contributions, or society roles — they show initiative beyond academics.");

  // Cap at 8 most relevant
  const finalSuggestions = suggestions.slice(0, 8);

  // 8. Skill gaps
  const skillGaps = GENERAL_TECH_STACK.filter(
    (s) => !foundSkills.some((fs) => fs.toLowerCase() === s.toLowerCase())
  );

  // 9. Matching job roles
  const roleScores = Object.entries(JOB_ROLE_SKILLS).map(([role, required]) => {
    const matched = required.filter((s) =>
      foundSkills.some((fs) => fs.toLowerCase() === s.toLowerCase())
    );
    return { role, score: Math.round((matched.length / required.length) * 100) };
  });
  roleScores.sort((a, b) => b.score - a.score);
  const matchingRoles = roleScores
    .filter((r) => r.score >= 20)
    .slice(0, 5)
    .map((r) => `${r.role} (${r.score}% match)`);

  return {
    skills: foundSkills,
    education: education.slice(0, 4),
    experience: experience.slice(0, 6),
    atsScore,
    suggestions: finalSuggestions,
    skillGaps: skillGaps.slice(0, 8),
    matchingRoles,
    meta: {
      wordCount: has.wordCount,
      pageCount: has.pages,
      bulletPoints: has.bullets,
    },
  };
}
