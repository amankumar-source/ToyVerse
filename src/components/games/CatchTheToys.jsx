import { useRef, useEffect, useState } from 'react';

export default function CatchTheToys() {
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);

    const state = useRef({
        toys: [],
        lastSpawn: 0,
        animId: null,
        mouse: { x: 0, y: 0, active: false }
    });

    const SPAWN_RATE = 800;
    const GRAVITY = 0.2;

    useEffect(() => {
        if (!playing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Reset
        state.current.toys = [];

        setTimeLeft(30);

        const timer = setInterval(() => {
            setTimeLeft(PREV => {
                if (PREV <= 1) {
                    setPlaying(false);
                    clearInterval(timer);
                    return 0;
                }
                return PREV - 1;
            });
        }, 1000);

        const handleMouseDown = (e) => {
            const rect = canvas.getBoundingClientRect();
            state.current.mouse.x = e.clientX - rect.left;
            state.current.mouse.y = e.clientY - rect.top;
            state.current.mouse.active = true;
        };

        const handleMouseUp = () => {
            state.current.mouse.active = false;
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        const loop = (timestamp) => {
            if (!playing) return;

            const { width, height } = canvas;
            ctx.clearRect(0, 0, width, height);

            // Spawn
            if (timestamp - state.current.lastSpawn > SPAWN_RATE) {
                const size = 30 + Math.random() * 30;
                state.current.toys.push({
                    x: Math.random() * (width - size),
                    y: -50,
                    vx: (Math.random() - 0.5) * 4,
                    vy: 0,
                    size,
                    color: ['#ff0055', '#ffe600', '#00ff9d', '#00f3ff'][Math.floor(Math.random() * 4)],
                    type: Math.random() > 0.5 ? 'circle' : 'square'
                });
                state.current.lastSpawn = timestamp;
            }

            // Update & Draw
            state.current.toys.forEach((toy, i) => {
                toy.vy += GRAVITY;
                toy.x += toy.vx;
                toy.y += toy.vy;

                // Bounce off walls
                if (toy.x <= 0 || toy.x + toy.size >= width) toy.vx *= -1;

                // Draw
                ctx.fillStyle = toy.color;
                ctx.shadowColor = toy.color;
                ctx.shadowBlur = 10;

                ctx.beginPath();
                if (toy.type === 'circle') {
                    ctx.arc(toy.x + toy.size / 2, toy.y + toy.size / 2, toy.size / 2, 0, Math.PI * 2);
                } else {
                    ctx.fillRect(toy.x, toy.y, toy.size, toy.size);
                }
                ctx.fill();
                ctx.shadowBlur = 0;

                // Click detection (Catch)
                if (state.current.mouse.active) {
                    const dx = state.current.mouse.x - (toy.x + toy.size / 2);
                    const dy = state.current.mouse.y - (toy.y + toy.size / 2);
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < toy.size) {
                        // Caught!
                        state.current.toys.splice(i, 1);
                        setScore(s => s + 1);
                        state.current.mouse.active = false; // Require separate clicks, or remove for drag-catch

                        // Boom effect (simple)
                        ctx.fillStyle = '#fff';
                        ctx.beginPath();
                        ctx.arc(toy.x, toy.y, 40, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }

                if (toy.y > height) {
                    state.current.toys.splice(i, 1);
                }
            });

            state.current.animId = requestAnimationFrame(loop);
        };

        state.current.animId = requestAnimationFrame(loop);

        return () => {
            clearInterval(timer);
            canvas.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            cancelAnimationFrame(state.current.animId);
        };
    }, [playing]);

    return (
        <div className="relative w-full h-[600px] bg-gray-900 rounded-xl overflow-hidden border-2 border-toy-neonBlue shadow-[0_0_30px_rgba(0,243,255,0.3)]">
            {!playing ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
                    <h3 className="text-4xl text-toy-yellow font-display mb-4">Toy Catcher</h3>
                    <p className="text-white mb-2">Click falling toys to catch them!</p>
                    <p className="text-gray-400 mb-6">Last Score: {score}</p>
                    <button
                        onClick={() => { setPlaying(true); }}
                        className="px-8 py-3 bg-toy-neonBlue text-black font-bold rounded-full hover:scale-110 transition-transform"
                    >
                        Start Game
                    </button>
                </div>
            ) : (
                <div className="absolute top-4 left-0 w-full flex justify-between px-6 z-10 pointer-events-none">
                    <h4 className="text-2xl font-bold text-white">Score: <span className="text-toy-green">{score}</span></h4>
                    <h4 className="text-2xl font-bold text-white">Time: <span className="text-toy-red">{timeLeft}s</span></h4>
                </div>
            )}

            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full h-full object-cover cursor-crosshair"
            />
        </div>
    );
}
