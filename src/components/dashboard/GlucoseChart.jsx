import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { glucoseDataToday, glucoseDataWeek, glucoseDataMonth } from '../../data/mockData';

const tabs = [
  { label: 'Today', key: 'today' },
  { label: 'Week', key: 'week' },
  { label: 'Month', key: 'month' },
];

const dataMap = {
  today: glucoseDataToday,
  week: glucoseDataWeek,
  month: glucoseDataMonth,
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-xl text-sm shadow-lg border border-gray-200">
        <p className="text-gray-600 text-xs mb-1">{label}</p>
        <p className="text-gray-900 font-semibold">
          Glucose: <span className="text-orange-600">{payload[0].value} mg/dl</span>
        </p>
        {payload[1] && (
          <p className="text-gray-600">
            Predicted: <span className="text-orange-600">{payload[1].value} mg/dl</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function GlucoseChart() {
  const [activeTab, setActiveTab] = useState('today');
  const data = dataMap[activeTab];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 font-[Poppins]">Glucose Trends & Predicted Spikes</h3>
          <p className="text-xs text-gray-600 mt-1">Real-time monitoring data</p>
        </div>
        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${activeTab === tab.key ? 'bg-orange-600 text-white' : 'text-gray-700 hover:text-orange-600'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-72 bg-orange-50 rounded-xl p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <defs>
              <linearGradient id="glucoseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ea580c" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#ea580c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(249, 115, 22, 0.15)" />
            <XAxis
              dataKey={activeTab === 'month' ? 'date' : 'time'}
              stroke="rgba(107, 114, 128, 0.5)"
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickLine={false}
              interval={activeTab === 'today' ? 5 : activeTab === 'week' ? 4 : 3}
            />
            <YAxis
              domain={[50, 210]}
              stroke="rgba(255,255,255,0.2)"
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={70} stroke="rgba(34, 197, 94, 0.4)" strokeDasharray="5 5" label={{ value: 'Low', fill: '#22c55e', fontSize: 10, position: 'right' }} />
            <ReferenceLine y={180} stroke="rgba(239, 68, 68, 0.4)" strokeDasharray="5 5" label={{ value: 'High', fill: '#ef4444', fontSize: 10, position: 'right' }} />
            <Area
              type="monotone"
              dataKey="predicted"
              stroke="#ea580c"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="url(#predictedGrad)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="glucose"
              stroke="#f97316"
              strokeWidth={2.5}
              fill="url(#glucoseGrad)"
              dot={false}
              activeDot={{ r: 5, fill: '#f97316', stroke: '#fafaf9', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 justify-center">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="w-3 h-0.5 rounded-full bg-orange-600" />
          Actual
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="w-3 h-0.5 rounded-full bg-orange-600" style={{ borderTop: '1px dashed #ea580c' }} />
          Predicted
        </div>
      </div>
    </div>
  );
}
