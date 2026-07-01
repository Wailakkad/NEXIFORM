'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useGSAP } from '@gsap/react';
import { ArrowRight } from 'lucide-react';

// Floating professional avatars surrounding the center text
const FLOATING_AVATARS = [
  { id: 1, url: 'https://res.cloudinary.com/dhkyla1rv/image/upload/v1782820697/Professional_corporate_headshot_photography__shot_202606301310_10.jpg', x: -280, y: -160, size: 'w-16 h-16 md:w-20 md:h-20' },
  { id: 2, url: 'https://res.cloudinary.com/dhkyla1rv/image/upload/v1782820831/Professional_corporate_headshot_photography__shot_202606301310_9.jpg', x: 260, y: -180, size: 'w-20 h-20 md:w-24 md:h-24' },
  { id: 3, url: 'https://res.cloudinary.com/dhkyla1rv/image/upload/v1782820963/Professional_corporate_headshot_photography__shot_202606301310_4.jpg', x: -320, y: 120, size: 'w-24 h-24 md:w-28 md:h-28' },
  { id: 4, url: 'https://res.cloudinary.com/dhkyla1rv/image/upload/v1782820987/Professional_corporate_headshot_photography__shot_202606301310_7.jpg', x: 280, y: 140, size: 'w-20 h-20 md:w-24 md:h-24' },
  { id: 5, url: 'https://res.cloudinary.com/dhkyla1rv/image/upload/v1782821001/Professional_corporate_headshot_photography__shot_202606301310_6.jpg', x: -120, y: -220, size: 'w-16 h-16 md:w-20 md:h-20' },
  { id: 6, url: 'https://res.cloudinary.com/dhkyla1rv/image/upload/v1782821001/Professional_corporate_headshot_photography__shot_202606301310_8.jpg', x: 120, y: -240, size: 'w-16 h-16 md:w-20 md:h-20' },
  { id: 7, url: 'https://res.cloudinary.com/dhkyla1rv/image/upload/v1782821033/Professional_corporate_headshot_photography__shot_202606301310_5.jpg', x: -140, y: 220, size: 'w-16 h-16 md:w-20 md:h-20' },
  { id: 8, url: 'https://res.cloudinary.com/dhkyla1rv/image/upload/v1782821041/Professional_corporate_headshot_photography__shot_202606301310_3.jpg', x: 140, y: 240, size: 'w-16 h-16 md:w-20 md:h-20' },
];

export default function InteractiveCampaign() {
  const scrollSectionRef = useRef<HTMLDivElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const centerTextRef = useRef<HTMLDivElement>(null);
  const pointingModelRef = useRef<HTMLImageElement>(null);
  const pointerButtonRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // We configure a multi-stage timeline linked precisely to the scroll offset with native GSAP pinning
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: scrollSectionRef.current,
        start: 'top top',
        end: '+=180%', // Pins the section for 1.8x the height of viewport
        scrub: 1, // High fidelity smooth-linked control
        pin: true, // Fixes the section in place
        anticipatePin: 1,
      }
    });

    // --- STAGE 1: INWARD ASSEMBLY ---
    // Floating avatars slide in from further out, settling into their circular coordinates
    FLOATING_AVATARS.forEach((avatar) => {
      timeline.fromTo(
        `.floating-avatar-${avatar.id}`,
        {
          opacity: 0,
          x: avatar.x * 1.5,
          y: avatar.y * 1.5,
          scale: 0.8,
        },
        {
          opacity: 1,
          x: avatar.x,
          y: avatar.y,
          scale: 1,
          duration: 0.5,
          ease: 'power3.out',
        },
        0 // Starts simultaneously at 0% scroll
      );
    });

    timeline.fromTo(
      centerTextRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' },
      0
    );

    // --- STAGE 2: THE DISPERSAL & VANISHING ---
    // User scrolls: avatars fly outward past boundaries and vanish. Center text fades out
    FLOATING_AVATARS.forEach((avatar) => {
      timeline.to(
        `.floating-avatar-${avatar.id}`,
        {
          opacity: 0,
          x: avatar.x * 2.5,
          y: avatar.y * 2.5,
          scale: 0.7,
          duration: 0.6,
          ease: 'power2.in',
        },
        0.6 // From 30% scroll progress to 60%
      );
    });

    timeline.to(
      centerTextRef.current,
      {
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        ease: 'power2.in',
      },
      0.6
    );

    // --- STAGE 3: THE POINTING MODEL ENTRANCE & EXTREME ZOOM-IN ---
    // The main pointing model is faded out and small in the middle initially
    gsap.set(pointingModelRef.current, { opacity: 0, scale: 0.4 });
    gsap.set(pointerButtonRef.current, { opacity: 0, scale: 0.8, x: 20 });

    timeline.to(
      pointingModelRef.current,
      {
        opacity: 1,
        scale: 1.15, // Scales up majestically on screen
        duration: 1.2,
        ease: 'power2.out',
      },
      1.0 // Starts zooming from 50% to 90% scroll progress
    );

    // --- STAGE 4: TOP-RIGHT CTA REVEAL ALIGNED WITH FINGER POINT ---
    timeline.to(
      pointerButtonRef.current,
      {
        opacity: 1,
        scale: 1,
        x: 0,
        duration: 0.4,
        ease: 'back.out(1.4)',
      },
      2.0 // Appears fully at the terminal 90%-100% of scroll progress
    );

  }, { scope: scrollSectionRef });

  return (
    <div
      ref={scrollSectionRef}
      className="relative z-30 w-full bg-[#0A0E1A] h-screen overflow-hidden"
    >
      {/* Viewport inner frame */}
      <div
        ref={pinContainerRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
      >
        {/* Deep background mesh pattern for texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.04)_0%,_transparent_65%)] pointer-events-none z-0" />

        {/* --- PART 1: CENTER WORDMARK & FLOATING AMBASSADORS --- */}
        <div ref={centerTextRef} className="relative z-10 flex flex-col items-center justify-center text-center max-w-lg px-6">
          <span className="text-white/45 text-xs uppercase tracking-[0.25em] font-bold font-sans">
            L'Alliance Statutaire
          </span>
          <h2 className="text-white font-sans font-bold text-4xl md:text-5xl leading-tight tracking-tight mt-4">
            L'Allure de la <br />
            <span className="text-[#3B82F6]">Réussite.</span>
          </h2>
          <p className="text-white/35 text-xs md:text-sm mt-4 leading-relaxed font-sans font-normal">
            Façonner l'allure de ceux qui construisent et dirigent le Maroc de demain. Un vestiaire d'autorité conçu pour l'action.
          </p>
        </div>

        {/* Floating Avatars around center text */}
        {FLOATING_AVATARS.map((avatar) => (
          <div
            key={avatar.id}
            className={`floating-avatar-${avatar.id} absolute z-20 overflow-hidden rounded-full border border-white/15 bg-[#0A0E1A] shadow-2xl pointer-events-none ${avatar.size}`}
            style={{
              transform: 'translate(-50%, -50%)',
            }}
          >
            <img
              src={avatar.url}
              alt="Ambassadeur NEXIFORM Maroc"
              className="w-full h-full object-cover select-none"
              referrerPolicy="no-referrer"
            />
          </div>
        ))}

        {/* --- PART 2: POINTING MODEL HERO (FADES & SCALES IN DIRECTLY LINKED TO SCROLL) --- */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center z-30 pointer-events-none">
          <div className="relative w-full h-full flex items-center justify-center max-w-7xl mx-auto px-6">
            
            {/* Main Model Image */}
            <img
              ref={pointingModelRef}
              src="https://res.cloudinary.com/dhkyla1rv/image/upload/v1782822560/Full_prompt_Professional_corporate_photography__202606301253.jpg"
              alt="NEXIFORM Elite Moroccan Collection Campaign"
              className="absolute w-full h-full max-w-5xl max-h-[90vh] object-contain object-center select-none"
              referrerPolicy="no-referrer"
            />

            {/* Micro subtle vignette over model */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A]/40 via-transparent to-transparent pointer-events-none" />

            {/* --- PART 3: TOP-RIGHT CTA ALIGNED WITH HER FINGER POINTING --- */}
            <div
              ref={pointerButtonRef}
              className="absolute top-10 right-6 md:top-24 md:right-16 z-40 pointer-events-auto"
            >
              <div className="flex flex-col items-end gap-3">
                {/* Micro pointer text */}
                <div className="bg-[#3B82F6] text-white text-[10px] md:text-xs font-mono tracking-wider uppercase font-bold px-3 py-1 rounded-full shadow-lg">
                  Notre Catalogue Elite 2026
                </div>
                {/* Main CTA */}
                <a
                  href="#devis"
                  className="group flex items-center gap-3 bg-white hover:bg-[#3B82F6] hover:text-white text-black text-xs md:text-sm font-bold tracking-wider uppercase px-5 py-3.5 rounded-xl shadow-2xl transition-all duration-300"
                >
                  <span>Demander l'offre sur-mesure</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
