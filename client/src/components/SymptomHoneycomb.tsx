import { useState, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { getSymptomIcon, getSymptomCategory } from './symptomIcons';
import { cn } from '../lib/utils';
import { Info } from 'lucide-react';

type Props = {
  symptoms: string[];
  selected: Record<string, number>; // 0-3
  onChange: (next: Record<string, number>) => void;
  className?: string;
  onAnnounce?: (message: string) => void;
};

const SEVERITY_CONFIG = [
  { label: 'None', color: 'bg-white border-slate-200 text-slate-400', ring: 'ring-transparent' },
  { label: 'Low', color: 'bg-sky-50 border-sky-200 text-sky-600', ring: 'ring-sky-400' },
  { label: 'Med', color: 'bg-emerald-50 border-emerald-200 text-emerald-600', ring: 'ring-emerald-400' },
  { label: 'High', color: 'bg-emerald-500 border-emerald-600 text-white', ring: 'ring-emerald-500' },
];

const CATEGORIES = ['All', 'General', 'Pain', 'Respiratory', 'Digestive', 'Neurological', 'Sensory', 'Other'];

export default function SymptomHoneycomb({ symptoms, selected, onChange, className = '', onAnnounce }: Props) {
  const [activeTab, setActiveTab] = useState('All');

  const toggle = (name: string) => {
    const curr = selected[name] || 0;
    const next = (curr + 1) % 4;
    const copy = { ...selected };
    if (next === 0) delete copy[name]; else copy[name] = next;
    onChange(copy);
    if (onAnnounce) onAnnounce(`${name} severity ${next}`);
  };

  const resetOne = (name: string) => {
    if (!selected[name]) return;
    const copy = { ...selected };
    delete copy[name];
    onChange(copy);
    if (onAnnounce) onAnnounce(`${name} reset to 0`);
  };

  // Group symptoms by category
  const categorizedSymptoms = useMemo(() => {
    const validSymptoms = symptoms.filter(s => s && s.trim().length > 0);
    if (activeTab === 'All') return validSymptoms;
    return validSymptoms.filter(s => getSymptomCategory(s) === activeTab);
  }, [symptoms, activeTab]);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 justify-center pb-2 border-b border-slate-100">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              activeTab === cat
                ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/25 scale-105"
                : "bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-2">
        <Info className="w-3 h-3" />
        <span>Click to cycle severity. Right-click to reset.</span>
      </div>

      {/* Smart Grid */}
      <LayoutGroup>
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          <AnimatePresence mode='popLayout'>
            {categorizedSymptoms.map((name) => {
              const SevIcon = getSymptomIcon(name);
              const sev = selected[name] || 0;
              const config = SEVERITY_CONFIG[sev];
              const isSelected = sev > 0;

              return (
                <motion.button
                  layout
                  key={name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggle(name)}
                  onContextMenu={(e) => { e.preventDefault(); resetOne(name); }}
                  className={cn(
                    "relative group flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 min-h-[120px]",
                    "outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2",
                    config.color,
                    isSelected ? "shadow-md ring-2 " + config.ring : "hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-xl transition-all duration-300",
                      isSelected ? "bg-white/20" : "bg-slate-100 group-hover:bg-white"
                    )}>
                      <SevIcon className={cn("w-6 h-6", isSelected ? "text-current" : "text-slate-500")} />
                    </div>
                    <span className="text-xs font-semibold text-center leading-tight">
                      {name}
                    </span>
                  </div>

                  {/* Severity Badge */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2"
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm",
                        sev === 3 ? "bg-white text-emerald-600" : "bg-brand-primary text-white"
                      )}>
                        {sev}
                      </div>
                    </motion.div>
                  )}

                  {/* Progress Bar Indicator */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={cn(
                          "w-6 h-1 rounded-full transition-all duration-300",
                          sev >= level
                            ? (sev === 3 ? "bg-white/80" : "bg-current")
                            : "bg-slate-200/50"
                        )}
                      />
                    ))}
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {categorizedSymptoms.length === 0 && (
        <div className="text-center py-12 text-slate-400 italic">
          No symptoms found in this category.
        </div>
      )}
    </div>
  );
}
