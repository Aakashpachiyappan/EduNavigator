import { CheckCircle2, Clock, AlertTriangle, Circle } from 'lucide-react';

const statusConfig = {
  pending:   { icon: Clock,         text: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-100', badge: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
  completed: { icon: CheckCircle2,  text: 'text-green-500',  bg: 'bg-white border-slate-100',      badge: 'bg-green-50 text-green-600',   label: 'Done' },
  overdue:   { icon: AlertTriangle, text: 'text-red-500',    bg: 'bg-red-50 border-red-100',        badge: 'bg-red-100 text-red-600',      label: 'Overdue' },
};

export default function AssignmentCard({ tasks = [], loading = false }) {
  if (loading) return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="skeleton h-4 w-32 rounded mb-4" />
      {[1,2,3].map(i => <div key={i} className="skeleton h-14 rounded-xl mb-3" />)}
    </div>
  );

  const counts = {
    pending:   tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue:   tasks.filter(t => t.status === 'overdue').length,
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-800">Tasks & Assignments</h3>
        <div className="flex gap-2">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">{counts.pending} pending</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-600">{counts.completed} done</span>
        </div>
      </div>

      {/* Progress bar */}
      {tasks.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
            <span>Progress</span>
            <span>{Math.round((counts.completed / tasks.length) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-green-400 rounded-full transition-all duration-700"
              style={{ width: `${Math.round((counts.completed / tasks.length) * 100)}%` }} />
          </div>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm">🎉 No pending tasks!</div>
      ) : (
        <div className="space-y-2.5">
          {tasks.map((task, i) => {
            const cfg = statusConfig[task.status] || statusConfig.pending;
            const Icon = cfg.icon;
            return (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${cfg.bg} transition-all hover:shadow-sm`}>
                <Icon size={16} className={`${cfg.text} shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {task.title}
                  </div>
                  {task.subject && <div className="text-[11px] text-slate-400 mt-0.5">{task.subject}</div>}
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                  {task.due && <div className="text-[10px] text-slate-400 mt-1">{task.due}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
