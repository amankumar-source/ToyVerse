import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';


export default function CustomCursor() {
    const cursorRef = useRef(null); // Inner cursor
    const canvasRef = useRef(null); // Particles

    // State for physics
    const pos = useRef({ x: 0, y: 0 }); // Current mouse position
    const vel = useRef({ x: 0, y: 0 }); // Mouse velocity

    // Performance optimization: use quickSetter
    const xSet = useRef(null);
    const ySet = useRef(null);

    const particles = useRef([]);


    // Track mouse position separately to decouple from render loop
    const mouse = useRef({ x: 0, y: 0 });

    // Use a ref for theme to avoid re-binding listeners
    const themeRef = useRef('default');

    useEffect(() => {
        // Initial setup
        const ctx = canvasRef.current.getContext('2d');
        let animationFrameId;

        // Initialize quickSetters
        xSet.current = gsap.quickSetter(cursorRef.current, "x", "px");
        ySet.current = gsap.quickSetter(cursorRef.current, "y", "px");

        const onMouseMove = (e) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;

            // Calculate velocity for squash/stretch
            vel.current = {
                x: e.clientX - pos.current.x,
                y: e.clientY - pos.current.y
            };

            // Update position for next frame calculation
            pos.current = { x: e.clientX, y: e.clientY };

            // Immediate update for inner cursor via quickSetter for zero lag
            xSet.current(e.clientX);
            ySet.current(e.clientY);

            // Spawn particles based on movement - Throttled
            if (Math.abs(vel.current.x) + Math.abs(vel.current.y) > 5) {
                // Limit particle spawning rate
                if (Math.random() > 0.5) {
                    createParticles(e.clientX, e.clientY, themeRef.current);
                }
            }
        };

        const createParticles = (x, y, theme) => {
            // Reduced particle count for performance
            const particleCount = theme === 'games' ? 2 : 1;
            const colorPalette = {
                default: ['#00f3ff', '#bc13fe'],
                hero: ['#ffffff', '#00f3ff'],
                products: ['#ff0055', '#ffe600'],
                games: ['#00ff9d', '#ff0055', '#ffe600']
            };
            const colors = colorPalette[theme] || colorPalette.default;

            for (let i = 0; i < particleCount; i++) {
                particles.current.push({
                    x, y,
                    vx: (Math.random() - 0.5) * (theme === 'games' ? 3 : 1),
                    vy: (Math.random() - 0.5) * (theme === 'games' ? 3 : 1),
                    life: 1,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    size: Math.random() * (theme === 'games' ? 3 : 2) + 1,
                    type: theme === 'games' ? 'square' : 'circle'
                });
            }

            // Limit total particles
            if (particles.current.length > 50) {
                particles.current.splice(0, particles.current.length - 50);
            }
        };

        const renderParticles = () => {
            // Check if canvas size matches window size to avoid expensive resize
            if (canvasRef.current.width !== window.innerWidth || canvasRef.current.height !== window.innerHeight) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }

            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            // Use a loop backwards to allow splicing
            for (let i = particles.current.length - 1; i >= 0; i--) {
                const p = particles.current[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.02;
                p.size *= 0.95;

                ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;

                if (p.type === 'square') {
                    ctx.fillRect(p.x, p.y, p.size, p.size);
                } else {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }

                if (p.life <= 0) {
                    particles.current.splice(i, 1);
                }
            }
        };

        const loop = () => {
            renderParticles();
            animationFrameId = requestAnimationFrame(loop);
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        loop();

        // Hover listeners
        const handleMouseOver = (e) => {
            const target = e.target;

            // Check for specific interactive elements
            if (target.matches('button, button *, a, a *')) {
                gsap.to(cursorRef.current, { scale: 1.5, backgroundColor: '#ffffff', duration: 0.2, overwrite: true });
            } else if (target.matches('img, .toy-card, .toy-card *')) {
                gsap.to(cursorRef.current, {
                    scale: 2.5,
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderColor: '#00f3ff',
                    borderStyle: 'solid',
                    duration: 0.2,
                    overwrite: true
                });
            } else {
                gsap.to(cursorRef.current, {
                    scale: 1,
                    backgroundColor: '#00f3ff',
                    duration: 0.2,
                    borderWidth: 0,
                    overwrite: true
                });
            }
        };

        // Use capture to ensure we catch events
        document.addEventListener('mouseover', handleMouseOver, { passive: true });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseover', handleMouseOver);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Separate effect for theme observation
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.id === 'hero') themeRef.current = 'hero';
                    else if (entry.target.id === 'products') themeRef.current = 'products';
                    else if (entry.target.id === 'games') themeRef.current = 'games';
                    else themeRef.current = 'default';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('section').forEach(sec => observer.observe(sec));

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[9998]" />
            {/* Inner Cursor - The sharp point */}
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-3 h-3 bg-toy-neonBlue rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_#00f3ff] mix-blend-screen will-change-transform" // Added will-change-transform
            />
        </>
    );
}
