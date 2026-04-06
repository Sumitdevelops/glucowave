const glowColors = {
  blue: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]',
  cyan: 'hover:shadow-[0_0_30px_rgba(6,214,160,0.2)]',
  purple: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]',
  red: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]',
  amber: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]',
  none: '',
};

export default function Card({ children, glow = 'blue', className = '', hover = true, ...props }) {
  return (
    <div
      className={`glass-card p-6 ${hover ? glowColors[glow] : ''} ${!hover ? '!transform-none' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
