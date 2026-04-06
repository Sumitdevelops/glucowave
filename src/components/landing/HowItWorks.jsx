import { Upload, Cpu, BellRing } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Input Your Data',
    description: 'Log your meals, insulin doses, and physical activity with just a few taps.',
    step: '01',
  },
  {
    icon: Cpu,
    title: 'AI Analysis',
    description: 'Our AI detects patterns, correlations, and trends in your glucose behavior.',
    step: '02',
  },
  {
    icon: BellRing,
    title: 'Get Alerts',
    description: 'Receive early warnings before low sugar events happen — stay in control.',
    step: '03',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20 max-w-3xl mx-auto space-y-4">
          <span className="text-sm text-accent-blue font-semibold tracking-wider uppercase block">How It Works</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Three Simple Steps
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            From data input to actionable alerts — powered by AI that learns your patterns.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-[2px]">
            <div className="w-full h-full bg-gradient-to-r from-accent-blue/50 via-accent-purple/50 to-accent-cyan/50 rounded-full" />
            {/* Animated dot */}
            <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent-blue animate-[shimmer_3s_ease-in-out_infinite]" style={{ left: '50%' }} />
          </div>

          {steps.map((step, i) => (
            <div key={i} className="step-card relative flex flex-col items-center text-center group">
              {/* Step number */}
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-navy-700 to-navy-800 border border-white/10 flex items-center justify-center group-hover:border-accent-blue/30 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-accent-blue/10">
                  <step.icon size={36} className="text-accent-blue group-hover:text-accent-cyan transition-colors duration-300" />
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple text-white text-sm font-bold flex items-center justify-center">
                  {step.step}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white font-[Poppins] mb-4">{step.title}</h3>
              <p className="text-base text-slate-400 leading-relaxed max-w-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
