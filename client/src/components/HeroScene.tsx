import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

function DNAHelix(props: any) {
  const ref = useRef<any>();

  // Generate DNA points
  const points = useMemo(() => {
    const count = 100; // base pairs
    const pts = [];
    const colors = [];
    const color1 = new THREE.Color('#10b981'); // Emerald
    const color2 = new THREE.Color('#38bdf8'); // Sky

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 8; // 4 turns
      const y = (t - 0.5) * 10; // Height spread
      const radius = 1.5;

      // Strand 1
      pts.push(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      colors.push(color1.r, color1.g, color1.b);

      // Strand 2
      pts.push(Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius);
      colors.push(color2.r, color2.g, color2.b);

      // Connecting rungs (add some points between strands)
      if (i % 2 === 0) {
        for (let j = 1; j < 5; j++) {
          const lerpT = j / 5;
          const x1 = Math.cos(angle) * radius;
          const z1 = Math.sin(angle) * radius;
          const x2 = Math.cos(angle + Math.PI) * radius;
          const z2 = Math.sin(angle + Math.PI) * radius;

          pts.push(
            x1 + (x2 - x1) * lerpT,
            y,
            z1 + (z2 - z1) * lerpT
          );
          colors.push(
            color1.r + (color2.r - color1.r) * lerpT,
            color1.g + (color2.g - color1.g) * lerpT,
            color1.b + (color2.b - color1.b) * lerpT
          );
        }
      }
    }
    return {
      positions: new Float32Array(pts),
      colors: new Float32Array(colors)
    };
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group {...props} ref={ref}>
      <Points positions={points.positions} colors={points.colors} stride={3}>
        <PointMaterial
          transparent
          vertexColors
          size={0.15}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <DNAHelix rotation={[0, 0, Math.PI / 6]} />
        </Float>
      </Canvas>
    </div>
  );
}
