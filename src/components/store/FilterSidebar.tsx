import { storeData } from '../../data/store';
import { SlidersHorizontal, RefreshCw } from 'lucide-react';

interface FilterSidebarProps {
  selectedIndustry: string;
  setSelectedIndustry: (industry: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  onReset: () => void;
  productCount: number;
}

export default function FilterSidebar({
  selectedIndustry,
  setSelectedIndustry,
  selectedCategories,
  setSelectedCategories,
  onReset,
  productCount,
}: FilterSidebarProps) {
  
  // Toggle individual categories
  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  return (
    <aside className="bg-white border border-neutral-100 rounded-xl p-6 md:p-8 flex flex-col gap-8 h-fit shadow-sm">
      
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#3B82F6]" />
          <h2 className="text-[#0F172A] font-sans font-bold text-sm tracking-wide uppercase">Filtrer</h2>
        </div>
        <span className="text-[10px] font-mono font-bold bg-neutral-100 px-2 py-0.5 rounded text-neutral-500">
          {productCount} {productCount > 1 ? 'modèles' : 'modèle'}
        </span>
      </div>

      {/* Industry selection (Radio Buttons as requested) */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[#0F172A] font-sans font-bold text-xs tracking-wider uppercase">Secteur d'Activité</h3>
        
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer group text-xs text-neutral-600 hover:text-[#0F172A]">
            <input
              type="radio"
              name="industry-filter"
              checked={selectedIndustry === 'all'}
              onChange={() => setSelectedIndustry('all')}
              className="w-4 h-4 border-neutral-300 text-[#3B82F6] focus:ring-[#3B82F6] accent-[#3B82F6]"
            />
            <span className={`font-medium ${selectedIndustry === 'all' ? 'text-[#3B82F6] font-semibold' : ''}`}>
              Tous les secteurs
            </span>
          </label>

          {storeData.industries.map((industry) => (
            <label
              key={industry.id}
              className="flex items-center gap-3 cursor-pointer group text-xs text-neutral-600 hover:text-[#0F172A]"
            >
              <input
                type="radio"
                name="industry-filter"
                checked={selectedIndustry === industry.id}
                onChange={() => setSelectedIndustry(industry.id)}
                className="w-4 h-4 border-neutral-300 text-[#3B82F6] focus:ring-[#3B82F6] accent-[#3B82F6]"
              />
              <span className={`font-medium ${selectedIndustry === industry.id ? 'text-[#3B82F6] font-semibold' : ''}`}>
                {industry.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Wear Category selection (Checkboxes as requested) */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[#0F172A] font-sans font-bold text-xs tracking-wider uppercase">Type de Vêtement</h3>
        
        <div className="flex flex-col gap-3">
          {storeData.wear_categories.map((category) => {
            const isChecked = selectedCategories.includes(category.id);
            return (
              <label
                key={category.id}
                className="flex items-center gap-3 cursor-pointer group text-xs text-neutral-600 hover:text-[#0F172A]"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleCategoryToggle(category.id)}
                  className="w-4 h-4 rounded border-neutral-300 text-[#3B82F6] focus:ring-[#3B82F6] accent-[#3B82F6]"
                />
                <span className={`font-medium ${isChecked ? 'text-[#3B82F6] font-semibold' : ''}`}>
                  {category.name}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Reset Button (as requested) */}
      <button
        onClick={onReset}
        disabled={selectedIndustry === 'all' && selectedCategories.length === 0}
        className="w-full h-11 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:border-neutral-200 text-[#0F172A] rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all duration-200"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Réinitialiser les filtres
      </button>

    </aside>
  );
}
