import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { useRef, useState } from 'react';
import { gsap } from 'gsap';

function Toy({ position, color, geometry: Geometry, scale = 1, rotation = [0, 0, 0] }) {
    const mesh = useRef();
    const [hovered, setHover] = useState(false);

    useFrame((state) => {
        if (!hovered) {
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
    return (
        <div className="h-screen w-full relative bg-sky-300 overflow-hidden">
            {/* Background Gradient - Fun & Vibrant */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-purple-300 to-pink-300 opacity-100 z-0" />

            {/* Floating Shapes Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-30">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full mix-blend-overlay animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 300 + 50}px`,
                            height: `${Math.random() * 300 + 50}px`,
                            background: `radial-gradient(circle, ${['#ff0055', '#00f3ff', '#ffe600', '#bc13fe'][Math.floor(Math.random() * 4)]} 0%, transparent 70%)`,
                            animationDuration: `${Math.random() * 10 + 10}s`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            <Canvas shadows dpr={[1, 2]} className="z-10 relative">
                <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />
                <ambientLight intensity={0.8} />
                <spotLight position={[10, 10, 10]} angle={0.25} penumbra={1} intensity={25} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={8} color="#00f3ff" />
                <pointLight position={[10, -5, 5]} intensity={8} color="#ffe600" />

                <group position={[0, 0, 0]}>
                    <ToyBox position={[-4, 2, -2]} color="#ff0080" /> {/* Hot Pink */}
                    <ToyBall position={[4, 1, -1]} color="#00ffff" /> {/* Cyan */}
                    <ToyPyramid position={[-3, -3, 1]} color="#ffdd00" /> {/* Yellow */}
                    <ToyTorus position={[3, -2, 2]} color="#9d00ff" scale={1.2} /> {/* Purple */}
                    <ToyIcosahedron position={[0, 3, -4]} color="#00ff66" scale={0.8} /> {/* Lime Green */}

                    {/* Floating Particles - More Colorful */}
                    {[...Array(50)].map((_, i) => (
                        <Float key={i} speed={0.8 + Math.random()} floatIntensity={2} position={[
                            (Math.random() - 0.5) * 20,
                            (Math.random() - 0.5) * 15,
                            (Math.random() - 0.5) * 10 - 5
                        ]}>
                            <mesh>
                                <sphereGeometry args={[0.08 + Math.random() * 0.2, 16, 16]} />
                                <meshStandardMaterial
                                    color={["#ff0080", "#00ffff", "#ffdd00", "#9d00ff", "#00ff66"][Math.floor(Math.random() * 5)]}
                                    emissiveIntensity={0.5}
                                    emissive={["#ff0080", "#00ffff", "#ffdd00", "#9d00ff", "#00ff66"][Math.floor(Math.random() * 5)]}
                                    roughness={0.1}
                                />
                            </mesh>
                        </Float>
                    ))}
                </group>

                <ContactShadows resolution={1024} scale={50} blur={2.5} opacity={0.3} far={20} color="#000" />
                <Environment preset="park" /> {/* Brighter Environment */}
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
