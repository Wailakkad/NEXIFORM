'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function StyleOutlookSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // 1. SECTION FADE IN (Trigger once only when section enters viewport)
    gsap.fromTo(
      '.section-fade-in-container',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      }
    );

    // 2. IMAGE GRID STAGGER (Stagger reveal for all image blocks)
    gsap.fromTo(
      '.style-grid-item',
      { opacity: 0, y: 60, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.style-grid-trigger',
          start: 'top 75%',
          once: true,
        },
      }
    );

    // 3. HEADLINE ANIMATION ("The Science of Everyday Comfort")
    const headlineTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: headlineRef.current,
        start: 'top 75%',
        once: true,
      },
    });

    headlineTimeline.fromTo(
      '.headline-line',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
      }
    );

    // 4. PRODUCT STRIP ANIMATION (3 product images stagger with 0.3s delay after headline starts)
    headlineTimeline.fromTo(
      '.product-strip-card',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      },
      '-=0.7' // Starts 0.3s after headline animates (headline duration is 1.0s, so -=0.7s matches exactly 0.3s delay)
    );

    // Subtle fade-in for the bottom banner
    gsap.fromTo(
      '.banner-fade-in',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.banner-fade-in',
          start: 'top 85%',
          once: true,
        },
      }
    );

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="style-outlook-section"
      className="relative z-30 bg-white py-24 md:py-32 w-full text-black select-none overflow-hidden border-t border-neutral-100"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 section-fade-in-container will-change-transform">
        
        {/* Top Header Block */}
        <div id="style-outlook-header" className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-12 mb-16 md:mb-20">
          <div className="md:w-[55%] flex flex-col items-start">
            <h2 id="style-outlook-title" className="text-[#0A0A0A] font-sans font-black text-[clamp(32px,4.5vw,52px)] leading-none tracking-tight">
              Style & Allure
            </h2>
          </div>
          <div className="md:w-[40%] pt-1 flex justify-start md:justify-end">
            <p id="style-outlook-description" className="text-[#888888] text-xs md:text-sm leading-relaxed max-w-[340px] font-sans font-normal text-left md:text-right">
              NEXIFORM s’engage à concevoir des vêtements professionnels de premier choix, alliant ergonomie de pointe et durabilité industrielle exceptionnelle pour toutes vos équipes de terrain.
            </p>
          </div>
        </div>

        {/* Image Grid with Stagger Reveal */}
        <div className="style-grid-trigger flex flex-col gap-6">
          
          {/* Grid Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Column: Large Vertical Image */}
            <div id="grid-item-vertical-scrub" className="style-grid-item md:col-span-8 flex flex-col will-change-transform">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100 group">
                <img
                  src="https://res.cloudinary.com/dhkyla1rv/image/upload/v1782915408/left_large_image.jpg"
                  alt="Secteur Médical Premium"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-103 will-change-transform"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span id="label-workwear" className="text-[#888888] font-sans text-xs uppercase mt-3 font-medium tracking-widest">
                vestiaire professionnel
              </span>
            </div>

            {/* Right Column: Two Stacked Smaller Images */}
            <div className="md:col-span-4 grid grid-rows-2 gap-6">
              <div id="grid-item-security-black" className="style-grid-item relative aspect-[4/3] md:aspect-auto rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100 group will-change-transform">
                <img
                  src="https://res.cloudinary.com/dhkyla1rv/image/upload/v1782915406/right_short_image_1.jpg"
                  alt="Équipement Sécurité"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-103 will-change-transform"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div id="grid-item-chef-white" className="style-grid-item relative aspect-[4/3] md:aspect-auto rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100 group will-change-transform">
                <img
                  src="https://res.cloudinary.com/dhkyla1rv/image/upload/v1782915406/right_short_image_2.jpg"
                  alt="Restauration Chef Prestige"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-103 will-change-transform"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>

          {/* Grid Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-2">
            
            {/* Left Column: Two Stacked Smaller Images */}
            <div className="md:col-span-4 grid grid-rows-2 gap-6 order-2 md:order-1">
              <div id="grid-item-polo-black" className="style-grid-item relative aspect-[4/3] md:aspect-auto rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100 group will-change-transform">
                <img
                  src="https://res.cloudinary.com/dhkyla1rv/image/upload/v1782915406/left_short_image_1.jpg"
                  alt="Polo Professionnel"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-103 will-change-transform"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div id="grid-item-vest-orange" className="style-grid-item relative aspect-[4/3] md:aspect-auto rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100 group will-change-transform">
                <img
                  src="https://res.cloudinary.com/dhkyla1rv/image/upload/v1782915406/left_short_image_2.jpg"
                  alt="Gilet Haute Visibilité"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-103 will-change-transform"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Right Column: Large Horizontal Image */}
            <div id="grid-item-horizontal-epi" className="style-grid-item md:col-span-8 flex flex-col order-1 md:order-2 will-change-transform">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100 group">
                <img
                  src="https://res.cloudinary.com/dhkyla1rv/image/upload/v1782915407/right_large_image.jpg"
                  alt="Gamme Professionnelle Industrielle"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-103 will-change-transform"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>

        </div>

        {/* Headline section: "THE SCIENCE OF EVERYDAY COMFORT" */}
        <div ref={headlineRef} id="headline-carousel-block" className="mt-28 md:mt-36">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <h3 id="science-headline" className="text-[#0A0A0A] font-sans font-black text-4xl md:text-6xl tracking-tight leading-[0.95]">
                <span className="headline-line block overflow-hidden will-change-transform">LA SCIENCE DU</span>
                <span className="headline-line block overflow-hidden will-change-transform mt-2">CONFORT AU</span>
                <span className="headline-line block overflow-hidden will-change-transform mt-2">QUOTIDIEN</span>
            </h3>

            {/* Interactive Carousel Arrow Buttons */}
            <div id="science-arrows" className="flex items-center gap-3">
              <button 
                id="arrow-prev"
                className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center text-black hover:bg-neutral-50 transition-colors"
                aria-label="Previous"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button 
                id="arrow-next"
                className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white hover:bg-neutral-900 transition-colors"
                aria-label="Next"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Product Strip Cards */}
          <div ref={productsRef} id="products-strip" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Product Card 1 */}
            <div id="product-card-1" className="product-strip-card flex flex-col group cursor-pointer will-change-transform">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100 flex items-center justify-center p-8">
                <img
                  src="https://res.cloudinary.com/dhkyla1rv/image/upload/v1782914156/Using_the_input_image_strictly_202607011522-removebg-preview.png"
                  alt="Gilet de protection technique"
                  className="w-[85%] h-[85%] object-contain transition-transform duration-500 group-hover:scale-103 will-change-transform"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-4">
                <h4 className="text-[#0A0A0A] font-bold text-sm tracking-tight">Gilet Orange Tech</h4>
                <p className="text-[#888888] text-xs mt-1">Gilet de Protection Haute Visibilité</p>
              </div>
            </div>

            {/* Product Card 2 */}
            <div id="product-card-2" className="product-strip-card flex flex-col group cursor-pointer will-change-transform">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100 flex items-center justify-center p-8">
                <img
                  src="https://res.cloudinary.com/dhkyla1rv/image/upload/v1782914156/Chef_jacket_on_white_background_202607011522-removebg-preview.png"
                  alt="Veste de chef blanche"
                  className="w-[85%] h-[85%] object-contain transition-transform duration-500 group-hover:scale-103 will-change-transform"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-4">
                <h4 className="text-[#0A0A0A] font-bold text-sm tracking-tight">Chef Prestige</h4>
                <p className="text-[#888888] text-xs mt-1">Veste de Chef Coton Premium</p>
              </div>
            </div>

            {/* Product Card 3 */}
            <div id="product-card-3" className="product-strip-card flex flex-col group cursor-pointer will-change-transform">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100 flex items-center justify-center p-8">
                <img
                  src="https://res.cloudinary.com/dhkyla1rv/image/upload/v1782914156/Using_the_input_image_strictly_202607011539-removebg-preview.png"
                  alt="Ensemble médical premium"
                  className="w-[85%] h-[85%] object-contain transition-transform duration-500 group-hover:scale-103 will-change-transform"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-4">
                <h4 className="text-[#0A0A0A] font-bold text-sm tracking-tight">Ensemble Bleu Azur</h4>
                <p className="text-[#888888] text-xs mt-1">Blouse & Pantalon Médical Flex</p>
              </div>
            </div>

            {/* Product Card 4 */}
            <div id="product-card-4" className="product-strip-card flex flex-col group cursor-pointer will-change-transform">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100 flex items-center justify-center p-8">
                <img
                  src="https://res.cloudinary.com/dhkyla1rv/image/upload/v1782915407/flaoting_product_images_3.png"
                  alt="Veste de Travail Polyvalente"
                  className="w-[85%] h-[85%] object-contain transition-transform duration-500 group-hover:scale-103 will-change-transform"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-4">
                <h4 className="text-[#0A0A0A] font-bold text-sm tracking-tight">Polo Technique</h4>
                <p className="text-[#888888] text-xs mt-1">Maille Respirante Ultra-Durable</p>
              </div>
            </div>

          </div>
        </div>

        {/* Full-width Banner: "The Future of Confort Awaits" */}
        <div id="future-banner" className="banner-fade-in relative w-full aspect-[21/9] md:aspect-[3/1] rounded-3xl overflow-hidden mt-28 md:mt-36 group shadow-sm border border-neutral-100 will-change-transform">
          {/* Background image */}
          <img
            src="https://res.cloudinary.com/dhkyla1rv/image/upload/v1782915410/banner_hero_image.png"
            alt="The Future of Confort"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          
          {/* Subtle overlay gradient to keep text readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent z-10" />

          {/* Content overlay */}
          <div className="absolute inset-0 z-20 p-8 md:p-12 lg:p-16 flex flex-col justify-between items-start">
            <div className="max-w-md">
              <h2 id="banner-title" className="text-white font-sans font-black text-3xl md:text-5xl tracking-tight leading-none mb-3">
                L'Avenir de<br />l'Uniforme Premium
              </h2>
            </div>

            <a
              id="banner-cta"
              href="#/store"
              className="group flex items-center justify-between bg-white hover:bg-[#3B82F6] hover:text-white h-11 pl-5 pr-1.5 rounded-full text-black font-sans text-xs font-semibold tracking-wide transition-all duration-300 shadow-lg"
            >
              <span>Découvrir la Boutique</span>
              <div className="w-8 h-8 ml-3 rounded-full bg-black text-white group-hover:bg-white group-hover:text-[#3B82F6] flex items-center justify-center transition-transform duration-300 ease-out group-hover:translate-x-1">
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
