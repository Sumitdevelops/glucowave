import Badge from '../ui/Badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const trendIcons = {
  rising: TrendingUp,
  falling: TrendingDown,
  stable: Minus,
};

const statusMap = {
  normal: 'safe',
  low: 'warning',
  high: 'danger',
};

export default function GlucoseDisplay({ data }) {
  const TrendIcon = trendIcons[data.trend] || Minus;
  const status = statusMap[data.status] || 'safe';

  return (
    <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">Current Glucose Level</p>
        <div className="flex items-baseline gap-3">
          <span className={`text-6xl font-extrabold font-[Poppins] ${status === 'safe' ? 'text-green-600' : status === 'warning' ? 'text-orange-600' : 'text-red-600'}`}>
            {data.value}
          </span>
          <span className="text-xl text-gray-500">{data.unit}</span>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <Badge status={data.status} />
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <TrendIcon size={14} />
            <span className="capitalize">{data.trend}</span>
          </div>
          <span className="text-xs text-gray-500">• Updated {data.lastUpdated}</span>
        </div>
      </div>

      {/* Large decorative ring */}
      <div className="hidden lg:block relative w-32 h-32">
        <svg width="128" height="128" className="transform -rotate-90">
          <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(249, 115, 22, 0.1)" strokeWidth="6" />
          <circle
            cx="64" cy="64" r="56"
            fill="none"
            stroke={status === 'safe' ? '#22c55e' : status === 'warning' ? '#f97316' : '#ef4444'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 56}`}
            strokeDashoffset={`${2 * Math.PI * 56 * (1 - data.value / 200)}`}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-gray-600">of 200</span>
          <span className="text-lg font-bold text-gray-900">{Math.round(data.value / 2)}%</span>
        </div>
      </div>
    </div>
  );
}
