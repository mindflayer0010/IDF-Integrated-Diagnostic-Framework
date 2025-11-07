export default function BrandLogo({ size = 56 }: { size?: number }) {
  const s = size;
  const baseApi = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';
  const base = typeof baseApi === 'string' ? baseApi.replace(/\/api\/?$/, '') : 'http://localhost:4000';
  const filename = 'logo(CareMate).png';
  const src = `${base}/logo/${encodeURIComponent(filename)}`;
  return (
    <img
      src={src}
      alt="CareMate logo"
      style={{ height: s, width: 'auto' }}
      className="block object-contain select-none"
      draggable={false}
    />
  );
}
