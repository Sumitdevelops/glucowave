import { useEffect, useRef, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { BarChart3, TrendingDown, TrendingUp, Target, Clock } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { glucoseDataToday, glucoseDataWeek, glucoseDataMonth, analyticsPatterns, weeklyStats } from '../data/mockData';

const timeFilters = [
  { label: '24h', key: 'today' },
  { label: '7d', key: 'week' },
  { label: '30d', key: 'month' },
];

const dataMap = {
  today: glucoseDataToday,
  week: glucoseDataWeek,
  month: glucoseDataMonth,
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass px-4 py-3 rounded-xl text-sm">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="text-white font-semibold">
          {payload[0].value} mg/dl
        </p>
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const [filter, setFilter] = useState('week');
  const mainRef = useRef(null);

  useEffect(() => {
    const initGSAP = async () => {
      const gsapModule = await import('gsap');
      const gsap = gsapModule.gsap || gsapModule.default;
      if (mainRef.current) {
        gsap.fromTo(mainRef.current.querySelectorAll('.analytics-card'),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out' }
        );
      }
    };
    initGSAP();
  }, []);

  const data = dataMap[filter];

  return (
    <div>
      <Navbar />
      <DashboardLayout>
        <div ref={mainRef} className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white font-[Poppins] flex items-center gap-3">
                <BarChart3 size={28} className="text-accent-purple" />
                Analytics
              </h1>
              <p className="text-slate-500 mt-1">Deep dive into your glucose patterns and trends</p>
            </div>
            {/* Time filters */}
            <div className="flex gap-1 p-1 rounded-xl bg-navy-800/50 border border-white/5">
              {timeFilters.map((tf) => (
                <button
                  key={tf.key}
                  onClick={() => setFilter(tf.key)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                    ${filter === tf.key ? 'bg-accent-blue/20 text-accent-blue glow-blue' : 'text-slate-500 hover:text-white'}`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Weekly summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'Avg Glucose', value: `${weeklyStats.avgGlucose} mg/dl`, icon: Target, color: 'text-accent-cyan' },
              { label: 'Time in Range', value: `${weeklyStats.timeInRange}%`, icon: Clock, color: 'text-accent-blue' },
              { label: 'Hypo Events', value: weeklyStats.hypoEvents, icon: TrendingDown, color: 'text-warning' },
              { label: 'Hyper Events', value: weeklyStats.hyperEvents, icon: TrendingUp, color: 'text-danger' },
              { label: 'Logs Recorded', value: weeklyStats.logsRecorded, icon: BarChart3, color: 'text-accent-purple' },
            ].map((stat, i) => (
              <div key={i} className="analytics-card glass-card p-4 text-center" style={{ transform: 'none' }}>
                <stat.icon size={20} className={`${stat.color} mx-auto mb-2`} />
                <p className="text-2xl font-bold text-white font-[Poppins]">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Full-width chart */}
          <div className="analytics-card glass-card p-6" style={{ transform: 'none' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white font-[Poppins]">Glucose Overview</h3>
              <span className="text-sm text-slate-500">{filter === 'today' ? 'Last 24 hours' : filter === 'week' ? 'Last 7 days' : 'Last 30 days'}</span>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <defs>
                    <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey={filter === 'month' ? 'date' : 'time'}
                    stroke="rgba(255,255,255,0.2)"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    tickLine={false}
                    interval={filter === 'today' ? 5 : filter === 'week' ? 4 : 3}
                  />
                  <YAxis
                    domain={[50, 210]}
                    stroke="rgba(255,255,255,0.2)"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={70} stroke="rgba(245,158,11,0.4)" strokeDasharray="5 5" />
                  <ReferenceLine y={180} stroke="rgba(239,68,68,0.4)" strokeDasharray="5 5" />
                  {/* Target range shading */}
                  <ReferenceLine y={70} stroke="none" />
                  <ReferenceLine y={180} stroke="none" />
                  <Area
                    type="monotone"
                    dataKey="glucose"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fill="url(#analyticsGrad)"
                    dot={false}
                    activeDot={{ r: 5, fill: '#3b82f6', stroke: '#0a0e27', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Patterns */}
          <div className="analytics-card">
            <h3 className="text-lg font-bold text-white font-[Poppins] mb-4 flex items-center gap-2">
              <TrendingDown size={20} className="text-accent-purple" />
              Detected Patterns
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {analyticsPatterns.map((pattern) => (
                <Card key={pattern.id} glow={pattern.severity === 'warning' ? 'amber' : 'cyan'}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white mb-1">{pattern.pattern}</p>
                      <p className="text-xs text-slate-500">{pattern.frequency}</p>
                    </div>
                    <Badge status={pattern.severity} />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
}
