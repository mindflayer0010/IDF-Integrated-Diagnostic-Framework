import Reveal from '../components/Reveal';
import Tilt from '../components/Tilt';

const quotes = [
  'Precision is compassion made measurable.',
  'Structured intake accelerates meaningful care.',
  'Repeatability builds trust in augmented decisions.',
  'Clarity at triage sets the tone for recovery.'
];

export default function Inspiration() {
  return (
    <div className="grid gap-8">
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <Reveal><h1 className="text-2xl font-semibold text-gradient">Inspiration Wall</h1></Reveal>
        <Reveal delay={60}><p className="mt-2 text-zinc-700 max-w-prose prose-energized">A small collection of guiding phrases to keep the product focused on patient value.</p></Reveal>
      </section>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quotes.map((q, i) => (
          <Reveal key={q} delay={80 + i * 80}>
            <Tilt className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover-glow h-full">
              <p className="text-sm text-zinc-700 leading-relaxed prose-energized">{q}</p>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
