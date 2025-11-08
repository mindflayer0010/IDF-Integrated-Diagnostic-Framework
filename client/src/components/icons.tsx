export const IconStethoscope = ({ className = 'h-8 w-8' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path stroke="currentColor" d="M6 3v6a4 4 0 0 0 4 4h.5" />
    <path stroke="currentColor" d="M10.5 13a5 5 0 0 0 10 0v-2.5" />
    <circle cx="20.5" cy="8" r="2.5" stroke="currentColor" />
    <path stroke="currentColor" d="M6 3h2M6 9h2" />
  </svg>
);

export const IconScale = ({ className = 'h-8 w-8' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path stroke="currentColor" d="M12 3v4m0 0l7 2-3 6H8L5 9l7-2z" />
    <path stroke="currentColor" d="M7 21h10" />
  </svg>
);

export const IconChart = ({ className = 'h-8 w-8' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path stroke="currentColor" d="M4 19V5m0 14h16M8 15v-4m4 4V9m4 6v-2" />
  </svg>
);
