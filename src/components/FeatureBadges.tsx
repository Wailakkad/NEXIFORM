import { Check } from 'lucide-react';

const BADGES = [
  { text: 'Broderie professionnelle' },
  { text: 'Livraison nationale' },
  { text: 'Fabrication sur mesure' },
];

export default function FeatureBadges() {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2.5 md:justify-start justify-center">
      {BADGES.map((badge) => (
        <div key={badge.text} className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#3B82F6]/15 flex items-center justify-center flex-shrink-0">
            <Check className="w-2.5 h-2.5 text-[#3B82F6]" strokeWidth={3} />
          </div>
          <span className="text-white/50 text-[11px] font-medium tracking-wide uppercase">
            {badge.text}
          </span>
        </div>
      ))}
    </div>
  );
}
