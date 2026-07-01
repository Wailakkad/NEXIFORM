import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useGSAP } from '@gsap/react';

interface HeroProps {
  preloaded: boolean;
}

export default function Hero({ preloaded }: HeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!preloaded) {
      // Set initial states for entrance animations
      gsap.set('.hero-eyebrow', { opacity: 0, x: -16 });
      gsap.set('.hero-line-1', { opacity: 0, y: 32 });
      gsap.set('.hero-line-2', { opacity: 0, y: 32 });
      gsap.set('.hero-body', { opacity: 0, y: 20 });
      gsap.set('.hero-cta', { opacity: 0, y: 16, scale: 0.95 });
      gsap.set(videoContainerRef.current, { scale: 1.08 });
      return;
    }

    // 1. Initial Entry Timeline (triggers immediately after preloader completes, not on scroll)
    const entryTimeline = gsap.timeline();

    // Scale down background video from 1.08 to 1.0 over 1.8s (runs in parallel with text cascade)
    entryTimeline.fromTo(
      videoContainerRef.current,
      { scale: 1.08 },
      { scale: 1.0, duration: 1.8, ease: 'power2.out' },
      0
    );

    // Eyebrow enters
    entryTimeline.fromTo(
      '.hero-eyebrow',
      { opacity: 0, x: -16 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' },
      0.1
    );

    // Headline Line 1
    entryTimeline.fromTo(
      '.hero-line-1',
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      0.25
    );

    // Headline Line 2 (starts 0.1s after Line 1)
    entryTimeline.fromTo(
      '.hero-line-2',
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      0.35
    );

    // Body Paragraph
    entryTimeline.fromTo(
      '.hero-body',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      0.5
    );

    // CTA Button with a very subtle premium overshoot bounce
    entryTimeline.fromTo(
      '.hero-cta',
      { opacity: 0, y: 16, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.2)' },
      0.65
    );

    // 2. Loop Animation for scroll-cue dot
    gsap.fromTo(
      '.scroll-cue-dot',
      { y: -8, opacity: 0.2 },
      { 
        y: 28, 
        opacity: 1, 
        duration: 1.8, 
        repeat: -1, 
        ease: 'power1.inOut',
        yoyo: true 
      }
    );

    // 3. Responsive ScrollTrigger Setup for Apple-style scroll interactions
    const mm = gsap.matchMedia();

    // Desktop/Tablet Interactions (enable rich parallax)
    mm.add('(min-width: 768px)', () => {
      // Parallax effect on the video background (translates Y by 15% of scroll distance)
      gsap.to(videoContainerRef.current, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });

      // Hero content fades to opacity 0 and slides up slightly (y: 0 to -40) over 300px
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=300',
          scrub: true,
        }
      });
    });

    // Mobile Interactions (optimized performance, lighter motion)
    mm.add('(max-width: 767px)', () => {
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200',
          scrub: true,
        }
      });
    });

    // Scroll-cue fades out once the user starts scrolling past 50px
    gsap.to(scrollCueRef.current, {
      opacity: 0,
      y: 10,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=50',
        scrub: true,
      }
    });

  }, { dependencies: [preloaded], scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="hero-section relative min-height-[100vh] h-screen w-full bg-[#0A0E1A] overflow-hidden select-none flex items-center justify-start z-10"
    >
      {/* Layer 1 — Video background with scale and poster fallback */}
      <div 
        ref={videoContainerRef}
        className="absolute inset-0 w-full h-full z-0 overflow-hidden"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1920"
        >
          <source 
            src="https://res.cloudinary.com/dhkyla1rv/video/upload/v1782816204/video-background.mp4" 
            type="video/mp4" 
          />
        </video>
      </div>

      {/* Layer 2 — Deep Dark Linear-Gradient Overlay */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, rgba(8, 12, 26, 0.65) 0%, rgba(8, 12, 26, 0.40) 45%, rgba(8, 12, 26, 0.05) 100%)'
        }}
      />

      {/* Layer 3 — Left-Aligned Text Content & Interactive Button */}
      <div 
        ref={contentRef}
        className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16"
      >
        <div className="max-w-[580px] flex flex-col gap-1 items-start">
          {/* Eyebrow label in exact sentence case */}
          <span className="hero-eyebrow text-white/45 text-[13px] font-sans tracking-wide font-medium">
            l'uniforme de prestige pour chaque industrie
          </span>

          {/* Headline - Split into 2 staggered line spans */}
          <h1 className="text-white font-sans font-bold text-[clamp(36px,5.2vw,64px)] leading-[1.12] tracking-tight mt-3 mb-5">
            <span className="hero-line-1 block">
              Affirmez votre <span className="text-[#3B82F6]">prestige.</span>
            </span>
            <span className="hero-line-2 block mt-1">
              Faites briller votre marque.
            </span>
          </h1>

          {/* Premium customized descriptive body paragraph */}
          <p className="hero-body text-white/45 text-[15px] leading-[1.65] max-w-[420px] font-sans font-normal">
            L'uniforme professionnel sur-mesure qui reflète l'excellence de votre entreprise. Broderie de haute précision pour votre logo, confort d'exception et livraison partout au Maroc.
          </p>

          {/* Custom pill-shaped CTA toggle-style button */}
          <div className="hero-cta mt-8">
            <a
              href="#/store"
              className="group flex items-center justify-between bg-[#3B82F6] hover:bg-[#2563EB] h-[52px] pl-6 pr-2 rounded-full text-white font-sans text-sm font-semibold tracking-wide transition-all duration-300"
            >
              <span>Découvrir notre boutique B2B</span>
              <div className="w-9 h-9 ml-4 rounded-full bg-white text-[#3B82F6] flex items-center justify-center transition-transform duration-300 ease-out group-hover:translate-x-1 shadow-sm">
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll-Cue Indicator at Bottom Center */}
      <div 
        ref={scrollCueRef}
        className="hero-scroll-cue absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2.5"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/45 font-sans font-semibold select-none">
          Scroll
        </span>
        <div className="w-[1.5px] h-11 bg-white/10 relative rounded-full overflow-hidden">
          <div className="scroll-cue-dot absolute left-0 w-full h-3 bg-[#3B82F6] rounded-full" />
        </div>
      </div>
    </section>
  );
}
