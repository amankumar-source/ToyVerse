import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Lightweight event-based toast — no store or context needed.
// Usage anywhere in the app: import { toast } from './ui/Toast'
export function toast(message, type = 'info', duration = 3500) {
    window.dispatchEvent(
        new CustomEvent('toyverse:toast', { detail: { message, type, duration, id: Date.now() } })
    );
}

export default function Toast() {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    useEffect(() => {
        const handler = (e) => {
            const { id, message, type, duration } = e.detail;
            setToasts((prev) => [...prev, { id, message, type }]);
            setTimeout(() => removeToast(id), duration);
        };
        window.addEventListener('toyverse:toast', handler);
        return () => window.removeEventListener('toyverse:toast', handler);
    }, [removeToast]);

    const bgMap = {
        info: 'bg-toy-dark border-toy-neonBlue/50',
        success: 'bg-emerald-900 border-emerald-400/50',
        warning: 'bg-yellow-900 border-yellow-400/50',
        error: 'bg-red-900 border-red-500/50',
    };

    const iconMap = {
        info: '💡',
        success: '🚀',
        warning: '⚡',
        error: '❌',
    };

    return (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[99999] flex flex-col items-center gap-3 pointer-events-none">
            <AnimatePresence>
                {toasts.map((t) => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className={`flex items-center gap-3 px-5 py-3 rounded-full border backdrop-blur-md shadow-xl text-white text-sm font-bold max-w-xs text-center ${bgMap[t.type] || bgMap.info}`}
                    >
                        <span>{iconMap[t.type] || iconMap.info}</span>
                        <span>{t.message}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
