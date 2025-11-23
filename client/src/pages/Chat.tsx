import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SymptomForm from '../components/SymptomForm';
import UrgencyGauge from '../components/UrgencyGauge';
import ExplanationCard from '../components/ExplanationCard';
import ThinkingState from '../components/ThinkingState';

export default function Chat() {
  const [result, setResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <div className="grid gap-6 max-w-5xl mx-auto">
      <SymptomForm
        onResult={(r) => {
          setResult(r);
          setIsAnalyzing(false);
        }}
        onLoading={setIsAnalyzing}
      />

      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <motion.div
            key="thinking"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="py-12"
          >
            <ThinkingState />
          </motion.div>
        ) : result ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <UrgencyGauge value={result.predicted.UrgencyScore} category={result.predicted.UrgencyCategory} />
            <ExplanationCard result={result} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
