'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useGSAP } from '@gsap/react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CapsulesCollection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Header reveal
    gsap.fromTo(
      '.capsule-header-reveal',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 80%',
          once: true,
        },
      }
    );

    // Grid cards staggered reveal
    gsap.fromTo(
      '.capsule-card',
      { opacity: 0, y: 50, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 75%',
          once: true,
        },
      }
    );

    // Subtle parallax shift on image components inside cards
    gsap.utils.toArray<HTMLElement>('.capsule-parallax-img').forEach((img) => {
      gsap.to(img, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative z-30 bg-white py-24 md:py-32 w-full text-black select-none overflow-hidden border-t border-neutral-100"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Asymmetric Two-Column Header (Exactly mimicking the screenshot layout logic) */}
        <div ref={headerRef} className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-12 mb-16 md:mb-24">
          {/* Left Column: Eyebrow + Headline */}
          <div className="md:w-[55%] flex flex-col items-start">
            <span className="capsule-header-reveal text-[#888888] text-[13px] font-sans tracking-normal font-medium mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" /> Les Collections
            </span>
            <h2 className="capsule-header-reveal text-[#0A0A0A] font-sans font-bold text-[clamp(32px,4vw,48px)] leading-[1.2] tracking-tight">
              L'excellence, dans chaque fil.<br />
              L'allure, sur toute la ligne.
            </h2>
          </div>

          {/* Right Column: Converting B2B Copy */}
          <div className="md:w-[35%] pt-1 md:pt-11 flex justify-start">
            <p className="capsule-header-reveal text-[#999999] text-[13px] leading-[1.6] max-w-[320px] font-sans">
              Trois capsules exclusives pensées pour structurer l'identité visuelle de vos collaborateurs — de la première impression client aux comités d'administration les plus prestigieux du Royaume.
            </p>
          </div>
        </div>

        {/* Asymmetric Capsules Grid Layout (Exactly matching the reference image arrangement) */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          
          {/* Top Left: Capsule 01 Text Card */}
          <div className="capsule-card flex flex-col justify-center bg-neutral-50 rounded-2xl p-8 md:p-12 border border-neutral-100">
            <div className="max-w-md">
              <span className="text-[#3B82F6] text-[11px] font-mono tracking-wider uppercase font-bold flex items-center gap-1.5 mb-6">
                <Sparkles className="w-3.5 h-3.5" /> Capsule 01
              </span>
              <h3 className="text-black font-sans font-bold text-2xl md:text-3xl tracking-tight mb-4">
                La Collection Atlas
              </h3>
              <p className="text-[#666666] text-xs md:text-sm leading-relaxed mb-8">
                Inspirée par la rigueur de nos grands hôtels et le prestige des services d'accueil marocains. Une coupe irréprochable qui allie aisance de mouvement absolue et distinction statutaire immédiate face aux clients.
              </p>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4 border-t border-neutral-200">
                <span className="text-neutral-400 text-xs font-mono">Sur-mesure de 10 à 500+ pièces</span>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#3B82F6] hover:text-[#2563EB] transition-colors"
                >
                  Découvrir la capsule <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Top Right: Capsule 01 Image Display (Atlas) */}
          <div className="capsule-card group relative aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-100">
            {/* Parallax Image container */}
            <div className="absolute inset-0 w-full h-[115%] -top-[10%]">
              <img
                src="/src/assets/images/nexiform_capsule_atlas_1782824994762.jpg"
                alt="La Collection Atlas NEXIFORM Morocco"
                className="capsule-parallax-img w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Smooth dark gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35 z-10" />

            {/* Title Display Top-Left */}
            <div className="absolute top-6 left-6 z-20">
              <h4 className="text-white text-3xl font-sans font-bold tracking-tight">
                Atlas
              </h4>
            </div>

            {/* Secondary Labels Bottom-Left */}
            <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-white/45 text-[10px] font-mono tracking-wider uppercase">Collection Premium</span>
                <span className="text-white text-xs font-sans font-semibold mt-0.5">Hôtellerie & Accueil d'Élite</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Bottom Left: Capsule 02 Image Display (Royaume) */}
          <div className="capsule-card group relative aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-100">
            {/* Parallax Image container */}
            <div className="absolute inset-0 w-full h-[115%] -top-[10%]">
              <img
                src="/src/assets/images/nexiform_capsule_royaume_1782825010302.jpg"
                alt="La Collection Royaume NEXIFORM Morocco"
                className="capsule-parallax-img w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Smooth dark gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35 z-10" />

            {/* Title Display Top-Left */}
            <div className="absolute top-6 left-6 z-20">
              <h4 className="text-white text-3xl font-sans font-bold tracking-tight">
                Royaume
              </h4>
            </div>

            {/* Secondary Labels Bottom-Left */}
            <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-white/45 text-[10px] font-mono tracking-wider uppercase">Tailoring Bespoke</span>
                <span className="text-white text-xs font-sans font-semibold mt-0.5">Direction & Haute Administration</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Bottom Right: Capsule 03 Image Display (Horizon) */}
          <div className="capsule-card group relative aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-100">
            {/* Parallax Image container */}
            <div className="absolute inset-0 w-full h-[115%] -top-[10%]">
              <img
                src="/src/assets/images/nexiform_capsule_horizon_1782825025136.jpg"
                alt="La Collection Horizon NEXIFORM Morocco"
                className="capsule-parallax-img w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Smooth dark gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35 z-10" />

            {/* Title Display Top-Left */}
            <div className="absolute top-6 left-6 z-20">
              <h4 className="text-white text-3xl font-sans font-bold tracking-tight">
                Horizon
              </h4>
            </div>

            {/* Secondary Labels Bottom-Left */}
            <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-white/45 text-[10px] font-mono tracking-wider uppercase">Vêtements Techniques</span>
                <span className="text-white text-xs font-sans font-semibold mt-0.5">Ingénierie & Sécurité Avancée</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
