'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useGSAP } from '@gsap/react';
import { ArrowRight, BookOpen, CheckCircle } from 'lucide-react';

export default function BrandCommitment() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(null);
  const cardRightRef = useRef<HTMLDivElement>(null);
  const cardLeftRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Set initial hidden states
    gsap.set(cardRightRef.current, { opacity: 0, x: 50, scale: 0.95 });
    gsap.set(cardLeftRef.current, { opacity: 0, x: -50, scale: 0.95 });
    gsap.set(bgImageRef.current, { scale: 1.05 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
        once: true,
      }
    });

    // Subtly zoom out background image
    tl.to(bgImageRef.current, {
      scale: 1,
      duration: 1.5,
      ease: 'power2.out',
    }, 0);

    // Fade and slide in cards
    tl.to(cardRightRef.current, {
      opacity: 1,
      x: 0,
      scale: 1,
      duration: 0.8,
      ease: 'power3.out',
    }, 0.2);

    tl.to(cardLeftRef.current, {
      opacity: 1,
      x: 0,
      scale: 1,
      duration: 0.8,
      ease: 'power3.out',
    }, 0.3);

  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative z-30 w-full h-[650px] md:h-[800px] overflow-hidden select-none bg-[#0A0E1A] flex items-center justify-center border-t border-white/5"
    >
      {/* Background Image: Configured to cover the layout and handle responsiveness */}
      <img
        ref={bgImageRef}
        src="https://res.cloudinary.com/dhkyla1rv/image/upload/v1782820352/ChatGPT_Image_30_juin_2026_12_52_16.png"
        alt="NEXIFORM Premium Workwear Campaign Morocco"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
        referrerPolicy="no-referrer"
      />

      {/* Deep Overlay for rich contrast and seamless integration with the dark site layout */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A]/50 via-transparent to-[#0A0E1A]/35 z-10 pointer-events-none" />

      <div className="relative z-20 w-full h-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex flex-col justify-between py-16 md:py-24 pointer-events-none">
        
        {/* Top-Right Content Card: Perfectly positioned to cover placeholder text and convert */}
        <div className="self-end w-full md:w-[380px] mt-4 md:mt-0 pointer-events-auto">
          <div
            ref={cardRightRef}
            className="bg-[#0A0E1A]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl"
          >
            <span className="text-[#3B82F6] text-[11px] font-mono tracking-wider uppercase font-bold flex items-center gap-1.5 mb-3">
              <CheckCircle className="w-3.5 h-3.5" /> Excellence Opérationnelle
            </span>
            <h3 className="text-white text-xl md:text-2xl font-sans font-bold tracking-tight mb-4">
              Rejoignez les leaders du marché
            </h3>
            <p className="text-white/60 text-xs md:text-sm leading-relaxed font-sans font-normal">
              Faites le choix de l'excellence pour vos équipes au Maroc. Nos pièces haut de gamme renforcent le sentiment d'appartenance tout en garantissant un confort absolu au quotidien.
            </p>
          </div>
        </div>

        {/* Bottom-Left Content Card with Premium Explore Catalog Call-to-Action */}
        <div className="self-start w-full md:w-[420px] mb-4 md:mb-0 pointer-events-auto">
          <div
            ref={cardLeftRef}
            className="bg-[#0A0E1A]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl"
          >
            <span className="text-[#10B981] text-[11px] font-mono tracking-wider uppercase font-bold flex items-center gap-1.5 mb-3">
              <BookOpen className="w-3.5 h-3.5" /> Identité & Marque
            </span>
            <h3 className="text-white text-xl md:text-2xl font-sans font-bold tracking-tight mb-4">
              Votre image, notre engagement unique
            </h3>
            <p className="text-white/60 text-xs md:text-sm leading-relaxed font-sans mb-6">
              Chaque logo est numérisé, optimisé puis brodé avec un relief saisissant dans nos ateliers pour offrir une finition digne des plus grands standards internationaux.
            </p>

            {/* CTA Button: Sleek, high-converting option to explore full catalog */}
            <a
              href="#/store"
              className="group flex items-center justify-between bg-white hover:bg-neutral-100 text-black h-12 px-5 rounded-xl font-sans text-xs font-bold tracking-wider uppercase transition-all duration-300"
            >
              <span>Explorer notre catalogue</span>
              <div className="w-7 h-7 rounded-lg bg-[#3B82F6] text-white flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="w-4 h-4" />
              </div>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
