import { useState, useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [shouldRender, setShouldRender] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user has already seen the preloader in this session
    const hasPlayed = sessionStorage.getItem('nexiform_preloader_played');
    if (hasPlayed === 'true') {
      setShouldRender(false);
      onComplete();
      return;
    }

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      sessionStorage.setItem('nexiform_preloader_played', 'true');
      setShouldRender(false);
      onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const letters = wordmarkRef.current?.querySelectorAll('.letter-span');
      
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem('nexiform_preloader_played', 'true');
          setShouldRender(false);
          onComplete();
        }
      });

      // 0.0s: Container is visible, fully opaque background (handled by CSS bg-[#0A0E1A])

      // 0.2s: NEXIFORM wordmark fades in and scales from 0.96 to 1.0 over 0.6s, ease "power3.out"
      // Stagger each letter with a 0.03s stagger, opacity 0 to 1, y: 12px to 0
      if (letters && letters.length > 0) {
        tl.fromTo(
          letters,
          { opacity: 0, y: 12 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.6, 
            stagger: 0.03, 
            ease: 'power3.out' 
          },
          0.2
        );
      }

      tl.fromTo(
        wordmarkRef.current,
        { scale: 0.96 },
        { scale: 1, duration: 0.6, ease: 'power3.out' },
        0.2
      );

      // 0.9s: Thin horizontal line (1px height, 0 to 60px width) draws in below over 0.5s, ease "power2.inOut"
      tl.fromTo(
        lineRef.current,
        { width: 0 },
        { width: 60, duration: 0.5, ease: 'power2.inOut' },
        0.9
      );

      // 1.0s: Tagline "Professional Uniform Solutions" fades in below, opacity 0 to 1, over 0.4s
      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        1.0
      );

      // 1.3s to 2.6s: Slim progress bar fills from 0% to 100% using a gradient #3B82F6 to #10B981, ease "power1.inOut"
      tl.fromTo(
        progressFillRef.current,
        { width: '0%' },
        { width: '100%', duration: 1.3, ease: 'power1.inOut' },
        1.3
      );

      // 2.6s to 2.8s: Hold full state briefly (implicit in timeline duration gap)

      // 2.8s: Entire preloader fades out (opacity 1 to 0) and scales up slightly (1.0 to 1.03) over 0.6s, ease "power2.in"
      tl.to(
        containerRef.current,
        { 
          opacity: 0, 
          scale: 1.03, 
          duration: 0.6, 
          ease: 'power2.in',
          onStart: () => {
            // Once fading out, make it non-interactive
            if (containerRef.current) {
              containerRef.current.style.pointerEvents = 'none';
            }
          }
        },
        2.8
      );
    });

    return () => {
      ctx.revert();
    };
  }, [onComplete]);

  if (!shouldRender) return null;

  const word = "NEXIFORM";

  return (
    <div
      id="preloader-container"
      ref={containerRef}
      className="fixed inset-0 bg-[#0A0E1A] z-[9999] flex flex-col items-center justify-center select-none overflow-hidden"
    >
      <div className="flex flex-col items-center">
        {/* Wordmark logo with split characters */}
        <div 
          ref={wordmarkRef} 
          className="text-white text-5xl md:text-6xl font-bold tracking-[0.18em] flex items-center justify-center font-sans"
        >
          {word.split('').map((char, index) => (
            <span 
              key={index} 
              className="letter-span inline-block"
              style={{ color: char === 'I' ? '#3B82F6' : '#FFFFFF' }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Thin horizontal marker line */}
        <div 
          ref={lineRef}
          className="h-[1px] bg-[#3B82F6] my-4"
          style={{ width: '0px' }}
        />

        {/* Tagline */}
        <div 
          ref={taglineRef}
          className="text-white/50 text-xs md:text-sm tracking-[0.22em] uppercase font-sans mb-8 text-center px-4"
        >
          Professional Uniform Solutions
        </div>

        {/* Slim progress bar track */}
        <div className="w-[200px] h-[1px] bg-white/8 rounded-full overflow-hidden relative">
          <div 
            ref={progressFillRef}
            className="h-full absolute left-0 top-0 bg-gradient-to-r from-[#3B82F6] to-[#10B981]"
            style={{ width: '0%' }}
          />
        </div>
      </div>
    </div>
  );
}
