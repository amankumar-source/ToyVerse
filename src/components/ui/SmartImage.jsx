import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ToyPlaceholder from "./ToyPlaceholder";

export default function SmartImage({
  src,
  alt,
  className = "",
  containerClassName = "",
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const containerRef = useRef(null);
  const observerRef = useRef(null);

  // Reset state when src changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  // Lazy load using IntersectionObserver
  useEffect(() => {
    if (!containerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observerRef.current.disconnect();
        }
      },
      {
        threshold: 0.01,
        rootMargin: "100px",
      }
    );

    observerRef.current.observe(containerRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // ✅ SAFE ERROR HANDLER (No Infinite Loop)
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-toy-dark/50 ${containerClassName}`}
    >
      <AnimatePresence>
        {/* Loading Skeleton */}
        {isLoading && !hasError && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-20 bg-gray-800 animate-pulse"
          />
        )}

        {/* Error Placeholder */}
        {hasError && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10"
          >
            <ToyPlaceholder className={className} />
          </motion.div>
        )}

        {/* Image */}
        {!hasError && isInView && (
          <motion.img
            key="image"
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
            decoding="async"
            className={`${className} transition-opacity duration-500 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{
              opacity: isLoading ? 0 : 1,
              scale: isLoading ? 1.05 : 1,
            }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
