import { useState, useEffect } from 'react';
import Preloader from './components/Preloader';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductShowcase from './components/ProductShowcase';
import ProfessionalShowcase from './components/ProfessionalShowcase';
import BrandCommitment from './components/BrandCommitment';
import InteractiveCampaign from './components/InteractiveCampaign';
import StyleOutlookSection from './components/home/StyleOutlookSection';
import StorePage from './components/store/StorePage';
import ProductDetailPage from './components/store/ProductDetailPage';
import AboutPage from './components/AboutPage';
import CartDrawer from './components/store/CartDrawer';
import BonCommandeModal from './components/store/BonCommandeModal';
import AdminDashboard from './components/admin/AdminDashboard';
import Footer from './components/Footer';

export default function App() {
  const [preloaded, setPreloaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBonCommandeOpen, setIsBonCommandeOpen] = useState(false);
  
  // High fidelity SPA routing state based on URL hash
  const [route, setRoute] = useState<{ name: 'home' | 'store' | 'product-detail' | 'about' | 'admin'; slug: string | null }>(() => {
    if (typeof window === 'undefined') return { name: 'home', slug: null };
    const hashWithQuery = window.location.hash;
    const hash = hashWithQuery.split('?')[0];
    if (hash.startsWith('#/store/')) {
      return { name: 'product-detail', slug: hash.replace('#/store/', '') };
    }
    if (hash === '#/store') {
      return { name: 'store', slug: null };
    }
    if (hash === '#/about') {
      return { name: 'about', slug: null };
    }
    if (hash === '#/admin') {
      return { name: 'admin', slug: null };
    }
    return { name: 'home', slug: null };
  });

  // Handle custom events (like opening the cart drawer from header or details)
  useEffect(() => {
    const handleOpenCart = () => {
      setIsCartOpen(true);
    };
    const handleOpenBonCommande = () => {
      setIsBonCommandeOpen(true);
    };
    window.addEventListener('open_nexiform_cart', handleOpenCart);
    window.addEventListener('open_nexiform_bon_commande', handleOpenBonCommande);
    return () => {
      window.removeEventListener('open_nexiform_cart', handleOpenCart);
      window.removeEventListener('open_nexiform_bon_commande', handleOpenBonCommande);
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hashWithQuery = window.location.hash;
      const hash = hashWithQuery.split('?')[0];
      if (hash.startsWith('#/store/')) {
        setRoute({ name: 'product-detail', slug: hash.replace('#/store/', '') });
      } else if (hash === '#/store') {
        setRoute({ name: 'store', slug: null });
      } else if (hash === '#/about') {
        setRoute({ name: 'about', slug: null });
      } else if (hash === '#/admin') {
        setRoute({ name: 'admin', slug: null });
      } else {
        setRoute({ name: 'home', slug: null });
      }
      
      // Instantly scroll to top when changing views
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Trigger initial route match if any hash already exists on load
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="bg-[#0A0E1A] min-h-screen text-white relative font-sans overflow-x-hidden">
      {/* Brand Preloader Overlay */}
      <Preloader onComplete={() => setPreloaded(true)} />

      {/* Transparent Scroll-Aware Fixed Header */}
      {route.name !== 'admin' && <Header preloaded={preloaded} />}

      {/* Conditional view rendering */}
      {route.name === 'home' && (
        <>
          {/* Full-Viewport Hero Section */}
          <Hero preloaded={preloaded} />

          {/* Premium Product Showcase Section */}
          <ProductShowcase />

          {/* Professional Showcase Section with Horizontal GSAP Scroll-Trigger */}
          <ProfessionalShowcase />

          {/* High-Converting Brand Commitment Campaign Section */}
          <BrandCommitment />

          {/* Highly Interactive GSAP Pinned Cinematic Campaign Section */}
          <InteractiveCampaign />

          {/* Style Outlook Premium Section with GSAP scroll animation */}
          <StyleOutlookSection />
        </>
      )}

      {route.name === 'store' && (
        <StorePage />
      )}

      {route.name === 'product-detail' && route.slug && (
        <ProductDetailPage slug={route.slug} />
      )}

      {route.name === 'about' && (
        <AboutPage />
      )}

      {route.name === 'admin' && (
        <AdminDashboard />
      )}

      {/* Global B2B Cart Drawer overlay */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Global Bon de Commande form overlay */}
      <BonCommandeModal isOpen={isBonCommandeOpen} onClose={() => setIsBonCommandeOpen(false)} />

      {/* Sleek Minimalist Footer */}
      {route.name !== 'admin' && (
        <Footer />
      )}
    </div>
  );
}
