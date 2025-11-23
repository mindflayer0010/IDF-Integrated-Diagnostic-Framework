import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, AlertCircle, Clock } from 'lucide-react';
import { getJSON } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { cn } from '../lib/utils';

type Log = { _id: string; spid?: string; symptoms: Record<string, number>; age: number; gender: string; predicted: any; createdAt: string };
type DailyResponse = { today: Log[]; yesterday: Log[] };

function UrgencyBadge({ cat }: { cat?: string }) {
  const color = cat === 'High' ? 'bg-red-100 text-red-700 border-red-200'
    : cat === 'Moderate' ? 'bg-amber-100 text-amber-700 border-amber-200'
      : 'bg-emerald-100 text-emerald-700 border-emerald-200';
  return <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", color)}>{cat || 'Unknown'}</span>
}

function StatCard({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: any; color: string }) {
  return (
    <div className="glass-card p-6 flex items-center gap-4">
      <div className={cn("p-3 rounded-xl", color)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <div className="text-sm text-slate-500 font-medium">{title}</div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
      </div>
    </div>
  );
}

function LogCard({ l, index }: { l: Log; index: number }) {
  const topSymptoms = useMemo(() => Object.entries(l.symptoms)
    .filter(([_, v]) => (v as number) > 0)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 4), [l.symptoms]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card p-5 hover:border-brand-primary/30 group"
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          {new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <UrgencyBadge cat={l.predicted?.UrgencyCategory} />
      </div>

      <div className="flex items-baseline justify-between mb-3">
        <div className="font-mono text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">
          {l.spid || '—'}
        </div>
        <div className="text-sm font-medium text-slate-900">
          {l.predicted?.Remedy || '—'}
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-500 mb-3 pb-3 border-b border-slate-100">
        <span>Age: <span className="font-medium text-slate-700">{l.age}</span></span>
        <span>Gender: <span className="font-medium text-slate-700">{l.gender}</span></span>
      </div>

      {topSymptoms.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {topSymptoms.map(([k, v]) => (
            <span key={k} className="inline-flex items-center px-2 py-1 rounded bg-slate-50 text-xs text-slate-600 border border-slate-100">
              {k} <span className={cn("ml-1 w-1.5 h-1.5 rounded-full", v === 3 ? "bg-red-400" : v === 2 ? "bg-amber-400" : "bg-emerald-400")} />
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function Dashboard() {
  const [daily, setDaily] = useState<DailyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getJSON('/api/logs/daily').then(setDaily).catch(e => setError(String(e)));
  }, []);

  const stats = useMemo(() => {
    if (!daily) return null;
    const all = [...daily.today, ...daily.yesterday];
    const critical = all.filter(l => l.predicted?.UrgencyCategory === 'High').length;
    const avgUrgency = all.reduce((acc, l) => acc + (l.predicted?.UrgencyScore || 0), 0) / (all.length || 1);

    return {
      total: all.length,
      critical,
      avgUrgency: avgUrgency.toFixed(1)
    };
  }, [daily]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Doctor's Dashboard</h2>
          <p className="text-slate-500">Real-time triage overview and patient statistics.</p>
        </div>
        <div className="text-sm text-slate-500 bg-white px-3 py-1.5 rounded-full border shadow-sm">
          {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {!daily ? (
        <div className="h-64 flex items-center justify-center">
          <LoadingSpinner label="Loading dashboard data..." />
        </div>
      ) : (
        <>
          {/* Stats Row */}
          <div className="grid md:grid-cols-3 gap-6">
            <StatCard
              title="Total Patients (48h)"
              value={stats?.total || 0}
              icon={Users}
              color="bg-blue-500"
            />
            <StatCard
              title="Avg Urgency Score"
              value={stats?.avgUrgency || "0.0"}
              icon={Activity}
              color="bg-emerald-500"
            />
            <StatCard
              title="Critical Cases"
              value={stats?.critical || 0}
              icon={AlertCircle}
              color="bg-red-500"
            />
          </div>

          <div className="space-y-6">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Today's Triage
                </h3>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                  {daily.today.length} entries
                </span>
              </div>

              {daily.today.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500">
                  No triage entries recorded today.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {daily.today.map((l, i) => <LogCard key={l._id} l={l} index={i} />)}
                </div>
              )}
            </section>

            <section className="opacity-75">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Yesterday</h3>
              {daily.yesterday.length === 0 ? (
                <div className="text-sm text-slate-500 italic">No entries from yesterday.</div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {daily.yesterday.map((l, i) => <LogCard key={l._id} l={l} index={i} />)}
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
