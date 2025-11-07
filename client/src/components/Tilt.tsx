import { PropsWithChildren, useRef } from 'react';

export default function Tilt({ children, className = '', maxTilt = 8, scale = 1.02 }: PropsWithChildren<{ className?: string; maxTilt?: number; scale?: number }>) {
  const ref = useRef<HTMLDivElement | null>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current!;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    const rx = (0.5 - py) * maxTilt; // rotateX
    const ry = (px - 0.5) * maxTilt; // rotateY
    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
  };
  const onLeave = () => {
    const el = ref.current!;
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
  };
  return (
    <div
      ref={ref}
      className={`will-change-transform transition-transform duration-200 ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}
