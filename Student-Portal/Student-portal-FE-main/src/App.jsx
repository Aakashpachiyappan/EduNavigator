import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar  from './components/Navbar';

import Home             from './pages/Home';
import About            from './pages/About';
import Forum            from './pages/Forum';
import PostDetail       from './pages/PostDetail';
import Clubs            from './pages/Clubs';
import Events           from './pages/Events';
import NewPost          from './pages/NewPost';
import NewEvent         from './pages/NewEvent';
import NewClub          from './pages/NewClub';
import NewJobBoard      from './pages/NewJobBoard';
import JobBoard         from './pages/JobBoard';
import ResumeChecker    from './pages/ResumeChecker';
import StudentDashboard from './pages/studentDashboard';
import Login            from './pages/Login';
import Register         from './pages/Register';
import Recommendations  from './pages/Recommendations';
import AdminApplications from './pages/AdminApplications';
import MyApplications   from './pages/MyApplications';
import SuperAdminPanel  from './pages/SuperAdminPanel';
import InterviewSimulator  from './pages/InterviewSimulator';
import InterviewDashboard  from './pages/InterviewDashboard';

function AppInner() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex">
      {/* Sidebar — always visible */}
      <Sidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col ml-60 min-h-screen">
        <Navbar />

        <main className="flex-1 p-6">
          <Routes>
            <Route path="/"         element={<Home />} />
            <Route path="/about"    element={<About />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/forum"           element={<ProtectedRoute><Forum /></ProtectedRoute>} />
            <Route path="/forum/:id"       element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
            <Route path="/clubs"           element={<ProtectedRoute><Clubs /></ProtectedRoute>} />
            <Route path="/events"          element={<ProtectedRoute><Events /></ProtectedRoute>} />
            <Route path="/jobs"            element={<ProtectedRoute><JobBoard /></ProtectedRoute>} />
            <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
            <Route path="/resume-checker"  element={<ProtectedRoute><ResumeChecker /></ProtectedRoute>} />
            <Route path="/dashboard"       element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
            <Route path="/my-applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
            <Route path="/interview"           element={<ProtectedRoute><InterviewSimulator /></ProtectedRoute>} />
            <Route path="/interview/dashboard" element={<ProtectedRoute><InterviewDashboard /></ProtectedRoute>} />

            <Route path="/new"                element={<ProtectedRoute><NewPost /></ProtectedRoute>} />
            <Route path="/new-event"          element={<ProtectedRoute><NewEvent /></ProtectedRoute>} />
            <Route path="/events/new"         element={<ProtectedRoute><NewEvent /></ProtectedRoute>} />
            <Route path="/new-club"           element={<ProtectedRoute><NewClub /></ProtectedRoute>} />
            <Route path="/clubs/new"          element={<ProtectedRoute><NewClub /></ProtectedRoute>} />
            <Route path="/jobs/new"           element={<ProtectedRoute><NewJobBoard /></ProtectedRoute>} />
            <Route path="/admin/applications" element={<ProtectedRoute><AdminApplications /></ProtectedRoute>} />
            <Route path="/superadmin"         element={<ProtectedRoute><SuperAdminPanel /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>

      <Toaster position="top-right" toastOptions={{
        style: { borderRadius: '12px', background: '#1e293b', color: '#f8fafc', fontSize: '13px' },
        success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
        error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
      }} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppInner />
      </SocketProvider>
    </AuthProvider>
  );
}