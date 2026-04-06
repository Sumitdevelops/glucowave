import { useEffect, useRef, useState } from 'react';

const colorMap = {
  safe: { stroke: '#22c55e', trail: 'rgba(34, 197, 94, 0.15)', glow: 'rgba(34, 197, 94, 0.3)' },
  warning: { stroke: '#f97316', trail: 'rgba(249, 115, 22, 0.15)', glow: 'rgba(249, 115, 22, 0.3)' },
  danger: { stroke: '#ef4444', trail: 'rgba(239, 68, 68, 0.15)', glow: 'rgba(239, 68, 68, 0.3)' },
};

export default function CircularProgress({ value = 0, size = 120, strokeWidth = 8, status = 'safe', label, sublabel }) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedValue / 100) * circumference;
  const colors = colorMap[status];

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90" style={{ filter: `drop-shadow(0 0 10px ${colors.glow})` }}>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.trail}
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color: colors.stroke }}>
            {Math.round(animatedValue)}%
          </span>
          {sublabel && <span className="text-xs text-gray-600">{sublabel}</span>}
        </div>
      </div>
      {label && <span className="text-sm text-gray-700 font-medium">{label}</span>}
    </div>
  );
}
