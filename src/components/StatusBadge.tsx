type StatusBadgeProps = {
  status: string;
};

const statusStyles: Record<string, string> = {
  New: 'bg-slate-100 text-slate-700',
  Contacted: 'bg-sky-100 text-sky-700',
  'Trial Scheduled': 'bg-indigo-100 text-indigo-700',
  Converted: 'bg-emerald-100 text-emerald-700',
  Lost: 'bg-rose-100 text-rose-700',
  'Pending Payment': 'bg-amber-100 text-amber-700',
  Active: 'bg-emerald-100 text-emerald-700',
  Paused: 'bg-slate-200 text-slate-700',
  Cancelled: 'bg-rose-100 text-rose-700',
  Overdue: 'bg-amber-100 text-amber-700',
};

function StatusBadge({ status }: StatusBadgeProps) {
  const styleClass =
    statusStyles[status] ?? 'bg-slate-100 text-slate-600';

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styleClass}`}>
      {status}
    </span>
  );
}

export default StatusBadge;

