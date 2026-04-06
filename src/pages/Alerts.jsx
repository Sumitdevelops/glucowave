import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Clock, CheckCircle, Bell, ShieldAlert, ShieldCheck } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { alerts } from '../data/mockData';

export default function Alerts() {
  const [alertList, setAlertList] = useState(alerts);
  const mainRef = useRef(null);

  useEffect(() => {
    const initGSAP = async () => {
      const gsapModule = await import('gsap');
      const gsap = gsapModule.gsap || gsapModule.default;
      if (mainRef.current) {
        gsap.fromTo(mainRef.current.querySelectorAll('.alert-card'),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, stagger: 0.12, duration: 0.6, ease: 'power3.out' }
        );
      }
    };
    initGSAP();
  }, []);

  const handleDismiss = (id) => {
    setAlertList(prev => prev.map(a => a.id === id ? { ...a, isActive: false } : a));
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'danger': return ShieldAlert;
      case 'warning': return AlertTriangle;
      default: return ShieldCheck;
    }
  };

  const getAlertGradient = (type) => {
    switch (type) {
      case 'danger': return 'from-danger/20 to-danger/5 border-danger/30';
      case 'warning': return 'from-warning/20 to-warning/5 border-warning/30';
      default: return 'from-safe/20 to-safe/5 border-safe/30';
    }
  };

  return (
    <div>
      <Navbar />
      <DashboardLayout>
        <div ref={mainRef} className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white font-[Poppins] flex items-center gap-3">
                <Bell size={28} className="text-warning" />
                Alerts
              </h1>
              <p className="text-slate-500 mt-1">AI-generated health warnings and insights</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">{alertList.filter(a => a.isActive).length} active</span>
              <div className="w-2 h-2 rounded-full bg-danger animate-pulse" />
            </div>
          </div>

          {/* Alerts list */}
          <div className="flex flex-col gap-6">
            {alertList.map((alert) => {
              const AlertIcon = getAlertIcon(alert.type);
              return (
                <div
                  key={alert.id}
                  className={`alert-card glass-card p-0 overflow-hidden transition-all duration-500 ${!alert.isActive ? 'opacity-50' : ''}`}
                  style={{ transform: 'none' }}
                >
                  {/* Top gradient bar */}
                  <div className={`h-1 bg-gradient-to-r ${alert.type === 'danger' ? 'from-danger to-warning' : alert.type === 'warning' ? 'from-warning to-amber-300' : 'from-safe to-accent-cyan'}`} />

                  <div className="p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Left: Main content */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getAlertGradient(alert.type)} border flex items-center justify-center flex-shrink-0`}>
                            <AlertIcon size={22} className={alert.type === 'danger' ? 'text-danger' : alert.type === 'warning' ? 'text-warning' : 'text-safe'} />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-xl font-bold text-white font-[Poppins]">{alert.title}</h3>
                              <Badge status={alert.type} />
                            </div>
                            <p className="text-sm text-slate-400">{alert.message}</p>
                          </div>
                        </div>

                        {/* Risk stats */}
                        <div className="flex items-center gap-6 mb-4 text-sm">
                          <div className="flex items-center gap-2 text-slate-400">
                            <AlertTriangle size={14} className={alert.type === 'danger' ? 'text-danger' : 'text-warning'} />
                            Risk: <span className="font-bold text-white">{alert.risk}%</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <Clock size={14} />
                            Window: <span className="font-semibold text-white">{alert.timeWindow}</span>
                          </div>
                          <div className="text-xs text-slate-600">{alert.timestamp}</div>
                        </div>

                        {/* Suggested actions */}
                        {alert.actions.length > 0 && (
                          <div className="mt-4">
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-semibold">Suggested Actions</p>
                            <div className="flex flex-col gap-2">
                              {alert.actions.map((action, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-navy-800/30 text-sm text-slate-300">
                                  <div className="w-6 h-6 rounded-full bg-accent-blue/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-bold text-accent-blue">{i + 1}</span>
                                  </div>
                                  {action}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Actions */}
                      {alert.isActive && (
                        <div className="flex lg:flex-col gap-3 lg:w-48 flex-shrink-0">
                          <Button size="sm" className="flex-1 justify-center" onClick={() => handleDismiss(alert.id)}>
                            <CheckCircle size={16} /> Mark as Done
                          </Button>
                          <Button variant="secondary" size="sm" className="flex-1 justify-center">
                            <Clock size={16} /> Remind Later
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
}
