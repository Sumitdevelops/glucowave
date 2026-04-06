import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Menu, X, Sun, Moon } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';

const landingLinks = [
  { label: 'Features', href: '/features' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Dashboard', href: '/dashboard' },
  
];

const dashboardLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Alerts', href: '/alerts' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const isLanding = location.pathname === '/';
  const navLinks = isLanding ? landingLinks : dashboardLinks;

  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-lg shadow-accent-blue/20 group-hover:shadow-accent-blue/40 transition-shadow">
            <Activity size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold font-[Poppins] gradient-text">GlucoWave</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`text-sm transition-colors duration-200 relative group ${location.pathname === link.href ? 'text-white' : 'text-slate-400 hover:text-white'
                }`}
            >
              {link.label}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-accent-blue transition-all duration-300 ${location.pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
            </Link>
          ))}
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {isLanding && (
            <Link to="/signup" className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 hover:border-accent-blue/50">
              <DotLottieReact
                src="/Login.json"
                loop
                autoplay
                style={{ width: '100%', height: '100%' }}
              />
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-slate-400 hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass px-6 py-4 mx-4 mb-4 rounded-2xl border border-white/5">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm text-slate-400 hover:text-white transition-colors py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isLanding && (
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 hover:border-accent-blue/50">
                <DotLottieReact
                  src="/Login.json"
                  loop
                  autoplay
                  style={{ width: '100%', height: '100%' }}
                />
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
