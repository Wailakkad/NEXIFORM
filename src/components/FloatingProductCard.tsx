import { motion } from 'motion/react';
import RotatingProduct from './RotatingProduct';

interface FloatingProductCardProps {
  preloaded: boolean;
  className?: string;
}

export default function FloatingProductCard({ preloaded, className = '' }: FloatingProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={preloaded ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.9, delay: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`w-[85vw] sm:w-[300px] md:w-[280px] rounded-2xl border border-white/[0.08] bg-black/40 shadow-2xl backdrop-blur-2xl p-4 md:p-5 ${className}`}
    >
      <RotatingProduct preloaded={preloaded} />
    </motion.div>
  );
}
