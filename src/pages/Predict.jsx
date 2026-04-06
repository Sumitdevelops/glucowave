import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, AlertTriangle, ArrowLeft, TrendingUp, TrendingDown,
  Clock, ShieldCheck, ShieldAlert, Heart, BrainCircuit
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart
} from 'recharts';
import Navbar from '../components/layout/Navbar';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
  getRecommendations,
  calculateLBGIRisk
} from '../utils/glucosePrediction';

// ML Engine
import { initializeMLModel, predictTrajectoryML } from '../utils/mlEngine';

export default function Predict() {
  const navigate = useNavigate();

  // ── ML State ──
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    initializeMLModel().then(success => {
      if (success) setIsModelLoaded(true);
    });
  }, []);

  // ── Form State ──
  const [glucose, setGlucose] = useState('');
  const [lastMealTime, setLastMealTime] = useState('');
  const [mealType, setMealType] = useState('rice_and_dal');

  // ── Result State ──
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Default to 1 hour ago for the last meal time on mount
  useEffect(() => {
    const d = new Date();
    d.setHours(d.getHours() - 1);
    setLastMealTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
  }, []);

  const handlePredict = async (e) => {
    e.preventDefault();
    const glucoseVal = parseFloat(glucose);
    if (isNaN(glucoseVal) || glucoseVal <= 0) return;

    setIsLoading(true);

    // 1. Core LBGI Risk Calculation (Mathematical/Clinical Baseline)
    let riskLevel = 'LOW';
    let explanation = 'Clinical indicators are stable. No immediate risk detected.';
    const lbgiScore = calculateLBGIRisk(glucoseVal);
    let confidence = 85;

    if (lbgiScore >= 5.0) {
       riskLevel = 'HIGH';
       explanation = 'Critical LBGI Index. High risk of immediate hypoglycemia.';
       confidence = 95;
    } else if (lbgiScore >= 2.5) {
       riskLevel = 'MEDIUM';
       explanation = 'Moderate risk score. Trends show movement toward low range.';
       confidence = 88;
    }

    // 2. ML Auto-Regressive Curve Generation (Drop Prediction)
    // Uses Explicit Digestion Timeline based on past meal!
    const trajectory = predictTrajectoryML(glucoseVal, lastMealTime, mealType);

    const recommendations = getRecommendations(riskLevel, glucoseVal);

    // Build chart data
    const chartData = trajectory.labels.map((label, i) => ({
      time: label,
      glucose: trajectory.data[i] > 0 ? trajectory.data[i] : 0, // Bound at zero
    }));

    setResult({
      riskLevel,
      explanation,
      lbgiScore: Math.round(lbgiScore * 100) / 100,
      predicted30: trajectory.data[8], // Shows Next 2-Hour (8 * 15m) step prediction 
      confidence,
      trajectory,
      chartData,
      recommendations,
    });

    setIsLoading(false);
  };

  const riskColors = {
    LOW: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600' },
    MEDIUM: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600' },
    HIGH: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600' },
  };

  const riskIcons = {
    LOW: ShieldCheck,
    MEDIUM: ShieldAlert,
    HIGH: AlertTriangle,
  };

  return (
    <div>
      <Navbar />
      <DashboardLayout>
        <div className="flex flex-col gap-8 max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/dashboard')} className="predict-back-btn">
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 font-[Poppins]">
                  1-Click <span className="text-orange-600">AI Predict</span>
                </h1>
                <p className="text-gray-600 mt-1">
                  Modeling your explicit digestion footprint.
                </p>
              </div>
            </div>
            
            {/* ML Status Badge */}
            <div className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-semibold border ${isModelLoaded ? 'bg-green-50 border-green-200 text-green-600' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
              <BrainCircuit size={16} className={isModelLoaded ? 'animate-pulse' : ''} />
              {isModelLoaded ? 'ML Active & Online' : 'Training Model...'}
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handlePredict}>
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200 flex flex-col items-center">
              
              <div className="w-full max-w-2xl mb-6 grid md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-sm font-bold text-gray-800 mb-2">
                    <Clock size={16} className="text-orange-600 mr-2" />
                    Last Eating Time
                  </label>
                  <input
                    type="time"
                    value={lastMealTime}
                    onChange={(e) => setLastMealTime(e.target.value)}
                    required
                    className="w-full text-lg font-bold px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-gray-900 bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="flex items-center text-sm font-bold text-gray-800 mb-2">
                    <Activity size={16} className="text-orange-600 mr-2" />
                    What did you eat?
                  </label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    className="w-full text-lg font-bold px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-gray-900 bg-gray-50 cursor-not-allowed opacity-80"
                  >
                    <option value="rice_and_dal">Rice and Dal (Avg. 75g Carbs)</option>
                    {/* Expandable in the future */}
                  </select>
                </div>
              </div>

              <div className="w-full max-w-sm mb-6">
                <label className="flex items-center justify-center gap-2 text-lg font-bold text-gray-800 mb-4">
                  <Heart size={20} className="text-orange-600" />
                  What is your Current Sugar Level?
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={glucose}
                    onChange={(e) => setGlucose(e.target.value)}
                    placeholder="e.g. 105"
                    min="20"
                    max="600"
                    required
                    className="w-full text-center text-4xl font-bold px-6 py-6 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all text-gray-900 shadow-inner bg-gray-50"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">mg/dL</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !isModelLoaded}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-14 rounded-full shadow-lg hover:shadow-orange-500/40 transition-all duration-300 transform hover:-translate-y-1 text-lg flex items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                <BrainCircuit size={22} />
                Predict Drop Trajectory
              </button>
            </div>
          </form>

          {/* ── Results ── */}
          {result && (
            <div className="flex flex-col gap-6 predict-results-enter">
              {/* Risk Overview Cards */}
              <div className="grid md:grid-cols-4 gap-4">
                {/* Risk Level */}
                <div className={`predict-result-card ${riskColors[result.riskLevel].bg} ${riskColors[result.riskLevel].border}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {(() => {
                      const Icon = riskIcons[result.riskLevel];
                      return <Icon size={18} className={riskColors[result.riskLevel].text} />;
                    })()}
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">LBGI Risk Level</span>
                  </div>
                  <p className={`text-2xl font-bold ${riskColors[result.riskLevel].text}`}>
                    {result.riskLevel}
                  </p>
                </div>

                {/* LBGI Score */}
                <div className="predict-result-card bg-blue-50 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity size={18} className="text-blue-600" />
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">LBGI Score</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{result.lbgiScore}</p>
                </div>

                {/* ML Future Prediction */}
                <div className="predict-result-card bg-purple-50 border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <BrainCircuit size={18} className="text-purple-600" />
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">ML +2Hr Forecast</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{result.predicted30}</p>
                </div>

                {/* Probable Drop Time */}
                <div className="predict-result-card bg-amber-50 border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown size={18} className="text-amber-600" />
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Probable Drop Starts</span>
                  </div>
                  <p className="text-lg font-bold text-amber-600">{result.trajectory.probableDropTime}</p>
                </div>
              </div>

              {/* Explanation Banner */}
              <div className={`predict-result-card ${riskColors[result.riskLevel].bg} ${riskColors[result.riskLevel].border}`}>
                <p className={`text-sm font-medium flex items-center gap-2 ${riskColors[result.riskLevel].text}`}>
                  <Activity size={18} />
                  {result.explanation}
                </p>
              </div>

              {/* Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                <h3 className="font-bold text-gray-900 font-[Poppins] mb-6 flex items-center gap-2">
                  <TrendingUp size={20} className="text-orange-600" />
                  12-Hour Drop Auto-Regression (ML Derived)
                </h3>
                <div className="w-full" style={{ height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="glucoseGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                      {/* interval={3} shows a tick every 4th step (every hour since step=15m) */}
                      <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#78716b' }} interval={3} minTickGap={15} axisLine={{ stroke: '#e7e5e4' }} tickLine={false} />
                      <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11, fill: '#78716b' }} axisLine={{ stroke: '#e7e5e4' }} tickLine={false} unit=" mg/dL" />
                      <Tooltip contentStyle={{ borderRadius: '12px', borderColor: '#fed7aa', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                      <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="6 4" label={{ value: 'Hypo (70)', position: 'left', fill: '#ef4444' }} />
                      <ReferenceLine y={180} stroke="#f59e0b" strokeDasharray="6 4" label={{ value: 'High (180)', position: 'left', fill: '#f59e0b' }} />
                      <Area type="monotone" dataKey="glucose" stroke="#f97316" strokeWidth={3} fill="url(#glucoseGradient)" activeDot={{ r: 6 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                <h3 className="font-bold text-gray-900 font-[Poppins] mb-4 flex items-center gap-2">
                  <ShieldCheck size={20} className="text-orange-600" />
                  Recommended Actions
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-orange-50 border border-orange-100 hover:bg-orange-100 transition-colors">
                      <span className="text-xl flex-shrink-0">{rec.icon}</span>
                      <p className="text-sm text-gray-700 font-medium">{rec.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </div>
  );
}
