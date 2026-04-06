import { Syringe, Utensils, Dumbbell, Heart } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import DashboardLayout from '../components/layout/DashboardLayout';
import GlucoseDisplay from '../components/dashboard/GlucoseDisplay';
import GlucoseChart from '../components/dashboard/GlucoseChart';
import PredictionCard from '../components/dashboard/PredictionCard';
import StatCard from '../components/dashboard/StatCard';
import { currentGlucose, predictionData, insulinLogs, mealLogs, activityLogs } from '../data/mockData';

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <DashboardLayout>
        <div className="flex flex-col gap-8">
          {/* Greeting */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-[Poppins]">
              Hi, <span className="text-orange-600">User</span> 👋
            </h1>
            <p className="text-gray-600 mt-1">Here's your health overview for today</p>
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
                value={`${insulinLogs.filter(l => l.date === 'Today').reduce((a, b) => a + b.units, 0)} units`}
                subtitle={`${insulinLogs.filter(l => l.date === 'Today').length} doses logged`}
                color="blue"
              />
            </div>
            <div>
              <StatCard
                icon={Utensils}
                title="Meals Today"
                value={`${mealLogs.filter(l => l.date === 'Today').reduce((a, b) => a + b.carbs, 0)}g carbs`}
                subtitle={`${mealLogs.filter(l => l.date === 'Today').length} meals logged`}
                color="cyan"
              />
            </div>
            <div>
              <StatCard
                icon={Dumbbell}
                title="Activity Today"
                value={activityLogs.filter(l => l.date === 'Today')[0]?.duration || '0 min'}
                subtitle={`${activityLogs.filter(l => l.date === 'Today').reduce((a, b) => a + b.calories, 0)} cal burned`}
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
                      <p className="text-xs text-gray-600">{meal.time} • {meal.date}</p>
                    </div>
                    <span className="text-sm font-semibold text-orange-600">{meal.carbs}g</span>
                  </div>
                ))}
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
                      <p className="text-sm font-medium text-gray-900">{log.type}</p>
                      <p className="text-xs text-gray-600">{log.time} • {log.date}</p>
                    </div>
                    <span className="text-sm font-semibold text-accent-blue">{log.units}u</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
}
