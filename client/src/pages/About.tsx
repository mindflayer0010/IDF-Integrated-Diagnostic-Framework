import Reveal from '../components/Reveal';
import Tilt from '../components/Tilt';

export default function About() {
  return (
    <div className="grid gap-8">
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <Reveal><h1 className="text-2xl font-semibold text-gradient">About CareMate</h1></Reveal>
        <Reveal delay={80}><p className="mt-2 text-zinc-700 max-w-prose prose-energized">
          CareMate is an AI-assisted triage companion focused on clarity, speed, and privacy. It helps structure symptom intake, provides consistent urgency assessments, and surfaces insights for clinicians.
        </p></Reveal>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        {[
          { title: 'Clarity', desc: 'Simple, guided inputs reduce errors and improve consistency across visits.' },
          { title: 'Trust', desc: 'Deterministic models and clear outputs help clinicians verify recommendations.' },
          { title: 'Privacy', desc: 'Patient data is scoped to SPID and stored securely for clinical review only.' },
        ].map((f, i) => (
          <Reveal key={f.title} delay={80 + i * 80}>
            <Tilt className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm h-full">
              <div className="text-zinc-900 font-medium">{f.title}</div>
              <div className="mt-1 text-sm text-zinc-600">{f.desc}</div>
            </Tilt>
          </Reveal>
        ))}
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <Reveal><h2 className="text-lg font-medium heading-accent">Principles</h2></Reveal>
        <div className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-zinc-700">
          <Reveal><div className="rounded border border-zinc-200 p-3">Human-first: decisions stay with clinicians.</div></Reveal>
          <Reveal delay={60}><div className="rounded border border-zinc-200 p-3">Explainability: show the why, not just the what.</div></Reveal>
          <Reveal delay={120}><div className="rounded border border-zinc-200 p-3">Safety: conservative defaults and guardrails.</div></Reveal>
          <Reveal delay={180}><div className="rounded border border-zinc-200 p-3">Privacy: least-privilege access and auditability.</div></Reveal>
        </div>
      </section>
    </div>
  );
}
