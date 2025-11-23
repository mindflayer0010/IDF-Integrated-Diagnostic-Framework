import { IconStethoscope } from './icons';
import { Snowflake, Activity } from 'lucide-react';

export type IconProps = { className?: string };

// Core set
const SvgThermometer = ({ className = 'h-7 w-7' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M10 2v10a4 4 0 1 0 4 4V2h-4z" />
  </svg>
);

const SvgHeadache = ({ className = 'h-7 w-7' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="7" r="3" />
    <path d="M6 21c.5-3.5 3.5-6 6-6s5.5 2.5 6 6" />
    <path d="M9 7l3-2 3 2" />
  </svg>
);

const SvgLungs = ({ className = 'h-7 w-7' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 3v6" />
    <path d="M12 9c-3 0-6 2-6 7v5M12 9c3 0 6 2 6 7v5" />
  </svg>
);

const SvgStomach = ({ className = 'h-7 w-7' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M10 6c0 2 1 6 6 6 0 7-9 7-9 0 0-2 1-3 3-3" />
  </svg>
);

const SvgRash = ({ className = 'h-7 w-7' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 12h16" />
    <path d="M6 8h4M14 8h4M8 16h4M16 16h2" />
  </svg>
);

const SvgDizzy = ({ className = 'h-7 w-7' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="8" />
    <path d="M8.5 9l-2-2m2 0l-2 2M17.5 9l-2-2m2 0l-2 2M9 15s1.2-1 3-1 3 1 3 1" />
  </svg>
);

// Extended set for variety
const SvgHeart = ({ className = 'h-7 w-7' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20.8 8.6a5.4 5.4 0 0 0-9.3-3.8L11 5.3l-.5-.5A5.4 5.4 0 0 0 1.2 8.6c0 3.7 3.7 6.2 9.8 11.2 6.1-5 9.8-7.5 9.8-11.2z" />
  </svg>
);

const SvgThroat = ({ className = 'h-7 w-7' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 3c-2 0-3 1.5-3 3v3c0 1.7 1.3 3 3 3s3-1.3 3-3V6c0-1.5-1-3-3-3z" />
    <path d="M10 12v5a2 2 0 0 0 4 0v-5" />
  </svg>
);

const SvgNose = ({ className = 'h-7 w-7' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 3c2 4 3 6 3 8a3 3 0 0 1-3 3 3 3 0 0 1-3-3c0-2 1-4 3-8z" />
    <path d="M9 14c0 1 .8 2 2 2M15 14c0 1-.8 2-2 2" />
  </svg>
);

const SvgEar = ({ className = 'h-7 w-7' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 21c-2 0-3-2-3-3 0-2 2-2 2-5 0-2-1-4-3-4-2 0-4 2-4 5a8 8 0 1 0 16 0c0-3-2-5-4-5-2 0-3 2-3 4" />
  </svg>
);

const SvgEye = ({ className = 'h-7 w-7' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const SvgSpine = ({ className = 'h-7 w-7' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 2v20" />
    <path d="M8 6h8M8 9h8M8 12h8M8 15h8M8 18h8" />
  </svg>
);

const SvgBone = ({ className = 'h-7 w-7' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 7a3 3 0 114 4l6 6a3 3 0 114-4l-6-6a3 3 0 11-4-4l-4 4z" />
  </svg>
);

const SvgBicep = ({ className = 'h-7 w-7' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M8 12c2-4 6-4 8 0 1 2 0 5-3 6-4 1-7-2-5-6z" />
  </svg>
);

const SvgKidney = ({ className = 'h-7 w-7' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M9 6c-3 0-5 2-5 5s2 5 5 5c2 0 3-2 3-4V6H9z" />
    <path d="M15 6c3 0 5 2 5 5s-2 5-5 5c-2 0-3-2-3-4V6h3z" />
  </svg>
);

const SvgBrain = ({ className = 'h-7 w-7' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M8 8a3 3 0 1 1 6 0 3 3 0 1 1 0 6 3 3 0 1 1-6 0 3 3 0 1 1 0-6z" />
  </svg>
);

const SvgDrop = ({ className = 'h-7 w-7' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 2C8 7 5 9 5 13a7 7 0 0 0 14 0c0-4-3-6-7-11z" />
  </svg>
);

const SvgBandage = ({ className = 'h-7 w-7' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="4" y="9" width="16" height="6" rx="2" />
    <path d="M8 9v6M16 9v6M12 10v4" />
  </svg>
);

const SvgPill = ({ className = 'h-7 w-7' }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="7" width="8" height="10" rx="4" />
    <rect x="13" y="7" width="8" height="10" rx="4" />
  </svg>
);

// Fallback badge using the first letters of words
function badgeFromName(name: string) {
  const words = name.trim().split(/\s+/);
  let label = '';
  if (words.length >= 2) {
    label = (words[0][0] + words[1][0]).toUpperCase();
  } else {
    label = name.trim().slice(0, 2).toUpperCase();
  }

  return function Badge({ className = 'h-7 w-7' }: IconProps) {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden>
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#4fe2e3" />
            <stop offset="100%" stopColor="#7ad957" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#g)" opacity="0.25" />
        <circle cx="12" cy="12" r="9" fill="white" stroke="#cbd5e1" />
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="9" fontWeight="600" fill="#0b1115">{label}</text>
      </svg>
    );
  };
}

export function getSymptomIcon(name: string) {
  const n = name.toLowerCase();
  if (/(fever|temperature|pyrex)/.test(n)) return SvgThermometer;
  if (/(cough|breath|lung|asthma|dyspnea|sputum|wheeze)/.test(n)) return SvgLungs;
  if (/(headache|migraine|head)/.test(n)) return SvgHeadache;
  if (/(nausea|vomit|stomach|abdomen|abdominal|gastric|diarrh|appetite)/.test(n)) return SvgStomach;
  if (/(rash|skin|itch|hives|dermat)/.test(n)) return SvgRash;
  if (/(dizzy|vertigo|syncope|faint)/.test(n)) return SvgDizzy;
  if (/(chest pain|palpitation|heart|cardiac)/.test(n)) return SvgHeart;
  if (/(throat|tonsil|pharyn)/.test(n)) return SvgThroat;
  if (/(nose|nasal|rhino|runny nose|congestion)/.test(n)) return SvgNose;
  if (/(ear|otitis|hearing)/.test(n)) return SvgEar;
  if (/(eye|vision|ocular|conjunct)/.test(n)) return SvgEye;
  if (/(back pain|spine|spinal)/.test(n)) return SvgSpine;
  if (/(joint|arthritis|arthralgia|bone)/.test(n)) return SvgBone;
  if (/(muscle|myalgia|strain|extremities|weakness)/.test(n)) return SvgBicep;
  if (/(urine|urinary|renal|kidney|uti)/.test(n)) return SvgKidney;
  if (/(anxiety|depress|mood|panic|brain)/.test(n)) return SvgBrain;
  if (/(bleed|hemorr|blood|epistaxis)/.test(n)) return SvgDrop;
  if (/(wound|cut|injury|laceration|bandage)/.test(n)) return SvgBandage;
  if (/(medicine|pill|tablet|capsule)/.test(n)) return SvgPill;

  // Specific fixes
  if (/(cold|chill)/.test(n)) return Snowflake;
  if (/(convulsion|spasm|seizure)/.test(n)) return Activity;

  // Diverse fallback with initials badge, else stethoscope
  return badgeFromName(name) as any || IconStethoscope;
}

export function getSymptomCategory(name: string): string {
  const n = name.toLowerCase();
  if (/(headache|migraine|pain|ache|cramp|sore)/.test(n)) return 'Pain';
  if (/(cough|breath|lung|asthma|dyspnea|sputum|wheeze|throat|nose|nasal|rhino|congestion)/.test(n)) return 'Respiratory';
  if (/(nausea|vomit|stomach|abdomen|gastric|diarrh|appetite|gut|bowel)/.test(n)) return 'Digestive';
  if (/(fever|temp|sweat|chill|cold|hot)/.test(n)) return 'General';
  if (/(dizzy|vertigo|faint|syncope|fatigue|weak|tired|sleep|insomnia)/.test(n)) return 'General';
  if (/(anxiety|depress|mood|panic|brain|confusion|memory)/.test(n)) return 'Neurological';
  if (/(eye|vision|ear|hearing|skin|rash|itch)/.test(n)) return 'Sensory';
  return 'Other';
}
