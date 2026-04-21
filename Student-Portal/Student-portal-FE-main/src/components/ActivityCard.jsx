const tagStyle = {
  Lecture:   'bg-blue-50 text-blue-600 border-blue-100',
  Lab:       'bg-purple-50 text-purple-600 border-purple-100',
  Workshop:  'bg-green-50 text-green-600 border-green-100',
  Exam:      'bg-red-50 text-red-500 border-red-100',
  default:   'bg-slate-50 text-slate-500 border-slate-100',
};

export default function ActivityCard({ items = [], loading = false }) {
  if (loading) return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="skeleton h-4 w-32 rounded mb-4" />
      {[1,2,3].map(i => (
        <div key={i} className="flex gap-3 mb-4 last:mb-0">
          <div className="skeleton w-10 h-10 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-3 w-3/4 rounded" />
            <div className="skeleton h-3 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-800">Today's Activities</h3>
        <span className="text-xs text-blue-600 font-medium">{items.length} scheduled</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm">No activities scheduled today.</div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => {
            const tag = item.tag || 'default';
            const ts = tagStyle[tag] || tagStyle.default;
            return (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors group">
                {/* Time column */}
                <div className="w-14 shrink-0 text-center">
                  <div className="text-xs font-bold text-blue-600">{item.time}</div>
                  {item.duration && <div className="text-[10px] text-slate-400">{item.duration}</div>}
                </div>
                {/* Dot */}
                <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-700 transition-colors">{item.title}</div>
                  {item.location && <div className="text-xs text-slate-400 mt-0.5">📍 {item.location}</div>}
                </div>
                {/* Badge */}
                <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border shrink-0 ${ts}`}>{tag}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
