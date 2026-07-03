import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { storeData, Product } from '../data/store';
import { ArrowRight } from 'lucide-react';

const FEATURED_IDS = [
  'MED-001', 'MED-003', 'MED-013', 'MED-051',
  'EPI-001', 'EPI-007', 'EPI-041', 'EPI-044',
  'TAB-001', 'EPI-028',
];

const products: Product[] = FEATURED_IDS
  .map((id) => storeData.products.find((p) => p.id === id))
  .filter((p): p is Product => !!p);

const industryNames: Record<string, string> = {
  medical: 'Médical',
  epi: 'EPI',
  restauration: 'Restauration',
};

function getIndustryName(id: string): string {
  return industryNames[id] || id;
}

const slideVariants = {
  enter: { opacity: 0, y: 24, scale: 0.97 },
  center: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -24, scale: 0.97 },
};

export default function RotatingProduct({ preloaded }: { preloaded: boolean }) {
  const [[index, direction], setIndex] = useState([0, 0]);

  const goNext = useCallback(() => {
    setIndex(([prev]) => [(prev + 1) % products.length, 1]);
  }, []);

  useEffect(() => {
    if (!preloaded) return;
    const interval = setInterval(goNext, 3000);
    return () => clearInterval(interval);
  }, [preloaded, goNext]);

  const current = products[index];
  if (!current) return null;

  const price = current.price;

  return (
    <div className="flex flex-col">
      <div className="relative w-full aspect-[4/3] md:aspect-[4/3] rounded-xl overflow-hidden bg-black/20 mb-3 md:mb-4">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.img
            key={current.id}
            src={current.image}
            alt={current.name}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0 w-full h-full object-contain p-4"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
      </div>

      <div className="px-1 space-y-2">
        <span className="inline-block text-[9px] font-mono uppercase tracking-[0.15em] text-[#3B82F6] font-bold bg-[#3B82F6]/10 px-2.5 py-1 rounded-full">
          {getIndustryName(current.industry)}
        </span>

        <h4 className="text-white text-sm font-semibold leading-tight line-clamp-1">
          {current.name}
        </h4>

        <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider">
          Premium Workwear
        </p>

        <div className="flex items-baseline gap-1">
          <span className="text-white text-sm font-bold">À partir de</span>
          <span className="text-white text-base font-black">{price}</span>
          <span className="text-white/40 text-[10px] font-mono">DH</span>
        </div>

        <a
          href={`#/store/${current.slug}`}
          className="group inline-flex items-center gap-1.5 text-[#3B82F6] hover:text-[#60A5FA] text-[11px] font-semibold uppercase tracking-wider transition-colors mt-1"
        >
          <span>Voir le produit</span>
          <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2.5} />
        </a>
      </div>
    </div>
  );
}
