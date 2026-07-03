import { ArrowRight, ChevronDown } from 'lucide-react';

interface HeroButtonsProps {
  onSecondaryClick?: () => void;
}

export default function HeroButtons({ onSecondaryClick }: HeroButtonsProps) {
  const handleSecondary = () => {
    if (onSecondaryClick) {
      onSecondaryClick();
    } else {
      const nextSection = document.querySelector('.product-showcase-section');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = '#/store';
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row md:items-center items-center gap-4 w-full">
      <a
        href="#/store"
        className="group inline-flex items-center justify-between bg-[#3B82F6] hover:bg-[#2563EB] h-[52px] pl-7 pr-2 rounded-full text-white font-sans text-sm font-semibold tracking-wide transition-all duration-300 w-full sm:w-auto"
      >
        <span>Découvrir la boutique B2B</span>
        <div className="w-9 h-9 ml-4 rounded-full bg-white text-[#3B82F6] flex items-center justify-center transition-transform duration-300 ease-out group-hover:translate-x-1 shadow-sm">
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </div>
      </a>

      <button
        onClick={handleSecondary}
        className="group inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-xs font-medium uppercase tracking-[0.12em] transition-colors duration-300 py-2"
      >
        <span>Voir nos secteurs</span>
        <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5" strokeWidth={2} />
      </button>
    </div>
  );
}
