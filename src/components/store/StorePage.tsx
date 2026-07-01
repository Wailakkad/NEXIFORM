import React, { useState, useMemo, useRef, useEffect } from 'react';
import { storeData } from '../../data/store';
import { gsap } from '../../lib/gsap';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, ShoppingBag, Search, ChevronDown, Check, X, Sparkles, Star, ArrowUpRight, RotateCcw, Plus } from 'lucide-react';

export default function StorePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Custom helper to parse query params from window.location.hash
  const getHashQueryParams = () => {
    const hash = window.location.hash;
    const searchPart = hash.includes('?') ? hash.split('?')[1] : '';
    return new URLSearchParams(searchPart);
  };

  // High fidelity client-side state with persistence
  const [selectedIndustry, setSelectedIndustry] = useState<string>(() => {
    const params = getHashQueryParams();
    const indParam = params.get('industry');
    if (indParam) return indParam;
    return localStorage.getItem('nexiform_store_selectedIndustry') || 'all';
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const params = getHashQueryParams();
    const catParam = params.get('categories');
    if (catParam) return catParam.split(',').filter(Boolean);
    
    try {
      const saved = localStorage.getItem('nexiform_store_selectedCategories');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedGender, setSelectedGender] = useState<string>(() => {
    const params = getHashQueryParams();
    const genParam = params.get('gender');
    if (genParam) return genParam;
    return localStorage.getItem('nexiform_store_selectedGender') || 'all';
  });

  const [searchQuery, setSearchQuery] = useState<string>(() => {
    const params = getHashQueryParams();
    const qParam = params.get('q');
    if (qParam) return qParam;
    return localStorage.getItem('nexiform_store_searchQuery') || '';
  });

  // Keep state, localStorage and URL Hash SearchParams in sync
  useEffect(() => {
    localStorage.setItem('nexiform_store_selectedIndustry', selectedIndustry);
    
    const hash = window.location.hash.split('?')[0];
    const params = getHashQueryParams();
    if (selectedIndustry && selectedIndustry !== 'all') {
      params.set('industry', selectedIndustry);
    } else {
      params.delete('industry');
    }
    
    const paramsStr = params.toString();
    const newHash = paramsStr ? `${hash}?${paramsStr}` : hash;
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, '', newHash);
    }
  }, [selectedIndustry]);

  useEffect(() => {
    localStorage.setItem('nexiform_store_selectedCategories', JSON.stringify(selectedCategories));
    
    const hash = window.location.hash.split('?')[0];
    const params = getHashQueryParams();
    if (selectedCategories.length > 0) {
      params.set('categories', selectedCategories.join(','));
    } else {
      params.delete('categories');
    }
    
    const paramsStr = params.toString();
    const newHash = paramsStr ? `${hash}?${paramsStr}` : hash;
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, '', newHash);
    }
  }, [selectedCategories]);

  useEffect(() => {
    localStorage.setItem('nexiform_store_selectedGender', selectedGender);
    
    const hash = window.location.hash.split('?')[0];
    const params = getHashQueryParams();
    if (selectedGender && selectedGender !== 'all') {
      params.set('gender', selectedGender);
    } else {
      params.delete('gender');
    }
    
    const paramsStr = params.toString();
    const newHash = paramsStr ? `${hash}?${paramsStr}` : hash;
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, '', newHash);
    }
  }, [selectedGender]);

  useEffect(() => {
    localStorage.setItem('nexiform_store_searchQuery', searchQuery);
    
    const hash = window.location.hash.split('?')[0];
    const params = getHashQueryParams();
    if (searchQuery) {
      params.set('q', searchQuery);
    } else {
      params.delete('q');
    }
    
    const paramsStr = params.toString();
    const newHash = paramsStr ? `${hash}?${paramsStr}` : hash;
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, '', newHash);
    }
  }, [searchQuery]);
  
  // Listen for hash changes to sync back to state if navigated externally
  useEffect(() => {
    const syncFromHash = () => {
      const params = getHashQueryParams();
      const indParam = params.get('industry') || 'all';
      const catParam = params.get('categories') ? (params.get('categories')?.split(',').filter(Boolean) || []) : [];
      const genParam = params.get('gender') || 'all';
      const qParam = params.get('q') || '';

      if (selectedIndustry !== indParam) setSelectedIndustry(indParam);
      if (JSON.stringify(selectedCategories) !== JSON.stringify(catParam)) setSelectedCategories(catParam);
      if (selectedGender !== genParam) setSelectedGender(genParam);
      if (searchQuery !== qParam) setSearchQuery(qParam);
    };

    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, [selectedIndustry, selectedCategories, selectedGender, searchQuery]);

  // Custom interactive dropdown state for minimalist pills
  const [industryOpen, setIndustryOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);

  // Home navigation handler
  const handleGoHome = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = '#/';
  };

  // Product detail navigation
  const handleNavigateToProduct = (slug: string) => {
    // Preserves filter search params when navigating to product detail and back
    const params = getHashQueryParams().toString();
    window.location.hash = params ? `#/store/${slug}?${params}` : `#/store/${slug}`;
  };

  // Filter & search combined logic
  const filteredProducts = useMemo(() => {
    return storeData.products.filter((product) => {
      const matchesIndustry = selectedIndustry === 'all' || product.industry === selectedIndustry;
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.wear_category);
      const matchesGender = selectedGender === 'all' || 
                            product.gender === selectedGender ||
                            (product.industry !== 'medical'); // only filter gender inside medical, keep other industries fully visible
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesIndustry && matchesCategory && matchesGender && matchesSearch;
    });
  }, [selectedIndustry, selectedCategories, selectedGender, searchQuery]);

  // Stagger animate products on load or filter change
  useGSAP(() => {
    gsap.fromTo(
      '.premium-prod-card',
      { opacity: 0, y: 30, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out' }
    );
  }, [selectedIndustry, selectedCategories, selectedGender, searchQuery]);

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedIndustry('all');
    setSelectedCategories([]);
    setSelectedGender('all');
    setSearchQuery('');
  };

  const handleCategoryToggle = (catId: string) => {
    if (selectedCategories.includes(catId)) {
      setSelectedCategories(selectedCategories.filter((id) => id !== catId));
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  // Get matching industry name
  const currentIndustryName = useMemo(() => {
    if (selectedIndustry === 'all') return 'Tous les secteurs';
    return storeData.industries.find(i => i.id === selectedIndustry)?.name || selectedIndustry;
  }, [selectedIndustry]);

  // Dynamically filter categories to only display categories applicable to the selected industry
  const visibleCategories = useMemo(() => {
    if (selectedIndustry === 'all') return storeData.wear_categories;
    const activeCatIds = new Set(
      storeData.products
        .filter(p => p.industry === selectedIndustry)
        .map(p => p.wear_category)
    );
    return storeData.wear_categories.filter(cat => activeCatIds.has(cat.id));
  }, [selectedIndustry]);

  // Dynamically configure the hero banner content based on selected industry
  const bannerContent = useMemo(() => {
    if (selectedIndustry === 'epi') {
      return {
        title: "L'Allure Force Technique.",
        description: "Une gamme d'équipements de protection individuelle (EPI) conçue pour résister aux contraintes extrêmes des chantiers et ateliers au Maroc, alliant protection maximale et confort ergonomique.",
        image1: "https://res.cloudinary.com/fnxxj10k/image/upload/v1782911783/WhatsApp_Image_2026-07-01_at_11.56.00_xyokqk.jpg",
        image2: "https://res.cloudinary.com/fnxxj10k/image/upload/v1782911782/Using_the_input_image_strictly_202607011356_2_sbdo22.jpg",
        label1: "Veste & Pantalon",
        label2: "Combinaisons",
        gradient: "from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]" // Minimal tech light zinc
      };
    }
    return {
      title: "L'Allure Atlas Médicale.",
      description: "Une gamme de blouses et d'ensembles certifiés ultra-confortables, associant la fraîcheur du coton égyptien et la solidité du polyester recyclé.",
      image1: "https://res.cloudinary.com/dhkyla1rv/image/upload/v1782858217/Ensemble_M%C3%A9dical_Professionnel_Bleu_Ciel.jpg",
      image2: "https://res.cloudinary.com/dhkyla1rv/image/upload/v1782858219/Blouse_M%C3%A9dicale_Longue_Blanche.jpg",
      label1: "Scrub",
      label2: "Blouses",
      gradient: "from-[#0EA5E9] via-[#38BDF8] to-[#EFF6FF]" // fresh blue gradient
    };
  }, [selectedIndustry]);

  return (
    <div ref={containerRef} className="bg-[#FFFFFF] min-h-screen text-black font-sans pt-28 pb-32 selection:bg-neutral-900 selection:text-white">
      
      {/* Top Breadcrumb & Minimal Navigation */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mb-6 flex items-center justify-between">
        <button
          onClick={handleGoHome}
          className="group flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#0F172A] hover:text-[#3B82F6] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Retour à l'accueil
        </button>
 
        <span className="text-neutral-400 text-[10px] font-mono uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" /> NEXIFORM / Boutique Officielle
        </span>
      </div>

      {/* Hero Section: Giant Typography "Essentialized" style exactly matching screenshot */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-8 pb-12 border-b border-neutral-100">
        <h1 className="text-[#0F172A] font-sans font-black text-[clamp(44px,10vw,120px)] leading-[0.9] tracking-tighter uppercase select-none mb-6">
          Essentialized
        </h1>
        
        {/* Double column descriptions under giant header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          <div>
            <p className="text-[#0F172A] text-sm md:text-base font-medium leading-relaxed max-w-lg">
              Feel confident in every layer, we engineered comfort you can trust. Des coupes pensées pour valoriser la stature de vos équipes face à vos clients prestigieux.
            </p>
          </div>
          <div className="flex md:justify-end items-end">
            <p className="text-neutral-500 text-xs md:text-sm max-w-sm leading-relaxed md:text-right">
              Smart comfort for daily living, with style that simplifies your life. Conçu et brodé avec minutie dans nos ateliers au Maroc.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Immersive Category Banner styled with premium theme */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mt-8">
        <div className={`relative w-full aspect-[21/9] md:aspect-[3/1] rounded-3xl overflow-hidden bg-gradient-to-r ${bannerContent.gradient} p-8 md:p-12 flex flex-col justify-between group shadow-sm border border-neutral-100`}>
          
          {/* Subtle soft fabric wave vector simulation overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,_rgba(255,255,255,0.45)_0%,_transparent_70%)] pointer-events-none" />
          
          <div className="relative z-10 flex items-start justify-between">
            <span className="bg-black/90 backdrop-blur-md text-[10px] font-mono tracking-widest text-white px-3.5 py-1.5 rounded-full uppercase font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8] animate-spin" /> Collection Signature 2026
            </span>
            
            <a 
              href="#/" 
              onClick={(e) => { e.preventDefault(); handleResetFilters(); }}
              className="bg-black text-white hover:bg-[#0F172A] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 shadow-md"
            >
              <span>Voir tout</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-6">
              <h2 className="text-black font-sans font-black text-2xl md:text-4xl tracking-tight leading-none mb-2">
                {bannerContent.title}
              </h2>
              <p className="text-black/75 text-xs md:text-sm max-w-md font-medium leading-relaxed">
                {bannerContent.description}
              </p>
            </div>

            {/* Float visual sub-capsules mimicking screenshot right elements */}
            <div className="md:col-span-6 flex justify-end gap-3 md:gap-4 overflow-x-auto pb-1 scrollbar-none">
              
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2.5 flex items-center gap-3 border border-white/20 min-w-[120px] shadow-sm">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                  <img src={bannerContent.image1} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-800 uppercase tracking-tight">{bannerContent.label1}</p>
                  <div className="flex gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2.5 flex items-center gap-3 border border-white/20 min-w-[120px] shadow-sm">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                  <img src={bannerContent.image2} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-800 uppercase tracking-tight">{bannerContent.label2}</p>
                  <div className="flex gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-white border border-neutral-300" />
                    <span className="w-2 h-2 rounded-full bg-sky-200" />
                    <span className="w-2 h-2 rounded-full bg-neutral-800" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Interactive Minimal Filter Bar exactly mimicking screenshot */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mt-16 pb-8 border-b border-neutral-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left: Filter triggers & active status pills */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[#0F172A] font-sans font-bold text-lg tracking-tight mr-2">
              Filter by
            </span>

            {/* Industry Filter Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => { setIndustryOpen(!industryOpen); setCategoryOpen(false); setGenderOpen(false); }}
                className={`h-10 px-4 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-200 ${
                  selectedIndustry !== 'all' 
                    ? 'border-[#0F172A] bg-[#0F172A] text-white' 
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                }`}
              >
                <span>Secteur: {currentIndustryName}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${industryOpen ? 'rotate-180' : ''}`} />
              </button>

              {industryOpen && (
                <div className="absolute top-12 left-0 z-50 w-56 bg-white border border-neutral-100 rounded-2xl shadow-xl p-2 flex flex-col gap-1">
                  <button
                    onClick={() => { setSelectedIndustry('all'); setSelectedCategories([]); setSelectedGender('all'); setIndustryOpen(false); }}
                    className="w-full text-left h-9 px-3 rounded-lg text-xs font-semibold flex items-center justify-between hover:bg-neutral-50"
                  >
                    <span>Tous les secteurs</span>
                    {selectedIndustry === 'all' && <Check className="w-3.5 h-3.5 text-[#3B82F6]" />}
                  </button>
                  {storeData.industries.map((ind) => (
                    <button
                      key={ind.id}
                      onClick={() => { setSelectedIndustry(ind.id); setSelectedCategories([]); setSelectedGender('all'); setIndustryOpen(false); }}
                      className="w-full text-left h-9 px-3 rounded-lg text-xs font-semibold flex items-center justify-between hover:bg-neutral-50"
                    >
                      <span>{ind.name}</span>
                      {selectedIndustry === ind.id && <Check className="w-3.5 h-3.5 text-[#3B82F6]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category Filter Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => { setCategoryOpen(!categoryOpen); setIndustryOpen(false); setGenderOpen(false); }}
                className={`h-10 px-4 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-200 ${
                  selectedCategories.length > 0 
                    ? 'border-[#0F172A] bg-[#0F172A] text-white' 
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                }`}
              >
                <span>Type de Vêtement ({selectedCategories.length})</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${categoryOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoryOpen && (
                <div className="absolute top-12 left-0 z-50 w-64 bg-white border border-neutral-100 rounded-2xl shadow-xl p-3 flex flex-col gap-2">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Sélectionnez les modèles :</span>
                  {visibleCategories.map((cat) => {
                    const isSelected = selectedCategories.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryToggle(cat.id)}
                        className="w-full text-left h-9 px-3 rounded-lg text-xs font-semibold flex items-center justify-between hover:bg-neutral-50 transition-colors"
                      >
                        <span className={isSelected ? 'text-[#3B82F6] font-bold' : 'text-neutral-700'}>{cat.name}</span>
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${isSelected ? 'border-[#3B82F6] bg-[#3B82F6] text-white' : 'border-neutral-300'}`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sexe Filter Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => { setGenderOpen(!genderOpen); setIndustryOpen(false); setCategoryOpen(false); }}
                className={`h-10 px-4 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-200 ${
                  selectedGender !== 'all' 
                    ? 'border-[#0F172A] bg-[#0F172A] text-white' 
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                }`}
              >
                <span>Sexe: {selectedGender === 'all' ? 'Tous' : (selectedGender === 'femme' ? 'Femme' : 'Homme')}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${genderOpen ? 'rotate-180' : ''}`} />
              </button>

              {genderOpen && (
                <div className="absolute top-12 left-0 z-50 w-48 bg-white border border-neutral-100 rounded-2xl shadow-xl p-2 flex flex-col gap-1">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block px-3 py-1">Sélectionnez le sexe :</span>
                  <button
                    onClick={() => { setSelectedGender('all'); setGenderOpen(false); }}
                    className="w-full text-left h-9 px-3 rounded-lg text-xs font-semibold flex items-center justify-between hover:bg-neutral-50"
                  >
                    <span className={selectedGender === 'all' ? 'text-[#3B82F6] font-bold' : 'text-neutral-700'}>Tous</span>
                    {selectedGender === 'all' && <Check className="w-3.5 h-3.5 text-[#3B82F6]" />}
                  </button>
                  <button
                    onClick={() => { setSelectedGender('femme'); setGenderOpen(false); }}
                    className="w-full text-left h-9 px-3 rounded-lg text-xs font-semibold flex items-center justify-between hover:bg-neutral-50"
                  >
                    <span className={selectedGender === 'femme' ? 'text-[#3B82F6] font-bold' : 'text-neutral-700'}>Femme</span>
                    {selectedGender === 'femme' && <Check className="w-3.5 h-3.5 text-[#3B82F6]" />}
                  </button>
                  <button
                    onClick={() => { setSelectedGender('homme'); setGenderOpen(false); }}
                    className="w-full text-left h-9 px-3 rounded-lg text-xs font-semibold flex items-center justify-between hover:bg-neutral-50"
                  >
                    <span className={selectedGender === 'homme' ? 'text-[#3B82F6] font-bold' : 'text-neutral-700'}>Homme</span>
                    {selectedGender === 'homme' && <Check className="w-3.5 h-3.5 text-[#3B82F6]" />}
                  </button>
                </div>
              )}
            </div>

            {/* Clear Filters indicator */}
            {(selectedIndustry !== 'all' || selectedCategories.length > 0 || selectedGender !== 'all' || searchQuery !== '') && (
              <button
                onClick={handleResetFilters}
                className="h-10 px-4 rounded-full border border-dashed border-red-200 hover:border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Effacer ({[
                  selectedIndustry !== 'all' ? 1 : 0,
                  selectedCategories.length,
                  selectedGender !== 'all' ? 1 : 0,
                  searchQuery !== '' ? 1 : 0
                ].reduce((a, b) => a + b, 0)})
              </button>
            )}

          </div>

          {/* Right: Premium minimal search bar */}
          <div className="flex items-center gap-3 w-full lg:w-96">
            <span className="text-[#0F172A] font-sans font-bold text-lg tracking-tight hidden md:inline">
              Search
            </span>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Rechercher un modèle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-full border border-neutral-200 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] text-xs font-sans font-semibold placeholder:text-neutral-400 bg-neutral-50/50"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="w-6 h-6 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center absolute right-2 top-2.5 text-neutral-500"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Layout exactly mimicking the screenshot structure */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Asymmetric Spotlight Card and Bon de Commande Trigger */}
          <div className="lg:col-span-3 flex flex-col justify-start">
            <div className="space-y-6 sticky top-28">
              {/* Card 1: Signature */}
              <div className="bg-neutral-50 border border-neutral-100 rounded-3xl p-8 flex flex-col justify-between h-[360px]">
                <div>
                  <span className="text-neutral-400 text-xs font-mono tracking-widest block mb-1">
                    /01
                  </span>
                  <h3 className="text-[#0F172A] font-sans font-black text-2xl tracking-tight leading-none mb-3">
                    Collection<br />
                    Signature
                  </h3>
                  <p className="text-neutral-500 text-xs leading-relaxed mb-4">
                    Associez le savoir-faire de l'artisanat marocain et la rigueur technique des tissus d'exception. Idéal pour vos comités d'accueil.
                  </p>
                  <div className="flex gap-1.5 mb-4">
                    <div className="w-4 h-4 rounded-full bg-[#3B82F6] border border-white" />
                    <div className="w-4 h-4 rounded-full bg-rose-500 border border-white" />
                    <div className="w-4 h-4 rounded-full bg-emerald-500 border border-white" />
                    <div className="w-4 h-4 rounded-full bg-[#F59E0B] border border-white" />
                  </div>
                </div>

                <a
                  href="#/"
                  onClick={(e) => { e.preventDefault(); handleResetFilters(); }}
                  className="bg-black hover:bg-neutral-900 text-white rounded-full h-11 px-5 flex items-center justify-between text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md group"
                >
                  <span>Explorer Tout</span>
                  <div className="w-5 h-5 rounded-full bg-white/10 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                </a>
              </div>

              {/* Card 2: Bon de Commande Autonomous Generator */}
              <div className="bg-[#3B82F6]/5 border border-[#3B82F6]/10 rounded-3xl p-8 flex flex-col justify-between h-[250px]">
                <div>
                  <span className="text-[#3B82F6] text-xs font-mono tracking-widest block mb-1 font-bold">
                    /02
                  </span>
                  <h3 className="text-[#0F172A] font-sans font-black text-lg tracking-tight leading-none mb-2">
                    Bon de Commande<br />
                    Autonome
                  </h3>
                  <p className="text-neutral-500 text-xs leading-normal">
                    Remplissez manuellement votre propre sélection textile d'excellence sans calculs de prix immédiats.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new Event('open_nexiform_bon_commande'))}
                  className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-full h-11 px-5 flex items-center justify-between text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md group"
                >
                  <span>Créer mon Bon</span>
                  <div className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Highly Premium Product Grid with star ratings, clean typography */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400 mb-4 border border-neutral-100">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h4 className="text-[#0F172A] font-sans font-bold text-base">Aucun modèle correspondant</h4>
                <p className="text-neutral-400 text-xs mt-1 leading-relaxed max-w-sm">
                  Essayez d'effacer vos critères de filtres ou d'ajuster votre saisie pour découvrir nos collections.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold uppercase tracking-wider text-xs px-6 py-3 rounded-full transition-all duration-200 shadow-lg shadow-[#3B82F6]/10"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleNavigateToProduct(product.slug)}
                    className="premium-prod-card bg-white border border-neutral-100 rounded-3xl p-4 hover:shadow-xl transition-all duration-500 ease-out cursor-pointer group flex flex-col justify-between h-full"
                  >
                    {/* Centered Model Frame exactly like the lookbook reference */}
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-50 mb-5 border border-neutral-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Interactive Diagonal Arrow button overlay on image */}
                      <div className="absolute bottom-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-black flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg">
                        <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                      </div>

                      {/* Pill Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-black/80 backdrop-blur-md text-[9px] font-mono uppercase tracking-wider text-white px-2.5 py-1 rounded-full border border-white/10 font-bold">
                          {product.color}
                        </span>
                      </div>
                    </div>

                    {/* Metadata & Information layout identical to screenshot */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-neutral-400 text-[10px] font-mono tracking-wider uppercase font-semibold">
                          {product.wear_category}
                        </span>
                        
                        {/* Rating stars exactly mimicking lookbook styling */}
                        <div className="flex items-center text-amber-500 gap-0.5">
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                        </div>
                      </div>

                      <h4 className="text-[#0F172A] font-sans font-bold text-sm leading-tight line-clamp-2 group-hover:text-[#3B82F6] transition-colors mb-4">
                        {product.name}
                      </h4>
                    </div>

                    {/* Sizing & Pricing Footer block */}
                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between mt-auto">
                      <span className="text-neutral-400 text-[10px] font-mono font-medium uppercase tracking-wider">
                        XS - XXXL
                      </span>
                      
                      <span className="text-[#0F172A] font-sans font-black text-base">
                        {product.price} <span className="text-xs font-bold">DH</span>
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
