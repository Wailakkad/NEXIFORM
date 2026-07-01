'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useGSAP } from '@gsap/react';

interface ModelProfile {
  id: number;
  imageUrl: string;
  name: string;
  role: string;
  sector: string;
}

const MODELS_DATA: ModelProfile[] = [
  {
    id: 1,
    imageUrl: 'https://res.cloudinary.com/dhkyla1rv/image/upload/v1782820697/Professional_corporate_headshot_photography__shot_202606301310_10.jpg',
    name: 'Karim S.',
    role: 'Directeur d\'Exploitation',
    sector: 'Énergie & Logistique',
  },
  {
    id: 2,
    imageUrl: 'https://res.cloudinary.com/dhkyla1rv/image/upload/v1782820831/Professional_corporate_headshot_photography__shot_202606301310_9.jpg',
    name: 'Youssef B.',
    role: 'Chef Exécutif',
    sector: 'Gastronomie & Hôtellerie',
  },
  {
    id: 3,
    imageUrl: 'https://res.cloudinary.com/dhkyla1rv/image/upload/v1782820963/Professional_corporate_headshot_photography__shot_202606301310_4.jpg',
    name: 'Nassim T.',
    role: 'Chef d\'Équipe Technique',
    sector: 'Aéronautique & Défense',
  },
  {
    id: 4,
    imageUrl: 'https://res.cloudinary.com/dhkyla1rv/image/upload/v1782820987/Professional_corporate_headshot_photography__shot_202606301310_7.jpg',
    name: 'Amine L.',
    role: 'Ingénieur de Chantier',
    sector: 'Bâtiment & Travaux Publics',
  },
  {
    id: 5,
    imageUrl: 'https://res.cloudinary.com/dhkyla1rv/image/upload/v1782821001/Professional_corporate_headshot_photography__shot_202606301310_6.jpg',
    name: 'Sarah M.',
    role: 'Responsable Accueil VIP',
    sector: 'Services Corporate',
  },
  {
    id: 6,
    imageUrl: 'https://res.cloudinary.com/dhkyla1rv/image/upload/v1782821001/Professional_corporate_headshot_photography__shot_202606301310_8.jpg',
    name: 'Zouhair F.',
    role: 'Superviseur de Sécurité',
    sector: 'Protection & Surveillance',
  },
  {
    id: 7,
    imageUrl: 'https://res.cloudinary.com/dhkyla1rv/image/upload/v1782821033/Professional_corporate_headshot_photography__shot_202606301310_5.jpg',
    name: 'Mehdi K.',
    role: 'Coordinateur Logistique',
    sector: 'Supply Chain & Transports',
  },
  {
    id: 8,
    imageUrl: 'https://res.cloudinary.com/dhkyla1rv/image/upload/v1782821041/Professional_corporate_headshot_photography__shot_202606301310_3.jpg',
    name: 'Rachid D.',
    role: 'Chef de Brigade',
    sector: 'Restauration Premium',
  },
  {
    id: 9,
    imageUrl: 'https://res.cloudinary.com/dhkyla1rv/image/upload/v1782821072/Professional_corporate_headshot_photography__shot_202606301310_1.jpg',
    name: 'Anas G.',
    role: 'Technicien Senior',
    sector: 'Automobile & Industrie',
  },
  {
    id: 10,
    imageUrl: 'https://res.cloudinary.com/dhkyla1rv/image/upload/v1782821077/Professional_corporate_headshot_photography__shot_202606301310_2.jpg',
    name: 'Yassine R.',
    role: 'Pilote Commercial',
    sector: 'Aviation & Transports',
  },
  {
    id: 11,
    imageUrl: 'https://res.cloudinary.com/dhkyla1rv/image/upload/v1782821092/Professional_corporate_headshot_photography__shot_202606301310.jpg',
    name: 'Hassan J.',
    role: 'Contrôleur Qualité',
    sector: 'Manufacturing de Précision',
  },
  {
    id: 12,
    imageUrl: 'https://res.cloudinary.com/dhkyla1rv/image/upload/v1782821096/Full_prompt_Professional_corporate_headshot_202606301310.jpg',
    name: 'Omar A.',
    role: 'Directeur de Site',
    sector: 'Télécoms & Réseaux',
  },
];

export default function ProfessionalShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Standard high-end GSAP horizontal scroll track animation
    // Translates the container from right to left as the user scrolls past the section
    const trackWidth = trackRef.current?.scrollWidth || 0;
    const windowWidth = window.innerWidth;
    const scrollAmount = trackWidth - windowWidth + 120; // adding comfort padding

    if (scrollAmount > 0) {
      gsap.to(trackRef.current, {
        x: -scrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1, // Smooth scrolling effect
        },
      });
    }

    // Fade-in entry animation for header block
    gsap.fromTo(
      '.showcase-text-reveal',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top 85%',
          once: true,
        },
      }
    );
  }, { scope: triggerRef });

  return (
    <section
      ref={triggerRef}
      className="relative z-30 bg-white py-24 md:py-32 w-full text-black select-none overflow-hidden border-t border-neutral-100"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mb-16">
        {/* Asymmetric Two-Column Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-12">
          {/* Left Column: Headline */}
          <div className="md:w-[55%] flex flex-col items-start">
            <span className="showcase-text-reveal text-[#888888] text-[13px] font-sans tracking-normal font-medium mb-3">
              Notre force humaine
            </span>
            <h2 className="showcase-text-reveal text-[#0A0A0A] font-sans font-bold text-[clamp(32px,4.5vw,48px)] leading-[1.2] tracking-tight">
              Portez l'ambition d'un groupe.<br />
              Menez le royaume.
            </h2>
          </div>

          {/* Right Column: Converting B2B Copy */}
          <div className="md:w-[35%] pt-1 md:pt-11 flex justify-start">
            <p className="showcase-text-reveal text-[#999999] text-[13px] leading-[1.6] max-w-[320px] font-sans">
              De Tanger à Dakhla, plus de 500 entreprises de premier plan font confiance à NEXIFORM pour équiper leurs collaborateurs d'un vestiaire professionnel d'exception, alliant autorité statutaire et confort absolu au quotidien.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Horizontal Scroll Track */}
      <div ref={containerRef} className="w-full overflow-hidden px-6 md:px-12 lg:px-16">
        <div
          ref={trackRef}
          className="flex gap-6 md:gap-8 cursor-grab active:cursor-grabbing w-max pr-12"
        >
          {MODELS_DATA.map((model) => (
            <div
              key={model.id}
              className="w-[260px] md:w-[320px] flex-shrink-0 group relative overflow-hidden rounded-xl border border-neutral-100 bg-[#FAFAFA]"
            >
              {/* Image Frame */}
              <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                <img
                  src={model.imageUrl}
                  alt={`${model.name} - ${model.role} NEXIFORM Morocco`}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-100 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Micro overlay with sector indicator */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-white/90 backdrop-blur-sm text-[10px] font-mono tracking-wider text-black px-2.5 py-1 rounded-full uppercase border border-neutral-200">
                    {model.sector}
                  </span>
                </div>
              </div>

              {/* Label Info Card */}
              <div className="p-5 bg-white border-t border-neutral-50 flex flex-col items-start transition-colors duration-300 group-hover:bg-[#FAFAFA]">
                <h4 className="text-black font-sans font-bold text-base leading-tight">
                  {model.name}
                </h4>
                <p className="text-[#888888] font-sans text-xs mt-1 font-medium">
                  {model.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
