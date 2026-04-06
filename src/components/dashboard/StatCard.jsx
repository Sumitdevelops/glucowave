import Card from '../ui/Card';

export default function StatCard({ icon: Icon, title, value, subtitle, color = 'blue' }) {
  const colorMap = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', lightBg: 'bg-blue-100' },
    cyan: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', lightBg: 'bg-green-100' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', lightBg: 'bg-purple-100' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', lightBg: 'bg-amber-100' },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl ${c.lightBg} flex items-center justify-center flex-shrink-0`}>
          <Icon size={22} className={c.text} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 font-[Poppins]">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

