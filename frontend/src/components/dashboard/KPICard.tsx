import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: number; // percentage, positive or negative
  trendLabel?: string;
  className?: string;
  colorTheme?: 'emerald' | 'amber' | 'red' | 'blue' | 'violet';
}

const colorMap = {
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-500', iconBg: 'bg-emerald-500/20' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-500', iconBg: 'bg-amber-500/20' },
  red: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-500', iconBg: 'bg-red-500/20' },
  blue: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-500', iconBg: 'bg-cyan-500/20' },
  violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-500', iconBg: 'bg-violet-500/20' },
};

export function KPICard({ title, value, icon, trend, trendLabel, className, colorTheme = 'violet' }: KPICardProps) {
  const colors = colorMap[colorTheme];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'relative overflow-hidden rounded-2xl p-5 border',
        'bg-white/5 border-white/10 backdrop-blur-xl',
        'shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]',
        className
      )}
    >
      {/* Background Glow */}
      <div className={cn('absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-20 pointer-events-none', colors.bg)} />

      <div className="relative z-10 flex justify-between items-start mb-4">
        <div className={cn('p-2.5 rounded-xl border', colors.iconBg, colors.border, colors.text)}>
          {icon}
        </div>
        
        {trend !== undefined && (
          <div className={cn(
            'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border',
            trend > 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
            trend < 0 ? 'bg-red-500/10 border-red-500/20 text-red-500' :
            'bg-gray-500/10 border-gray-500/20 text-gray-400'
          )}>
            {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-sm font-medium text-gray-400 tracking-wide">{title}</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
          {trendLabel && <span className="text-xs text-gray-500">{trendLabel}</span>}
        </div>
      </div>
    </motion.div>
  );
}

// Special variant for the Health Score
export function RadialKPICard({ score, previousScore }: { score: number, previousScore: number }) {
  const trend = score - previousScore;
  const colorTheme = score >= 80 ? 'emerald' : score >= 50 ? 'amber' : 'red';
  const colors = colorMap[colorTheme];

  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'relative overflow-hidden rounded-2xl p-6 border col-span-1 lg:col-span-1 flex flex-col items-center justify-center',
        'bg-white/5 border-white/10 backdrop-blur-xl',
        'shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]'
      )}
    >
      <div className={cn('absolute inset-0 opacity-10 pointer-events-none', colors.bg)} />
      
      <div className="relative flex items-center justify-center mb-2" style={{ width: 140, height: 140 }}>
        <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
          <circle cx="70" cy="70" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="70" cy="70" r="45"
            fill="none"
            className={colors.text}
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ filter: 'drop-shadow(0 0 6px currentColor)' }}
          />
        </svg>
        <div className="absolute text-center">
          <span className="text-4xl font-black text-white">{score}</span>
        </div>
      </div>

      <div className="text-center z-10">
        <h3 className="text-sm font-semibold text-white tracking-wide">Compliance Health</h3>
        <div className="mt-2 flex items-center justify-center gap-1.5">
          <div className={cn(
            'flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border',
            trend >= 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
          )}>
            {trend >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {Math.abs(trend)} pts
          </div>
          <span className="text-[10px] text-gray-500">vs last week</span>
        </div>
      </div>
    </motion.div>
  );
}
