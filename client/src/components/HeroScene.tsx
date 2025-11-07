import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Animated hero background: soft floating particles with brand colors.
 * Lightweight (no post-processing). Auto-resizes and respects device pixel ratio caps.
 */
type Props = { className?: string; hasBackground?: boolean };
export default function HeroScene({ className = '', hasBackground = false }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const mouse = useRef<{x:number;y:number}>({x:0,y:0});

  useEffect(() => {
    const mount = mountRef.current!;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    mount.appendChild(renderer.domElement);

    // Optional soft gradient plane (disabled by default to avoid any dark banding)
    let bgGeo: THREE.PlaneGeometry | undefined;
    let tex: THREE.DataTexture | undefined;
    if (hasBackground) {
      const size = 512;
      const data = new Uint8Array(3 * size);
      for (let i = 0; i < size; i++) {
        const t = i / (size - 1);
        const r = 255 * (0.9);
        const g = 255 * (0.98 - 0.08 * t);
        const b = 255 * (1 - 0.02 * t);
        data[3 * i] = r;
        data[3 * i + 1] = g;
        data[3 * i + 2] = b;
      }
      tex = new THREE.DataTexture(data, size, 1, THREE.RGBFormat);
      tex.needsUpdate = true;
      tex.wrapS = tex.wrapT = THREE.MirroredRepeatWrapping;
      bgGeo = new THREE.PlaneGeometry(20, 12);
      const bgMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.6 });
      const bg = new THREE.Mesh(bgGeo, bgMat);
      bg.position.z = -2.5;
      scene.add(bg);
    }

    // Particles (floating orbs)
    const orbCount = 90;
    const positions = new Float32Array(orbCount * 3);
    const colors = new Float32Array(orbCount * 3);
    const colorA = new THREE.Color('#4fe2e3');
    const colorB = new THREE.Color('#7ad957');
    for (let i = 0; i < orbCount; i++) {
      positions[3 * i] = (Math.random() - 0.5) * 10;
      positions[3 * i + 1] = (Math.random() - 0.5) * 6;
      positions[3 * i + 2] = (Math.random() - 0.5) * 1;
      const c = colorA.clone().lerp(colorB, Math.random());
      colors[3 * i] = c.r;
      colors[3 * i + 1] = c.g;
      colors[3 * i + 2] = c.b;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({ size: 0.08, vertexColors: true, transparent: true, opacity: 0.85 });
  const points = new THREE.Points(geom, mat);
  scene.add(points);
  // Additive glow layer
  const glowMat = new THREE.PointsMaterial({ size: 0.16, color: 0xffffff, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, depthWrite: false });
  const glow = new THREE.Points(geom, glowMat);
  scene.add(glow);

    let t0 = performance.now();
    const onResize = () => {
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || 360;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width * 2 - 1;
      const ny = (e.clientY - rect.top) / rect.height * 2 - 1;
      mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, nx, 0.2);
      mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, ny, 0.2);
    };
    const animate = () => {
      const t = (performance.now() - t0) * 0.001;
      points.rotation.y = 0.1 * t;
      points.rotation.x = 0.05 * Math.sin(t * 0.5);
      glow.rotation.copy(points.rotation);
      // Subtle parallax
      camera.position.x = mouse.current.x * 0.4;
      camera.position.y = -mouse.current.y * 0.3;
      camera.lookAt(0,0,0);
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };

    onResize();
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointerMove);
    animate();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      geom.dispose();
      glowMat.dispose();
      if (bgGeo) bgGeo.dispose();
      if (tex) tex.dispose();
    };
  }, []);

  return <div ref={mountRef} className={className} />;
}
