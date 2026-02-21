import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { useRef, useState, useMemo, useEffect } from 'react';
import { gsap } from 'gsap';
import { useInView } from 'framer-motion';

// Detect mobile / low-end device once at module load time (stable, no re-renders)
const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 768;
const IS_LOW_END = typeof window !== 'undefined' && (navigator.hardwareConcurrency ?? 4) <= 2;

// Geometry color and position arrays defined outside the component —
// stable references, not recreated on every render.
const PARTICLE_COLORS = ["#ff0080", "#00ffff", "#ffdd00", "#9d00ff", "#00ff66"];
const BG_SHAPE_COLORS = ['#ff0055', '#00f3ff', '#ffe600', '#bc13fe'];

// eslint-disable-next-line no-unused-vars
function Toy({ position, color, geometry: Geometry, scale = 1, rotation = [0, 0, 0] }) {
    const mesh = useRef();
    const [hovered, setHover] = useState(false);

    useFrame(() => {
        if (!hovered && mesh.current) {
            mesh.current.rotation.x += 0.005;
            mesh.current.rotation.y += 0.005;
        }
    });

    const onPointerOver = (e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = 'none';
        gsap.to(mesh.current.scale, { x: scale * 1.5, y: scale * 1.5, z: scale * 1.5, duration: 0.4, ease: 'back.out(2)' });
        gsap.to(mesh.current.rotation, { x: mesh.current.rotation.x + 2, y: mesh.current.rotation.y + 2, duration: 0.5 });
    };

    const onPointerOut = () => {
        setHover(false);
        gsap.to(mesh.current.scale, { x: scale, y: scale, z: scale, duration: 0.4 });
    };

    return (
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
            <mesh
                ref={mesh}
                position={position}
                rotation={rotation}
                scale={scale}
                onPointerOver={onPointerOver}
                onPointerOut={onPointerOut}
                castShadow
                receiveShadow
            >
                <Geometry args={[1, 32, 32]} />
                <meshStandardMaterial
                    color={color}
                    roughness={0.2}
                    metalness={0.6}
                    emissive={hovered ? color : 'black'}
                    emissiveIntensity={hovered ? 0.8 : 0}
                />
            </mesh>
        </Float>
    );
}

// Specialized Toy Components using Primitives
const ToyBox = (props) => (
    <Toy {...props} geometry={() => <boxGeometry args={[1.5, 1.5, 1.5]} />} />
);

const ToyBall = (props) => (
    <Toy {...props} geometry={() => <sphereGeometry args={[1, 32, 32]} />} />
);

const ToyPyramid = (props) => (
    <Toy {...props} geometry={() => <coneGeometry args={[1, 1.5, 4]} />} />
);

const ToyTorus = (props) => (
    <Toy {...props} geometry={() => <torusGeometry args={[0.8, 0.3, 16, 100]} />} />
);

const ToyIcosahedron = (props) => (
    <Toy {...props} geometry={() => <icosahedronGeometry args={[1, 0]} />} />
);

export default function Hero() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: false, amount: 0.1 });

    // Adaptive: fewer meshes on mobile/low-end = fewer GPU draw calls per frame
    const particleCount = IS_LOW_END ? 6 : IS_MOBILE ? 8 : 15;

    // Memoize static decorative data — avoids regenerating on every render
    const backgroundShapes = useMemo(() =>
        [...Array(10)].map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 300 + 50}px`,
            height: `${Math.random() * 300 + 50}px`,
            background: `radial-gradient(circle, ${BG_SHAPE_COLORS[Math.floor(Math.random() * 4)]} 0%, transparent 70%)`,
            animationDuration: `${Math.random() * 10 + 10}s`,
            animationDelay: `${Math.random() * 5}s`
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
        , []); // Empty deps — generated once and stable

    // Adaptive particle array based on device capability
    const floatingParticles = useMemo(() =>
        [...Array(particleCount)].map((_, i) => ({
            id: i,
            speed: 0.8 + Math.random(),
            position: [
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 10 - 5
            ],
            geometryArgs: [0.08 + Math.random() * 0.2, 16, 16],
            color: PARTICLE_COLORS[Math.floor(Math.random() * 5)]
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
        , []); // Empty deps — generated once and stable

    return (
        <div ref={containerRef} id="hero" className="h-screen w-full relative bg-sky-300 overflow-hidden">
            {/* Background Gradient - Fun & Vibrant */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-purple-300 to-pink-300 opacity-100 z-0" />

            {/* Floating Shapes Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-30">
                {backgroundShapes.map((shape) => (
                    <div
                        key={shape.id}
                        className="absolute rounded-full mix-blend-overlay animate-float"
                        style={{
                            left: shape.left,
                            top: shape.top,
                            width: shape.width,
                            height: shape.height,
                            background: shape.background,
                            animationDuration: shape.animationDuration,
                            animationDelay: shape.animationDelay,
                            // Hint the browser to promote this element to its own layer
                            willChange: 'transform',
                        }}
                    />
                ))}
            </div>

            <Canvas
                shadows={!IS_MOBILE}          // Shadow maps are expensive on mobile GPUs
                dpr={IS_MOBILE ? 1 : [1, 1.5]} // Fixed DPR=1 on mobile; adaptive on desktop
                gl={{ antialias: !IS_MOBILE, powerPreference: 'high-performance' }}
                className="z-10 relative"
                frameloop={isInView ? "always" : "never"}
            >
                <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />
                <ambientLight intensity={0.8} />
                <spotLight position={[10, 10, 10]} angle={0.25} penumbra={1} intensity={25} castShadow={!IS_MOBILE} />
                <pointLight position={[-10, -10, -10]} intensity={8} color="#00f3ff" />
                <pointLight position={[10, -5, 5]} intensity={8} color="#ffe600" />

                <group position={[0, 0, 0]}>
                    <ToyBox position={[-4, 2, -2]} color="#ff0080" /> {/* Hot Pink */}
                    <ToyBall position={[4, 1, -1]} color="#00ffff" /> {/* Cyan */}
                    <ToyPyramid position={[-3, -3, 1]} color="#ffdd00" /> {/* Yellow */}
                    <ToyTorus position={[3, -2, 2]} color="#9d00ff" scale={1.2} /> {/* Purple */}
                    <ToyIcosahedron position={[0, 3, -4]} color="#00ff66" scale={0.8} /> {/* Lime Green */}

                    {/* Floating Particles - Reduced from 25 to 15 */}
                    {floatingParticles.map((particle) => (
                        <Float key={particle.id} speed={particle.speed} floatIntensity={2} position={particle.position}>
                            <mesh>
                                <sphereGeometry args={particle.geometryArgs} />
                                <meshStandardMaterial
                                    color={particle.color}
                                    emissiveIntensity={0.5}
                                    emissive={particle.color}
                                    roughness={0.1}
                                />
                            </mesh>
                        </Float>
                    ))}
                </group>

                <ContactShadows resolution={512} scale={50} blur={2.5} opacity={0.3} far={20} color="#000" />
                <Environment preset="park" background={false} /> {/* Brighter Environment */}
            </Canvas>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                <h1 className="text-8xl md:text-[10rem] leading-none font-black text-white drop-shadow-[0_10px_0_rgba(0,0,0,0.1)] font-display text-center"
                    style={{ textShadow: '4px 4px 0px #ff0080, 8px 8px 0px #00ffff' }}>
                    TOY<br />VERSE
                </h1>
                <p className="mt-8 text-2xl md:text-3xl text-toy-dark font-bold bg-white/60 backdrop-blur-md px-10 py-4 rounded-full border-4 border-white shadow-xl animate-bounce-slow">
                    Where Fun Comes to Life! 🚀
                </p>

                <div className="flex gap-6 mt-12 pointer-events-auto">
                    <button
                        onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                        className="px-10 py-5 bg-toy-yellow text-toy-dark font-black rounded-full text-xl shadow-[0_10px_0_rgba(180,100,0,0.5)] active:shadow-none active:translate-y-[10px] hover:scale-110 transition-all border-4 border-white"
                    >
                        START PLAYING
                    </button>
                    <button
                        onClick={() => document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' })}
                        className="px-10 py-5 bg-white text-toy-purple font-black rounded-full text-xl shadow-[0_10px_0_rgba(200,200,255,0.5)] active:shadow-none active:translate-y-[10px] hover:scale-110 transition-all border-4 border-toy-purple"
                    >
                        ARCADE ZONE
                    </button>
                </div>
            </div>
        </div>
    );
}
