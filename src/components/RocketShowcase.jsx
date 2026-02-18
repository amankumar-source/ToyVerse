import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    Stage,
    PresentationControls,
    ContactShadows,
    Environment,
    PerspectiveCamera,
    Float,
    Stars,
    Sparkles
} from '@react-three/drei';
import { motion, useInView } from 'framer-motion';
import * as THREE from 'three';

// --- Materials ---
const hullMaterial = new THREE.MeshPhysicalMaterial({
    color: '#e0e0e0',
    metalness: 0.6,
    roughness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
});

const finMaterial = new THREE.MeshStandardMaterial({
    color: '#ff0000', // Red fins
    metalness: 0.4,
    roughness: 0.4,
});

const windowMaterial = new THREE.MeshPhysicalMaterial({
    color: '#87ceeb',
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.5, // Glass-like
    thickness: 0.5,
});

const engineMaterial = new THREE.MeshStandardMaterial({
    color: '#333333',
    metalness: 0.8,
    roughness: 0.5,
});

const flameMaterial = new THREE.MeshBasicMaterial({
    color: '#ffaa00',
    toneMapped: false,
});

// --- Rocket Model Component ---
const RocketModel = ({ isEngineOn, isLaunched, onHover }) => {
    const group = useRef();
    const exhaustRef = useRef();

    // Animation Loop
    useFrame((state, delta) => {
        const t = state.clock.getElapsedTime();

        if (isLaunched && group.current) {
            // Launch: Accelerate upwards
            group.current.position.y += 10 * delta;
            // Add a bit of rotation during launch
            group.current.rotation.y += 2 * delta;
        } else if (isEngineOn && group.current) {
            // Engine Start: Severe shake / Vibration
            group.current.position.x = (Math.random() - 0.5) * 0.1;
            group.current.position.z = (Math.random() - 0.5) * 0.1;
            group.current.position.y = (Math.random() - 0.5) * 0.05; // Minor vertical jitter
        } else if (group.current) {
            // Idle: Gentle float (handled by <Float> wrapper mostly, but we can add subtle internal movement if needed)
            group.current.rotation.z = Math.sin(t * 0.5) * 0.05;
        }

        // Exhaust flicker
        if (exhaustRef.current && (isEngineOn || isLaunched)) {
            exhaustRef.current.scale.y = 1 + Math.random() * 0.5;
            exhaustRef.current.position.y = -2.5 - Math.random() * 0.2;
        }
    });

    return (
        <group
            ref={group}
            onPointerOver={() => onHover(true)}
            onPointerOut={() => onHover(false)}
        >
            {/* --- BODY --- */}
            {/* Main Hull */}
            <mesh position={[0, 0, 0]} castShadow>
                <cylinderGeometry args={[0.7, 0.9, 4, 32]} />
                <primitive object={hullMaterial} />
            </mesh>

            {/* Nose Cone */}
            <mesh position={[0, 2.75, 0]} castShadow>
                <coneGeometry args={[0.7, 1.5, 32]} />
                <primitive object={finMaterial} />
            </mesh>

            {/* Window */}
            <mesh position={[0, 1, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.3, 0.05, 16, 32]} />
                <meshStandardMaterial color="#888" />
            </mesh>
            <mesh position={[0, 1, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.3, 32]} />
                <primitive object={windowMaterial} />
            </mesh>

            {/* --- FINS --- */}
            {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((rotation, i) => (
                <group key={i} rotation={[0, rotation, 0]}>
                    <mesh position={[0.8, -1.5, 0]} castShadow>
                        <boxGeometry args={[0.8, 1.5, 0.1]} />
                        <primitive object={finMaterial} />
                    </mesh>
                    {/* Angle the top of the fin in for style (optional) - simple box is fine for now, or use custom geometry */}
                </group>
            ))}

            {/* --- ENGINE --- */}
            <mesh position={[0, -2.2, 0]} castShadow>
                <cylinderGeometry args={[0.6, 0.8, 0.5, 32]} />
                <primitive object={engineMaterial} />
            </mesh>
            <mesh position={[0, -2.5, 0]}>
                <cylinderGeometry args={[0.5, 0.7, 0.4, 32]} />
                <meshStandardMaterial color="#222" />
            </mesh>

            {/* --- FLAME (Visible only when engine on) --- */}
            {(isEngineOn || isLaunched) && (
                <mesh ref={exhaustRef} position={[0, -3.5, 0]} rotation={[Math.PI, 0, 0]}>
                    <coneGeometry args={[0.4, 2, 16]} />
                    <primitive object={flameMaterial} />
                </mesh>
            )}
        </group>
    );
};

// --- Particles / Stars Effect ---
// Reuse Sparkles or create simple custom particles for exhaust if needed
const ExhaustParticles = ({ isEngineOn, isLaunched }) => {
    if (!isEngineOn && !isLaunched) return null;

    return (
        <group position={[0, -3, 0]}>
            <Sparkles
                count={50}
                scale={4}
                size={6}
                speed={5}
                opacity={0.8}
                color="#ff8800"
                noise={1}
            />
        </group>
    )
}


const RocketShowcase = () => {
    const [isEngineOn, setIsEngineOn] = useState(false);
    const [isLaunched, setIsLaunched] = useState(false);
    const [, setIsHovered] = useState(false);
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: false, amount: 0.1 });

    const handleAction = () => {
        if (!isEngineOn && !isLaunched) {
            // Start Engine
            setIsEngineOn(true);
        } else if (isEngineOn && !isLaunched) {
            // Launch
            setIsLaunched(true);
            setTimeout(() => {
                // Reset after some time or just let it fly away?
                // Let's reset for replayability after 5 seconds
                setTimeout(() => {
                    setIsLaunched(false);
                    setIsEngineOn(false);
                }, 5000);
            }, 500);
        }
    };

    return (
        <div ref={containerRef} className="w-full h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-black z-0" />

            {/* 3D Scene */}
            <div className="w-full h-full absolute inset-0 z-10">
                <Canvas
                    shadows
                    dpr={[1, 1.5]}
                    camera={{ position: [0, 2, 10], fov: 45 }}
                    frameloop={isInView ? "always" : "never"}
                >
                    <fog attach="fog" args={['#050505', 5, 20]} />

                    {/* Lighting */}
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={20} castShadow shadow-bias={-0.0001} />
                    <pointLight position={[-10, 5, -10]} intensity={5} color="#00f3ff" />
                    <pointLight position={[10, 5, 5]} intensity={5} color="#ff0000" />

                    <Environment preset="night" blur={0.8} background={false} />
                    <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={isLaunched ? 10 : 1} />

                    <PerspectiveCamera makeDefault position={[0, 2, 12]} fov={50} />

                    <Float speed={isEngineOn ? 20 : 2} rotationIntensity={isEngineOn ? 1 : 0.2} floatIntensity={isEngineOn ? 2 : 0.5}>
                        <PresentationControls
                            global
                            zoom={0.8}
                            rotation={[0, -Math.PI / 4, 0]}
                            polar={[-Math.PI / 6, Math.PI / 6]}
                            azimuth={[-Math.PI / 4, Math.PI / 4]}
                            config={{ mass: 2, tension: 400 }}
                            enabled={!isLaunched} // Disable controls during launch
                        >
                            <Stage environment={null} intensity={0.5} contactShadow={false} shadowBias={-0.001}>
                                <RocketModel isEngineOn={isEngineOn} isLaunched={isLaunched} onHover={setIsHovered} />
                            </Stage>
                        </PresentationControls>
                    </Float>

                    <ExhaustParticles isEngineOn={isEngineOn} isLaunched={isLaunched} />

                    {!isLaunched && <ContactShadows resolution={512} scale={50} blur={2} opacity={0.5} far={10} color="#000" />}
                </Canvas>
            </div>

            {/* UI Overlay */}
            <div className={`relative z-20 pointer-events-none flex flex-col items-center text-center transition-opacity duration-1000 ${isLaunched ? 'opacity-0' : 'opacity-100'}`}>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 font-display tracking-tighter"
                >
                    GALACTIC X
                </motion.h2>
                <p className="text-gray-400 text-xl mt-4 max-w-lg">
                    Interstellar Transport Vehicle. Ready for lift-off.
                </p>

                <div className="mt-12 pointer-events-auto">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAction}
                        className={`px-12 py-4 rounded-full font-bold text-xl transition-all duration-300 border-2 ${isEngineOn
                            ? 'bg-orange-600 border-orange-500 text-white shadow-[0_0_30px_rgba(255,165,0,0.5)] animate-pulse'
                            : 'bg-transparent border-white/20 text-white hover:bg-white hover:text-black hover:border-white'
                            }`}
                    >
                        {!isEngineOn ? 'START ENGINE' : 'LAUNCH MISSION'}
                    </motion.button>
                </div>
            </div>

            {/* Dashboard / HUD Elements */}
            <div className="absolute bottom-10 left-10 z-20 hidden md:block">
                <div className="text-white/50 text-sm font-mono">
                    <p>STATUS: {isLaunched ? 'IN FLIGHT' : isEngineOn ? 'IGNITION SEQUENCED' : 'SYSTEMS READY'}</p>
                    <p>FUEL: 100%</p>
                    <p>DESTINATION: MARS</p>
                </div>
            </div>
        </div>
    );
};

export default RocketShowcase;
