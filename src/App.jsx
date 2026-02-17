import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import CategorySection from './components/CategorySection';
import ProductShowcase from './components/ProductShowcase';
import FeaturedToys from './components/FeaturedToys';
import StorySection from './components/StorySection';
import GameZone from './components/GameZone';
import Cart from './components/Cart';
import CustomCursor from './components/CustomCursor';
import Chatbot from './components/Chatbot';


function App() {
  return (
    <div className="relative min-h-screen">
      <CustomCursor />
      <Header />
      <Hero />
      <CategorySection />
      <GameZone />
      <FeaturedToys />
      <ProductShowcase />
      <StorySection />

      <Footer />

      <Cart />
      <Chatbot />
    </div>
  );
}

export default App;
