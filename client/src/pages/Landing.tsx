import BrandLogo from '../components/BrandLogo';
import HeroScene from '../components/HeroScene';
import Reveal from '../components/Reveal';
import Tilt from '../components/Tilt';

export default function Landing({ onStartTriage, onViewLogs }: { onStartTriage: () => void; onViewLogs: () => void }) {
  return (
    <div className="min-h-[calc(100vh-140px)]">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-cyan-50 via-white to-emerald-50 border border-zinc-200 shadow-sm">
        <div className="px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20 grid lg:grid-cols-2 gap-8 items-center">
          <Reveal as="div">
            <div className="flex items-center gap-4 mb-6">
              <BrandLogo size={88} />
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900">CareMate</h1>
            </div>
            <p className="text-lg text-zinc-700 max-w-prose">
              Fast, consistent, AI-assisted triage. Enter symptoms, get an urgency score and suggested remedies—then review insights on the doctor dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={onStartTriage} className="btn-primary px-5 py-2 rounded hover-lift">Start Triage</button>
              <button onClick={onViewLogs} className="btn-outline px-5 py-2 rounded hover-tint">View Logs</button>
            </div>
          </Reveal>
          <div className="lg:justify-self-end">
            <Reveal as="div" delay={100}>
            <Tilt className="rounded-xl border border-zinc-200 bg-white/80 backdrop-blur p-4 sm:p-6 shadow transition-transform duration-200">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-4 rounded-lg bg-cyan-50 border border-cyan-100">
                  <div className="text-2xl">🩺</div>
                  <div className="mt-2 text-sm font-medium text-zinc-800">Symptoms</div>
                </div>
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                  <div className="text-2xl">⚖️</div>
                  <div className="mt-2 text-sm font-medium text-zinc-800">Severity</div>
                </div>
                <div className="p-4 rounded-lg bg-cyan-50 border border-cyan-100">
                  <div className="text-2xl">📊</div>
                  <div className="mt-2 text-sm font-medium text-zinc-800">Urgency</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-zinc-600">Models run on the server and your entries are saved securely for review.</p>
            </Tilt>
            </Reveal>
          </div>
        </div>
        {/* Animated background */}
        <HeroScene className="absolute inset-0 pointer-events-none" />
        {/* Scroll cue */}
        <button
          type="button"
          aria-label="Scroll to features"
          onClick={() => {
            const el = document.getElementById('features');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="absolute left-1/2 -bottom-6 -translate-x-1/2 w-12 h-12 rounded-full bg-white shadow border border-zinc-200 flex items-center justify-center animate-bounce-soft"
        >
          <span className="text-xl">⌄</span>
        </button>
      </section>

  {/* Features */}
      <section id="features" className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: 'Data‑driven symptoms', desc: 'Dropdown is populated from your dataset; keys are normalized for fewer input errors.' },
          { title: 'Doctor dashboard', desc: 'Today/Yesterday groups with SPID, remedy, and top symptoms for quick scanning.' },
          { title: 'Secure & private', desc: 'Backed by MongoDB; each triage is linked to a patient SPID for easy retrieval.' },
        ].map((f, i) => (
          <Reveal key={f.title} delay={100 + i * 80}>
            <Tilt className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="text-zinc-900 font-medium">{f.title}</div>
              <div className="mt-1 text-sm text-zinc-600">{f.desc}</div>
            </Tilt>
          </Reveal>
        ))}
      </section>

      {/* How it works */}
      <section className="mt-12 rounded-xl border border-zinc-200 bg-white p-6">
        <Reveal as="h2" className="text-lg font-medium text-zinc-900">How it works</Reveal>
        <ol className="mt-3 grid sm:grid-cols-3 gap-4 text-sm text-zinc-700">
          <Reveal as="li" className="rounded-lg border border-zinc-200 p-4" delay={0}>1) Enter SPID, age, gender, and select symptoms + severity.</Reveal>
          <Reveal as="li" className="rounded-lg border border-zinc-200 p-4" delay={80}>2) We predict urgency and suggest a remedy; everything is saved.</Reveal>
          <Reveal as="li" className="rounded-lg border border-zinc-200 p-4" delay={160}>3) Doctors review the daily logs and patient history.</Reveal>
        </ol>
      </section>
    </div>
  );
}
