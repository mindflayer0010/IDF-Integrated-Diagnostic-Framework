import { useEffect, useMemo, useState } from 'react';
import { getJSON } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';

type Log = { _id: string; spid?: string; symptoms: Record<string, number>; age: number; gender: string; predicted: any; createdAt: string };
type DailyResponse = { today: Log[]; yesterday: Log[] };

function UrgencyBadge({ cat }: { cat?: string }) {
  const color = cat === 'High' ? 'bg-red-100 text-red-700 border-red-200'
    : cat === 'Moderate' ? 'bg-amber-100 text-amber-700 border-amber-200'
    : 'bg-emerald-100 text-emerald-700 border-emerald-200';
  return <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded border ${color}`}>{cat || 'Unknown'}</span>
}

function LogCard({ l }: { l: Log }) {
  const topSymptoms = useMemo(() => Object.entries(l.symptoms)
    .filter(([_, v]) => (v as number) > 0)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 4), [l.symptoms]);
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover-lift">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-zinc-500">{new Date(l.createdAt).toLocaleTimeString()}</div>
        <UrgencyBadge cat={l.predicted?.UrgencyCategory} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
  <div className="text-sm"><span className="text-zinc-500">SPID</span>: {l.spid || '—'}</div>
        <div className="text-sm"><span className="text-zinc-500">Remedy</span>: {l.predicted?.Remedy || '—'}</div>
        <div className="text-sm"><span className="text-zinc-500">Age</span>: {l.age} <span className="ml-2 text-zinc-500">Gender</span>: {l.gender}</div>
      </div>
      {topSymptoms.length > 0 && (
        <div className="mt-2 text-sm text-zinc-600">
          <span className="text-zinc-500">Top symptoms:</span> {topSymptoms.map(([k, v]) => `${k}(${v})`).join(', ')}
        </div>
      )}
    </div>
  );
}

function Section({ title, logs }: { title: string; logs: Log[] }) {
  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold">{title}</h3>
        <div className="text-xs text-zinc-500">{logs.length} entries</div>
      </div>
      {logs.length === 0 ? (
        <div className="text-sm text-zinc-500 border rounded-md p-3 bg-white">No entries.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {logs.map(l => <LogCard key={l._id} l={l} />)}
        </div>
      )}
    </section>
  );
}

export default function Dashboard() {
  const [daily, setDaily] = useState<DailyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    getJSON('/api/logs/daily').then(setDaily).catch(e => setError(String(e)));
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-gradient">Doctor's Dashboard</h2>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      {!daily ? (
        <LoadingSpinner label="Loading logs…" />
      ) : (
        <>
          <Section title="Today" logs={daily.today} />
          <Section title="Yesterday" logs={daily.yesterday} />
        </>
      )}
    </div>
  );
}
