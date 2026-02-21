import { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function TiltCard({ children, className = "" }) {
    const ref = useRef(null);
    const rafRef = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

    // Cache the last event coords so rAF can read them without closure issues
    const pendingX = useRef(0);
    const pendingY = useRef(0);

    const handleMouseMove = useCallback((e) => {
        pendingX.current = e.clientX;
        pendingY.current = e.clientY;

        // Throttle getBoundingClientRect + motion value updates to once per frame
        if (rafRef.current) return;
        rafRef.current = requestAnimationFrame(() => {
            if (!ref.current) { rafRef.current = null; return; }
            const rect = ref.current.getBoundingClientRect();
            const xPct = (pendingX.current - rect.left) / rect.width - 0.5;
            const yPct = (pendingY.current - rect.top) / rect.height - 0.5;
            x.set(xPct);
            y.set(yPct);
            rafRef.current = null;
        });
    }, [x, y]);

    const handleMouseLeave = useCallback(() => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        x.set(0);
        y.set(0);
    }, [x, y]);

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className={`relative ${className}`}
        >
            {children}
        </motion.div>
    );
}
