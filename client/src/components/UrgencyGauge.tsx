import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export default function UrgencyGauge({ value, category }: { value: number | null; category: string | null }) {
  const score = value || 0;
  // Map 0-10 to 0-180 degrees
  const rotation = (score / 10) * 180;

  const getColor = (s: number) => {
    if (s < 4) return 'text-emerald-500';
    if (s < 7) return 'text-amber-500';
    return 'text-red-500';
  };

  const colorClass = getColor(score);

  return (
    <div className="glass-card p-6 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500 opacity-20" />

      <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-6">Urgency Score</h3>

      <div className="relative w-64 h-32 mb-4">
        {/* Gauge Background */}
        <svg className="w-full h-full overflow-visible" viewBox="0 0 200 100">
          {/* Track */}
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#e2e8f0" strokeWidth="20" strokeLinecap="round" />

          {/* Colored Segments (Gradient effect via multiple paths or gradient defs) */}
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gaugeGradient)" strokeWidth="20" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset="0" className="opacity-80" />
        </svg>

        {/* Needle */}
        <motion.div
          className="absolute bottom-0 left-1/2 w-1 h-24 bg-slate-800 origin-bottom rounded-full z-10"
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation - 90 }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          style={{ marginLeft: '-2px' }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 rounded-full" />
        </motion.div>

        {/* Pivot */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-white border-2 border-slate-800 rounded-full z-20" />
      </div>

      <div className="text-center mt-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("text-4xl font-bold tabular-nums", colorClass)}
        >
          {score.toFixed(1)}
        </motion.div>
        <div className={cn("text-lg font-medium mt-1", colorClass)}>
          {category || 'Unknown'}
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-4 text-center max-w-[200px]">
        *AI-generated assessment. Not a medical diagnosis.*
      </p>
    </div>
  );
}
