import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Syringe, Utensils, Dumbbell, Heart, Activity } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import DashboardLayout from '../components/layout/DashboardLayout';
import GlucoseDisplay from '../components/dashboard/GlucoseDisplay';
import GlucoseChart from '../components/dashboard/GlucoseChart';
import PredictionCard from '../components/dashboard/PredictionCard';
import StatCard from '../components/dashboard/StatCard';
import { currentGlucose, predictionData } from '../data/mockData';
import { useAuth } from '../context/useAuth';
import { getUserScopedKey } from '../utils/userStorage';
import { subscribeToUserLogs } from '../services/userData';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
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

  const insulinLogs = logs.filter((l) => l.type === 'insulin');
  const mealLogs = logs.filter((l) => l.type === 'meal');
  const activityLogs = logs.filter((l) => l.type === 'activity');
  const today = new Date().toLocaleDateString();
  const insulinToday = insulinLogs.filter((l) => l.date === today);
  const mealsToday = mealLogs.filter((l) => l.date === today);
  const activityToday = activityLogs.filter((l) => l.date === today);

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
            <div className="lg:col-span-2">
              <GlucoseDisplay data={currentGlucose} />
            </div>
            <div>
              <PredictionCard data={predictionData} />
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
            <GlucoseChart />
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

          {/* Recent logs */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Meals */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <h3 className="font-bold text-gray-900 font-[Poppins] mb-4 flex items-center gap-2">
                <Utensils size={18} className="text-orange-600" /> Recent Meals
              </h3>
              <div className="flex flex-col gap-3">
                {mealLogs.slice(0, 3).map((meal) => (
                  <div key={meal.id} className="flex items-center justify-between p-3 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{meal.name}</p>
                      <p className="text-xs text-gray-600">{meal.time || '--:--'} • {meal.date || 'Today'}</p>
                    </div>
                    <span className="text-sm font-semibold text-orange-600">{meal.value || 0}g</span>
                  </div>
                ))}
                {mealLogs.length === 0 && <p className="text-sm text-gray-500">No meal logs yet.</p>}
              </div>
            </div>

            {/* Recent Insulin */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <h3 className="font-bold text-gray-900 font-[Poppins] mb-4 flex items-center gap-2">
                <Syringe size={18} className="text-orange-600" /> Recent Insulin
              </h3>
              <div className="flex flex-col gap-3">
                {insulinLogs.slice(0, 3).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{log.name}</p>
                      <p className="text-xs text-gray-600">{log.time || '--:--'} • {log.date || 'Today'}</p>
                    </div>
                    <span className="text-sm font-semibold text-accent-blue">{log.value || 0}u</span>
                  </div>
                ))}
                {insulinLogs.length === 0 && <p className="text-sm text-gray-500">No insulin logs yet.</p>}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
}
