import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, MessageSquare, Users, Calendar, Briefcase,
  Sparkles, FileText, Mic, ClipboardList, TrendingUp, PenSquare,
  CalendarPlus, UserPlus, PlusCircle, Settings, LogOut,
  GraduationCap, Bell
} from 'lucide-react';

const studentNav = [
  { to: '/dashboard',           icon: LayoutDashboard, label: 'Dashboard'          },
  { to: '/forum',               icon: MessageSquare,   label: 'Forum'              },
  { to: '/clubs',               icon: Users,           label: 'Clubs'              },
  { to: '/events',              icon: Calendar,        label: 'Events'             },
  { to: '/jobs',                icon: Briefcase,       label: 'Job Board'          },
  { to: '/recommendations',     icon: Sparkles,        label: 'AI Job Matches'     },
  { to: '/resume-checker',      icon: FileText,        label: 'Resume Checker'     },
  { to: '/interview',           icon: Mic,             label: 'AI Interviewer'     },
  { to: '/my-applications',     icon: ClipboardList,   label: 'My Applications'    },
  { to: '/interview/dashboard', icon: TrendingUp,      label: 'Interview History'  },
];

const adminNav = [
  { to: '/new',               icon: PenSquare,   label: 'New Post'       },
  { to: '/new-event',         icon: CalendarPlus,label: 'New Event'      },
  { to: '/new-club',          icon: UserPlus,    label: 'New Club'       },
  { to: '/jobs/new',          icon: PlusCircle,  label: 'Post Job'       },
  { to: '/admin/applications',icon: Users,       label: 'All Applicants' },
];

const superNav = [
  { to: '/superadmin', icon: Settings, label: 'Admin Panel' },
];

function SectionLabel({ label }) {
  return (
    <p className="text-[10px] font-bold text-blue-200/60 uppercase tracking-[0.12em] px-3 pt-4 pb-1 select-none">
      {label}
    </p>
  );
}

function SideItem({ to, icon: Icon, label }) {
  return (
    <NavLink to={to} end={to === '/dashboard'}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
          isActive
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-blue-100 hover:bg-white/10 hover:text-white'
        }`
      }>
      {({ isActive }) => (
        <>
          <Icon size={16} className={`shrink-0 ${isActive ? 'text-blue-600' : 'text-blue-200 group-hover:text-white'}`} />
          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin      = user?.role === 'admin' || user?.role === 'superadmin';
  const isSuperAdmin = user?.role === 'superadmin';

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-60 bg-gradient-to-b from-blue-600 to-blue-700 flex flex-col z-40 shadow-xl">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
          <GraduationCap size={20} className="text-white" />
        </div>
        <div>
          <div className="font-bold text-white text-sm leading-tight">EduNavigator</div>
          <div className="text-blue-200 text-[10px] capitalize">{user?.role || 'portal'}</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll px-3 py-2 space-y-0.5">
        {user && (
          <>
            <SectionLabel label="Main" />
            {studentNav.map(item => <SideItem key={item.to} {...item} />)}
          </>
        )}

        {isAdmin && (
          <>
            <SectionLabel label="Admin" />
            {adminNav.map(item => <SideItem key={item.to} {...item} />)}
          </>
        )}

        {isSuperAdmin && (
          <>
            <SectionLabel label="Super Admin" />
            {superNav.map(item => <SideItem key={item.to} {...item} />)}
          </>
        )}

        {!user && (
          <>
            <SectionLabel label="Account" />
            <SideItem to="/login"    icon={Users}    label="Sign In" />
            <SideItem to="/register" icon={PenSquare} label="Register" />
          </>
        )}
      </nav>

      {/* Bottom */}
      {user && (
        <div className="border-t border-white/10 p-3 space-y-1">
          <NavLink to="/about"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-blue-100 hover:bg-white/10 hover:text-white transition-all">
            <Settings size={16} /> <span>Settings</span>
          </NavLink>
          <button onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-blue-100 hover:bg-red-400/20 hover:text-red-200 transition-all">
            <LogOut size={16} /> <span>Logout</span>
          </button>
          {/* User chip */}
          <div className="flex items-center gap-2.5 px-2 py-2 mt-1 rounded-xl bg-white/10">
            <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user.name}</p>
              <p className="text-blue-200 text-[10px] capitalize truncate">{user.department || user.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
