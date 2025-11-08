import Reveal from '../components/Reveal';
import Tilt from '../components/Tilt';

export default function About() {
  return (
    <div className="grid gap-8">
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <Reveal as="h1" className="text-2xl font-semibold text-gradient">About CareMate</Reveal>
        <Reveal as="p" delay={80} className="mt-2 text-zinc-700 max-w-prose prose-energized">
          CareMate is an AI-assisted triage companion focused on clarity, speed, and privacy. It helps structure symptom intake, provides consistent urgency assessments, and surfaces insights for clinicians.
        </Reveal>
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
        <Reveal as="h2" className="text-lg font-medium heading-accent">Principles</Reveal>
        <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-zinc-700">
          <Reveal as="li" className="rounded border border-zinc-200 p-3">Human-first: decisions stay with clinicians.</Reveal>
          <Reveal as="li" className="rounded border border-zinc-200 p-3" delay={60}>Explainability: show the why, not just the what.</Reveal>
          <Reveal as="li" className="rounded border border-zinc-200 p-3" delay={120}>Safety: conservative defaults and guardrails.</Reveal>
          <Reveal as="li" className="rounded border border-zinc-200 p-3" delay={180}>Privacy: least-privilege access and auditability.</Reveal>
        </ul>
      </section>
    </div>
  );
}
