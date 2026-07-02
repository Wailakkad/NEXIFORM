import React, { useRef, useState, useEffect } from 'react';
import { gsap } from '../lib/gsap';
import { useGSAP } from '@gsap/react';
import { ShoppingBag } from 'lucide-react';
import { getInitialCartState, CART_UPDATE_EVENT } from '../lib/cartStore';

interface HeaderProps {
  preloaded: boolean;
}

export default function Header({ preloaded }: HeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentHash, setCurrentHash] = useState(() => typeof window !== 'undefined' ? window.location.hash : '');
  const [cartCount, setCartCount] = useState(0);

  // Load initial cart count and listen to updates
  useEffect(() => {
    const updateCount = () => {
      const state = getInitialCartState();
      setCartCount(state.totalQuantity);
    };
    updateCount();
    window.addEventListener(CART_UPDATE_EVENT, updateCount);
    return () => window.removeEventListener(CART_UPDATE_EVENT, updateCount);
  }, []);

  // Track scrolling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track route changes
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isLightView = currentHash.startsWith('#/store') || currentHash === '#/about';

  useGSAP(() => {
    if (!preloaded) {
      gsap.set(headerRef.current, { opacity: 0, y: -20 });
      return;
    }

    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        delay: 0.1,
      }
    );
  }, { dependencies: [preloaded], scope: headerRef });

  const navLinks = [
    { label: 'Accueil', href: '#/' },
    { label: 'Boutique B2B', href: '#/store' },
    { label: 'À Propos', href: '#/about' },
    { label: 'Secteurs', href: '#/about' },
    { label: 'Contact', href: '#/about' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, label: string) => {
    if (href === '#/bon-commande') {
      e.preventDefault();
      window.dispatchEvent(new Event('open_nexiform_bon_commande'));
      return;
    }
    if (href === '#/') {
      return;
    }
    if (href === '#/store') {
      return;
    }

    if (href === '#/about') {
      if (window.location.hash === '#/about') {
        e.preventDefault();
        let targetId = '';
        if (label === 'Secteurs') targetId = 'secteurs-detail';
        if (label === 'Contact') targetId = 'contact-portal';
        
        if (targetId) {
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        if (label === 'Secteurs' || label === 'Contact') {
          const targetId = label === 'Secteurs' ? 'secteurs-detail' : 'contact-portal';
          sessionStorage.setItem('scroll_target', targetId);
        }
      }
    }
  };

  const handleOpenCart = () => {
    window.dispatchEvent(new Event('open_nexiform_cart'));
  };

  // Determine styles dynamically for maximum visual polish
  const headerBgClass = isScrolled
    ? isLightView
      ? 'bg-white/90 backdrop-blur-md border-b border-neutral-100 shadow-sm'
      : 'bg-[#0A0E1A]/90 backdrop-blur-md border-b border-white/5 shadow-lg shadow-[#000000]/20'
    : 'bg-transparent border-b border-transparent';

  const logoColorClass = isLightView
    ? 'text-[#0F172A]'
    : 'text-white';

  const linkColorClass = (isActive: boolean) => {
    if (isLightView) {
      return isActive 
        ? 'text-[#3B82F6] font-bold' 
        : 'text-neutral-500 hover:text-black';
    } else {
      return isActive
        ? 'text-white font-bold'
        : 'text-white/65 hover:text-white';
    }
  };

  const actionButtonClass = isLightView
    ? 'text-xs font-semibold uppercase tracking-[0.06em] text-white bg-[#0F172A] hover:bg-[#1E293B] rounded-full px-5 py-2.5 transition-all duration-300 shadow-sm shadow-black/10'
    : 'text-xs font-semibold uppercase tracking-[0.06em] text-[#3B82F6] border border-[#3B82F6]/50 rounded px-5 py-2.5 transition-all duration-300 hover:bg-[#3B82F6] hover:text-white';

  const bonCommandeClass = isLightView
    ? 'hidden lg:inline-block text-xs font-semibold uppercase tracking-[0.06em] text-neutral-600 border border-neutral-200 hover:border-black rounded-full px-5 py-2.5 transition-all duration-300'
    : 'hidden lg:inline-block text-xs font-semibold uppercase tracking-[0.06em] text-white/85 border border-white/10 hover:border-white/50 rounded px-5 py-2.5 transition-all duration-300';

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${headerBgClass}`}
      style={{ pointerEvents: preloaded ? 'auto' : 'none' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand logo */}
        <a 
          href="#/" 
          className={`text-xl md:text-2xl font-bold tracking-[0.18em] font-sans select-none flex items-center gap-1 transition-colors duration-300 ${logoColorClass}`}
        >
          <span>NEX</span>
          <span className="text-[#3B82F6]">I</span>
          <span>FORM</span>
        </a>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-10">
          {navLinks.map((link) => {
            const isLinkActive = 
              (link.href === '#/' && currentHash === '#/') ||
              (link.href === '#/store' && currentHash.startsWith('#/store')) ||
              (link.href === '#/about' && currentHash === '#/about');

            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href, link.label)}
                className={`text-xs uppercase tracking-[0.06em] transition-colors duration-200 font-medium font-sans ${linkColorClass(isLinkActive)}`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {/* Shopping Cart button with active animation badge */}
          <button
            onClick={handleOpenCart}
            className={`relative p-2.5 rounded-full border transition-all duration-300 flex items-center justify-center ${
              isLightView
                ? 'border-neutral-200 hover:bg-neutral-100 text-neutral-800'
                : 'border-white/10 hover:bg-white/5 text-white'
            }`}
            title="Consulter le panier"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#3B82F6] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-md animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => window.dispatchEvent(new Event('open_nexiform_bon_commande'))}
            className={bonCommandeClass}
          >
            Bon de Commande
          </button>

          <a
            href="#/store"
            className={actionButtonClass}
          >
            Boutique
          </a>
        </div>
      </div>
    </header>
  );
}
