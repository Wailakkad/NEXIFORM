import { motion } from 'motion/react';
import FeatureBadges from './FeatureBadges';
import HeroButtons from './HeroButtons';

interface HeroContentProps {
  preloaded: boolean;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function HeroContent({ preloaded }: HeroContentProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={preloaded ? 'visible' : 'hidden'}
      className="max-w-[540px] w-full flex flex-col md:items-start items-center gap-5 md:gap-6 md:text-left text-center"
    >
      <motion.span
        variants={itemVariants}
        className="md:hidden text-white/40 text-[10px] font-mono uppercase tracking-[0.25em] font-semibold mb-1"
      >
        NEXIFORM
      </motion.span>

      <motion.span
        variants={itemVariants}
        className="text-white/35 text-[11px] font-mono uppercase tracking-[0.2em] font-semibold hidden md:block"
      >
        Premium Workwear &bull; Made in Morocco
      </motion.span>

      <motion.h1
        variants={itemVariants}
        className="text-white font-sans font-black text-[clamp(32px,8vw,68px)] md:text-[clamp(38px,5.5vw,68px)] leading-[1.12] md:leading-[1.08] tracking-tight"
      >
        Affirmez votre<br />
        <span className="text-[#3B82F6]">prestige.</span><br />
        Habillez votre<br />
        entreprise.
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="text-white/40 text-[15px] md:text-[14px] leading-[1.7] max-w-[400px] w-full font-sans"
      >
        Des uniformes professionnels sur-mesure, brodés avec précision et livrés partout au Maroc. L'excellence textile pour vos équipes.
      </motion.p>

      <motion.div variants={itemVariants} className="w-full">
        <FeatureBadges />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="pt-2 w-full"
      >
        <HeroButtons />
      </motion.div>
    </motion.div>
  );
}
