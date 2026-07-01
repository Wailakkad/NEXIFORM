'use client';

import React, { useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useGSAP } from '@gsap/react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ChevronUp, 
  Check, 
  Send,
  Linkedin,
  Instagram,
  MessageSquare
} from 'lucide-react';

export default function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);
  const col4Ref = useRef<HTMLDivElement>(null);
  const newsletterRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // GSAP ScrollTrigger Scroll Animation
  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Set initial state
    const elements = [
      col1Ref.current,
      col2Ref.current,
      col3Ref.current,
      col4Ref.current,
      newsletterRef.current
    ];

    gsap.set(elements, { opacity: 0, y: 30 });
    gsap.set(bottomBarRef.current, { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        once: true,
      }
    });

    tl.to(elements, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
    });

    tl.to(bottomBarRef.current, {
      opacity: 1,
      duration: 0.6,
      ease: 'power1.out'
    }, '-=0.4');

  }, { scope: containerRef });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubscribed) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      setEmail('');
    }, 1200);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer 
      ref={containerRef}
      id="contact" 
      className="relative z-30 bg-[#060A14] border-t border-white/5 pt-20 pb-10 select-none overflow-hidden font-sans text-white"
    >
      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Intro Column */}
          <div ref={col1Ref} className="lg:col-span-2 flex flex-col items-start gap-5">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-[0.25em] text-white">
                NEXI<span className="text-[#3B82F6]">FORM</span>
              </span>
              <span className="h-4 w-[1px] bg-white/10" />
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#3B82F6] font-semibold bg-[#3B82F6]/10 px-2 py-0.5 rounded">
                Atelier Maroc
              </span>
            </div>
            
            <p className="text-white/45 text-sm leading-relaxed max-w-sm">
              L'uniforme de prestige par excellence au Maroc. Nous concevons des tenues professionnelles sur-mesure de qualité supérieure pour valoriser votre image de marque et assurer un confort thermique et ergonomique d'exception au quotidien.
            </p>

            {/* Social Handles */}
            <div className="flex items-center gap-3 mt-2">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#3B82F6] hover:text-white text-white/50 flex items-center justify-center transition-all duration-300"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#3B82F6] hover:text-white text-white/50 flex items-center justify-center transition-all duration-300"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://wa.me/212661000000" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#25D366] hover:text-white text-white/50 flex items-center justify-center transition-all duration-300"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Secteurs Column */}
          <div ref={col2Ref} className="flex flex-col items-start gap-4">
            <h4 className="text-xs uppercase font-mono tracking-widest text-white/80 font-bold border-b border-white/10 pb-2 w-full">
              Nos Secteurs
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <a href="#/store" className="text-white/40 hover:text-[#3B82F6] transition-colors duration-200 flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-[#3B82F6] transition-all" />
                  Médical & Cliniques
                </a>
              </li>
              <li>
                <a href="#/store" className="text-white/40 hover:text-[#3B82F6] transition-colors duration-200 flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-[#3B82F6] transition-all" />
                  Hôtellerie & Services
                </a>
              </li>
              <li>
                <a href="#/store" className="text-white/40 hover:text-[#3B82F6] transition-colors duration-200 flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-[#3B82F6] transition-all" />
                  Restauration & Cuisine
                </a>
              </li>
              <li>
                <a href="#/store" className="text-white/40 hover:text-[#3B82F6] transition-colors duration-200 flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-[#3B82F6] transition-all" />
                  Sécurité & Équipements
                </a>
              </li>
            </ul>
          </div>

          {/* L'Atelier Column */}
          <div ref={col3Ref} className="flex flex-col items-start gap-4">
            <h4 className="text-xs uppercase font-mono tracking-widest text-white/80 font-bold border-b border-white/10 pb-2 w-full">
              L'Atelier
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <a href="#/about" className="text-white/40 hover:text-[#3B82F6] transition-colors duration-200 flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-[#3B82F6] transition-all" />
                  Sur-Mesure & Broderie
                </a>
              </li>
              <li>
                <a href="#/about" className="text-white/40 hover:text-[#3B82F6] transition-colors duration-200 flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-[#3B82F6] transition-all" />
                  Qualité & Tissus Premium
                </a>
              </li>
              <li>
                <a href="#/about" className="text-white/40 hover:text-[#3B82F6] transition-colors duration-200 flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-[#3B82F6] transition-all" />
                  Notre Engagement RSE
                </a>
              </li>
              <li>
                <a href="#/about" className="text-white/40 hover:text-[#3B82F6] transition-colors duration-200 flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-[#3B82F6] transition-all" />
                  Notre Histoire
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div ref={col4Ref} className="flex flex-col items-start gap-4">
            <h4 className="text-xs uppercase font-mono tracking-widest text-white/80 font-bold border-b border-white/10 pb-2 w-full">
              Nous Contacter
            </h4>
            <div className="flex flex-col gap-4 text-xs md:text-sm text-white/40">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                <span>Boulevard d'Anfa, Showroom Privé, Casablanca, Maroc</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#3B82F6] shrink-0" />
                <span>+212 (0) 522 45 88 90</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#3B82F6] shrink-0" />
                <span>b2b@nexiform.ma</span>
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#3B82F6]/80 bg-[#3B82F6]/5 p-2 rounded border border-[#3B82F6]/10 w-full text-center mt-1">
                Lun - Ven: 9h00 - 18h30
              </div>
            </div>
          </div>

        </div>

        {/* Newsletter Section */}
        <div 
          ref={newsletterRef}
          className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row justify-between items-center gap-8 mb-16"
        >
          <div className="flex flex-col items-start gap-2 text-center lg:text-left max-w-md">
            <h4 className="text-lg font-bold tracking-tight text-white">
              S'abonner à la Lettre d'Excellence
            </h4>
            <p className="text-white/45 text-sm">
              Restez informé de nos nouveaux lancements, nouvelles étoffes de prestige et actualités professionnelles au Maroc.
            </p>
          </div>

          <div className="w-full max-w-md">
            <form onSubmit={handleSubscribe} className="relative flex items-center w-full">
              <input
                type="email"
                required
                disabled={isSubscribed || isSubmitting}
                placeholder={isSubscribed ? "Abonnement enregistré !" : "Votre adresse e-mail professionnelle"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full h-12 bg-[#0A0E1A]/60 border rounded-full px-5 pr-14 text-sm font-sans focus:outline-none focus:ring-1 transition-all duration-300 ${
                  isSubscribed 
                    ? 'border-emerald-500/40 text-emerald-400 placeholder-emerald-400/60 bg-emerald-500/5' 
                    : 'border-white/10 text-white placeholder-white/20 focus:border-[#3B82F6] focus:ring-[#3B82F6]/35'
                }`}
              />
              <button
                type="submit"
                disabled={isSubscribed || isSubmitting || !email}
                className={`absolute right-1.5 top-1.5 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isSubscribed 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-[#3B82F6] text-white hover:bg-blue-600 active:scale-95 disabled:opacity-40 disabled:pointer-events-none'
                }`}
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isSubscribed ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
            </form>
            {isSubscribed && (
              <p className="text-emerald-400 text-xs mt-2.5 text-center lg:text-left font-medium animate-pulse">
                Merci ! Votre e-mail a été enregistré dans notre registre de prestige.
              </p>
            )}
          </div>
        </div>

        {/* Separator */}
        <div className="w-full h-[1px] bg-white/5 mb-8" />

        {/* Bottom copyright details and back-to-top */}
        <div ref={bottomBarRef} className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-3 text-xs text-white/30 text-center md:text-left">
            <span>© 2026 NEXIFORM. Tous droits réservés.</span>
            <span className="hidden md:inline h-3 w-[1px] bg-white/10" />
            <a href="#/about" className="hover:text-white transition-colors">Politique de Confidentialité</a>
            <span className="hidden md:inline h-3 w-[1px] bg-white/10" />
            <a href="#/about" className="hover:text-white transition-colors">Conditions Générales de Vente (CGV)</a>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[11px] font-mono text-white/20 select-none hidden lg:inline">
              Fait avec passion à Casablanca pour le Maroc.
            </span>
            
            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              className="group h-9 px-4 rounded-full border border-white/5 hover:border-[#3B82F6] hover:bg-[#3B82F6]/5 bg-white/[0.02] text-xs font-semibold text-white/50 hover:text-white flex items-center gap-2 transition-all duration-300"
            >
              <span>Retour en haut</span>
              <div className="w-5 h-5 rounded-full bg-white/5 group-hover:bg-[#3B82F6]/20 flex items-center justify-center transition-colors">
                <ChevronUp className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
              </div>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
