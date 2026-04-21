import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const pageTitles = {
  '/':                  'Home',
  '/dashboard':         'Dashboard',
  '/forum':             'Discussion Forum',
  '/clubs':             'Campus Clubs',
  '/events':            'Events',
  '/jobs':              'Job Board',
  '/recommendations':   'AI Job Matches',
  '/resume-checker':    'Resume Checker',
  '/interview':         'AI Interviewer',
  '/my-applications':   'My Applications',
  '/interview/dashboard':'Interview History',
  '/admin/applications':'All Applicants',
  '/superadmin':        'Admin Panel',
  '/about':             'About',
  '/login':             'Sign In',
  '/register':          'Create Account',
};

export default function Navbar({ onSearch }) {
  const { user } = useAuth();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'EduNavigator';
  const today = new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 gap-4 shadow-sm sticky top-0 z-30">
      {/* Left: Page title */}
      <div>
        <h1 className="text-base font-bold text-slate-800 leading-tight">{title}</h1>
        <p className="text-xs text-slate-400">{today}</p>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-sm hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        <Search size={15} className="text-slate-400 shrink-0" />
        <input
          placeholder="Search anything…"
          onChange={e => onSearch?.(e.target.value)}
          className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-2">
        <NotificationBell />

        {user ? (
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-100 ml-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-700 leading-tight">{user.name}</p>
              <p className="text-[10px] text-slate-400 capitalize">{user.role}</p>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 ml-2">
            <Link to="/login" className="px-3 py-1.5 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">Sign In</Link>
            <Link to="/register" className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Register</Link>
          </div>
        )}
      </div>
    </header>
  );
}
