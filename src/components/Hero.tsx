import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import HeroContent from './HeroContent';
import FloatingProductCard from './FloatingProductCard';

interface HeroProps {
  preloaded: boolean;
}

export default function Hero({ preloaded }: HeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.25], [0, -30]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full md:h-screen md:min-h-0 min-h-screen bg-[#0A0E1A] overflow-hidden select-none"
    >
      {/* Video Background */}
      <motion.div
        initial={{ scale: 1.08 }}
        animate={preloaded ? { scale: 1 } : { scale: 1.08 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ scale: videoScale }}
        className="absolute inset-0 w-full h-full z-0 overflow-hidden will-change-transform"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://res.cloudinary.com/dhkyla1rv/video/upload/v1782816204/video-background.mp4"
            type="video/mp4"
          />
        </video>
      </motion.div>

      {/* Dark Overlay - slightly darker on left */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(105deg, rgba(8, 12, 26, 0.70) 0%, rgba(8, 12, 26, 0.45) 50%, rgba(8, 12, 26, 0.10) 100%)',
        }}
      />

      {/* Content Layer */}
      <div className="relative z-20 w-full h-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-center w-full h-full md:py-0 pt-20 pb-4 md:pb-0">
          {/* Left - Editorial Content */}
          <motion.div
            style={{ opacity: contentOpacity, y: contentY }}
            className="md:w-1/2 lg:w-[45%] flex flex-col items-center md:items-start"
          >
            <HeroContent preloaded={preloaded} />
          </motion.div>
        </div>
      </div>

      {/* Floating Product Card - Desktop (absolute) */}
      <div className="hidden md:block absolute bottom-10 lg:bottom-14 right-6 lg:right-14 z-30">
        <FloatingProductCard preloaded={preloaded} />
      </div>

      {/* Floating Product Card - Mobile (in-flow) */}
      <div className="md:hidden relative z-20 max-w-7xl mx-auto px-6 pb-12 mt-8 flex justify-center">
        <FloatingProductCard preloaded={preloaded} />
      </div>

      {/* Scroll Cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={preloaded ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.6 }}
        className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex-col items-center gap-2.5"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/35 font-sans font-semibold select-none">
          Scroll
        </span>
        <div className="w-[1.5px] h-10 bg-white/10 relative rounded-full overflow-hidden">
          <motion.div
            className="absolute left-0 w-full h-3 bg-[#3B82F6] rounded-full"
            animate={{ y: [-8, 24], opacity: [0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', repeatType: 'reverse' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
