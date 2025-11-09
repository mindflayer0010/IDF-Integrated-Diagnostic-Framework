import { useEffect, useMemo, useRef } from 'react';
import { getSymptomIcon } from './symptomIcons';

type Props = {
  symptoms: string[];
  selected: Record<string, number>; // 0-3
  onChange: (next: Record<string, number>) => void;
  className?: string;
  onAnnounce?: (message: string) => void; // aria-live announcements
};

const SEVERITY_COLORS = [
  'bg-white border-zinc-200',
  'bg-cyan-50 border-cyan-200',
  'bg-emerald-100 border-emerald-300',
  'bg-emerald-300 border-emerald-500',
];

export default function SymptomHoneycomb({ symptoms, selected, onChange, className = '', onAnnounce }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Pointer parallax for subtle 3D feel
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(1000px) rotateX(${py * -6}deg) rotateY(${px * 6}deg)`;
    };
    const onLeave = () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const rows = useMemo(() => {
    const perRow = 6; // refactorable constant
    const result: string[][] = [];
    for (let i = 0; i < symptoms.length; i += perRow) {
      result.push(symptoms.slice(i, i + perRow));
    }
    return result;
  }, [symptoms]);

  // Precompute a pseudo-sphere depth map: map cell index to radial distance
  const depthMap = useMemo(() => {
    const positions: { name: string; x: number; y: number }[] = [];
    rows.forEach((row, rIndex) => {
      row.forEach((name, cIndex) => {
        // Offset odd rows for honeycomb staggering
        const x = cIndex + (rIndex % 2 ? 0.5 : 0);
        const y = rIndex * 0.9; // vertical compression
        positions.push({ name, x, y });
      });
    });
    // Normalize coordinates to center
    const xs = positions.map(p => p.x);
    const ys = positions.map(p => p.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const radius = Math.max(maxX - minX, maxY - minY) / 2 + 0.0001;
    const map: Record<string, number> = {};
    positions.forEach(p => {
      const dx = (p.x - centerX) / radius;
      const dy = (p.y - centerY) / radius;
      const dist = Math.sqrt(dx*dx + dy*dy); // 0 at center
      // Invert distance so center pops forward; clamp and scale
      const depth = (1 - Math.min(dist, 1)) * 18; // max 18px translateZ
      map[p.name] = depth;
    });
    return map;
  }, [rows, symptoms]);

  const toggle = (name: string) => {
    const curr = selected[name] || 0;
    const next = (curr + 1) % 4; // 0->1->2->3->0
    const copy = { ...selected };
    if (next === 0) delete copy[name]; else copy[name] = next;
    onChange(copy);
    if (onAnnounce) onAnnounce(`${name} severity ${next}`);
  };

  const resetOne = (name: string) => {
    const copy = { ...selected };
    delete copy[name];
    onChange(copy);
    if (onAnnounce) onAnnounce(`${name} reset to 0`);
  };

  return (
    <div className={className}>
      <div className="mb-2 text-sm text-zinc-600">Click or press Enter/Space to set severity (0–3). Right-click or press “R” to reset. Color intensity increases with severity.</div>
      <div
        ref={containerRef}
        className="transition-transform duration-200 will-change-transform rounded-xl p-4 border border-zinc-200 bg-white shadow-sm"
        aria-label="Symptom selector"
      >
        <div className="relative">
          <div className="pointer-events-none absolute -inset-8 rounded-[999px] opacity-40" style={{ background: 'radial-gradient(600px at 50% 50%, rgba(79,226,227,.15), transparent 70%)' }} />
          <div className="relative">
            {rows.map((row, i) => (
              <div key={i} className={`flex gap-3 mb-3 ${i % 2 === 1 ? 'ml-8' : ''}`}>
                {row.map((name) => {
                  const SevIcon = getSymptomIcon(name);
                  const sev = selected[name] || 0;
                  const cls = SEVERITY_COLORS[sev];
                  const z = depthMap[name] || 0;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => toggle(name)}
                      onContextMenu={(e) => { e.preventDefault(); resetOne(name); }}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(name); } if (e.key.toLowerCase() === 'r') { resetOne(name); } }}
                      className={`hex-cell ${cls} hover-glow focus:outline-none focus:ring-2 focus:ring-brand.accent`}
                      aria-pressed={sev > 0}
                      aria-label={`${name} severity ${sev}`}
                      style={{ '--z': `${z}px` } as any }
                    >
                      <SevIcon className={`h-6 w-6 ${sev >= 2 ? 'text-emerald-700' : 'text-cyan-700'}`} />
                      <span className="mt-1 text-[11px] leading-tight text-zinc-800 px-1 text-center line-clamp-2">{name}</span>
                      <div className="mt-1 flex gap-1" aria-hidden>
                        {[1,2,3].map(n => (
                          <span key={n} className={`inline-block h-1.5 w-3 rounded ${sev >= n ? 'bg-emerald-600' : 'bg-zinc-200'}`} />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
