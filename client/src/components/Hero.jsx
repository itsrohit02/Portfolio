import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Sphere } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import { useState, useRef, useEffect } from 'react';

const defaultProfile = {
  heroText: 'Aspiring full-stack developer with a growing focus on AI-driven products — I care about clean architecture as much as sharp UI, and I build things end to end.'
};

const ParticleRing = () => {
  const groupRef = useRef();
  const coreRef = useRef();
  const [sphere] = useState(() => random.inSphere(new Float32Array(3000), { radius: 2.6 }));

  useFrame((state, delta) => {
    if (!groupRef.current || !coreRef.current) return;
    groupRef.current.rotation.y += delta * 0.1;
    groupRef.current.rotation.x += Math.sin(state.clock.elapsedTime * 0.5) * 0.002;
    coreRef.current.rotation.y -= delta * 0.15;
    coreRef.current.rotation.x -= delta * 0.05;

    const targetX = state.pointer.x * 0.5;
    const targetY = state.pointer.y * 0.3;
    groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <Points positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#e8a33d" size={0.04} sizeAttenuation={true} depthWrite={false} />
      </Points>
      <Sphere ref={coreRef} args={[1.15, 16, 16]}>
        <meshBasicMaterial color="#b8456b" wireframe transparent opacity={0.25} />
      </Sphere>
    </group>
  );
};

export default function Hero() {
  const [profile, setProfile] = useState(defaultProfile);

  useEffect(() => {
    const controller = new AbortController();
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://portfolio-pd7x.onrender.com';

    const loadProfile = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/profile`, { signal: controller.signal });
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        const data = await res.json();
        setProfile(data || defaultProfile);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to load profile:', err);
          setProfile(defaultProfile);
        }
      }
    };

    loadProfile();
    return () => controller.abort();
  }, []);

  return (
    <section className="relative w-full h-screen flex items-center px-8 md:px-24 overflow-hidden bg-[#0a0d1a]">
      
      {/* 3D CANVAS BACKGROUND - Locked to right edge */}
      <div className="absolute top-0 right-0 bottom-0 w-full md:w-[60%] h-full z-0 opacity-90 pointer-events-none translate-x-[10%]">
        <Canvas camera={{ position: [0, 0, 7.5], fov: 45 }}>
          <ParticleRing />
        </Canvas>
      </div>

      {/* FOREGROUND CONTENT - Anchored left */}
      <div className="relative z-10 w-full md:w-1/2">
        <p className="text-[#6fe7dd] tracking-widest uppercase text-sm mb-4 font-mono">
          Jaipur, India — Full-Stack Developer
        </p>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-[#f1eae0]">
          Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8a33d] to-[#b8456b] italic font-serif">structured</span> systems with an engineer's mind.
        </h1>
        
        <p className="text-[#9aa0c0] mt-6 text-lg max-w-lg min-h-[80px]">
          {profile.heroText || defaultProfile.heroText}
        </p>
        
        <div className="flex gap-4 mt-8">
          <a href="#projects" className="border border-[#e8a33d] bg-[#e8a33d] text-[#1a1204] font-bold px-6 py-3 uppercase tracking-wider text-sm hover:bg-[#b8456b] hover:border-[#b8456b] hover:text-[#f1eae0] transition-colors duration-300 inline-block text-center">
            View Projects
          </a>
          <a href="#contact" className="border border-[rgba(241,234,224,0.2)] text-[#f1eae0] px-6 py-3 uppercase tracking-wider text-sm hover:border-[#e8a33d] hover:text-[#e8a33d] transition-colors duration-300 inline-block text-center">
            Get In Touch
          </a>
        </div>
      </div>
    </section>
  );
}