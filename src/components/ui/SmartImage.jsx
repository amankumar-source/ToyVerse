import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToyPlaceholder from './ToyPlaceholder';

export default function SmartImage({ src, alt, className, containerClassName = "" }) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.01, rootMargin: '100px' } // Lower threshold and larger margin for earlier loading
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    const handleError = (e) => {
        console.error(`Failed to load image: ${src}`, e);
        setIsLoading(false);
        setHasError(true);
    };

    return (
        <div ref={containerRef} className={`relative overflow-hidden bg-toy-dark/50 ${containerClassName}`}>
            <AnimatePresence mode="wait">
                {/* Loading Skeleton */}
                {isLoading && (
                    <motion.div
                        key="loader"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 z-20 bg-gray-800 animate-pulse"
                    />
                )}

                {/* Error State - Custom Placeholder */}
                {hasError && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 z-10"
                    >
                        <ToyPlaceholder className={className} />
                    </motion.div>
                )}

                {/* Actual Image */}
                {!hasError && isInView && (
                    <motion.img
                        key="image"
                        ref={imgRef}
                        src={src}
                        alt={alt}
                        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
                        onLoad={handleLoad}
                        onError={handleError}
                        loading="lazy"
                        decoding="async"
                        crossOrigin="anonymous"
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{
                            opacity: isLoading ? 0 : 1,
                            scale: isLoading ? 1.05 : 1
                        }}
                        transition={{ duration: 0.5 }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
