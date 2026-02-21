import React, { useRef, useState, useEffect, useCallback, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, ContactShadows, Environment } from "@react-three/drei";
import { useInView } from "framer-motion";
import * as THREE from "three";

// Detect device capability once at module load — no re-renders needed
const IS_MOBILE_DEVICE = typeof window !== 'undefined' && window.innerWidth < 768;
const IS_LOW_END_DEVICE = typeof window !== 'undefined' && (navigator.hardwareConcurrency ?? 4) <= 2;
const STAR_COUNT = IS_LOW_END_DEVICE ? 800 : IS_MOBILE_DEVICE ? 1500 : 3000;

// ---------------- ROCKET ----------------
function Rocket({ engineOn, launched }) {
  const ref = useRef();

  useFrame((state, delta) => {
    if (!ref.current) return;

    if (launched) {
      ref.current.position.y += 8 * delta;
      ref.current.rotation.y += 2 * delta;
      ref.current.rotation.x += 0.5 * delta;
    } else if (engineOn) {
      // Shake effect
      ref.current.position.x = (Math.random() - 0.5) * 0.05;
      ref.current.position.z = (Math.random() - 0.5) * 0.05;
    } else {
      // Idle float animation
      ref.current.position.x = 0;
      ref.current.position.z = 0;
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, 0, 0.1);
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={ref}>
      {/* Body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.6, 0.8, 3, 32]} />
        <meshStandardMaterial color="#e0e0e0" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 2, 0]}>
        <coneGeometry args={[0.6, 1.2, 32]} />
        <meshStandardMaterial color="#ef4444" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Fins */}
      {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((r, i) => (
        <mesh key={i} position={[0, -1, 0]} rotation={[0, r, 0]}>
          <group position={[0.7, 0, 0]}>
            <boxGeometry args={[0.8, 1.5, 0.1]} />
            <meshStandardMaterial color="#ef4444" metalness={0.6} />
          </group>
        </mesh>
      ))}

      {/* Engine */}
      <mesh position={[0, -1.8, 0]}>
        <cylinderGeometry args={[0.5, 0.7, 0.6, 32]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Flame */}
      {(engineOn || launched) && (
        <mesh position={[0, -3, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.5, 2.5, 16]} />
          <meshBasicMaterial color="#ffaa00" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
}

// ---------------- MAIN ----------------
export default function RocketShowcase() {
  const containerRef = useRef(null);
  const [engineOn, setEngineOn] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // Store the reset timeout to clean up on unmount
  const resetTimerRef = useRef(null);

  // Pause 3D rendering when the section is scrolled out of view — same approach as Hero.jsx
  const isInView = useInView(containerRef, { once: false, amount: 0.1 });

  useEffect(() => {
    // Debounced resize handler — avoids triggering setState on every pixel of resize
    let resizeTimeout;
    const checkMobile = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 100);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => {
      window.removeEventListener("resize", checkMobile);
      clearTimeout(resizeTimeout);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const handleClick = useCallback(() => {
    if (!engineOn) {
      setEngineOn(true);
    } else if (!launched) {
      setLaunched(true);
      resetTimerRef.current = setTimeout(() => {
        setEngineOn(false);
        setLaunched(false);
      }, 5000);
    }
  }, [engineOn, launched]);

  const status = launched ? "IN FLIGHT" : engineOn ? "IGNITION" : "READY";

  return (
    // Supports dvh for mobile browsers
    <div ref={containerRef} className="w-full h-[100dvh] bg-[#050510] relative overflow-hidden flex flex-col items-center justify-center">

      {/* Background Layers */}
      <div className="absolute inset-0 rocket-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute inset-0 rocket-scanlines pointer-events-none z-30 opacity-20" />
      <div className="absolute inset-0 rocket-vignette pointer-events-none z-10" />

      {/* 3D Scene — paused when out of view via frameloop prop */}
      <div className="absolute inset-0 z-10">
        <Canvas
          shadows={!IS_MOBILE_DEVICE}  // Shadow maps are expensive on mobile GPUs
          gl={{ powerPreference: "high-performance", antialias: !IS_MOBILE_DEVICE }}
          camera={{ position: [0, isMobile ? 1 : 2, isMobile ? 14 : 9], fov: 45 }}
          dpr={IS_MOBILE_DEVICE ? 1 : [1, 1.5]}  // Force DPR=1 on mobile
          frameloop={isInView ? "always" : "never"}
        >
          <color attach="background" args={["#050510"]} />

          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={20} castShadow={!IS_MOBILE_DEVICE} />
            <pointLight position={[-10, -5, -10]} intensity={5} color="#00f3ff" />

            {/* Adaptive star count: 3000 desktop → 1500 mobile → 800 low-end */}
            <Stars radius={100} depth={50} count={STAR_COUNT} factor={4} fade speed={launched ? 2 : 0.5} />
            <Environment preset="city" />

            <Float speed={engineOn ? 10 : 2} rotationIntensity={0.5} floatIntensity={0.5}>
              <Rocket engineOn={engineOn} launched={launched} />
            </Float>

            <ContactShadows position={[0, -3, 0]} opacity={0.5} scale={20} blur={2.5} far={4} color="#000" />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between py-8 md:py-12 pointer-events-none px-4">
        {/* Top HUD */}
        <div className={`text-center transition-opacity duration-1000 ${launched ? 'opacity-0' : 'opacity-100'}`}>
          <h1 className="text-6xl md:text-9xl font-display text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 tracking-wider drop-shadow-lg leading-tight">
            GALACTIC X
          </h1>
          <p className="font-tech text-toy-neonBlue tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-base mt-2">
            INTERSTELLAR TRANSPORT VEHICLE
          </p>
        </div>

        {/* Bottom Controls */}
        <div className={`flex flex-col items-center gap-6 transition-opacity duration-1000 ${launched ? 'opacity-0' : 'opacity-100'} mb-16 md:mb-0`}>
          <div className="pointer-events-auto">
            <button
              onClick={handleClick}
              className={`px-8 py-3 md:px-12 md:py-4 rounded-full font-display text-xl md:text-2xl tracking-wider transition-all duration-300 border-2
                          ${engineOn
                  ? "bg-orange-600 border-orange-400 text-white shadow-[0_0_50px_rgba(255,100,0,0.6)] scale-110 animate-pulse"
                  : "bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/50"
                }`}
            >
              {engineOn ? "LAUNCH MISSION" : "START ENGINE"}
            </button>
          </div>
        </div>
      </div>

      {/* HUD Data Overlay - Bottom Left */}
      <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-20 font-tech text-[10px] md:text-sm text-toy-neonBlue/80 space-y-1 border-l-2 border-toy-neonBlue/30 pl-2 md:pl-4 opacity-70 md:opacity-100">
        <div className="flex gap-2 md:gap-4"><span className="text-gray-500 w-12 md:w-16">STATUS</span> <span className={engineOn ? "text-orange-500 animate-pulse" : "text-green-400"}>{status}</span></div>
        <div className="flex gap-2 md:gap-4"><span className="text-gray-500 w-12 md:w-16">FUEL</span> 100%</div>
        <div className="flex gap-2 md:gap-4"><span className="text-gray-500 w-12 md:w-16">DEST</span> MARS</div>
      </div>

      {/* HUD Data Overlay - Bottom Right */}
      <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-20 font-tech text-[10px] md:text-xs text-right text-toy-neonBlue/60 opacity-70 md:opacity-100">
        <div>SYS.V.2.0.4</div>
        <div>LOW ORBIT</div>
      </div>

    </div>
  );
}
