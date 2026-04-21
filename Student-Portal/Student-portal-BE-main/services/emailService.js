import nodemailer from "nodemailer";

// ── Transporter (lazy init) ──────────────────────────────────────────────────
let _transporter = null;

function getTransporter() {
  if (_transporter) return _transporter;
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;
  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) return null;
  _transporter = nodemailer.createTransport({
    host:   EMAIL_HOST,
    port:   parseInt(EMAIL_PORT || "587"),
    secure: parseInt(EMAIL_PORT || "587") === 465,
    auth:   { user: EMAIL_USER, pass: EMAIL_PASS },
  });
  return _transporter;
}

// ── Generic send ─────────────────────────────────────────────────────────────
export async function sendMail({ to, subject, html }) {
  const t = getTransporter();
  if (!t) {
    console.log("📧 Email skipped (SMTP not configured):", subject);
    return;
  }
  try {
    await t.sendMail({
      from: process.env.EMAIL_FROM || `"EduNavigator" <${process.env.EMAIL_USER}>`,
      to, subject, html,
    });
    console.log(`📧 Email sent → ${to}`);
  } catch (err) {
    console.error("📧 Email error:", err.message);
  }
}

// ── Job notification email ────────────────────────────────────────────────────
export async function sendJobNotification(students, job) {
  if (!students?.length) return;
  const skillsHtml = (job.skills || [])
    .map(s => `<span style="display:inline-block;padding:3px 10px;background:#eff6ff;border:1px solid #bfdbfe;color:#2563eb;font-size:12px;margin:2px 3px;border-radius:3px;">${s}</span>`)
    .join("");

  const html = `
  <div style="font-family:'Inter',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f0f4ff;padding:24px;">
    <div style="background:#fff;border:1.5px solid rgba(59,130,246,0.18);border-radius:4px;overflow:hidden;">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#2563eb,#7c3aed);padding:28px 32px;">
        <div style="font-size:24px;font-weight:900;color:#fff;letter-spacing:0.04em;">⚡ Edu<span style="color:#bfdbfe;">Navigator</span></div>
        <div style="color:rgba(255,255,255,0.75);font-size:13px;margin-top:6px;">AI-Powered Student Career Portal</div>
      </div>
      <!-- Body -->
      <div style="padding:28px 32px;">
        <div style="font-size:13px;color:#64748b;font-family:'Courier New',monospace;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px;">🚀 New Opportunity Posted</div>
        <h2 style="font-size:22px;color:#1e293b;margin:0 0 4px;">${job.role}</h2>
        <div style="font-size:15px;color:#3b82f6;font-weight:600;margin-bottom:16px;">${job.company}</div>

        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <tr>
            <td style="padding:8px 12px;background:#f8faff;border:1px solid #e2e8f0;font-size:13px;color:#475569;font-weight:600;width:30%;">📍 Location</td>
            <td style="padding:8px 12px;background:#fff;border:1px solid #e2e8f0;font-size:13px;color:#1e293b;">${job.location}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;background:#f8faff;border:1px solid #e2e8f0;font-size:13px;color:#475569;font-weight:600;">💼 Type</td>
            <td style="padding:8px 12px;background:#fff;border:1px solid #e2e8f0;font-size:13px;color:#1e293b;">${job.type || "Full-time"}</td>
          </tr>
          ${job.contact ? `<tr>
            <td style="padding:8px 12px;background:#f8faff;border:1px solid #e2e8f0;font-size:13px;color:#475569;font-weight:600;">✉ Contact</td>
            <td style="padding:8px 12px;background:#fff;border:1px solid #e2e8f0;font-size:13px;color:#1e293b;">${job.contact}</td>
          </tr>` : ""}
        </table>

        ${job.description ? `<p style="font-size:14px;color:#475569;line-height:1.7;margin-bottom:18px;">${job.description}</p>` : ""}

        ${skillsHtml ? `<div style="margin-bottom:20px;"><div style="font-size:11px;color:#94a3b8;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:8px;">Required Skills</div>${skillsHtml}</div>` : ""}

        <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/jobs" 
           style="display:inline-block;padding:13px 28px;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;font-size:13px;font-weight:700;text-decoration:none;letter-spacing:0.06em;text-transform:uppercase;">
          VIEW &amp; APPLY →
        </a>
      </div>
      <!-- Footer -->
      <div style="padding:16px 32px;background:#f8faff;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;text-align:center;">
        You received this because you're registered on EduNavigator. 
        Visit <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}" style="color:#3b82f6;">the portal</a> to manage your account.
      </div>
    </div>
  </div>`;

  // Send to each student individually (in background, no await chain)
  for (const student of students) {
    sendMail({ to: student.email, subject: `🚀 New Job: ${job.role} at ${job.company} — EduNavigator`, html })
      .catch(() => {});
  }
}

// ── Interview results email ───────────────────────────────────────────────────
export async function sendInterviewResultEmail(student, session) {
  const { finalScore } = session;
  const scoreColor = finalScore.overall >= 70 ? "#10b981" : finalScore.overall >= 40 ? "#f59e0b" : "#ef4444";
  const label      = finalScore.overall >= 70 ? "Excellent" : finalScore.overall >= 40 ? "Good" : "Needs Improvement";

  const html = `
  <div style="font-family:'Inter',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f0f4ff;padding:24px;">
    <div style="background:#fff;border:1.5px solid rgba(59,130,246,0.18);border-radius:4px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#2563eb,#7c3aed);padding:28px 32px;">
        <div style="font-size:24px;font-weight:900;color:#fff;">⚡ EduNavigator</div>
        <div style="color:rgba(255,255,255,0.75);font-size:13px;margin-top:6px;">AI Interview Results</div>
      </div>
      <div style="padding:28px 32px;">
        <h2 style="font-size:20px;color:#1e293b;margin:0 0 4px;">Hi ${student.name},</h2>
        <p style="color:#64748b;font-size:14px;margin-bottom:24px;">Your AI Interview Simulation is complete. Here's your performance summary:</p>
        
        <div style="text-align:center;padding:24px;background:#f8faff;border:1.5px solid rgba(59,130,246,0.1);margin-bottom:24px;">
          <div style="font-size:52px;font-weight:900;color:${scoreColor};">${finalScore.overall}<span style="font-size:24px;">/100</span></div>
          <div style="font-size:14px;color:${scoreColor};font-weight:600;margin-top:4px;">${label}</div>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr><td style="padding:8px 12px;background:#f8faff;border:1px solid #e2e8f0;font-size:13px;color:#475569;font-weight:600;">🧠 Technical</td><td style="padding:8px 12px;border:1px solid #e2e8f0;font-size:14px;font-weight:700;color:#3b82f6;">${finalScore.technical}/100</td></tr>
          <tr><td style="padding:8px 12px;background:#f8faff;border:1px solid #e2e8f0;font-size:13px;color:#475569;font-weight:600;">💬 Communication</td><td style="padding:8px 12px;border:1px solid #e2e8f0;font-size:14px;font-weight:700;color:#8b5cf6;">${finalScore.communication}/100</td></tr>
          <tr><td style="padding:8px 12px;background:#f8faff;border:1px solid #e2e8f0;font-size:13px;color:#475569;font-weight:600;">🎯 Confidence</td><td style="padding:8px 12px;border:1px solid #e2e8f0;font-size:14px;font-weight:700;color:#10b981;">${finalScore.confidence}/100</td></tr>
        </table>

        <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/interview/dashboard" 
           style="display:inline-block;padding:13px 28px;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;font-size:13px;font-weight:700;text-decoration:none;letter-spacing:0.06em;text-transform:uppercase;">
          VIEW FULL REPORT →
        </a>
      </div>
    </div>
  </div>`;

  await sendMail({ to: student.email, subject: `📊 Your Interview Score: ${finalScore.overall}/100 — EduNavigator`, html });
}
