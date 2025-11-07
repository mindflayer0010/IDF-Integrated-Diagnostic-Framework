import { PropsWithChildren, useEffect, useRef, useState } from 'react';

export default function Reveal({ children, as:Tag = 'div', delay = 0, className = '' as string }: PropsWithChildren<{ as?: any; delay?: number; className?: string }>) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current as HTMLElement | null;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const style: React.CSSProperties = { transitionDelay: `${delay}ms` };
  const classes = `reveal ${visible ? 'is-visible' : ''} ${className}`;
  return (
    <Tag ref={ref as any} className={classes} style={style}>
      {children}
    </Tag>
  );
}
