import React, { useState, useRef } from 'react';
import { storeData, Product } from '../../data/store';
import { ArrowLeft, CheckCircle2, ShoppingBag, ShieldCheck, Mail, Send, Star, FileText, Sparkles, ChevronRight, Check, Image as ImageIcon } from 'lucide-react';
import { gsap } from '../../lib/gsap';
import { useGSAP } from '@gsap/react';
import { calculateDiscountedPrice, notifyCartUpdate, getInitialCartState, cartReducer } from '../../lib/cartStore';

interface ProductDetailPageProps {
  slug: string;
}

type SizeType = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export default function ProductDetailPage({ slug }: ProductDetailPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Selection states
  const [selectedSize, setSelectedSize] = useState<SizeType>('M');
  const [quantity, setQuantity] = useState<number>(10);
  const [isCustomQty, setIsCustomQty] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Custom logo impression states
  const [hasLogo, setHasLogo] = useState<boolean>(false);
  const [logoType, setLogoType] = useState<'Broderie' | 'Sérigraphie'>('Broderie');

  // Match product by slug
  const product = storeData.products.find((p) => p.slug === slug);

  const handleBackToStore = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = '#/store';
  };

  // Stagger entry animations
  useGSAP(() => {
    gsap.fromTo(
      '.reveal-element',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }
    );
  }, { scope: containerRef });

  // If product is not found, render a premium empty state
  if (!product) {
    return (
      <div className="bg-[#FFFFFF] min-h-screen text-black font-sans pt-32 pb-20 flex flex-col items-center justify-center px-6">
        <div className="bg-neutral-50 border border-neutral-100 rounded-3xl p-8 md:p-12 text-center max-w-md w-full shadow-sm">
          <span className="text-red-500 font-mono text-xs uppercase tracking-widest block mb-3">Erreur 404</span>
          <h1 className="text-[#0F172A] font-sans font-black text-2xl mb-4">Modèle non trouvé</h1>
          <p className="text-neutral-500 text-xs leading-relaxed mb-6">
            Le modèle ou l'ensemble médical demandé n'existe pas ou a été déplacé de notre catalogue officiel.
          </p>
          <button
            onClick={handleBackToStore}
            className="w-full h-12 bg-black hover:bg-neutral-900 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200"
          >
            Retour au catalogue
          </button>
        </div>
      </div>
    );
  }

  // Calculate prices based on current selection
  const basePrice = product.price;
  const pricingInfo = calculateDiscountedPrice(basePrice, quantity, hasLogo, logoType);

  // Preset Offers details
  const presets = [
    { qty: 10, label: '10 pièces', badge: 'Standard B2B', discount: 0 },
    { qty: 20, label: '20 pièces', badge: 'Remise -10%', discount: 10 },
    { qty: 30, label: '30 pièces', badge: 'Optimisé -15%', discount: 15 }
  ];

  // Submission handler adding item to cart
  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Fetch initial state and trigger action dispatch
    const initialState = getInitialCartState();
    const action = {
      type: 'ADD_ITEM' as const,
      payload: {
        product,
        size: selectedSize,
        quantity,
        hasLogo,
        logoType: hasLogo ? logoType : null
      }
    };
    
    // Execute reducer update
    cartReducer(initialState, action);
    notifyCartUpdate(); // broadcast changes across components

    setIsSubmitted(true);
    
    // Play sweet GSAP bounce confirmation
    gsap.fromTo('.confirm-bubble', 
      { scale: 0.85, opacity: 0, y: 15 },
      { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
    );

    setTimeout(() => {
      setIsSubmitted(false);
    }, 4500);
  };

  const handleSelectPreset = (qty: number) => {
    setIsCustomQty(false);
    setQuantity(qty);
  };

  const handleEnableCustom = () => {
    setIsCustomQty(true);
    setQuantity(1);
  };

  return (
    <div ref={containerRef} className="bg-[#FFFFFF] min-h-screen text-black font-sans pt-28 pb-32 selection:bg-neutral-900 selection:text-white">
      
      {/* Top Header & Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mb-8 flex items-center justify-between">
        <button
          onClick={handleBackToStore}
          className="group flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#0F172A] hover:text-[#3B82F6] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Retour au catalogue
        </button>

        <span className="text-neutral-400 text-[10px] font-mono uppercase tracking-[0.15em] flex items-center gap-1.5">
          Catalogue / <span className="text-neutral-700 font-bold">{product.wear_category}</span>
        </span>
      </div>

      {/* Main Detail Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Left Column: Lookbook Image Frame */}
          <div className="lg:col-span-6 reveal-element">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-neutral-50 border border-neutral-100 shadow-sm group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
              
              {/* Product ID Label overlay */}
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-black/90 backdrop-blur-md text-[10px] font-mono tracking-widest text-white px-3.5 py-1.5 rounded-full border border-white/10 font-bold uppercase">
                  SKU: {product.sku}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Information & Order Configurator */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-8">
            
            <div className="reveal-element">
              {/* Industry Tag & Rating */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-[#3B82F6] text-[10px] font-mono tracking-widest uppercase font-extrabold px-3 py-1 rounded-full bg-[#3B82F6]/5 border border-[#3B82F6]/10">
                  Collection Nexiform B2B
                </span>

                <div className="flex items-center text-amber-500 gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-neutral-400 text-[10px] font-mono ml-1.5 font-bold">(5.0)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-[#0F172A] font-sans font-black text-3xl md:text-4xl tracking-tight leading-none mb-4">
                {product.name}
              </h1>

              {/* Price Display */}
              <div className="flex items-baseline gap-2 pb-6 border-b border-neutral-100">
                <span className="text-[#0F172A] font-sans font-black text-3xl">
                  {product.price} <span className="text-lg font-bold">DH</span>
                </span>
                <span className="text-neutral-400 text-xs font-mono">HT / Pièce (Tarif de base)</span>
              </div>

              {/* Details List */}
              <div className="py-6 space-y-6">
                
                {/* Color Selection Indicator */}
                <div className="flex justify-between items-center bg-neutral-50 p-4 rounded-2xl border border-neutral-100/50">
                  <div>
                    <span className="text-neutral-400 text-[9px] font-mono uppercase tracking-[0.15em] block mb-1 font-bold">Coloris Officiel</span>
                    <span className="text-xs font-bold font-sans text-neutral-800 uppercase tracking-wide">{product.color}</span>
                  </div>
                  <span className="w-6 h-6 rounded-full border border-neutral-200 shadow-inner flex-shrink-0" style={{ backgroundColor: '#3B82F6' }} />
                </div>

                {/* Description */}
                <div>
                  <span className="text-neutral-400 text-[10px] font-mono uppercase tracking-[0.15em] block mb-2 font-bold">Description du modèle</span>
                  <p className="text-neutral-600 text-xs md:text-sm leading-relaxed max-w-lg">
                    {product.description} Conçu spécifiquement pour répondre aux exigences élevées d'ergonomie et de prestige des établissements de santé, d'hôtellerie et d'accueil au Maroc.
                  </p>
                </div>

                {/* Premium Technical Features */}
                <div>
                  <span className="text-neutral-400 text-[10px] font-mono uppercase tracking-[0.15em] block mb-3 font-bold">Fiche Technique Premium</span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-neutral-600 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    <li className="flex items-center gap-2 text-xs text-neutral-600 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
                      <span>Broderies d'image soignées à Casablanca</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>

            {/* ORDER PROCESS BLOCK */}
            <div className="bg-neutral-50 border border-neutral-100 rounded-3xl p-6 md:p-8 space-y-6 reveal-element">
              
              {/* 1. SIZE SELECTION (S, M, L, XL, XXL) */}
              <div>
                <span className="text-neutral-400 text-[10px] font-mono uppercase tracking-[0.15em] block mb-3 font-bold">
                  Sélectionner la Taille *
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {(['S', 'M', 'L', 'XL', 'XXL'] as SizeType[]).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`h-11 w-14 rounded-xl border text-xs font-bold uppercase transition-all flex items-center justify-center ${
                        selectedSize === size
                          ? 'border-[#3B82F6] bg-black text-white shadow-sm'
                          : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. LOGO IMPRESSION SELECTION ENGINE (NEW!) */}
              <div>
                <span className="text-neutral-400 text-[10px] font-mono uppercase tracking-[0.15em] block mb-3 font-bold">
                  Option de Marquage Logo *
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  {/* Option: Sans Logo */}
                  <button
                    type="button"
                    onClick={() => setHasLogo(false)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      !hasLogo
                        ? 'border-[#3B82F6] bg-black text-white shadow-sm'
                        : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">Sans Marquage</span>
                      <span className="text-[9px] text-neutral-400 font-mono block mt-0.5">Tissu uni original</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${!hasLogo ? 'border-[#3B82F6] bg-[#3B82F6]' : 'border-neutral-300'}`}>
                      {!hasLogo && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>

                  {/* Option: Avec Logo */}
                  <button
                    type="button"
                    onClick={() => setHasLogo(true)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      hasLogo
                        ? 'border-[#3B82F6] bg-black text-white shadow-sm'
                        : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">Avec Marquage Logo</span>
                      <span className="text-[9px] text-neutral-400 font-mono block mt-0.5">Personnalisé</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${hasLogo ? 'border-[#3B82F6] bg-[#3B82F6]' : 'border-neutral-300'}`}>
                      {hasLogo && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                </div>

                {/* Dropdown selector for impression type */}
                {hasLogo && (
                  <div className="bg-white border border-neutral-150/60 rounded-2xl p-4 space-y-3 shadow-inner transition-all duration-300">
                    <label className="text-neutral-500 text-[9px] font-mono uppercase tracking-wider block font-bold">
                      Choisir le type de marquage :
                    </label>
                    
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setLogoType('Broderie')}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center text-center ${
                          logoType === 'Broderie'
                            ? 'border-[#3B82F6] bg-[#3B82F6]/5 text-[#3B82F6]'
                            : 'border-neutral-200 bg-neutral-50/50 text-neutral-500 hover:bg-neutral-50'
                        }`}
                      >
                        <span className="block font-black text-xs">Broderie</span>
                        <span className="text-[9px] opacity-75 font-mono mt-0.5">+60 DH / pièce</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setLogoType('Sérigraphie')}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center text-center ${
                          logoType === 'Sérigraphie'
                            ? 'border-[#3B82F6] bg-[#3B82F6]/5 text-[#3B82F6]'
                            : 'border-neutral-200 bg-neutral-50/50 text-neutral-500 hover:bg-neutral-50'
                        }`}
                      >
                        <span className="block font-black text-xs">Sérigraphie</span>
                        <span className="text-[9px] opacity-75 font-mono mt-0.5">+40 DH / pièce</span>
                      </button>
                    </div>

                    <div className="text-[9px] text-neutral-400 leading-normal flex items-start gap-1.5 pt-1.5">
                      <Sparkles className="w-3 h-3 text-[#3B82F6] mt-0.5 flex-shrink-0 animate-spin" />
                      <span>La remise de volume dégressive est aussi appliquée au prix de marquage !</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. QUANTITY SELECTION ENGINE */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-neutral-400 text-[10px] font-mono uppercase tracking-[0.15em] block font-bold">
                    Quantités & Offres dégressives *
                  </span>
                  <span className="text-[#3B82F6] text-[10px] font-mono font-bold uppercase tracking-wider">
                    Min: 1 pièce
                  </span>
                </div>

                {/* Offer cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {presets.map((preset) => {
                    const presetPricing = calculateDiscountedPrice(basePrice, preset.qty, hasLogo, logoType);
                    const isSelected = !isCustomQty && quantity === preset.qty;
                    return (
                      <button
                        key={preset.qty}
                        type="button"
                        onClick={() => handleSelectPreset(preset.qty)}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 ${
                          isSelected
                            ? 'border-[#3B82F6] bg-[#3B82F6]/5 text-black shadow-sm'
                            : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-extrabold text-neutral-800">{preset.label}</span>
                          <span className={`text-[8px] font-mono uppercase font-bold px-1.5 py-0.5 rounded-full ${
                            preset.discount > 0 
                              ? 'bg-emerald-500 text-white' 
                              : 'bg-neutral-100 text-neutral-400'
                          }`}>
                            {preset.badge}
                          </span>
                        </div>
                        <div className="mt-2">
                          <span className="text-[10px] text-neutral-400 block line-through">
                            {((basePrice + (hasLogo ? (logoType === 'Broderie' ? 60 : 40) : 0)) * preset.qty).toLocaleString()} DH
                          </span>
                          <span className="text-xs font-black text-[#0F172A]">
                            {presetPricing.totalPrice.toLocaleString()} DH <span className="text-[10px] font-bold text-neutral-500">HT</span>
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Custom quantity switch button */}
                <div className="mt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleEnableCustom}
                    className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-all ${
                      isCustomQty
                        ? 'bg-black text-white'
                        : 'bg-neutral-200/60 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    Saisir une autre quantité
                  </button>

                  {isCustomQty && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-neutral-400 font-mono">Pièces :</span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 h-9 px-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-center focus:outline-none focus:border-[#3B82F6] bg-white text-black"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 4. DYNAMIC PRICING SUMMARY CARD */}
              <div className="p-4 bg-white border border-neutral-100 rounded-2xl space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">Tenue unitaire :</span>
                  <div className="text-right">
                    {pricingInfo.discountPercent > 0 && (
                      <span className="text-[10px] font-mono text-neutral-400 line-through mr-1.5">
                        {basePrice} DH
                      </span>
                    )}
                    <span className="text-xs font-black text-neutral-800">
                      {pricingInfo.discountedUnitPrice} DH <span className="text-[10px] text-neutral-400 font-normal">HT/u</span>
                    </span>
                  </div>
                </div>

                {hasLogo && (
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">Option marquage ({logoType}) :</span>
                    <div className="text-right">
                      {pricingInfo.discountPercent > 0 && (
                        <span className="text-[10px] font-mono text-neutral-400 line-through mr-1.5">
                          {logoType === 'Broderie' ? 60 : 40} DH
                        </span>
                      )}
                      <span className="text-xs font-black text-neutral-800">
                        {pricingInfo.discountedLogoUnitPrice} DH <span className="text-[10px] text-neutral-400 font-normal">HT/u</span>
                      </span>
                    </div>
                  </div>
                )}

                {pricingInfo.discountPercent > 0 && (
                  <div className="flex justify-between items-baseline text-xs pt-1 border-t border-neutral-100/60">
                    <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase">Remise cumulative de volume :</span>
                    <span className="font-extrabold text-emerald-600">-{pricingInfo.discountPercent}%</span>
                  </div>
                )}

                <div className="pt-2 border-t border-neutral-150 flex justify-between items-baseline">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold">Total Estimé HT :</span>
                  <span className="text-xl font-black text-[#3B82F6]">
                    {pricingInfo.totalPrice.toLocaleString()} DH
                  </span>
                </div>
              </div>

              {/* Submit Action */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full h-12 bg-black hover:bg-neutral-900 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md group"
              >
                <ShoppingBag className="w-4 h-4 text-[#3B82F6] group-hover:scale-110 transition-transform" />
                <span>Ajouter à ma sélection</span>
              </button>

              {/* Success validation confirmation */}
              {isSubmitted && (
                <div className="confirm-bubble mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-800 text-xs font-semibold flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5 animate-spin" />
                  <div>
                    <span className="block font-bold">Ajouté avec succès !</span>
                    <span className="text-emerald-700/80 font-normal block mt-0.5">
                      Modèle configuré en taille <strong>{selectedSize}</strong> {hasLogo ? `avec marquage (${logoType})` : 'sans marquage'} x {quantity} unités. Ouvrez votre panier pour compléter le projet.
                    </span>
                  </div>
                </div>
              )}

              {/* trust labels */}
              <div className="pt-4 border-t border-neutral-200/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px] text-neutral-400 font-mono">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />
                  <span>Broderies d'image réalisées à Casablanca</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>MOQ flexible par article</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
