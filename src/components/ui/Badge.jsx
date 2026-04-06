const statusStyles = {
  safe: 'status-bg-safe status-safe',
  warning: 'status-bg-warning status-warning',
  danger: 'status-bg-danger status-danger',
  normal: 'status-bg-safe status-safe',
  low: 'status-bg-warning status-warning',
  high: 'status-bg-danger status-danger',
};

const statusLabels = {
  safe: 'Safe',
  warning: 'Warning',
  danger: 'Danger',
  normal: 'Normal',
  low: 'Low',
  high: 'High',
};

export default function Badge({ status = 'safe', label, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status]} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {label || statusLabels[status]}
    </span>
  );
}
