import { Suspense, lazy, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import CategorySection from './components/CategorySection';
import Cart from './components/Cart';
import CustomCursor from './components/CustomCursor';
import Chatbot from './components/Chatbot';
import Toast from './components/ui/Toast';

// Lazy load heavy components — each has its own Suspense so they
// load/fail independently instead of blocking each other.
const GameZone = lazy(() => import('./components/GameZone'));
const FeaturedToys = lazy(() => import('./components/FeaturedToys'));
const ProductShowcase = lazy(() => import('./components/ProductShowcase'));
const RocketShowcase = lazy(() => import('./components/RocketShowcase'));
const StorySection = lazy(() => import('./components/StorySection'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center w-full h-96">
    <div className="w-12 h-12 border-4 border-toy-purple border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  const rafIdRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      duration: 2.0,
      smoothWheel: true,
      wheelMultiplier: 1.2,
    });

    function raf(time) {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }

    rafIdRef.current = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      <CustomCursor />
      <Header />
      <Hero />
      <CategorySection />

      <Suspense fallback={<LoadingSpinner />}><GameZone /></Suspense>
      <Suspense fallback={<LoadingSpinner />}><FeaturedToys /></Suspense>
      <Suspense fallback={<LoadingSpinner />}><ProductShowcase /></Suspense>
      <Suspense fallback={<LoadingSpinner />}><RocketShowcase /></Suspense>
      <Suspense fallback={<LoadingSpinner />}><StorySection /></Suspense>

      <Footer />
      <Cart />
      <Chatbot />
      {/* Global toast notifications */}
      <Toast />
    </div>
  );
}

export default App;
