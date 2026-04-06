import { Brain, Activity, Bell } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeatureCard from '../components/landing/FeatureCard';
import HowItWorks from '../components/landing/HowItWorks';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Brain,
    title: 'Smart Prediction',
    description:
      'Our AI model analyzes your glucose patterns, lifestyle habits, and medication schedule to predict hypoglycemia risk hours before it happens.',
  },
  {
    icon: Activity,
    title: 'Real-Time Monitoring',
    description:
      'Continuous glucose trend tracking with beautiful visualizations — see your data in real time and understand your body like never before.',
  },
  {
    icon: Bell,
    title: 'Personalized Alerts',
    description:
      'Intelligent alerts that learn your behavior and suggest specific actions — not generic warnings, but guidance tailored to you.',
  },
];

export default function Landing() {

  return (
    <div className="relative">
      <Navbar />

      {/* Hero */}
      <HeroSection />

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 max-w-3xl mx-auto space-y-4">
            <span className="text-sm text-accent-cyan font-semibold uppercase tracking-wider block">Features</span>
            <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
              Powered by <span className="text-accent-cyan">Artificial Intelligence</span>
            </h2>
            <p className="text-lg text-slate-400">
              Everything you need to stay ahead of glucose fluctuations — in one simple interface.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <FeatureCard key={i} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <HowItWorks />

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card p-20 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Take Control of Your Health
            </h2>
            <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
              Join thousands of users who trust GlucoWave to monitor smarter and stay safe.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg">Get Started Free</Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="secondary" size="lg">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 bg-gradient-to-b from-transparent to-navy-950/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
          <span className="text-white font-semibold">GlucoWave</span>
          <span>© 2026 GlucoWave. All rights reserved.</span>
          <div className="flex gap-8">
            <a href="#" className="hover:text-accent-cyan transition-colors">Privacy</a>
            <a href="#" className="hover:text-accent-cyan transition-colors">Terms</a>
            <a href="#" className="hover:text-accent-cyan transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}