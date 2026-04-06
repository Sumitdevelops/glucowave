import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Clock, LogIn, TrendingDown, Scale, CheckCircle2, ChevronRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  const [profile, setProfile] = useState({
    wakingTime: '07:00',
    breakfastTime: '08:00',
    lunchTime: '13:00',
    dinnerTime: '19:00',
    activityLevel: 'Normal',
    isf: '40', // Insulin Sensitivity Factor (1U drops glucose by 40mg/dL)
    icr: '10'  // Insulin to Carb Ratio (1U covers 10g carbs)
  });

  const handleChange = (e) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleComplete = () => {
    localStorage.setItem('glucowave_user_profile', JSON.stringify(profile));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-orange-50/50">
      <Navbar />

      <div className="pt-28 pb-12 px-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2 font-[Poppins]">
              Personalize Your AI Profile
            </h1>
            <p className="text-orange-100">
              Set this up once, and never type it again. We use your metabolism to dynamically auto-run your daily predictions!
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8 md:p-12">
            
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 text-xl font-bold text-gray-800">
                  <Clock className="text-orange-500" />
                  Your Daily Schedule
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Waking Time */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Morning Wake Time</label>
                    <input 
                      type="time" name="wakingTime" value={profile.wakingTime} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium text-gray-800 bg-gray-50"
                    />
                  </div>
                  {/* Breakfast Time */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Usual Breakfast Time</label>
                    <input 
                      type="time" name="breakfastTime" value={profile.breakfastTime} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium text-gray-800 bg-gray-50"
                    />
                  </div>
                  {/* Lunch Time */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Usual Lunch Time</label>
                    <input 
                      type="time" name="lunchTime" value={profile.lunchTime} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium text-gray-800 bg-gray-50"
                    />
                  </div>
                  {/* Dinner Time */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Usual Dinner Time</label>
                    <input 
                      type="time" name="dinnerTime" value={profile.dinnerTime} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium text-gray-800 bg-gray-50"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    onClick={() => setStep(2)}
                    className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors"
                  >
                    Next Step <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 text-xl font-bold text-gray-800">
                  <Activity className="text-orange-500" />
                  Metabolism & Activity
                </div>

                <div className="space-y-6">
                  {/* Activity Level */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Baseline Activity Level</label>
                    <select 
                      name="activityLevel" value={profile.activityLevel} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium text-gray-800 bg-gray-50"
                    >
                      <option value="Low">Low - Sedentary (Desk Job)</option>
                      <option value="Normal">Normal - Moderate Activity</option>
                      <option value="High">High - Athlete / Manual Labor</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
                    {/* ISF */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-orange-900 mb-1">
                        <TrendingDown size={16} /> 
                        Insulin Sensitivity (ISF)
                      </label>
                      <p className="text-xs text-gray-500 mb-2">Amount 1U of insulin drops your glucose</p>
                      <div className="relative">
                        <input 
                          type="number" name="isf" value={profile.isf} onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-bold text-gray-800 bg-white"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">mg/dL</span>
                      </div>
                    </div>

                    {/* ICR */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-orange-900 mb-1">
                        <Scale size={16} /> 
                        Insulin to Carb Ratio (ICR)
                      </label>
                      <p className="text-xs text-gray-500 mb-2">Grams of carbs covered by 1U of insulin</p>
                      <div className="relative">
                        <input 
                          type="number" name="icr" value={profile.icr} onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-bold text-gray-800 bg-white"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">g</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="text-gray-500 px-6 py-3 rounded-full font-bold hover:text-gray-800 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleComplete}
                    className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-orange-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-orange-500/30"
                  >
                    <CheckCircle2 size={20} />
                    Complete Setup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
