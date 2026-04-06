import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Navbar from '../components/layout/Navbar';

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      setLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />

      <div className="pt-24 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-150px)]">
            {/* Left Side - Animation */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="w-full max-w-md h-96 rounded-3xl overflow-hidden bg-white shadow-lg flex items-center justify-center">
                <DotLottieReact
                  src="/online_doctor.json"
                  loop
                  autoplay
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
                <p className="text-gray-700">Start your journey to better metabolic health today.</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-5 py-3 rounded-full border border-gray-300 bg-orange-100/50 focus:bg-orange-100 focus:border-orange-400 focus:outline-none transition-colors placeholder-gray-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full px-5 py-3 rounded-full border border-gray-300 bg-orange-100/50 focus:bg-orange-100 focus:border-orange-400 focus:outline-none transition-colors placeholder-gray-500"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      className="w-full px-5 py-3 rounded-full border border-gray-300 bg-orange-100/50 focus:bg-orange-100 focus:border-orange-400 focus:outline-none transition-colors placeholder-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Create Account Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-semibold transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-6 flex items-center justify-center gap-2"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                  {!loading && <span>→</span>}
                </button>
              </form>

              {/* Divider */}
             

              {/* Social Buttons */}
              <div className="grid grid-cols-2 gap-4 mb-6">
               
                
              </div>

              {/* Sign In Link */}
              <p className="text-center text-gray-600 mb-8">
                Already have an account?{' '}
                <Link to="/signin" className="text-orange-600 font-semibold hover:underline">
                  Sign In
                </Link>
              </p>

              {/* Footer Links */}
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
