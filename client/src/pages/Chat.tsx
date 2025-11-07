import { useState } from 'react';
import SymptomForm from '../components/SymptomForm';
import UrgencyGauge from '../components/UrgencyGauge';
import ExplanationCard from '../components/ExplanationCard';

export default function Chat(){
  const [result, setResult] = useState<any>(null);

  return (
    <div className="grid gap-4">
      <SymptomForm onResult={setResult} />
      {result && (
        <div className="grid md:grid-cols-2 gap-4">
          <UrgencyGauge value={result.predicted.UrgencyScore} category={result.predicted.UrgencyCategory} />
          <ExplanationCard result={result} />
        </div>
      )}
    </div>
  );
}
