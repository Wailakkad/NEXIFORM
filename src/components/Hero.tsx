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
      className="relative w-full min-h-screen lg:min-h-screen flex flex-col justify-end lg:justify-start bg-[#0A0E1A] overflow-hidden select-none"
    >
      {/* Video Background — absolute covering full section on all breakpoints */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <motion.div
          initial={{ scale: 1.08 }}
          animate={preloaded ? { scale: 1 } : { scale: 1.08 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ scale: videoScale }}
          className="w-full h-full will-change-transform"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source
              src="https://res.cloudinary.com/dhkyla1rv/video/upload/v1782816204/video-background.mp4"
              type="video/mp4"
            />
          </video>
        </motion.div>
      </div>

      {/* Dark Overlay — stronger gradient on mobile, lighter on desktop */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 60%, rgba(0,0,0,0.92) 100%)',
        }}
      />

      {/* Desktop light overlay override */}
      <div
        className="hidden lg:block absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(105deg, rgba(8, 12, 26, 0.70) 0%, rgba(8, 12, 26, 0.45) 50%, rgba(8, 12, 26, 0.10) 100%)',
        }}
      />

      {/* Spacer — desktop only */}
      <div className="hidden lg:block flex-1" />

      {/* Content Layer */}
      <div className="relative z-[2] w-full max-w-7xl mx-auto flex flex-col lg:flex-row lg:justify-between lg:items-end lg:px-[60px] lg:pb-[48px]">
        {/* Left Content Block */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="w-full lg:max-w-[520px] px-5 pt-6 pb-4 lg:px-0 lg:pt-0 lg:pb-0 mt-auto lg:mt-0"
        >
          <HeroContent preloaded={preloaded} />
        </motion.div>

        {/* Floating Product Card — Desktop */}
        <div className="hidden lg:block self-end">
          <FloatingProductCard preloaded={preloaded} />
        </div>
      </div>

      {/* Floating Product Card — Hidden on mobile */}
      <div className="hidden relative z-[2] w-full px-5 pb-8">
        <div className="w-full bg-[rgba(15,20,35,0.95)] rounded-xl p-4">
          <FloatingProductCard preloaded={preloaded} />
        </div>
      </div>

      {/* Scroll Cue — Desktop only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={preloaded ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.6 }}
        className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex-col items-center gap-2.5"
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
