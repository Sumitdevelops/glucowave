import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Syringe, Utensils, Dumbbell, Activity } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import DashboardLayout from '../components/layout/DashboardLayout';
import GlucoseDisplay from '../components/dashboard/GlucoseDisplay';
import GlucoseChart from '../components/dashboard/GlucoseChart';
import PredictionCard from '../components/dashboard/PredictionCard';
import StatCard from '../components/dashboard/StatCard';
import { useAuth } from '../context/useAuth';
import { getUserScopedKey } from '../utils/userStorage';
import { subscribeToUserLogs, subscribeToUserPredictions } from '../services/userData';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [activityLevel] = useState(() => {
    const raw = localStorage.getItem(getUserScopedKey('glucowave_user_profile'));
    if (!raw) return 'Normal';
    try {
      const profile = JSON.parse(raw);
      return profile?.activityLevel || 'Normal';
    } catch {
      return 'Normal';
    }
  });

  useEffect(() => {
    if (!user?.uid) return undefined;
    return subscribeToUserLogs(
      user.uid,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
        setLogs(items);
      },
      () => {
        setLogs([]);
      },
    );
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return undefined;
    return subscribeToUserPredictions(
      user.uid,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
        setPredictions(items);
      },
      () => {
        setPredictions([]);
      },
    );
  }, [user?.uid]);

  const insulinLogs = logs.filter((l) => l.type === 'insulin');
  const explicitMealLogs = logs.filter((l) => l.type === 'meal');
  const activityLogs = logs.filter((l) => l.type === 'activity');

  const implicitMealLogs = predictions.filter(p => p.mealType).map(p => ({
    id: p.id + '_implicit_meal',
    type: 'meal',
    name: p.mealType,
    value: p.estimatedCarbs || 0,
    unit: 'g',
    date: new Date(p.createdAtMs || Date.now()).toLocaleDateString(),
    time: p.lastMealTime || new Date(p.createdAtMs || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAtMs: (p.createdAtMs || Date.now()) - 1,
    subtitle: 'AI Estimated'
  }));

  const mealLogs = [...explicitMealLogs, ...implicitMealLogs];

  const latestPrediction = predictions[0];
  const today = new Date().toLocaleDateString();
  const insulinToday = insulinLogs.filter((l) => l.date === today);
  const mealsToday = mealLogs.filter((l) => l.date === today);
  const activityToday = activityLogs.filter((l) => l.date === today);
  const predictionData = latestPrediction
    ? {
        risk:
          latestPrediction.riskLevel === 'HIGH'
            ? 85
            : latestPrediction.riskLevel === 'MEDIUM'
              ? 55
              : 20,
        timeWindow: '2 hours',
        predictedValue: latestPrediction.predicted2Hr ?? latestPrediction.glucose ?? 0,
        confidence: latestPrediction.riskLevel === 'HIGH' ? 95 : 88,
      }
    : null;

  const currentGlucose = latestPrediction
    ? {
        value: latestPrediction.glucose ?? 0,
        unit: 'mg/dl',
        status:
          (latestPrediction.glucose ?? 0) < 70
            ? 'low'
            : (latestPrediction.glucose ?? 0) > 180
              ? 'high'
              : 'normal',
        trend: 'stable',
        lastUpdated: 'just now',
      }
    : null;

  const chartPoints = [...predictions]
    .reverse()
    .slice(-24)
    .map((p) => ({
      time: new Date(p.createdAtMs || Date.now()).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      date: new Date(p.createdAtMs || Date.now()).toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
      }),
      glucose: p.glucose ?? 0,
      predicted: p.predicted2Hr ?? p.glucose ?? 0,
    }));

  // Combine all entries for a unified activity feed
  const allEntries = [
    ...logs,
    ...implicitMealLogs,
    ...predictions.map((p) => ({
      id: p.id,
      type: 'glucose',
      name: `Glucose (${p.riskLevel || 'Unknown'} Risk)`,
      value: p.glucose,
      unit: 'mg/dl',
      time: new Date(p.createdAtMs || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date(p.createdAtMs || Date.now()).toLocaleDateString(),
      createdAtMs: p.createdAtMs || Date.now(),
      subtitle: `Pred 2Hr: ${Math.round(p.predicted2Hr || p.glucose || 0)} mg/dL • LBGI: ${p.lbgiScore || 0}`
    }))
  ].sort((a, b) => b.createdAtMs - a.createdAtMs);

  return (
    <div>
      <Navbar />
      <DashboardLayout>
        <div className="flex flex-col gap-8">
          {/* Greeting */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-[Poppins]">
              Hi, <span className="text-orange-600">{user?.displayName || 'User'}</span> 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Here's your health overview for today ({activityLevel} activity profile)
            </p>
          </div>

          {/* Top: Glucose + Prediction */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col">
              {currentGlucose ? (
                <GlucoseDisplay data={currentGlucose} />
              ) : (
                <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
                  <Activity size={48} className="text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">No recent glucose data found.</p>
                  <p className="text-sm text-gray-400 mt-1">Click 'Start Predicting' to log your current value.</p>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              {predictionData ? (
                <PredictionCard data={predictionData} />
              ) : (
                <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
                  <p className="text-gray-400 text-sm">No prediction available.</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Button: Start Predicting */}
          <div className="flex justify-center w-full my-2">
            <button
              onClick={() => navigate('/predict')}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-10 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 w-full md:w-auto text-lg flex items-center justify-center gap-3"
              id="start-predicting-btn"
            >
              <Activity size={24} />
              Start Predicting
            </button>
          </div>

          {/* Middle: Chart */}
          <div>
            <GlucoseChart data={chartPoints} />
          </div>

          {/* Bottom: Stat Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <StatCard
                icon={Syringe}
                title="Insulin Today"
                value={`${insulinToday.reduce((a, b) => a + (b.value || 0), 0)} units`}
                subtitle={`${insulinToday.length} doses logged`}
                color="blue"
              />
            </div>
            <div>
              <StatCard
                icon={Utensils}
                title="Meals Today"
                value={`${mealsToday.reduce((a, b) => a + (b.value || 0), 0)}g carbs`}
                subtitle={`${mealsToday.length} meals logged`}
                color="cyan"
              />
            </div>
            <div>
              <StatCard
                icon={Dumbbell}
                title="Activity Today"
                value={`${activityToday.reduce((a, b) => a + (b.value || 0), 0)} min`}
                subtitle={`${activityToday.length} entries logged`}
                color="purple"
              />
            </div>
          </div>

          {/* Complete Activity Feed */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <h3 className="font-bold text-gray-900 font-[Poppins] mb-4 flex items-center gap-2">
              <Activity size={20} className="text-orange-600" /> Input Log History
            </h3>
            <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {allEntries.map((entry) => {
                const isMeal = entry.type === 'meal';
                const isInsulin = entry.type === 'insulin';
                const isGlucose = entry.type === 'glucose';

                const IconTag = isMeal ? Utensils : isInsulin ? Syringe : isGlucose ? Activity : Dumbbell;
                const activeColor = isMeal ? 'text-orange-600 bg-orange-100' : isInsulin ? 'text-blue-600 bg-blue-100' : isGlucose ? 'text-red-600 bg-red-100' : 'text-purple-600 bg-purple-100';
                
                return (
                  <div key={entry.id || Math.random()} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 hover:border-gray-200 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeColor}`}>
                        <IconTag size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{entry.name}</p>
                        <p className="text-xs text-gray-500">
                          {entry.time || '--:--'} • {entry.date || 'Today'}
                          {entry.subtitle && (
                            <>
                              <span className="mx-1">•</span>
                              <span className="text-orange-600 font-medium">{entry.subtitle}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    <span className={`text-base font-bold ${activeColor.split(' ')[0]}`}>
                      {entry.value} {entry.unit}
                    </span>
                  </div>
                );
              })}
              {allEntries.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">No entries logged yet. All your inputs will appear here.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </DashboardLayout>
    </div>
  );
}
