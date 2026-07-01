'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useGSAP } from '@gsap/react';

export default function ProductShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // If reduced motion is active, do not animate (everything stays visible)
      return;
    }

    // Initialize hidden states
    gsap.set('.showcase-reveal', { opacity: 0, y: 30 });
    gsap.set('.product-card', { opacity: 0, y: 50, scale: 0.96 });
    gsap.set('.corner-bracket-tl', { opacity: 0, x: 4, y: 4 });
    gsap.set('.corner-bracket-tr', { opacity: 0, x: -4, y: 4 });
    gsap.set('.corner-bracket-bl', { opacity: 0, x: 4, y: -4 });
    gsap.set('.corner-bracket-br', { opacity: 0, x: -4, y: -4 });

    // 1. ScrollTrigger for the entire section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true, // Fire once only
      }
    });

    // 2. Header block (eyebrow, headline, body paragraph) animations
    tl.to('.showcase-reveal', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.1,
    });

    // 3. Product cards staggered enter animation
    tl.to('.product-card', {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.15,
    }, '-=0.4'); // Start slightly before header finishes

    // 4. Corner brackets on each product card animate independently after their parent card
    // Top-Left bracket
    tl.to('.corner-bracket-tl', {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.15,
    }, '-=0.6');

    // Top-Right bracket
    tl.to('.corner-bracket-tr', {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.15,
    }, '-=0.6');

    // Bottom-Left bracket
    tl.to('.corner-bracket-bl', {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.15,
    }, '-=0.6');

    // Bottom-Right bracket
    tl.to('.corner-bracket-br', {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.15,
    }, '-=0.6');

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative z-30 bg-white py-24 md:py-32 w-full text-black select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Top Content Block — Asymmetric Two-Column Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-12">
          {/* Left Column: Eyebrow + Headline */}
          <div className="md:w-[55%] flex flex-col items-start">
            <span className="showcase-reveal text-[#888888] text-[13px] font-sans tracking-normal font-medium mb-3">
              Notre collection
            </span>
            <h2 className="showcase-reveal text-[#0A0A0A] font-sans font-bold text-[clamp(32px,4vw,48px)] leading-[1.2] tracking-tight">
              Conçu pour durer.<br />
              Taillé pour impressionner.
            </h2>
          </div>

          {/* Right Column: Body Paragraph */}
          <div className="md:w-[35%] pt-1 md:pt-11 flex justify-start">
            <p className="showcase-reveal text-[#999999] text-[13px] leading-[1.6] max-w-[280px] font-sans">
              Chaque pièce NEXIFORM est confectionnée avec des tissus premium résistants à l'usure intensive. Du tissage à la broderie finale, chaque détail répond aux exigences des professionnels marocains les plus exigeants.
            </p>
          </div>
        </div>

        {/* Product Grid — Two Columns */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-16 mt-16 md:mt-24">
          
          {/* Product 1: Polo corporate Atlas */}
          <div className="product-card flex flex-col">
            <div className="relative aspect-[4/3] w-full rounded-sm bg-[radial-gradient(circle_at_center,_#F5F5F5_0%,_#FAFAFA_100%)] flex items-center justify-center overflow-hidden p-8 border border-neutral-100">
              {/* Four corner-bracket decorations */}
              <div className="corner-bracket-tl absolute top-4 left-4 w-6 h-6 border-t-[1.5px] border-l-[1.5px] border-[#D4D4D4]" />
              <div className="corner-bracket-tr absolute top-4 right-4 w-6 h-6 border-t-[1.5px] border-r-[1.5px] border-[#D4D4D4]" />
              <div className="corner-bracket-bl absolute bottom-4 left-4 w-6 h-6 border-b-[1.5px] border-l-[1.5px] border-[#D4D4D4]" />
              <div className="corner-bracket-br absolute bottom-4 right-4 w-6 h-6 border-b-[1.5px] border-r-[1.5px] border-[#D4D4D4]" />
              
              {/* Soft elliptical studio shadow beneath product */}
              <div className="absolute top-[82%] left-1/2 -translate-x-1/2 w-44 h-4 bg-black/[0.06] blur-[10px] rounded-[100%] z-0" />
              
              {/* Product Image */}
              <img
                src="/src/assets/images/polo_atlas_1782819847872.jpg"
                alt="Polo corporate Atlas NEXIFORM, secteurs hôtellerie et sécurité"
                className="relative z-10 w-[60%] md:w-[55%] h-auto object-contain transition-transform duration-500 hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Product Label Block */}
            <div className="mt-5 flex flex-col items-start">
              <h3 className="text-[#0A0A0A] font-semibold text-[15px] font-sans">
                Polo corporate Atlas
              </h3>
              <span className="text-[#888888] text-[12px] uppercase tracking-[0.06em] font-sans mt-1">
                Hôtellerie · Corporate · Sécurité
              </span>
            </div>
          </div>

          {/* Product 2: Veste de chef Prestige */}
          <div className="product-card flex flex-col">
            <div className="relative aspect-[4/3] w-full rounded-sm bg-[radial-gradient(circle_at_center,_#F5F5F5_0%,_#FAFAFA_100%)] flex items-center justify-center overflow-hidden p-8 border border-neutral-100">
              {/* Four corner-bracket decorations */}
              <div className="corner-bracket-tl absolute top-4 left-4 w-6 h-6 border-t-[1.5px] border-l-[1.5px] border-[#D4D4D4]" />
              <div className="corner-bracket-tr absolute top-4 right-4 w-6 h-6 border-t-[1.5px] border-r-[1.5px] border-[#D4D4D4]" />
              <div className="corner-bracket-bl absolute bottom-4 left-4 w-6 h-6 border-b-[1.5px] border-l-[1.5px] border-[#D4D4D4]" />
              <div className="corner-bracket-br absolute bottom-4 right-4 w-6 h-6 border-b-[1.5px] border-r-[1.5px] border-[#D4D4D4]" />
              
              {/* Soft elliptical studio shadow beneath product */}
              <div className="absolute top-[82%] left-1/2 -translate-x-1/2 w-44 h-4 bg-black/[0.06] blur-[10px] rounded-[100%] z-0" />
              
              {/* Product Image */}
              <img
                src="/src/assets/images/chef_prestige_1782819861496.jpg"
                alt="Veste de chef Prestige NEXIFORM, secteur restauration"
                className="relative z-10 w-[60%] md:w-[55%] h-auto object-contain transition-transform duration-500 hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Product Label Block */}
            <div className="mt-5 flex flex-col items-start">
              <h3 className="text-[#0A0A0A] font-semibold text-[15px] font-sans">
                Veste de chef Prestige
              </h3>
              <span className="text-[#888888] text-[12px] uppercase tracking-[0.06em] font-sans mt-1">
                Restauration · Hôtellerie
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
