export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">🎓</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">About EduNavigator</h1>
          <p className="text-gray-500">A smart student platform built for modern campus life.</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              EduNavigator is an all-in-one student portal that connects campus life with career opportunities.
              We help students manage academics, discover jobs, check their resumes, and prepare for interviews
              — all powered by AI.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Features</h2>
            <ul className="space-y-2 text-gray-600">
              {[
                '💬 Discussion Forum — collaborate with peers',
                '🏆 Campus Clubs — find your community',
                '📅 Events — stay in the loop',
                '💼 Job Board — discover opportunities',
                '🧠 AI Resume Checker — instant ATS scoring',
                '🎯 AI Job Matching — personalised recommendations',
                '🎤 AI Interview Simulator — practice with feedback',
              ].map(f => <li key={f} className="flex gap-2">{f}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Tech Stack</h2>
            <p className="text-gray-600">Built with React, Node.js, Express, MongoDB, and Socket.IO.</p>
          </div>
        </div>
      </div>
    </div>
  );
}