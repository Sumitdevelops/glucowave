import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Button from '../ui/Button';

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center py-20 px-6 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side */}
          <div className="flex flex-col gap-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-sm font-medium w-fit">
              <span className="w-2 h-2 rounded-full bg-accent-blue" />
              AI-Powered Monitoring
            </div>

            {/* Title */}
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              Predict <span className="text-accent-cyan">Hypoglycemia</span><br />Before It Happens
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-slate-400 leading-relaxed max-w-lg">
              AI-powered insights combining glucose, lifestyle, and medication data to keep you one step ahead.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/dashboard">
                <Button size="md">Get Started <ArrowRight size={18} /></Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="secondary" size="md"><Play size={16} /> View Demo</Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 pt-4 text-sm text-slate-500">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-navy-600 to-navy-700 border-2 border-navy-950 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <span>10k+ users</span>
              </div>
              <span>⭐ 4.9/5 rating</span>
            </div>
          </div>

          {/* Right Side - Lottie Animation */}
          <div className="flex items-center justify-center rounded-full overflow-hidden bg-slate-800/30 border border-slate-700 hover:border-accent-blue/30 transition-colors">
            <DotLottieReact
              src="/glucose.json"
              loop
              autoplay
              style={{ width: '100%', maxWidth: '500px', height: '400px' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}