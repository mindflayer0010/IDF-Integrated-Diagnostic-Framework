import { motion } from 'framer-motion';
import { Pill, FlaskConical, BrainCircuit, AlertTriangle, FileText } from 'lucide-react';

export default function ExplanationCard({ result }: { result: any }) {
  const { predicted, dosage, composition, fallbackUsed, explanation } = result;

  const typewriterVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.01
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="glass-card p-6 flex flex-col gap-6 h-full">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
        <div className="p-2 bg-brand-primary/10 rounded-lg">
          <FileText className="w-5 h-5 text-brand-primary" />
        </div>
        <h3 className="font-semibold text-slate-900">Clinical Analysis</h3>
      </div>

      <div className="grid gap-4">
        {/* Remedy Section */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="flex items-start gap-3">
            <Pill className="w-5 h-5 text-sky-500 mt-0.5" />
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Recommended Remedy</div>
              <div className="text-lg font-semibold text-slate-900">{predicted.Remedy}</div>
              {dosage && (
                <div className="text-sm text-slate-600 mt-1">
                  {dosage.Concentration} • {dosage.Dosage} • {dosage.Timing}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Composition Section */}
        {composition && (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-start gap-3">
              <FlaskConical className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Composition</div>
                <div className="text-sm font-medium text-slate-900">{composition.Remedy}</div>
                <div className="text-xs text-slate-500 mt-1">{composition['Chemical Composition']}</div>
              </div>
            </div>
          </div>
        )}

        {/* AI Explanation */}
        {explanation && (
          <div className="relative mt-2">
            <div className="flex items-center gap-2 mb-2">
              <BrainCircuit className="w-4 h-4 text-brand-secondary" />
              <span className="text-xs font-medium text-brand-secondary uppercase tracking-wider">AI Reasoning</span>
            </div>
            <motion.div
              className="text-sm text-slate-700 leading-relaxed bg-brand-primary/5 p-4 rounded-xl border border-brand-primary/10"
              initial="hidden"
              animate="visible"
              variants={typewriterVariants}
            >
              {explanation.split("").map((char: string, i: number) => (
                <motion.span key={i} variants={letterVariants}>
                  {char}
                </motion.span>
              ))}
            </motion.div>
          </div>
        )}

        {fallbackUsed && (
          <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
            <AlertTriangle className="w-4 h-4" />
            <span>Fallback protocol used for single symptom analysis.</span>
          </div>
        )}
      </div>
    </div>
  );
}
