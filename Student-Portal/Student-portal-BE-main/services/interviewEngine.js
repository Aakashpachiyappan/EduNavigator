import { randomUUID as uuid } from "crypto";

// ────────────────────────────────────────────────────────────────────────────
// QUESTION BANK  — keyed by skill name, each has easy/medium/hard arrays
// ────────────────────────────────────────────────────────────────────────────
const QB = {
  React: {
    easy: [
      { text:"What is JSX and why do we use it in React?", expectedKeywords:["javascript xml","syntax","html","component","babel","transpile","render"] },
      { text:"What is the difference between state and props in React?", expectedKeywords:["state","mutable","props","immutable","parent","child","re-render"] },
    ],
    medium: [
      { text:"Explain how the useEffect hook works and when you'd use cleanup functions.", expectedKeywords:["side effect","dependency array","mount","unmount","cleanup","return","subscription"] },
      { text:"How does React's Virtual DOM improve performance?", expectedKeywords:["virtual dom","reconciliation","diff","real dom","batch","re-render","fiber"] },
    ],
    hard: [
      { text:"Explain React's Context API vs Redux — when would you choose each?", expectedKeywords:["context","provider","consumer","global state","redux","prop drilling","performance","middleware"] },
      { text:"What are React performance optimisation techniques you've applied?", expectedKeywords:["memo","usecallback","usememo","lazy","suspense","code splitting","virtualization","avoid re-render"] },
    ],
  },
  "Node.js": {
    easy: [
      { text:"What is the event loop in Node.js and why is it important?", expectedKeywords:["event loop","non-blocking","asynchronous","callback","single thread","libuv","queue"] },
    ],
    medium: [
      { text:"How do you handle errors in an Express.js application?", expectedKeywords:["try catch","middleware","error handler","next","status","promise","async await"] },
      { text:"What is the difference between require() and ES Modules import in Node.js?", expectedKeywords:["commonjs","esm","synchronous","asynchronous","static","dynamic","module"] },
    ],
    hard: [
      { text:"How would you scale a Node.js application to handle millions of concurrent requests?", expectedKeywords:["cluster","load balancer","pm2","horizontal scaling","redis","caching","microservices","worker"] },
    ],
  },
  JavaScript: {
    easy: [
      { text:"What is the difference between var, let, and const in JavaScript?", expectedKeywords:["scope","hoisting","block","function","reassign","temporal dead zone"] },
      { text:"What are arrow functions and how do they differ from regular functions?", expectedKeywords:["this","lexical","argument","prototype","concise","es6"] },
    ],
    medium: [
      { text:"Explain closures in JavaScript with an example.", expectedKeywords:["closure","inner function","outer scope","variable","private","memorization","retain"] },
      { text:"What is the difference between == and === in JavaScript?", expectedKeywords:["strict equality","loose equality","coercion","type","NaN","null","undefined"] },
    ],
    hard: [
      { text:"Explain the JavaScript prototype chain and how inheritance works.", expectedKeywords:["prototype","chain","Object.create","inheritance","__proto__","class","extends"] },
      { text:"What are JavaScript Promises and how does async/await work under the hood?", expectedKeywords:["promise","resolve","reject","then","catch","async","await","event loop","microtask"] },
    ],
  },
  TypeScript: {
    easy: [
      { text:"What is TypeScript and what advantages does it have over JavaScript?", expectedKeywords:["type safety","compile","static","interface","error","autocomplete","refactor"] },
    ],
    medium: [
      { text:"Explain TypeScript generics and give a practical use case.", expectedKeywords:["generic","type parameter","reusable","T","constraint","function","interface"] },
      { text:"What is the difference between interface and type in TypeScript?", expectedKeywords:["interface","type alias","extend","merge","union","intersection","class"] },
    ],
    hard: [
      { text:"How do you handle advanced TypeScript patterns like conditional types and mapped types?", expectedKeywords:["conditional type","mapped type","infer","keyof","typeof","utility","partial","record"] },
    ],
  },
  Python: {
    easy: [
      { text:"What are Python list comprehensions and when would you use them?", expectedKeywords:["list comprehension","concise","loop","filter","map","readable","expression"] },
      { text:"What is the difference between a list and a tuple in Python?", expectedKeywords:["mutable","immutable","list","tuple","ordered","indexed","memory"] },
    ],
    medium: [
      { text:"Explain Python decorators with a real-world example.", expectedKeywords:["decorator","wrapper","function","closure","@","logging","authentication","modify"] },
      { text:"What are Python generators and how do they differ from regular functions?", expectedKeywords:["generator","yield","lazy","memory","iterator","next","large data","stream"] },
    ],
    hard: [
      { text:"How does Python's GIL (Global Interpreter Lock) affect multi-threading?", expectedKeywords:["GIL","thread","CPython","multiprocessing","concurrency","I/O","CPU-bound","workaround"] },
    ],
  },
  MongoDB: {
    easy: [
      { text:"What is MongoDB and how does it differ from relational databases?", expectedKeywords:["document","collection","NoSQL","schema","JSON","BSON","flexible","relational","table"] },
    ],
    medium: [
      { text:"What is the aggregation pipeline in MongoDB? Give an example.", expectedKeywords:["aggregation","pipeline","match","group","project","sort","lookup","stage"] },
      { text:"How do you design relationships in MongoDB — embedding vs referencing?", expectedKeywords:["embed","reference","ObjectId","populate","denormalization","one-to-many","query"] },
    ],
    hard: [
      { text:"How would you optimise a slow MongoDB query?", expectedKeywords:["index","explain","compound index","covered query","projection","limit","shard","profiler"] },
    ],
  },
  "Machine Learning": {
    easy: [
      { text:"What is the difference between supervised and unsupervised learning?", expectedKeywords:["supervised","label","unsupervised","cluster","classification","regression","training"] },
    ],
    medium: [
      { text:"Explain overfitting and how you would prevent it.", expectedKeywords:["overfitting","regularization","dropout","cross-validation","bias-variance","training","test"] },
      { text:"What is gradient descent and how does it work?", expectedKeywords:["gradient","descent","loss","learning rate","optimise","iteration","weight","minimum"] },
    ],
    hard: [
      { text:"Compare CNN, RNN, and Transformer architectures and when to use each.", expectedKeywords:["CNN","image","RNN","sequence","transformer","attention","LSTM","NLP","vision"] },
    ],
  },
  Docker: {
    easy: [
      { text:"What is Docker and how is it different from a virtual machine?", expectedKeywords:["container","image","OS","lightweight","VM","hypervisor","isolate","reproducible"] },
    ],
    medium: [
      { text:"Explain Docker Compose and when you'd use it.", expectedKeywords:["compose","multi-container","service","network","volume","yaml","orchestrate","environment"] },
    ],
    hard: [
      { text:"How would you implement a CI/CD pipeline using Docker and GitHub Actions?", expectedKeywords:["CI/CD","pipeline","build","push","registry","deploy","workflow","test","automate"] },
    ],
  },
  AWS: {
    medium: [
      { text:"Explain the key AWS services you've used and their purpose.", expectedKeywords:["EC2","S3","Lambda","RDS","CloudFront","IAM","VPC","compute","storage"] },
      { text:"What is the difference between AWS Lambda and EC2?", expectedKeywords:["lambda","serverless","EC2","instance","scaling","cost","always on","trigger","event"] },
    ],
    hard: [
      { text:"How would you architect a highly available and fault-tolerant system on AWS?", expectedKeywords:["availability zone","load balancer","auto scaling","multi-region","RDS","S3","Route 53","failover"] },
    ],
  },
  SQL: {
    easy: [
      { text:"What is the difference between INNER JOIN, LEFT JOIN, and RIGHT JOIN?", expectedKeywords:["inner join","matching","left join","all rows","right join","null","result set"] },
    ],
    medium: [
      { text:"What are database indexes and how do they improve query performance?", expectedKeywords:["index","B-tree","lookup","fast","write overhead","primary","clustered","full scan"] },
      { text:"Explain ACID properties in database transactions.", expectedKeywords:["atomicity","consistency","isolation","durability","transaction","commit","rollback","integrity"] },
    ],
  },
  Git: {
    easy: [
      { text:"What is the difference between git merge and git rebase?", expectedKeywords:["merge","rebase","linear","branch","conflict","history","commit","fast-forward"] },
    ],
    medium: [
      { text:"How do you handle merge conflicts in a team environment?", expectedKeywords:["conflict","resolve","communication","branch","pull request","review","merge","strategy"] },
    ],
  },
  "REST API": {
    easy: [
      { text:"What are the key principles of RESTful API design?", expectedKeywords:["stateless","HTTP","resource","verb","GET","POST","PUT","DELETE","JSON","uniform"] },
    ],
    medium: [
      { text:"How do you handle API versioning and backward compatibility?", expectedKeywords:["versioning","v1","header","deprecated","backward","route","client","breaking change"] },
      { text:"What security measures do you implement in a REST API?", expectedKeywords:["JWT","OAuth","HTTPS","rate limit","validation","CORS","authentication","authorization"] },
    ],
  },
};

// Behavioral questions (always included)
const BEHAVIORAL = [
  { text:"Tell me about yourself and your technical background.", difficulty:"easy", expectedKeywords:["background","education","projects","skills","experience","interest","goal"] },
  { text:"Describe a challenging technical problem you solved and your approach.", difficulty:"medium", expectedKeywords:["problem","solution","approach","research","debug","learned","outcome","overcome"] },
  { text:"How do you handle tight deadlines when working on multiple tasks?", difficulty:"medium", expectedKeywords:["prioritize","deadline","organize","communicate","time management","deliver","focus"] },
  { text:"Describe how you collaborate in a team project. Give a specific example.", difficulty:"medium", expectedKeywords:["team","collaborate","communicate","git","conflict","role","contribute","outcome"] },
  { text:"Where do you see yourself professionally in the next 3 years?", difficulty:"easy", expectedKeywords:["goal","career","grow","learn","contribute","position","technology","impact"] },
];

// Project-based question templates
const PROJECT_TEMPLATES = [
  (skill) => ({ text:`Walk me through a project where you used ${skill}. What challenges did you face?`, expectedKeywords:["project","challenge","solution","implement","team","result","learned",skill.toLowerCase()] }),
  (skill) => ({ text:`How did you optimise performance in your ${skill} project?`, expectedKeywords:["optimise","performance","bottleneck","cache","lazy","reduce","measure","profile",skill.toLowerCase()] }),
];

// ────────────────────────────────────────────────────────────────────────────
// SESSION BUILDER
// ────────────────────────────────────────────────────────────────────────────
export function buildQuestions(skills = []) {
  const questions = [];

  // Map known skills
  const known = skills.filter(s => QB[s]);

  // Pick top 4 skills at most
  const picked = known.slice(0, 4);

  picked.forEach((skill, idx) => {
    const bank = QB[skill];
    // One easy + one medium/hard per skill (alternate difficulty)
    const easy = bank.easy?.[0];
    const hard  = bank.hard?.[0] || bank.medium?.[0];

    if (easy) questions.push({ id: uuid(), skill, category:"technical", difficulty:"easy",   text: easy.text, expectedKeywords: easy.expectedKeywords });
    if (hard)  questions.push({ id: uuid(), skill, category:"technical", difficulty:idx%2===0?"medium":"hard", text: hard.text, expectedKeywords: hard.expectedKeywords });

    // Add one project question for the first 2 skills
    if (idx < 2) {
      const tmpl = PROJECT_TEMPLATES[idx % PROJECT_TEMPLATES.length](skill);
      questions.push({ id: uuid(), skill, category:"project", difficulty:"medium", text: tmpl.text, expectedKeywords: tmpl.expectedKeywords });
    }
  });

  // Always add 2 behavioral questions
  const bq1 = BEHAVIORAL[Math.floor(Math.random() * 3)];
  const bq2 = BEHAVIORAL[3 + Math.floor(Math.random() * 2)];
  questions.push({ id: uuid(), skill:"", category:"behavioral", difficulty: bq1.difficulty, text: bq1.text, expectedKeywords: bq1.expectedKeywords });
  questions.push({ id: uuid(), skill:"", category:"behavioral", difficulty: bq2.difficulty, text: bq2.text, expectedKeywords: bq2.expectedKeywords });

  // Fallback: if no skills matched, use generic JS questions + behaviorals
  if (picked.length === 0) {
    const fallback = QB["JavaScript"];
    questions.push({ id:uuid(), skill:"JavaScript", category:"technical", difficulty:"easy",   text:fallback.easy[0].text,   expectedKeywords:fallback.easy[0].expectedKeywords });
    questions.push({ id:uuid(), skill:"JavaScript", category:"technical", difficulty:"medium", text:fallback.medium[0].text, expectedKeywords:fallback.medium[0].expectedKeywords });
  }

  return questions.slice(0, 10); // cap at 10
}

// ────────────────────────────────────────────────────────────────────────────
// ANSWER EVALUATOR
// ────────────────────────────────────────────────────────────────────────────
export function evaluateAnswer(question, answerText) {
  const lower    = answerText.toLowerCase();
  const words    = answerText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const { expectedKeywords = [], category, difficulty } = question;

  // 1. Keyword matching
  const matched  = expectedKeywords.filter(kw => lower.includes(kw.toLowerCase()));
  const missed   = expectedKeywords.filter(kw => !lower.includes(kw.toLowerCase()));
  const kwRatio  = expectedKeywords.length > 0 ? matched.length / expectedKeywords.length : 0.5;

  // 2. Depth score (word count)
  let depthScore = 0;
  if (wordCount >= 150) depthScore = 3;
  else if (wordCount >= 80)  depthScore = 2;
  else if (wordCount >= 30)  depthScore = 1;

  // 3. Base score (0-7) from keyword ratio
  const diffMult = difficulty === "hard" ? 0.85 : difficulty === "medium" ? 0.9 : 1;
  const baseScore = Math.round(kwRatio * 7 * diffMult);

  // 4. Raw score capped at 10
  let score = Math.min(baseScore + depthScore, 10);

  // Minimum score: if they wrote something meaningful (>20 words), give at least 2
  if (wordCount > 20 && score < 2) score = 2;
  // If they wrote very little, cap at 5
  if (wordCount < 15) score = Math.min(score, 4);

  // 5. Build feedback
  const strengths  = [];
  const weaknesses = [];

  if (matched.length > 0)
    strengths.push(`Good coverage of: ${matched.slice(0, 4).join(", ")}.`);
  if (wordCount >= 80)
    strengths.push("Detailed and thorough explanation.");
  if (wordCount >= 150)
    strengths.push("Excellent depth — shows strong understanding.");
  if (category === "behavioral" && /example|instance|situation|project/i.test(answerText))
    strengths.push("Great use of a concrete example.");

  if (missed.length > 0)
    weaknesses.push(`Could have also mentioned: ${missed.slice(0, 3).join(", ")}.`);
  if (wordCount < 30)
    weaknesses.push("Answer is too brief. Expand with examples and reasoning.");
  if (wordCount < 60 && category === "technical")
    weaknesses.push("Technical answers benefit from more detail and examples.");
  if (category === "behavioral" && !/example|instance|situation|because|when/i.test(answerText))
    weaknesses.push("Try using the STAR method: Situation → Task → Action → Result.");

  // 6. Improvement tip
  const tip = missed.length > 0
    ? `Strengthen your answer by discussing: ${missed.slice(0, 2).join(" and ")}.`
    : wordCount < 50
    ? "Aim for 100+ word answers in real interviews to show depth."
    : "Strong answer! Review edge cases to make it even more impressive.";

  return { score, feedback: { strengths, weaknesses, tip }, matched, missed };
}

// ────────────────────────────────────────────────────────────────────────────
// FINAL SCORE CALCULATOR
// ────────────────────────────────────────────────────────────────────────────
export function calculateFinalScore(answers = []) {
  if (answers.length === 0) return { overall:0, technical:0, communication:0, confidence:0 };

  const techAnswers       = answers.filter(a => a.category === "technical" || a.category === "project");
  const behavioralAnswers = answers.filter(a => a.category === "behavioral");
  const allScores         = answers.map(a => a.score);

  const avg = (arr) => arr.length > 0 ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length) : 0;

  // Technical: average of tech + project answers → scale to 100
  const technical = Math.min(Math.round(avg(techAnswers.map(a => a.score)) * 10), 100);

  // Communication: based on word counts across all answers
  const wordCounts = answers.map(a => a.answerText?.split(/\s+/).filter(Boolean).length || 0);
  const avgWords   = avg(wordCounts);
  const communication = Math.min(Math.round((avgWords / 150) * 100), 100);

  // Confidence: consistency (low variance = high confidence)
  const overallAvg = avg(allScores);
  const variance   = avg(allScores.map(s => Math.abs(s - overallAvg)));
  const confidence = Math.max(Math.min(Math.round(100 - variance * 12), 100), 0);

  // Overall: weighted
  const overall = Math.round(technical * 0.5 + communication * 0.3 + confidence * 0.2);

  // Improvement tips
  const tips = [];
  if (technical < 60)     tips.push("Revise core technical concepts for your primary skills.");
  if (communication < 50) tips.push("Practice giving longer, more structured answers (aim for 100+ words each).");
  if (confidence < 60)    tips.push("Work on consistency — try to maintain the same answer quality throughout.");
  if (avgWords < 50)      tips.push("In real interviews, interviewers expect detailed explanations. Practice elaborating.");
  tips.push("Record yourself answering questions out loud to improve articulation.");

  return { overall, technical, communication, confidence, tips };
}
