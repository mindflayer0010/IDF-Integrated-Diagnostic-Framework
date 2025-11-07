export default function UrgencyGauge({ value, category }: { value: number | null; category: string | null }){
  const pct = value ? Math.max(0, Math.min(100, (value/10)*100)) : 0;
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="text-sm text-zinc-600 mb-2">Urgency Score</div>
      <div className="h-4 bg-zinc-200 rounded overflow-hidden">
        <div className="h-full bg-gradient-to-r from-green-400 to-red-400" style={{ width: pct+'%' }} />
      </div>
      <div className="mt-2 font-semibold">{value !== null ? `${value.toFixed(2)}/10` : 'N/A'}</div>
      {category && <div className="text-sm text-zinc-600">Category: {category}</div>}
      <p className="text-xs text-zinc-500">*Guidance only. Not a diagnosis.*</p>
    </div>
  );
}
