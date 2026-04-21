export default function StatCard({ icon: Icon, label, value, sub, color = 'blue', gradient = false }) {
  const colors = {
    blue:   { text: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100',  iconBg: 'bg-blue-100' },
    green:  { text: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-100', iconBg: 'bg-green-100' },
    yellow: { text: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100',iconBg: 'bg-yellow-100' },
    red:    { text: 'text-red-500',    bg: 'bg-red-50',    border: 'border-red-100',   iconBg: 'bg-red-100' },
    purple: { text: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100',iconBg: 'bg-purple-100' },
  };
  const c = colors[color] || colors.blue;

  if (gradient) {
    return (
      <div className="card-hover relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 shadow-md text-white">
        <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10" />
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
            {Icon && <Icon size={18} className="text-white" />}
          </div>
          <div className="text-3xl font-extrabold mb-0.5">{value}</div>
          <div className="text-blue-100 text-sm font-medium">{label}</div>
          {sub && <div className="text-blue-200 text-xs mt-1">{sub}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className={`card-hover rounded-2xl bg-white border ${c.border} p-5 shadow-sm flex items-start gap-4`}>
      <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center shrink-0`}>
        {Icon && <Icon size={18} className={c.text} />}
      </div>
      <div>
        <div className={`text-2xl font-extrabold ${c.text}`}>{value}</div>
        <div className="text-sm text-slate-600 font-medium mt-0.5">{label}</div>
        {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
      </div>
    </div>
  );
}
