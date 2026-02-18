import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

export default function ToyCarRunner() {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: false, amount: 0.1 });

    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    // Game state refs (to avoid closure staleness in loop)
    const state = useRef({
        carX: 0,
        carLane: 1, // 0, 1, 2
        obstacles: [],
        stars: [],
        speed: 5,
        lastObstacleTime: 0,
        lastStarTime: 0,
        animId: null,
        lastFrameTime: 0
    });

    const LANE_WIDTH = 100;
    const CAR_WIDTH = 50;
    const CAR_HEIGHT = 80;

    useEffect(() => {
        if (!gameStarted) return;

        // If not in view, cancel animation and return
        if (!isInView) {
            cancelAnimationFrame(state.current.animId);
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Initialize car position on first run
        if (state.current.carX === 0) {
            state.current.carX = canvas.width / 2;
        }

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') moveLane(-1);
            if (e.key === 'ArrowRight') moveLane(1);
        };

        const moveLane = (dir) => {
            const newLane = Math.max(0, Math.min(2, state.current.carLane + dir));
            state.current.carLane = newLane;
        };

        window.addEventListener('keydown', handleKeyDown);

        const loop = (timestamp) => {
            if (gameOver) return;

            // Limit frame rate check if needed, but standard RAF is fine
            // We just need to handle the pause/resume delta correctly if we were using delta time
            // For this simple game, we can just resume.

            const { width, height } = canvas;
            ctx.clearRect(0, 0, width, height);

            // Background road
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(width / 2 - LANE_WIDTH * 1.5, 0, LANE_WIDTH * 3, height);

            // Lane markers
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.setLineDash([20, 20]);
            ctx.beginPath();
            ctx.moveTo(width / 2 - LANE_WIDTH * 0.5, 0);
            ctx.lineTo(width / 2 - LANE_WIDTH * 0.5, height);
            ctx.moveTo(width / 2 + LANE_WIDTH * 0.5, 0);
            ctx.lineTo(width / 2 + LANE_WIDTH * 0.5, height);
            ctx.stroke();

            // Update Car Position (Smooth)
            const targetX = (width / 2 - LANE_WIDTH) + state.current.carLane * LANE_WIDTH + (LANE_WIDTH - CAR_WIDTH) / 2;
            state.current.carX += (targetX - state.current.carX) * 0.2;

            // Draw Car
            ctx.fillStyle = '#ff0055';
            ctx.shadowColor = '#bc13fe';
            ctx.shadowBlur = 20;
            ctx.fillRect(state.current.carX, height - 150, CAR_WIDTH, CAR_HEIGHT);
            ctx.shadowBlur = 0;

            // Spawn Obstacles
            if (timestamp - state.current.lastObstacleTime > 1500) {
                const lane = Math.floor(Math.random() * 3);
                state.current.obstacles.push({
                    lane,
                    x: (width / 2 - LANE_WIDTH) + lane * LANE_WIDTH + (LANE_WIDTH - 60) / 2,
                    y: -100,
                    width: 60,
                    height: 60
                });
                state.current.lastObstacleTime = timestamp;
            }

            // Spawn Stars
            if (timestamp - state.current.lastStarTime > 1000) {
                const lane = Math.floor(Math.random() * 3);
                // Don't spawn on top of obstacles (simple check omitted for brevity)
                state.current.stars.push({
                    lane,
                    x: (width / 2 - LANE_WIDTH) + lane * LANE_WIDTH + (LANE_WIDTH - 30) / 2,
                    y: -100,
                    size: 15
                });
                state.current.lastStarTime = timestamp;
            }

            // Update & Draw Obstacles
            ctx.fillStyle = '#00f3ff';
            state.current.obstacles.forEach((obs, i) => {
                obs.y += state.current.speed;
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

                // Collision
                if (
                    obs.y + obs.height > height - 150 &&
                    obs.y < height - 150 + CAR_HEIGHT &&
                    state.current.carLane === obs.lane
                ) {
                    setGameOver(true);
                }

                if (obs.y > height) state.current.obstacles.splice(i, 1);
            });

            // Update & Draw Stars
            ctx.fillStyle = '#ffe600';
            state.current.stars.forEach((star, i) => {
                star.y += state.current.speed;
                ctx.beginPath();
                ctx.arc(star.x + star.size, star.y + star.size, star.size, 0, Math.PI * 2);
                ctx.fill();

                // Collection
                if (
                    star.y + star.size * 2 > height - 150 &&
                    star.y < height - 150 + CAR_HEIGHT &&
                    state.current.carLane === star.lane
                ) {
                    setScore(s => s + 10);
                    state.current.stars.splice(i, 1);
                }

                if (star.y > height) state.current.stars.splice(i, 1);
            });

            state.current.speed += 0.001; // Accelerate

            state.current.animId = requestAnimationFrame(loop);
        };

        state.current.animId = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            // eslint-disable-next-line react-hooks/exhaustive-deps
            cancelAnimationFrame(state.current.animId);
        };
    }, [gameStarted, gameOver, isInView]); // Dependency on isInView ensures we restart loop when back in view

    return (
        <div ref={containerRef} className="relative w-full h-[600px] bg-toy-dark rounded-xl overflow-hidden border-2 border-toy-purple shadow-[0_0_30px_rgba(188,19,254,0.3)]">
            {!gameStarted ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
                    <h3 className="text-4xl text-toy-neonBlue font-display mb-4">Neon Racer</h3>
                    <p className="text-white mb-6">Use Arrow Keys to Dodge & Collect Stars</p>
                    <button
                        onClick={() => {
                            state.current = {
                                carX: 0,
                                carLane: 1,
                                obstacles: [],
                                stars: [],
                                speed: 5,
                                lastObstacleTime: 0,
                                lastStarTime: 0,
                                animId: null,
                                lastFrameTime: 0
                            };
                            setGameStarted(true);
                            setGameOver(false);
                            setScore(0);
                        }}
                        className="px-8 py-3 bg-toy-red text-white font-bold rounded-full hover:scale-110 transition-transform"
                    >
                        Start Engine
                    </button>
                </div>
            ) : gameOver ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/80 z-20">
                    <h3 className="text-4xl text-white font-display mb-4">CRASH!</h3>
                    <p className="text-2xl text-toy-yellow mb-6">Score: {score}</p>
                    <button
                        onClick={() => {
                            state.current = {
                                carX: 0,
                                carLane: 1,
                                obstacles: [],
                                stars: [],
                                speed: 5,
                                lastObstacleTime: 0,
                                lastStarTime: 0,
                                animId: null,
                                lastFrameTime: 0
                            };
                            setGameOver(false);
                            setScore(0);
                        }}
                        className="px-8 py-3 bg-white text-toy-red font-bold rounded-full hover:scale-110 transition-transform"
                    >
                        Try Again
                    </button>
                </div>
            ) : null}

            <div className="absolute top-4 left-4 z-10 text-white font-bold text-2xl">
                Score: <span className="text-toy-yellow">{score}</span>
            </div>

            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full h-full object-cover"
            />
        </div>
    );
}
