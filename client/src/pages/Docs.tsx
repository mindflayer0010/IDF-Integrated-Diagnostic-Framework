import Reveal from '../components/Reveal';

const sections = [
  {
    id: 'architecture',
    title: 'Architecture Overview',
    body: `Frontend (React + Tailwind) collects structured symptom data. A Node/Express API exposes triage endpoints. A Python service hosts ML inference (urgency scoring & remedy suggestion). MongoDB stores patient triage history keyed by SPID.`
  },
  {
    id: 'triage-flow',
    title: 'Triage Flow',
    body: `1) User enters SPID + demographics. 2) Selects symptoms and severity. 3) Request sent to /api/triage. 4) Urgency + remedy predicted. 5) Log persisted. 6) Dashboard aggregates recent logs.`
  },
  {
    id: 'design-choices',
    title: 'Design Choices',
    body: `We favor deterministic supervised models with calibrated outputs for auditability. Frontend interactions emphasize progressive disclosure—start simple, then reveal deeper explanation.`
  },
  {
    id: 'privacy',
    title: 'Data & Privacy',
    body: `Patients referenced only by SPID identifier. No raw PII stored in the triage logs. Access pathways can be wrapped with token-based auth (not shown in demo).`
  },
  {
    id: 'extensibility',
    title: 'Extensibility',
    body: `Additional scoring dimensions (risk bands, follow-up flags) can be added by extending the Python inference layer and augmenting the log schema.`
  }
];

export default function Docs() {
  return (
    <div className="grid gap-8">
      <header className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <Reveal><h1 className="text-2xl font-semibold text-gradient">Documentation</h1></Reveal>
        <Reveal delay={60}><p className="mt-2 text-zinc-700 max-w-prose prose-energized">Quick internal-facing overview of how the system fits together.</p></Reveal>
        <nav className="mt-4 flex flex-wrap gap-2 text-sm" aria-label="Documentation sections">
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} className="badge badge-accent hover-lift">{s.title}</a>
          ))}
        </nav>
      </header>
      {sections.map((s, i) => (
        <section key={s.id} id={s.id} className="rounded-xl border border-zinc-200 bg-white p-6 scroll-mt-24">
          <Reveal delay={i * 40}><h2 className="text-lg font-medium heading-accent">{s.title}</h2></Reveal>
          <Reveal delay={80 + i * 40} className="prose prose-zinc mt-2 max-w-none">
            <div>
              <p>{s.body}</p>
            </div>
          </Reveal>
        </section>
      ))}
    </div>
  );
}
