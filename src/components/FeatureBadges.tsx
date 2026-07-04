import { Check } from 'lucide-react';

const BADGES = [
  { text: 'Broderie professionnelle' },
  { text: 'Fabrication sur mesure' },
  { text: 'Livraison nationale' },
];

export default function FeatureBadges() {
  return (
    <>
      {/* Mobile: inline check + text, horizontal scroll, no pills */}
      <div className="flex lg:hidden items-center gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {BADGES.map((badge) => (
          <span
            key={badge.text}
            className="inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] tracking-[0.05em] text-white"
          >
            <Check className="w-3 h-3 text-[#3B82F6] shrink-0" strokeWidth={3} />
            {badge.text}
          </span>
        ))}
      </div>

      {/* Desktop: pill tags with border */}
      <div className="hidden lg:flex flex-wrap items-center gap-2">
        {BADGES.map((badge) => (
          <span
            key={badge.text}
            className="px-3.5 py-[5px] text-[11px] tracking-[0.06em] text-white border border-white/30 rounded-full uppercase leading-none"
          >
            {badge.text}
          </span>
        ))}
      </div>
    </>
  );
}
