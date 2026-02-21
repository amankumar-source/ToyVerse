import { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Uses motion values + style prop instead of animate + state.
// This means position updates bypass React re-renders entirely —
// Framer Motion drives the DOM directly, running at display frame rate.
export default function MagneticButton({ children, className = "", onClick }) {
    const ref = useRef(null);
    const rafRef = useRef(null);

    // Raw motion values (no re-renders)
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Spring-smoothed values — same physics as before
    const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
    const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

    // Cache last coords so the rAF callback can read them
    const pendingX = useRef(0);
    const pendingY = useRef(0);

    const handleMouse = useCallback((e) => {
        pendingX.current = e.clientX;
        pendingY.current = e.clientY;

        // Throttle getBoundingClientRect to once per animation frame
        if (rafRef.current) return;
        rafRef.current = requestAnimationFrame(() => {
            if (!ref.current) { rafRef.current = null; return; }
            const { left, top, width, height } = ref.current.getBoundingClientRect();
            x.set((pendingX.current - (left + width / 2)) * 0.3);
            y.set((pendingY.current - (top + height / 2)) * 0.3);
            rafRef.current = null;
        });
    }, [x, y]);

    const reset = useCallback(() => {
        if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
        x.set(0);
        y.set(0);
    }, [x, y]);

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            onClick={onClick}
            style={{ x: springX, y: springY }}
            className={`relative overflow-hidden group ${className}`}
        >
            <span className="relative z-10">{children}</span>
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0 rounded-full" />
        </motion.button>
    );
}
