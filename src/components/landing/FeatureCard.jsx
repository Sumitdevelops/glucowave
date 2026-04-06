export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="feature-card w-full h-full flex flex-col items-center text-center p-6 rounded-xl bg-navy-800 border border-white/10">

      {/* Icon */}
      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-navy-700 mb-4">
        <Icon className="w-5 h-5 text-accent-cyan" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-slate-400 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}