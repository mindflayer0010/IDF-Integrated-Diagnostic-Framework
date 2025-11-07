export default function ExplanationCard({ result }: { result: any }){
  const { predicted, dosage, composition, fallbackUsed, explanation } = result;
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="text-sm text-zinc-600 mb-2">Results</div>
      <div className="space-y-2 text-sm">
        <div><strong>Remedy:</strong> {predicted.Remedy}</div>
        {dosage && (
          <div>
            <strong>Dosage:</strong> {dosage.Concentration} {dosage.Dosage} {dosage.Timing} ({dosage['Age Category']} {dosage.Gender === 'M' ? 'Males' : dosage.Gender === 'F' ? 'Females' : 'Other'})
          </div>
        )}
        {composition && (
          <div>
            <strong>Composition:</strong> {composition.Remedy} - {composition.Source} - {composition['Chemical Composition']}
          </div>
        )}
        {explanation && <div><strong>Explanation:</strong> {explanation}</div>}
        {fallbackUsed && <div className="text-orange-600">*Fallback used for single symptom*</div>}
      </div>
    </div>
  );
}
