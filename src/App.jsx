import { Suspense, lazy, useEffect } from 'react';
import Lenis from 'lenis';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import CategorySection from './components/CategorySection';
import Cart from './components/Cart';
import CustomCursor from './components/CustomCursor';
import Chatbot from './components/Chatbot';

// Lazy loading heavy components
const RocketShowcase = lazy(() => import('./components/RocketShowcase'));
const FeaturedToys = lazy(() => import('./components/FeaturedToys'));
const ProductShowcase = lazy(() => import('./components/ProductShowcase'));
const GameZone = lazy(() => import('./components/GameZone'));
const StorySection = lazy(() => import('./components/StorySection'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center w-full h-96">
    <div className="w-12 h-12 border-4 border-toy-purple border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      duration: 2.0,
      smoothWheel: true,
      wheelMultiplier: 1.2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      <CustomCursor />
      <Header />
      <Hero />
      <CategorySection />

      <Suspense fallback={<LoadingSpinner />}>
        <GameZone />
        <FeaturedToys />
        <ProductShowcase />
        <RocketShowcase />
        <StorySection />
      </Suspense>

      <Footer />

      <Cart />
      <Chatbot />
    </div>
  );
}

export default App;
