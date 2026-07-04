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
    <>
      {/* Mobile: full-width blue button + centered secondary */}
      <div className="flex flex-col lg:hidden items-center gap-4 w-full">
        <a
          href="#/store"
          className="flex items-center justify-between w-full h-[56px] px-6 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-full text-[15px] font-semibold transition-all duration-300"
        >
          <span>Découvrir la boutique B2B</span>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowRight className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
        </a>

        <button
          onClick={handleSecondary}
          className="inline-flex items-center justify-center gap-1.5 text-white/80 hover:text-white text-[13px] transition-colors duration-300"
        >
          <span>VOIR NOS SECTEURS</span>
          <ChevronDown className="w-[14px] h-[14px]" strokeWidth={2} />
        </button>
      </div>

      {/* Desktop: inline white button + ghost link */}
      <div className="hidden lg:flex flex-wrap items-center gap-6">
        <a
          href="#/store"
          className="inline-flex items-center justify-center px-7 py-[13px] bg-white text-black hover:bg-white/90 rounded-full text-[14px] font-medium border-none whitespace-nowrap transition-all duration-300"
        >
          Découvrir la boutique B2B
        </a>

        <button
          onClick={handleSecondary}
          className="inline-flex items-center gap-1.5 bg-transparent border-none text-white hover:text-white/80 text-[14px] whitespace-nowrap transition-colors duration-300 cursor-pointer"
        >
          <span>VOIR NOS SECTEURS</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
        </button>
      </div>
    </>
  );
}
