import { Megaphone, Info, AlertCircle, CheckCircle } from 'lucide-react';

const typeConfig = {
  important: { icon: AlertCircle, bg: 'bg-blue-50',   border: 'border-l-4 border-blue-400', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
  info:      { icon: Info,        bg: 'bg-slate-50',  border: 'border-l-4 border-slate-300',text: 'text-slate-700', badge: 'bg-slate-100 text-slate-600' },
  success:   { icon: CheckCircle, bg: 'bg-green-50',  border: 'border-l-4 border-green-400',text: 'text-green-700', badge: 'bg-green-100 text-green-700' },
  default:   { icon: Megaphone,   bg: 'bg-slate-50',  border: 'border-l-4 border-slate-200', text: 'text-slate-700', badge: 'bg-slate-100 text-slate-500' },
};

export default function AnnouncementList({ items = [], loading = false }) {
  if (loading) return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 h-full">
      <div className="skeleton h-4 w-36 rounded mb-4" />
      {[1,2,3,4].map(i => <div key={i} className="skeleton h-14 rounded-xl mb-3" />)}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800">Announcements</h3>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">{items.length} new</span>
      </div>

      <div className="panel-scroll space-y-2.5 flex-1 max-h-72 pr-1">
        {items.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">No announcements yet.</div>
        ) : (
          items.map((item, i) => {
            const cfg = typeConfig[item.type || 'default'];
            const Icon = cfg.icon;
            return (
              <div key={i} className={`${cfg.bg} ${cfg.border} rounded-r-xl p-3 hover:shadow-sm transition-shadow cursor-pointer`}>
                <div className="flex items-start gap-2.5">
                  <Icon size={14} className={`${cfg.text} shrink-0 mt-0.5`} />
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-semibold ${cfg.text} leading-snug`}>{item.title}</div>
                    {item.description && <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{item.description}</div>}
                    <div className="text-[10px] text-slate-400 mt-1">{item.date}</div>
                  </div>
                  {item.type === 'important' && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${cfg.badge}`}>URGENT</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
