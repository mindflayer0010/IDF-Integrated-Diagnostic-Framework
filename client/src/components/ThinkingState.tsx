import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import { BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

function ParticleSphere(props: any) {
    const ref = useRef<any>();
    const [sphere] = useState(() => random.inSphere(new Float32Array(1500), { radius: 1.2 }));

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
            // Pulse effect
            const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
            ref.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#10b981"
                    size={0.03}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}

export default function ThinkingState() {
    return (
        <div className="flex flex-col items-center justify-center py-12 space-y-8">
            <div className="relative w-64 h-64">
                {/* 3D Particle Sphere */}
                <div className="absolute inset-0 z-0">
                    <Canvas camera={{ position: [0, 0, 3] }}>
                        <ParticleSphere />
                    </Canvas>
                </div>

                {/* Central Icon */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="relative">
                        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                        <BrainCircuit className="w-12 h-12 text-emerald-500 relative z-10" />
                    </div>
                </div>
            </div>

            <div className="space-y-2 text-center relative z-10">
                <h3 className="text-xl font-semibold text-slate-800">
                    Analyzing Symptoms
                </h3>
                <div className="flex items-center justify-center gap-1">
                    <span className="text-slate-500">Consulting medical database</span>
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-emerald-500 font-bold text-lg"
                    >
                        ...
                    </motion.span>
                </div>
            </div>
        </div>
    );
}
