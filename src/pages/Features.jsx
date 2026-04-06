import Navbar from '../components/layout/Navbar';
import { TrendingUp, Target, Activity, Bell, BarChart3, Users } from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    title: 'AI-Driven Forecasting',
    description: 'Predicts glucose spikes before they happen, allowing you to take proactive measures.',
  },
  {
    icon: Target,
    title: 'Meal Impact Score',
    description: 'Analyzes how different foods affect your blood sugar levels, helping you make smarter dietary choices.',
  },
  {
    icon: Activity,
    title: 'Activity Sync',
    description: 'Integrates workout data to understand how physical activity influences your glucose trends.',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Receives early warnings about potential glucose fluctuations, giving you time to adjust.',
  },
  {
    icon: BarChart3,
    title: 'Data Visualization',
    description: 'View clear trend charts and insightful graphs to track your long-term glucose patterns.',
  },
  {
    icon: Users,
    title: 'Community Insights',
    description: 'Explore anonymized data trends from the community to gain broader perspectives on diabetes management.',
  },
];

export default function Features() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-orange-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-orange-600 font-semibold mb-4">GlucoWave Comprehensive Features</p>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Empowering You with <br className="hidden md:block" /> Proactive Insights
            </h1>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-8 border-2 border-orange-100 hover:border-orange-300 hover:shadow-lg transition-all duration-300"
                >
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mb-6">
                    <Icon size={32} className="text-orange-600" strokeWidth={1.5} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>

                  {/* Description */}
                  <p className="text-gray-700 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
