export default function SymptomLegend() {
  return (
    <div className="mt-1 text-xs text-zinc-600 bg-zinc-50 border border-zinc-200 rounded p-2">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1">
          <span className="inline-block h-3 w-5 rounded bg-zinc-200" />
          <span>0: none</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block h-3 w-5 rounded bg-emerald-400" />
          <span>1–3: increasing severity</span>
        </div>
        <div className="text-zinc-500">Click to cycle. Right-click or press “R” to reset. Use Tab to focus, Enter/Space to toggle.</div>
      </div>
    </div>
  );
}
