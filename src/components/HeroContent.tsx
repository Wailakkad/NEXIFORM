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
      className="flex flex-col gap-4"
    >
      <motion.h1
        variants={itemVariants}
        className="text-white font-sans text-[38px] lg:text-[52px] leading-[1.15] lg:leading-[1.1] tracking-tight font-bold lg:font-semibold mb-2 lg:mb-3"
      >
        <span className="lg:font-semibold">
          Affirmez votre{' '}
          <span className="text-[#3B82F6] lg:text-inherit">prestige</span>,
        </span>
        <br />
        <span className="lg:italic lg:font-normal lg:text-inherit text-white">
          Habillez votre entreprise.
        </span>
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="text-[14px] lg:text-[13px] text-white/70 lg:text-white/60 leading-[1.6] max-w-[400px] text-center lg:text-left mb-1 lg:mb-5"
      >
        Des uniformes professionnels sur-mesure, brodés avec précision et livrés partout au Maroc.
      </motion.p>

      <motion.div variants={itemVariants}>
        <FeatureBadges />
      </motion.div>

      <motion.div variants={itemVariants}>
        <HeroButtons />
      </motion.div>
    </motion.div>
  );
}
